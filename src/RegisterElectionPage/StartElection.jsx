import React, { useState, useEffect } from "react";
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
import { useUser } from "../Context/UserContext";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useElectionContext } from "../Context/ElectionContext";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import CloseElectionModal from "./CloseElectionModal";

const StartElection = () => {
  const [tabValue, setTabValue] = useState(0);
  const [startElectionModalOpen, setStartElectionModalOpen] = useState(false);
  const [closeElectionModalOpen, setCloseElectionModalOpen] = useState(false);

  const [canStartElection, setCanStartElection] = useState(false);

  const navigate = useNavigate();
  const { profileId } = useUser();
  const [searchParams] = useSearchParams();
  const {
    registered,
    status,
    questions,
    title,
    setRegistered,
    setStatus,
    registedVoters,
    hasVoted,
    collectorsSelectedIds,
  } = useElectionContext();
  useEffect(() => {
    setCanStartElection(
      registedVoters?.length >= 3 && collectorsSelectedIds?.length >= 2
    );
  }, [registedVoters, collectorsSelectedIds]);

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
              collectors: collectorsSelectedIds,
              electionId: searchParams.get("id"),
            })
            .then(() => {
              setStatus(VOTING_IN_PROGRESS_STATUS);
            })
            .catch((e) => console.error(e));
          setStartElectionModalOpen(false);
        }}
      />

      <CloseElectionModal
        open={closeElectionModalOpen}
        handleClose={() => {
          setCloseElectionModalOpen(false);
        }}
        stopVoting={() => {
          axios
            .put("http://localhost:8080/updateElection", {
              REGISTRATION_STATUS: VOTING_ENDED_STATUS,
              profileId,
              electionId: searchParams.get("id"),
            })
            .then(() => {
              setStatus(VOTING_ENDED_STATUS);
            })
            .catch((e) => console.error(e));
          setCloseElectionModalOpen(false);
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
                <Status
                  status={status}
                  registered={registered}
                  hasVoted={hasVoted}
                />
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
                    <Collectors disabled={status !== REGISTRATION_STATUS} />
                  </TabPanel>
                  <TabPanel value={1} style={{ maxHeight: "320px" }}>
                    <Questions questions={questions} />
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
                    disabled={status === VOTING_IN_PROGRESS_STATUS && hasVoted}
                    registered={registered}
                    status={status}
                    onClick={() => {
                      if (status === REGISTRATION_STATUS) {
                        axios
                          .post("http://localhost:8080/registerVoter", {
                            profileId,
                            electionId: searchParams.get("id"),
                            hasRegistered: !registered,
                          })
                          .then((res) => {
                            if (res.data) {
                              setRegistered(res.data?.hasRegistered);
                            }
                          });
                      } else if (status === VOTING_IN_PROGRESS_STATUS) {
                        navigate("/VotingPage?id=" + searchParams.get("id"));
                      } else {
                        navigate("/results?id=" + searchParams.get("id"));
                      }
                    }}
                  />
                </Grid>
                {status === VOTING_IN_PROGRESS_STATUS && (
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
                      startIcon={<StopCircleIcon />}
                      style={{ marginRight: "auto", marginLeft: "auto" }}
                      variant="contained"
                      color="warning"
                      onClick={() => setCloseElectionModalOpen(true)}
                      // TODO disable if less than 2 people have voted
                    >
                      Close Voting
                    </Button>
                  </Grid>
                )}
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
                      disabled={
                        collectorsSelectedIds?.length < 2 || !canStartElection
                      }
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
