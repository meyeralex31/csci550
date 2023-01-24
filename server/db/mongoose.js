const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const db = await mongoose.connect('mongodb+srv://cryptoEVote:ionodeuser9124@crypto.5vefsns.mongodb.net/?retryWrites=true&w=majority')
        console.log(`Mongoose Connected ------------> ${db.connection.host}`)
    } catch(err) {
        console.log(`Exception Printed --> ${err}`)
    }
}

module.exports = connectDB