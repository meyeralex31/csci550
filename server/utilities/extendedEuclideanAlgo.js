// assume big int
const extendedEuclideanAlgo = (a, b) => {
    let a0 = a;
    let b0 = b;
    let t0 = 0n;
    let t = 1n; 
    let q = a0/b0;
    let r = a0 - q* b0;
    while (r > 0) {
        let temp = (t0 - q* t) % a;
        t0 = t;
        t = temp;
        a0 = b0;
        b0 = r;
        q = a0/b0;
        r = a0 - q * b0;
    }
    if (b0 !== 1n) {
        throw new Error('no inverse')
    }
    return t;
}


// console.log(extendedEuclideanAlgo(9987n, 3125n));

module.exports = extendedEuclideanAlgo;
