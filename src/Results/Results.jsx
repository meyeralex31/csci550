import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { BallotDisplay } from "./BallotDisplay";
import { useResultsContext } from "../Context/ResultsContext";
const Results = () => {
  const { title, questions, ballotVoted, reverseBallotVoted } =
    useResultsContext();
  const [tabValue, setTabValue] = useState(0);

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
              <Grid item xs={12}>
                <Tabs
                  value={tabValue}
                  onChange={(_, newValue) => setTabValue(newValue)}
                >
                  <Tab label="Foward Ballot" />
                  <Tab label="Reverse Ballot" />
                </Tabs>
                <TabContext value={tabValue}>
                  <TabPanel value={0} style={{ maxHeight: "320px" }}>
                    <Grid container style={{ padding: "10px" }} spacing={2}>
                      <BallotDisplay ballots={ballotVoted} />
                    </Grid>
                  </TabPanel>
                  <TabPanel value={1} style={{ maxHeight: "320px" }}>
                    <Grid container style={{ padding: "10px" }} spacing={2}>
                      <BallotDisplay ballots={reverseBallotVoted} />
                    </Grid>
                  </TabPanel>
                </TabContext>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Results;
