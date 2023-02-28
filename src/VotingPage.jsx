import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MuiAlert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import List from "@mui/material/List";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import ListSubheader from "@mui/material/ListSubheader";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import BallotIcon from "@mui/icons-material/Ballot";
import { useNavigate } from "react-router-dom";

const VotingPage = () => {
  const title = "Title";
  const [showVotingLocation, setShowVotingLocation] = useState(false);
  const questions = [
    { question: "Which fruits do you prefer?", options: ["Apple", "Mango"] },
    { question: "Which animals do you prefer?", options: ["Dog", "Cat"] },
    { question: "Which fruits do you prefer?", options: ["Apple", "Mango"] },
    { question: "Which animals do you prefer?", options: ["Dog", "Cat"] },
    { question: "Which fruits do you prefer?", options: ["Apple", "Mango"] },
    { question: "Which animals do you prefer?", options: ["Dog", "Cat"] },
  ];
  const navigate = useNavigate();

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
            <List
              sx={{
                width: "100%",
                maxWidth: "100%",
                position: "relative",
                overflow: "auto",
                maxHeight: "320px",
                border: ".5px solid #EAEAEA",
                paddingLeft: "10px",
                "& ul": { padding: 0 },
              }}
              subheader={<li />}
            >
              {questions.map((question) => (
                <li key={`section-${question.question}`}>
                  <ul>
                    <ListSubheader>{question.question}</ListSubheader>
                    <RadioGroup>
                      {question.options.map((option) => (
                        <FormControlLabel
                          key={`section-${option}`}
                          label={option}
                          value={option}
                          control={<Radio />}
                        />
                      ))}
                    </RadioGroup>
                  </ul>
                </li>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              style={{ padding: "10px" }}
            >
              <Button
                startIcon={<BallotIcon />}
                variant="contained"
                color="primary"
                onClick={() => navigate("/registerElection")}
              >
                Vote
              </Button>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              style={{ padding: "10px" }}
            >
              <FormControl
                sx={{ m: 1, width: "50-ch", alignContent: "center" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Location
                </InputLabel>
                <OutlinedInput
                  disabled={true}
                  value="6"
                  type={showVotingLocation ? "text" : "password"}
                  startAdornment={
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setShowVotingLocation((prev) => !prev);
                        }}
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                      >
                        {showVotingLocation ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <MuiAlert severity="warning" elevation={6} variant="filled">
                Notice: This will allow you to confirm your ballot when the
                election is complete. Please keep in a safe place. If someone
                sees this they will know how you voted.
              </MuiAlert>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
export default VotingPage;
