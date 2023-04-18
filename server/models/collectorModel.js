const mongoose = require('mongoose');

const collectorSchema = mongoose.Schema (
    {   
        url : {
            type: String,
            // required: true
        },
        collectorId : {
            type: mongoose.Schema.Types.ObjectId
        },
        name: {
            type: String,
            required: true
        },
        voterId: {
            type: String,
        },
        electionId : {
            type: String,
        },
        secretShare : {
            type: String,
        }
    }, {
        timestamps: true,
    }
)

const collector = mongoose.model("Collectors", collectorSchema);

module.exports = collector;