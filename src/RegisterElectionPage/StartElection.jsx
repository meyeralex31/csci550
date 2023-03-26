import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Status from "./Status";
import Questions from "./Questions";
import RegisterButton from "./RegisterButton";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import Collectors from "./Collectors";
import RegisterVoters from "./RegisteredVoters";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StartVotingModal from "./StartVotingModal";
import {
  REGISTRATION_STATUS,
  VOTING_IN_PROGRESS_STATUS,
  VOTING_ENDED_STATUS,
} from "../PublicElectionPage";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import axios from "axios";

const StartElection = () => {
  const title = "Title";
  const registered = true;
  const status = VOTING_IN_PROGRESS_STATUS;
  const [tabValue, setTabValue] = useState(0);
  const [startElectionModalOpen, setStartElectionModalOpen] = useState(false);
  const navigate = useNavigate();
  const { profileId } = useUser();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StartVotingModal
        open={startElectionModalOpen}
        handleClose={() => {
          setStartElectionModalOpen(false);
        }}
        startVoting={() => {
          axios
            .put("http://localhost:8080/updateElection", {
              REGISTRATION_STATUS: VOTING_IN_PROGRESS_STATUS,
              profileId,
            })
            .then(() => {
              // navigate("/startElection");
            })
            .catch((e) => console.error(e));
          setStartElectionModalOpen(false);
        }}
      />
      <Grid style={{ width: "80%", maxHeight: "80%" }} container spacing={2}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          {title}
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Grid container style={{ padding: "10px" }}>
              <Grid item xs={5} style={{ borderRight: "1px solid grey" }}>
                <Status />
              </Grid>
              <Grid
                item
                xs={7}
                style={{ paddingLeft: "10px", maxHeight: "400px" }}
              >
                <Tabs
                  value={tabValue}
                  onChange={(_, newValue) => setTabValue(newValue)}
                >
                  <Tab label="Collectors" />
                  <Tab label="Questions" />
                  <Tab label="Register Voters" />
                </Tabs>
                <TabContext value={tabValue}>
                  <TabPanel value={0} style={{ maxHeight: "320px" }}>
                    <Collectors />
                  </TabPanel>
                  <TabPanel value={1} style={{ maxHeight: "320px" }}>
                    <Questions />
                  </TabPanel>
                  <TabPanel value={2} style={{ maxHeight: "320px" }}>
                    <RegisterVoters />
                  </TabPanel>
                </TabContext>
              </Grid>
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                style={{
                  background: "#D3D3D3",
                  padding: "20px",
                  marginTop: "10px",
                }}
              >
                <Grid
                  item
                  xs={6}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RegisterButton
                    registered={registered}
                    status={status}
                    onClick={() => {
                      if (status === REGISTRATION_STATUS) {
                        console.log("registration status changed");
                      } else if (status === VOTING_IN_PROGRESS_STATUS) {
                        navigate("/VotingPage");
                      }
                    }}
                  />
                </Grid>
                {status === REGISTRATION_STATUS && (
                  <Grid
                    item
                    xs={6}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      startIcon={<PlayArrowIcon />}
                      style={{ marginRight: "auto", marginLeft: "auto" }}
                      variant="contained"
                      color="info"
                      onClick={() => setStartElectionModalOpen(true)}
                    >
                      Open Voting
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default StartElection;
