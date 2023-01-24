const connectDB = require('../db/mongoose');

//Importing the sample json and model structure

// To establish a MongoDB connection
connectDB()

//Importing Voter profile details
const profiles = require('../data/profiles');
const Profile = require('../models/profileModel');

//Importing Voter login details
const voters = require('../data/voters');
const Voter = require('../models/voterModel');

const importData = async () => {
    try {
        //Below code is to insert profiles in DB
        await Profile.deleteMany()

        await Profile.insertMany(profiles);

        // Below code is to insert voters in DB
        await Voter.deleteMany()

        await Voter.insertMany(voters);

        process.exit()

    } catch (err) {
        process.exit(1)
    }
}

importData()