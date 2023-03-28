import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Status from "./Status";
import Questions from "./Questions";
import RegisterButton from "./RegisterButton";
import {
  REGISTRATION_STATUS,
  VOTING_IN_PROGRESS_STATUS,
  VOTING_ENDED_STATUS,
} from "../PublicElectionPage";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../UserContext";
import axios from "axios";
const RegisterElectionPage = () => {
  const title = "Title";
  const status = REGISTRATION_STATUS;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [registered, setRegistered] = useState(false);
  const [electionOwner, setElectionOwner] = useState(false);

  const { profileId } = useUser();
  useEffect(() => {
    if (!searchParams.get("id")) {
      alert("No election id given returning to home page");
      navigate("/");
    } else {
    }
  }, []);

  useEffect(() => {
    if (profileId)
      axios
        .post("http://localhost:8080/getVoterDtls", {
          profileId,
          electionId: searchParams.get("id"),
        })
        .then((res) => {
          if (res.data) {
            setRegistered(res.data[0]?.hasRegistered);
          }
        });
  }, [profileId]);

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
                <h3>Questions</h3>
                <Questions />
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
                <RegisterButton
                  status={status}
                  registered={registered}
                  onClick={() => {
                    if (status === REGISTRATION_STATUS) {
                      console.log("registration status changed");
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
                    } else if (status === VOTING_ENDED_STATUS) {
                      navigate("/results?id=" + searchParams.get("id"));
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default RegisterElectionPage;
