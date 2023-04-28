const paillierBigint = require('paillier-bigint')
const  extendedEuclideanAlgo = require('./extendedEuclideanAlgo');
const crypto = require('crypto');

const n = 20;
const numberOfCollectors = 100;
const createPi = () => {
    const pi = [...Array(n).keys()];
    for (let i = n - 1; i >= 0; i--) {
        const r = Math.floor(Math.random() *i);
        const t = pi[r];
        pi[r] = pi[i];
        pi[i] = t;
    }
    return pi.map(v => BigInt(v));
}

const firstPhase = (collectorOnePublicKey) => {
    return createPi().map((value) => collectorOnePublicKey.encrypt(value));

}
const secondPhase = (publicKey, prevPhase, shouldShuffle) => {
    // const pi = createPi(); 
    const pi = shouldShuffle? createPi(): [...Array(n).keys()];
    const r = [];   
    const encryptedValues = pi.map((value, i) => {
        let ri = BigInt('0x' + crypto.randomBytes(64).toString('hex'))% publicKey.n;
        r.push(ri);
        const encrypted = publicKey.encrypt(ri);

        const other = prevPhase[value];
        return other *extendedEuclideanAlgo(publicKey._n2, encrypted) %  publicKey._n2;
    })
    return { encryptedValues, r};
}

const lastPhase = (privateKey, encryptedValues) => {
    return encryptedValues.map((value) => privateKey.decrypt(value) )
}

const run = async () => {
    //  the private key should stay only where collector one knows it
    const { publicKey: collectorOnePublicKey, privateKey: collectorOnePrivateKey } = await paillierBigint.generateRandomKeys(512)
    let encryptedValues = firstPhase(collectorOnePublicKey);

    const ris = [];
    // the first collector already went
    for (let i = 1; i < numberOfCollectors ; i ++) {
        let ri;
        // we need to shuffle with collector 1 or else collector 0 knows evveryones location
        ({encryptedValues, r: ri} = secondPhase(collectorOnePublicKey, encryptedValues, i ===1));
        ris.push(ri);
    }


    const r1 = lastPhase(collectorOnePrivateKey, encryptedValues);

    // this happens on the ui when they get all values
    const locations = r1.map((value, i) => (value + ris.reduce((prev, curr) => prev + curr[i], 0n)) % BigInt(collectorOnePublicKey.n));
    const occurances = locations.reduce((prev, current) => prev[current] = prev[current] ? prev[current] + 1: 1, {});
    console.log('any duplicates', Object.keys(occurances).filter(key => occurances[key] > 1))
    console.log(locations);
};


run();