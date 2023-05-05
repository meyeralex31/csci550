const express = require('express');

const Voter = require('../models/voterModel')
const Profile = require('../models/profileModel')
const Election = require('../models/electionModel')
const Collector = require('../models/collectorModel');
const axios = require('axios');
const {validateVote} = require('../utilities/validation');
const createRouter = (socket,electionOwnerToSocketId) => {
    const router = new express.Router();
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
        const { electionId, profileId, questionsVotedOn } = req.body;
        if(!electionId || !profileId) {
            return res.status(400).json("Bad Request");
        }
        if (!(await validateVote(electionId, profileId, questionsVotedOn))) {
            throw new Error('Invalid vote')
        } else {
            console.log('Vote is valid');
        }
        await Voter.findOneAndUpdate( { electionId, profileId }, {questionsVotedOn ,hasVoted: true }, {
            upsert: true 
          });
        

        socket.emit(`voted-${electionId}`, 'a user voted')

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

router.get('/votedVoters', async (req,res) => {
    try {
        const  { electionId, profileId } = req.query;
        if(!electionId && !profileId) {
            return res.status(400).json("Bad Request");
        }
        const profiles = await Voter.find( { electionId,  hasVoted: true }, {profileId: 1, hasRegistered: 1});
        const profilesNamesVoted = await Promise.all(profiles.map((profile) =>{
            return Profile.findOne({profileId: profile.profileId}, {name: 1}).then(res => {
                return { name: res.name};
            })
        }));
        return res.status(200).send({profilesNamesVoted})
    } catch (e) {
        console.log(`Exception caught --------> ${e}`)
        return res.status(500).send(e);
    }
})
router.get('/getResults', async (req,res) => {
    try {
        const  { electionId } = req.query;
        if(!electionId) {
            return res.status(400).json("Bad Request");
        }
        const election = await Election.findOne( {electionId}, { electionTitle: 1,questions: 1, collectors: 1 }).lean();
        const voters = await Voter.find( { electionId }, {questionsVotedOn: 1, hasVoted: 1,hasRegistered: 1,profileId: 1 });
        const votedVoters = voters.filter((voter) => voter.hasVoted);
        const voterNotVoted = voters.filter((voter) => !voter.hasVoted && voter.hasRegistered).map(({profileId}) => profileId);
        const collectors =  await Promise.all(election?.collectors?.map(async (id) => {
            return await Collector.findOne({collectorId: id}, {url: 1});
        }));

        const collectorResults = await Promise.all(collectors.map(({url}) => {
            return axios.post(`${url}/getAllShares`, {electionId, voterNotVoted}).then(res => res.data);
        }));

        votedVoters.forEach((voter) => {
            if (voter?.questionsVotedOn) {
                voter.questionsVotedOn.forEach((question) => {
                    const currentQuestion = election.questions.find((q) => q._id.equals(question.questionId));
                    if (currentQuestion) {
                        if (!currentQuestion.forwardBallot ) {
                            currentQuestion.forwardBallot  = question.forwardBallot ;
                        } else {
                            currentQuestion.forwardBallot  = `${BigInt(currentQuestion.forwardBallot ) + BigInt(question.forwardBallot )}`;
                        }
                        if (!currentQuestion.reverseBallot) {
                            currentQuestion.reverseBallot = question.reverseBallot;

                        } else {
                            currentQuestion.reverseBallot =  `${BigInt(currentQuestion.reverseBallot) + BigInt(question.reverseBallot)}`;
                        }
                    } else {
                        throw new Error('Could not tally results');
                    } 
                });
            }
        })
        election.questions = election.questions.map((question) => {
            const forwardBallot = collectorResults.reduce((prev, res) => {
                return prev -  BigInt(res.questions[question._id].fowardShare);
            }, BigInt(question.forwardBallot)).toString();
            const reverseBallot = collectorResults.reduce((prev, res) => {
                return prev -  BigInt(res.questions[question._id].reverseShare);
            }, BigInt(question.reverseBallot)).toString();
            return {
                ...question,
                forwardBallot,
                reverseBallot
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