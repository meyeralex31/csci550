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
import { useUser } from "../UserContext";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const StartElection = () => {
  const [title, setTitle] = useState("");
  const [registered, setRegistered] = useState(false);
  const [status, setStatus] = useState("");
  const [questions, setQuestions] = useState([]);
  const [collectorsSelectedIds, setCollectorsSelectedIds] = useState([]);

  const [tabValue, setTabValue] = useState(0);
  const [startElectionModalOpen, setStartElectionModalOpen] = useState(false);
  const [canStartElection, setCanStartElection] = useState(false);

  const navigate = useNavigate();
  const { profileId } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("id")) {
      alert("No election id given returning to home page");
      navigate("/");
    } else {
      axios
        .post("http://localhost:8080/displayElections", {
          electionId: searchParams.get("id"),
        })
        .then((res) => {
          setStatus(res.data[0]?.REGISTRATION_STATUS);
          setQuestions(res.data[0]?.questions);
          setCollectorsSelectedIds(res.data[0]?.collectors);
          setTitle(res.data[0]?.electionTitle);
        });
    }
  }, []);
  useEffect(() => {
    if (profileId) {
      axios
        .post("http://localhost:8080/getVoterDtls", {
          electionId: searchParams.get("id"),
          profileId,
        })
        .then((res) => {
          setRegistered(res.data[0]?.hasRegistered);
        });
    }
  }, [profileId]);

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
      <Grid style={{ width: "80%", maxHeight: "80%" }} container spacing={2}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          {title}
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Grid container style={{ padding: "10px" }}>
              <Grid item xs={5} style={{ borderRight: "1px solid grey" }}>
                <Status status={status} registered={registered} />
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
                    <Collectors
                      collectorsSelectedIds={collectorsSelectedIds}
                      setCollectorsSelectedIds={setCollectorsSelectedIds}
                    />
                  </TabPanel>
                  <TabPanel value={1} style={{ maxHeight: "320px" }}>
                    <Questions questions={questions} />
                  </TabPanel>
                  <TabPanel value={2} style={{ maxHeight: "320px" }}>
                    <RegisterVoters setCanStartElection={setCanStartElection} />
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
