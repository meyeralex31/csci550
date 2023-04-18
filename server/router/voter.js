const express = require('express');

const Voter = require('../models/voterModel')
const Profile = require('../models/profileModel')
const Election = require('../models/electionModel')
const Collector = require('../models/collectorModel')

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

const createRouter = (socket,electionOwnerToSocketId) => {
    const router = new express.Router();

    // Forward & Reverse ballots
    // Fe just needs

//An endpoint to sum up and send the secret ballot of a profile
// router.post('/getSecretBallot', async (req,res) => {
//     try {
//         const ballotDoc = await Voter.findOne(req.body);
//         console.log(ballotDoc)
//         let secretBallot = ballotDoc.secretBallot ? ballotDoc.secretBallot : null;
//         return secretBallot !== null ?  res.json(secretBallot) :  res.json("Unable to fetch the ballot")
//     } catch(err) {
//         console.log(`Exception caught --------> ${err}`)
//         return res.status(500).send(err);
//     }
// })
router.post('/getSecretBallot', async (req,res) => { 
    try {
        let count = 0;
        const  { voterId, electionId } = req.body;
        if(!voterId || !electionId) {
            return res.status(400).json("Bad Request");
        }
        const search = { ...(voterId ? {voterId} :{} ), ...(electionId ? {electionId} :{} )}
        const CollectorDtls = await Collector.find(search, { secretShare : 1  });
        const locDtls = await Voter.find(search, { secretLocation: 1, secretVote : 1 });
        for (let i = 0; i < locDtls.length; i++) {
            const secretLocation = locDtls[i].secretLocation;
            const secretVote = locDtls[i].secretVote;
            count += parseInt(secretLocation);
            count += parseInt(secretVote);
          }
          for (let i = 0; i < CollectorDtls.length; i++) {
            count += parseInt(CollectorDtls[i].secretShare);
          }
        //Summed up values of the shares to give the secret Ballot number
        return res.json(count); 
    } catch (err) {
        console.log(`Exception caught --------> ${err}`)
        return res.status(500).send(err);
    }
})

router.post('/getVoterDtls', async (req,res) => {
    try {
        const  { profileId, electionId } = req.body;
        if(!profileId && !electionId) {
            return res.status(400).json("Bad Request");
        }
        const search = { ...(profileId ? {profileId} :{} ), ...(electionId ? {electionId} :{} )}
        const VoterDtls = await Voter.find(search, { electionId : 1 , hasRegistered : 1,hasVoted: 1, isElectionOwner: 1 });
        return res.json(VoterDtls);
    } catch(e) {
        console.log(`Exception caught --------> ${e}`)
        return res.status(500).send(e);
    }
})

router.post('/registerVoter', async (req,res) => {
    try {
        const  { electionId, profileId, hasRegistered } = req.body;
        if(!electionId || !profileId) {
            return res.status(400).json("Bad Request");
        }
        // let genSecretLocation = `${electionId}-${profileId}-${Date.now().toString(36)}`;
        await Voter.findOneAndUpdate( { electionId, profileId }, {hasRegistered}, {
            upsert: true 
          });
          if (electionOwnerToSocketId[electionId]) {
            socket.to(electionOwnerToSocketId[electionId]).emit(`registered-${electionId}`, 'change in registeration');
          }

        return res.status(200).send({hasRegistered: hasRegistered})
    } catch (e) {
        console.log(`Exception caught --------> ${e}`)
        return res.status(500).send(e);
    }
})

router.post('/vote', async (req,res) => {
    try {
        const  { electionId, profileId, questionsVotedOn } = req.body;
        if(!electionId || !profileId) {
            return res.status(400).json("Bad Request");
        }
        // TODO we will need to let election owner know that a vote has happened
        // TODO we will need to run validation on ballots before we save them
        //Produces the Vote
        const secretVote = getRandomInt(20); 
        await Voter.findOneAndUpdate( { electionId, profileId }, {questionsVotedOn ,hasVoted: true, secretVote }, {
            upsert: true 
          });
        // TODO we will need to let election owner know that a vote has happened

          if (electionOwnerToSocketId[electionId]) {
            socket.to(electionOwnerToSocketId[electionId]).emit(`voted-${electionId}`, 'a user voted');
          }

        return res.status(200).send({hasVoted: true})
    } catch (e) {
        console.log(`Exception caught --------> ${e}`)
        return res.status(500).send(e);
    }
})

router.get('/registerVoters', async (req,res) => {
    try {
        const  { electionId, profileId } = req.query;
        if(!electionId && !profileId) {
            return res.status(400).json("Bad Request");
        }
        const secretLocation = getRandomInt(20);
        Voter.findOneAndUpdate({electionId} , {secretLocation});
        const profiles = await Voter.find( { electionId }, {profileId: 1, hasRegistered: 1});
        const profilesNamesRegistered = await Promise.all(profiles.filter(profile => profile.hasRegistered).map((profile) =>{
            return Profile.findOne({profileId: profile.profileId}, {name: 1}).then(res => {
                return { name: res.name};
            })
        }));
        return res.status(200).send({profilesNamesRegistered})
    } catch (e) {
        console.log(`Exception caught --------> ${e}`)
        return res.status(500).send(e);
    }
})
// TODO we will need to switch to bigInts for this
router.get('/getResults', async (req,res) => {
    try {
        const  { electionId } = req.query;
        if(!electionId) {
            return res.status(400).json("Bad Request");
        }
        const election = await Election.findOne( {electionId}, { electionTitle: 1,questions: 1 }).lean();
        const voters = await Voter.find( { electionId, hasVoted: 1 }, {questionsVotedOn: 1});
        voters.forEach((voter) => {
            if (voter?.questionsVotedOn) {
                voter.questionsVotedOn.forEach((question) => {
                    const currentQuestion = election.questions.find((q) => q._id.equals(question.questionId));
                    if (currentQuestion) {
                        if (!currentQuestion.fowardBallot) {
                            currentQuestion.fowardBallot = question.fowardBallot;
                            console.log('hit does not exist', currentQuestion,question.fowardBallot )
                        } else {
                            currentQuestion.fowardBallot += question.fowardBallot;
                            console.log('hit does exist', currentQuestion,question.fowardBallot )
                        }
                        if (!currentQuestion.reverseBallot) {
                            currentQuestion.reverseBallot = question.reverseBallot;

                        } else {
                            currentQuestion.reverseBallot += question.reverseBallot;
                        }
                    } else {
                        throw new Error('Could not tally results');
                    } 
                });
            }
        })

        return res.status(200).send({election})
    } catch (e) {
        console.log(`Exception caught --------> ${e}`)
        return res.status(500).send(e);
    }
})
return router;
}




module.exports = createRouter;