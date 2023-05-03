const paillierBigint = require('paillier-bigint')
const  extendedEuclideanAlgo = require('./extendedEuclideanAlgo');
const crypto = require('crypto');

const { PublicKey } = require( 'paillier-bigint' );

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
    // const pi = createPi(); 
    const { publicKey : collectorOnePublicKey } = await paillierBigint.generateRandomKeys(512)
    console.log(`Before allotment n: ${collectorOnePublicKey.n} and _n2: ${collectorOnePublicKey._n2 }`)
    collectorOnePublicKey._n2 = initKey._n2
    collectorOnePublicKey.n = initKey.n
    console.log(`After allotment n: ${collectorOnePublicKey.n} and _n2: ${collectorOnePublicKey._n2 }`)
    console.log(typeof(publicKey))
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

const lastPhase = async (privateKey, encryptedValues) => {
    const { privateKey: collectorOnePrivateKey } = await paillierBigint.generateRandomKeys(512)
    collectorOnePrivateKey._p = privateKey._p
    collectorOnePrivateKey._q = privateKey._q
    collectorOnePrivateKey.lambda = privateKey.lambda
    collectorOnePrivateKey.mu = privateKey.mu
    return encryptedValues.map((value) => collectorOnePrivateKey.decrypt(value) )
    //share of the first collector shares enc
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
    console.log(r1)

    // this happens on the ui when they get all values
    const locations = r1.map((value, i) => (value + ris.reduce((prev, curr) => prev + curr[i], 0n)) % BigInt(collectorOnePublicKey.n));
    const occurances = locations.reduce((prev, current) => prev[current] = prev[current] ? prev[current] + 1: 1, {});
    console.log('any duplicates', Object.keys(occurances).filter(key => occurances[key] > 1))
    console.log(locations);

    //Voting
    //Send it along with the shares
    //gen random num(-ve 2^numofVoters+1 -> +ve 2^numofVoters+1)
};


// run();

module.exports = { firstPhase , secondPhase, lastPhase};