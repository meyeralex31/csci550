const mongoose = require('mongoose');

const collectorSchema = mongoose.Schema (
    {   
        collectorId : {
            type: mongoose.Schema.Types.ObjectId
        },
        electionId : {
            type: String,
        },
        privateKey : {
            type: String
        }
    }, {
        timestamps: true,
    }
)

const collectorElectionModel = mongoose.model("CollectorElectionModel", collectorSchema);

module.exports = collectorElectionModel;