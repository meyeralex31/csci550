import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Status from "./Status";
import Questions from "./Questions";
import RegisterButton from "./RegisterButton";

const RegisterElectionPage = () => {
  const title = "Title";
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
                <Status />
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
                <RegisterButton />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default RegisterElectionPage;
