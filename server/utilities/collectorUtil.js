const paillierBigint = require('paillier-bigint')
const  extendedEuclideanAlgo = require('./extendedEuclideanAlgo');
const crypto = require('crypto');

const { PublicKey, PrivateKey } = require( 'paillier-bigint' );

const numberOfCollectors = 4;

// const pubKey = new PublicKey()

const genObj = {}

const createPi = (n) => {
    const pi = [...Array(n).keys()];
    for (let i = n - 1; i >= 0; i--) {
        const r = Math.floor(Math.random() *i);
        const t = pi[r];
        pi[r] = pi[i];
        pi[i] = t;
    }
    return pi.map(v => BigInt(v));
}

const firstPhase = async (numberOfVoters) => {
    const { publicKey: collectorOnePublicKey, privateKey: collectorOnePrivateKey } = await paillierBigint.generateRandomKeys(512)
    return {"encValues" : createPi(numberOfVoters).map((value) => collectorOnePublicKey.encrypt(value)) , "publicKey" : collectorOnePublicKey, "privateKey" : collectorOnePrivateKey};
}

//3 rd collector -> shld shuffle shld be false. Everyone except second shld shuffle shld be false
//prev Phase -> enc values
const secondPhase = async (initKey, prevPhase, shouldShuffle) => {
    const collectorOnePublicKey = new PublicKey(initKey.n, initKey.g);
    console.log(`After allotment n: ${collectorOnePublicKey.n} and _n2: ${collectorOnePublicKey._n2 }`)
    console.log(typeof(collectorOnePublicKey))
    console.log(`Public Key -----------> ${collectorOnePublicKey.n} and the prevPhase ------> ${prevPhase}`)
    const pi = shouldShuffle? createPi(prevPhase.length): [...Array(prevPhase.length).keys()];
    const r = [];   
    const encryptedValues = pi.map((value, i) => {
        let ri = BigInt('0x' + crypto.randomBytes(64).toString('hex'))% collectorOnePublicKey.n;
        r.push(ri);      
        // const encrypted = publicKey.encrypt(ri);
        const encrypted = collectorOnePublicKey.encrypt(ri);
        console.log(encrypted)
        const other = prevPhase[value];
        return other *extendedEuclideanAlgo(collectorOnePublicKey._n2, encrypted) %  collectorOnePublicKey._n2;
        // return BigInt(other) * extendedEuclideanAlgo(publicKey._n2, encrypted) % publicKey._n2;
    })
    return { encryptedValues, r};
}

const lastPhase = async (publicKey, privateKey, encryptedValues) => {
    const collectorOnePublicKey = new PublicKey(publicKey.n, publicKey.g);

    const collectorOnePrivateKey = new PrivateKey(privateKey.lambda,privateKey.mu, collectorOnePublicKey, privateKey._p, privateKey._q)
    return encryptedValues.map((value) => collectorOnePrivateKey.decrypt(value) )
    //share of the first collector shares enc
}


module.exports = { firstPhase , secondPhase, lastPhase, createPi};