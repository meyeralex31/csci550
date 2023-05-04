const mongoose = require('mongoose');

//To create election
// 1. questionsArray : question, Indexes Id, options
// 2. electionTitle
// 3. Status of selection (For this election Id, do we meed the minimum registered users? If so
// 4. Voting Started(true / false) -> Will be sent from FE once voter starts elections after eligibility is met
// export const REGISTRATION_STATUS = "Registeration Open";
// export const VOTING_IN_PROGRESS_STATUS = "Voting Started";
// export const VOTING_ENDED_STATUS = "Voting Ended";
// array of collector ids
// electionCreatorProfileId

// Election Id to be present in schema
const electionSchema = mongoose.Schema (
    {   
        questions: [ {
            question : {
                type: String,
                required: true
            },
            questionId: mongoose.Schema.Types.ObjectId,
            options: [ {
                option : {
                    type: String,
                    required: true
                },
     }],
    }],
    electionTitle: {
        type: String,
        required: true
    },
        REGISTRATION_STATUS : {
            type: String,
            // required: true
        },
        adminProfileId : {
            type: String,
            required: true
        },
        electionId : {
            type: String
        },
        collectors: [{
                type: String,
     }],
     locationN:{
        type: String,
     },
     totalVoters: {
        type: Number,
     }
    }, {
        timestamps: true,
    }
)

const election = mongoose.model("Election", electionSchema);

module.exports = election;