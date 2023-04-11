import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useResultsContext } from "../Context/ResultsContext";
export const BallotDisplay = ({ ballots }) => {
  const { questions } = useResultsContext();

  return ballots?.map((ballot, index) => (
    <Grid item xs={3} key={index} style={{ textAlign: "center" }}>
      <Paper style={{ height: "100%", width: "100%" }}>
        <h5>Ballot {index}</h5>
        {questions.map((question, questionIndex) => {
          const voteLocation = ballot[question._id];
          const vote = question.options[voteLocation];
          return (
            <div key={questionIndex}>
              {questionIndex + 1}. {vote.option}
            </div>
          );
        })}
      </Paper>
    </Grid>
  ));
};
