const Election = require('../models/electionModel')
const Collector = require('../models/collectorModel')
const axios = require('axios');
const { verifyVoterLocation } = require('./verifyVoteCollectors')

const validateVote = async (electionId, profileId, questionsVotedOn) => {

    const Elections = await Election.find({electionId}, { collectors: 1, totalVoters: 1, questions: 1});
    const collectors = await Promise.all(Elections?.[0]?.collectors?.map(async (id) => await Collector.findOne({collectorId: id}, {url: 1})));
    const collectorsData = await Promise.all(collectors.map(({url}) => {
        return axios.post(`${url}/validate`, {electionId, voterId: profileId, questionsVotedOn, otherCollectorsUrl: collectors.filter(({url: otherUrl}) => otherUrl !== url ) }).then(({data}) => data);
    }));
    return questionsVotedOn.every((question) => {
        const sumShares = collectorsData.reduce((prev, {res}) => {
            const currentQuestion = res.find(({questionId}) => questionId === question.questionId );
            return prev + BigInt(currentQuestion.value);
        }, 0n);
        const optionCountForQuestion = Elections[0]?.questions.find(({_id}) => _id.toString() === question.questionId );
        console.log('options', optionCountForQuestion, Elections[0]?.questions, question.questionId);
        console.log(BigInt(question.forwardBallot) * BigInt(question.reverseBallot) + sumShares);
        console.log(2n ** (BigInt(Elections?.[0]?.totalVoters) * BigInt(optionCountForQuestion.options.length)));
        return BigInt(question.forwardBallot) * BigInt(question.reverseBallot) + sumShares === 2n ** (BigInt(Elections?.[0]?.totalVoters) * BigInt(optionCountForQuestion.options.length)-1n);

    });
}

module.exports = {validateVote}