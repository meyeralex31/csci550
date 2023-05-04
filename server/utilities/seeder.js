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

//Importing Individual Collectors data and individual models
// const collectorInd = require('../data/collectorInd');
// const collectorOne = require('../models/collectorOneModel');
// const collectorTwo = require('../models/collectorTwoModel');
// const collectorThree = require('../models/collectorThreeModel');
// const collectorFour = require('../models/collectorFourModel');

// Importing Collector Profile Data and the Model
const collectorProfile = require('../data/collectorProfile');
const CollectorProfile = require('../models/collectorProfileModel');

const importData = async () => {
    try {
        //Below code is to insert profiles in DB
        // await Profile.deleteMany()

        // await Profile.insertMany(profiles);

        // Below code is to insert voters in DB
        // await Voter.deleteMany()

        // await Voter.insertMany(voters);

        //Below code is to insert election data to the DB

        // await Election.deleteMany()

        // await Election.insertMany(elections)

        //Below code is to insert collectors data to the DB

        // await Collector.deleteMany()

        // await Collector.insertMany(collectors);

        //Below code is to insert individual collector data to DB 

        // await collectorOne.deleteMany()
        // await collectorTwo.deleteMany()
        // await collectorThree.deleteMany()
        // await collectorFour.deleteMany()

        // await collectorOne.insertMany(collectorInd);
        // await collectorTwo.insertMany(collectorInd);
        // await collectorThree.insertMany(collectorInd);
        // await collectorFour.insertMany(collectorInd);

        //Below code is to insert Collector Profile Information
        // await Voter.deleteMany()
        // await Voter.insertMany(voters)

        await CollectorProfile.deleteMany()
        await CollectorProfile.insertMany(collectorProfile)

        process.exit()

    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

importData()