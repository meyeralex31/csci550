const mongoose = require('mongoose');

const collectorSchema = mongoose.Schema (
    {   
        url : {
            type: String,
            required: true
        },
        electionId : {
            type: String,
            required: true
        }
    }, {
        timestamps: true,
    }
)

const collector = mongoose.model("Collectors", collectorSchema);

module.exports = collector;