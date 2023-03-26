import React, { useEffect } from "react";
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

const RegisterElectionPage = () => {
  const title = "Title";
  const status = VOTING_ENDED_STATUS;
  const registered = true;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("id")) {
      alert("No election id given returning to home page");
      navigate("/");
    }
  }, []);

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
                <Status status={status} />
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
