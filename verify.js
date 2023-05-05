const paillierBigint = require('paillier-bigint')
const  extendedEuclideanAlgo = require('./server/utilities/extendedEuclideanAlgo');
const crypto = require('crypto');


const powerMod = (a, b, n) => {
    if (n === 1n) return 0n;
    let result = 1n;
    a = a % n;
    while (b > 0) {
        if (b % 2n === 1n) {
            result = (result * a) % n;
        }
        b = b >> 1n;
        a = (a * a) % n;
    }
    return result;
}
//[collector1, collector2, collector3, collector4]
const shares = [15n, 53074129n, 45265093n,97081031n];
const sharesPrime = [1205392n, -13n, 4n,-38n];
const v = 8n;
const vPrime = 2048n;

const p = v + shares.reduce((prev, current) => prev + current,0n);
const pPrime = vPrime + sharesPrime.reduce((prev, current) => prev + current,0n);

const otherCollectorVerification = (collectorIndex, publicKey, encryptValue) => {
    // all other collectors
    let ri = BigInt('0x' + crypto.randomBytes(128).toString('hex'))% publicKey._n2;
    const encryptedReturn = powerMod(encryptValue, sharesPrime[collectorIndex],publicKey._n2) *extendedEuclideanAlgo(publicKey._n2, publicKey.encrypt(ri))% publicKey._n2;
    return {ri,encryptedReturn }
}

const getS = (collectorIndex, publicKey, encrypted, privateKey) => {
    // collector A
    let {ri,encryptedReturn } = otherCollectorVerification(collectorIndex, publicKey, encrypted);
    if (2n * ri > publicKey.n) ri = ri - publicKey.n;
    let decryptedValue = privateKey.decrypt(encryptedReturn);
    if (2n * decryptedValue > publicKey.n) decryptedValue = decryptedValue - publicKey.n;
    return (ri + decryptedValue) % publicKey.n;
}
const getVerification = async (collectorIndex) => {
    //collector A
    const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(512)
    // shares will come from db. 
    // will need to pull from collectorProfileModel[electionId][voterId][questionId].fowardShare
    const encrypted = publicKey.encrypt(shares[collectorIndex]);
    const sValues = shares.map((_, index) => {
        if(index !== collectorIndex) return getS(index,publicKey, encrypted, privateKey)
        return 0n;
    });
    return -p * sharesPrime[collectorIndex] - pPrime * shares[collectorIndex] + sharesPrime[collectorIndex] * shares[collectorIndex] + sValues.reduce((prev, current) => prev + current,0n)
}
const run = async (electionid, voterid) => {
    // admin
    // finds voter from VoterModel
    // for each question it will complete this
    // p is forwardBallot  in VoterModel and pPrime is reverseBallot
    // it also needs to pass down p, pPrime, and questionId
    const Ss = await Promise.all(shares.map((_, index) => getVerification(index)));
    console.log(Ss);

    console.log(p * pPrime + Ss.reduce((prev, current) => prev + current,0n) === 2n ** 14n)
}

//run();

getVerification(0);