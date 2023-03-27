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

//Imprting Election fields
const elections = require('../data/election')
const Election = require('../models/electionModel');

//Importing Collectors Collection
const collectors = require('../data/collector');
const Collector = require('../models/collectorModel');

const importData = async () => {
    try {
        //Below code is to insert profiles in DB
        await Profile.deleteMany()

        await Profile.insertMany(profiles);

        // Below code is to insert voters in DB
        await Voter.deleteMany()

        await Voter.insertMany(voters);

        //Below code is to insert election data to the DB

        await Election.deleteMany()

        await Election.insertMany(elections)

        //Below code is to insert collectors data to the DB

        await Collector.deleteMany()

        await Collector.insertMany(collectors);

        process.exit()

    } catch (err) {
        process.exit(1)
    }
}

importData()