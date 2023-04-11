import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useResultsContext } from "../Context/ResultsContext";
const Results = () => {
  const { title, questions, ballotVoted } = useResultsContext();
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
              {questions?.map((question, index) => {
                // TODO handle ties
                const winner = question?.options?.[question.choosenIndex];
                return (
                  <Grid item xs={4} key={index} style={{ textAlign: "center" }}>
                    <Paper style={{ height: "100%", width: "100%" }}>
                      <h5>
                        {index + 1}. {question?.question}
                      </h5>
                      <div>
                        {winner?.option} ({winner?.total})
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
              {ballotVoted?.map((ballot, index) => (
                <Grid item xs={4} key={index} style={{ textAlign: "center" }}>
                  <Paper style={{ height: "100%", width: "100%" }}>
                    <h5>Ballot {index}</h5>
                    {questions.map((question, questionIndex) => {
                      const voteLocation = ballot[question._id];
                      const vote = question.options[voteLocation];
                      return (
                        <div>
                          {questionIndex + 1}. {vote.option}
                        </div>
                      );
                    })}
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
