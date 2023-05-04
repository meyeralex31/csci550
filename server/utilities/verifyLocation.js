const paillierBigint = require('paillier-bigint')
const  extendedEuclideanAlgo = require('../utilities/extendedEuclideanAlgo');
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
// const shares = [82738795n, 53074129n, 45265093n,97081031n];
// const sharesPrime = [1205392n, 16957305n, 23187162n,50100442n];
// const v = 8n;
// const vPrime = 2048n;

// const p = v + shares.reduce((prev, current) => prev + current,0n);
// const pPrime = vPrime + sharesPrime.reduce((prev, current) => prev + current,0n);

const otherCollectorVerification = (collectorIndex, publicKey, encryptValue,shares, sharesPrime,p,pPrime) => {
    // all other collectors
    let ri = BigInt('0x' + crypto.randomBytes(128).toString('hex'))% publicKey._n2;
    console.log(collectorIndex)
    const encryptedReturn = powerMod(encryptValue, sharesPrime[collectorIndex],publicKey._n2) *extendedEuclideanAlgo(publicKey._n2, publicKey.encrypt(ri))% publicKey._n2;
    return {ri,encryptedReturn }
}

const getS = (collectorIndex, publicKey, encrypted, privateKey,shares, sharesPrime,p,pPrime) => {
    // collector A
    let {ri,encryptedReturn } = otherCollectorVerification(collectorIndex, publicKey, encrypted, sharesPrime,p,pPrime);
    if (2n * ri > publicKey.n) ri = ri - publicKey.n;
    let decryptedValue = privateKey.decrypt(encryptedReturn);
    if (2n * decryptedValue > publicKey.n) decryptedValue = decryptedValue - publicKey.n;

    return (ri + decryptedValue) % publicKey.n;
}
const getVerification = async (collectorIndex,shares, sharesPrime,p,pPrime) => {
    //collector A
    const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(512)
    // shares will come from db. 
    // will need to pull from collectorProfileModel[electionId][voterId][questionId].fowardShare
    const encrypted = publicKey.encrypt(shares[collectorIndex]);
    const sValues = shares.map((_, index) => {
        if(index !== collectorIndex) return getS(index,publicKey, encrypted, privateKey, sharesPrime,p,pPrime)
        return 0n;
    });
    // console.log("P Value is ----------> ",p)
    return -p * sharesPrime[collectorIndex] - pPrime * shares[collectorIndex] + sharesPrime[collectorIndex] * shares[collectorIndex] + sValues.reduce((prev, current) => prev + current,0n)
}
const verifyVoterLocation = async (shares, sharesPrime, v, vprime) => {
    // admin
    // finds voter from VoterModel
    // for each question it will complete this
    // p is forwardBallot  in VoterModel and pPrime is reverseBallot
    // it also needs to pass down p, pPrime, and questionId
    // console.log(`Before conversion to BIGINT -> shares: ${shares}, sharesPrime:${sharesPrime}, v:${v}, vprime:${vprime}`)
    shares = shares.map(n => BigInt(n));
    sharesPrime = sharesPrime.map(n => BigInt(n));
    v = BigInt(v[0])
    vPrime = BigInt(vprime[0])
    // v = v.map(n => `${n}n`);
    // vprime = vprime.map(n => `${n}n`);
    // console.log(`After conversion to BIGINT -> shares: ${shares}, sharesPrime:${sharesPrime}, v:${v}, vprime:${vprime}`)

    // console.log('v val before p operation',v)
    let p = v + shares.reduce((prev, current) => prev + current,0n);
    // console.log('p val generated',p)
    let pPrime = vPrime + sharesPrime.reduce((prev, current) => prev + current,0n);
   
    const Ss = await Promise.all(shares.map((_, index) => getVerification(index,shares, sharesPrime,p,pPrime)));
    console.log(Ss);

    console.log(p * pPrime + Ss.reduce((prev, current) => prev + current,0n) === 2n ** 14n)
}

//run();

console.log((226650851649568865472384386006416986879075884571720688747407192614827770980876054976892548559459180602318686956516459241869825582571665307308172742978537n +
    1448026983436730830303379700209885854069774642458132802263652754356736474360532906054518401386431698224549588446414667360311046201576816779739996532697856n
  + 6266744957860068980312430253476966167684313970046338818005709932990101565625946943238992989464853196127195711535482343987318668425449394632224282292439405n
  +   1731833774632559277449003149255106938045266832812819453905913127229558538646744558836637838364022822135704561406231971883395662366391820135980387111221579n
    ) % 9673256567578927953537197488948375946678431329889011762922683007191224349614100463107041777774766897089768548344645442472895202575989696855252838679337377n);


module.exports = { verifyVoterLocation };