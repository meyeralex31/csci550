import React from "react";
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
import { useUser } from "../Context/UserContext";
import { useElectionContext } from "../Context/ElectionContext";
import axios from "axios";
const RegisterElectionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profileId } = useUser();
  const { registered, status, questions, title, setRegistered, hasVoted } =
    useElectionContext();

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
                <h3>Questions</h3>
                <Questions questions={questions} />
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
                  disabled={status === VOTING_IN_PROGRESS_STATUS && hasVoted}
                  status={status}
                  registered={registered}
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
