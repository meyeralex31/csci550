import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

const Results = () => {
  const title = "Title";
  const questions = [
    {
      question: "Which fruits do you prefer?",
      number: 1,
      options: ["Apple", "Mango"],
      results: [
        { name: "Apple", votes: 3 },
        { name: "Mango", votes: 5 },
      ],
    },
    {
      question: "Which animals do you prefer?",
      options: ["Dog", "Cat"],
      number: 2,
      results: [
        { name: "Dog", votes: 8 },
        { name: "Cat", votes: 0 },
      ],
    },
    {
      question: "Which fruits do you prefer?",
      options: ["Apple", "Mango"],
      number: 3,
      results: [
        { name: "Apple", votes: 3 },
        { name: "Mango", votes: 5 },
      ],
    },
    {
      question: "Which animals do you prefer?",
      options: ["Dog", "Cat"],
      number: 4,
      results: [
        { name: "Dog", votes: 8 },
        { name: "Cat", votes: 0 },
      ],
    },
    {
      question: "Which fruits do you prefer?",
      options: ["Apple", "Mango"],
      number: 5,
      results: [
        { name: "Apples", votes: 3 },
        { name: "Mango", votes: 5 },
      ],
    },
    {
      question: "Which animals do you prefer?",
      options: ["Dog", "Cat"],
      number: 6,
      results: [
        { name: "Dog", votes: 8 },
        { name: "Cat", votes: 0 },
      ],
    },
  ];

  const ballots = [
    {
      location: 1,
      votes: [
        { vote: "Apple", question: questions[0] },
        { vote: "Dog", question: questions[1] },
        { vote: "Apple", question: questions[2] },
        { vote: "Dog", question: questions[3] },
        { vote: "Apple", question: questions[4] },
        { vote: "Dog", question: questions[5] },
      ],
    },
    {
      location: 2,
      votes: [
        { vote: "Mango", question: questions[0] },
        { vote: "Dog", question: questions[1] },
        { vote: "Mango", question: questions[2] },
        { vote: "Dog", question: questions[3] },
        { vote: "Mango", question: questions[4] },
        { vote: "Dog", question: questions[5] },
      ],
    },
    {
      location: 3,
      votes: [
        { vote: "Mango", question: questions[0] },
        { vote: "Dog", question: questions[1] },
        { vote: "Mango", question: questions[2] },
        { vote: "Dog", question: questions[3] },
        { vote: "Mango", question: questions[4] },
        { vote: "Dog", question: questions[5] },
      ],
    },
    {
      location: 4,
      votes: [
        { vote: "Apple", question: questions[0] },
        { vote: "Dog", question: questions[1] },
        { vote: "Apple", question: questions[2] },
        { vote: "Dog", question: questions[3] },
        { vote: "Apple", question: questions[4] },
        { vote: "Dog", question: questions[5] },
      ],
    },
    {
      location: 5,
      votes: [
        { vote: "Apple", question: questions[0] },
        { vote: "Dog", question: questions[1] },
        { vote: "Apple", question: questions[2] },
        { vote: "Dog", question: questions[3] },
        { vote: "Apple", question: questions[4] },
        { vote: "Dog", question: questions[5] },
      ],
    },
    {
      location: 6,
      votes: [
        { vote: "Mango", question: questions[0] },
        { vote: "Dog", question: questions[1] },
        { vote: "Mango", question: questions[2] },
        { vote: "Dog", question: questions[3] },
        { vote: "Mango", question: questions[4] },
        { vote: "Dog", question: questions[5] },
      ],
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid style={{ width: "80%", maxHeight: "80%" }} container spacing={2}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          Results: {title}
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ paddingBottom: "25px" }}>
            <Grid container spacing={2} style={{ padding: "10px" }}>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                Winners
              </Grid>
              {questions.map((question, index) => {
                // TODO handle ties
                const winner = question.results.reduce((prevMax, result) =>
                  prevMax.votes > result.votes ? prevMax : result
                );
                return (
                  <Grid item xs={4} key={index} style={{ textAlign: "center" }}>
                    <Paper style={{ height: "100%", width: "100%" }}>
                      <h5>
                        {question.number}. {question.question}
                      </h5>
                      <div>
                        {winner.name} ({winner.votes})
                      </div>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} />
        <Grid item xs={12}>
          <Paper style={{ paddingBottom: "25px" }}>
            <Grid container style={{ padding: "10px" }} spacing={2}>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                Ballots
              </Grid>
              {ballots.map((ballot) => (
                <Grid
                  item
                  xs={4}
                  key={ballot.location}
                  style={{ textAlign: "center" }}
                >
                  <Paper style={{ height: "100%", width: "100%" }}>
                    <h5>Ballot {ballot.location}</h5>
                    {ballot.votes.map((vote) => (
                      <div>
                        {vote.question.number}. {vote.vote}
                      </div>
                    ))}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Results;
