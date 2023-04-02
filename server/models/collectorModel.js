const mongoose = require('mongoose');

const collectorSchema = mongoose.Schema (
    {   
        url : {
            type: String,
            required: true
        },
        collectorId : {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        collectorId: mongoose.Schema.Types.ObjectId,
    }, {
        timestamps: true,
    }
)

const collector = mongoose.model("Collectors", collectorSchema);

module.exports = collector;