const paillierBigint = require('paillier-bigint')
const  extendedEuclideanAlgo = require('./extendedEuclideanAlgo');
const crypto = require('crypto');
const { default: axios } = require('axios');
const { PublicKey } = require( 'paillier-bigint' );


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

const otherCollectorVerification = (initKey, encryptedValues,secretShares) => {
    const publicKey = new PublicKey(BigInt(initKey.n), BigInt(initKey.g));
    return encryptedValues.map(({ encrypted, questionId }) => {
        const share = secretShares.find(share => share.questionId === questionId);
        let ri = BigInt('0x' + crypto.randomBytes(128).toString('hex'))% publicKey._n2;
        const encryptedReturn = powerMod(BigInt(encrypted), BigInt(share.reverseShare),publicKey._n2) *extendedEuclideanAlgo(publicKey._n2, publicKey.encrypt(ri))% publicKey._n2;
        return {ri: ri.toString(),encryptedReturn: encryptedReturn.toString(), questionId }
    });
}

const getS = async (url, publicKey, encryptedValues, privateKey,electionId, voterId) => {
    const serializedPublicKey = {};
    for (const [key, value] of Object.entries(publicKey)) {
        serializedPublicKey[key] = value.toString(); // Convert BigInt value to string
    }
    return axios.post(`${url}/validate/second`, {
        electionId, voterId,publicKey: serializedPublicKey, encryptedValues
    }).then(({data}) => {
        return data.res.map(({ri: riString, encryptedReturn: encryptedReturnString, questionId}) => {
            let ri = BigInt(riString);
            const encryptedReturn = BigInt(encryptedReturnString);
            if (2n * ri > publicKey.n) ri = ri - publicKey.n;
            let decryptedValue = privateKey.decrypt(encryptedReturn);
            console.log('ri',ri);
            console.log('befroe decryptedValue',decryptedValue)
            if (2n * decryptedValue > publicKey.n) decryptedValue = decryptedValue - publicKey.n;

            console.log({ 'befroe decryptedValue': decryptedValue, 'after decryptedValue':decryptedValue,'ri':ri } )

            return { value :(ri + decryptedValue) % publicKey.n, questionId } ;
        });
    });
    
}
const getVerification = async (collectorsUrl,secretShares,questionsVotedOn, electionId, voterId) => {
    //collector A
    const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(512);
    const encryptedValues = secretShares.map((secretShare) => {
        return { encrypted: publicKey.encrypt(BigInt(secretShare.fowardShare)).toString(), questionId: secretShare.questionId };
    })
    // shares will come from db. 
    const sValues = await Promise.all(collectorsUrl.map(({url}) => {
        return getS(url,publicKey, encryptedValues, privateKey, electionId, voterId)
    }));
    console.log('sValues', sValues);
    const sValuesByQuestion = {};
    sValues.forEach((items) => {
        items.forEach(({ value, questionId }) => {
            if (sValuesByQuestion[questionId]) {
                sValuesByQuestion[questionId] += value;
            } else {
                sValuesByQuestion[questionId] = value;
            }
        })
    });
    return questionsVotedOn.map(({forwardBallot: p, reverseBallot:pPrime, questionId }) => {
        const share = secretShares.find(share => share.questionId === questionId);
        const sValue = sValuesByQuestion[questionId];
        console.log({p, pPrime,share })
        return { value: ( BigInt(-p) * BigInt(share.reverseShare) -  BigInt(pPrime) * BigInt(share.fowardShare) + BigInt(share.reverseShare) * BigInt(share.fowardShare) + sValue).toString(), questionId };
    })
}
//run();

module.exports = { getVerification, otherCollectorVerification };