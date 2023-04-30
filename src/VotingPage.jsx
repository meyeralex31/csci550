import React, { useEffect, useState } from "react";
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
import { useSearchParams } from "react-router-dom";
import { useElectionContext } from "./Context/ElectionContext";
import { VOTING_IN_PROGRESS_STATUS } from "./PublicElectionPage";
import axios from "axios";
import { useUser } from "./Context/UserContext";
/* global BigInt */

const VotingPage = () => {
  const [showVotingLocation, setShowVotingLocation] = useState(false);
  const { isElectionOwner, status, questions, title } = useElectionContext();
  const { profileId } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // this structure is { [electionId]: answer }
  const [answers, setAnswers] = useState({});
  const [allAnswersMade, setAllAnswersMade] = useState(false);
  // TODO values we need to get from server
  const collectorShares = [];
  const collectorSharesPrime = [];
  // we will obvisouly need to set this on server
  const [location, setLocation] = useState();
  const totalVoters = 6n;
  // end
  const redirect = () => {
    if (isElectionOwner) {
      navigate("/startElection?id=" + searchParams.get("id"));
    } else {
      navigate("/registerElection?id=" + searchParams.get("id"));
    }
  };
  const sumbit = () => {
    // will look like v, p, vPrime, and pPrime
    const itemToSumbit = questions.map((question) => {
      const answerID = answers[question._id];
      const indexOfAnswer = BigInt(
        question.options.findIndex((option) => option._id === answerID)
      );
      if (indexOfAnswer < 0n) {
        console.error("cant find option or answer");
        return {};
      }
      const optionsCount = BigInt(question.options.length);

      const powerV = location * optionsCount + indexOfAnswer;
      const v = 2n ** powerV;
      const p = collectorShares.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        v
      );
      const powerVPrime =
        (totalVoters - location) * optionsCount +
        (optionsCount - indexOfAnswer - 1n);
      const vPrime = 2n ** powerVPrime;
      const pPrime = collectorSharesPrime.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        vPrime
      );
      return {
        fowardBallot: p.toString(),
        reverseBallot: pPrime.toString(),
        questionId: question._id,
      };
    });
    axios
      .post("http://localhost:8080/vote", {
        profileId,
        electionId: searchParams.get("id"),
        questionsVotedOn: itemToSumbit,
      })
      .then((res) => {
        redirect();
      });
  };
  useEffect(() => {
    if (status !== "" && status !== VOTING_IN_PROGRESS_STATUS) redirect();
  }, [status]);

  useEffect(() => {
    setAllAnswersMade(
      questions.every((question) => {
        return answers[question._id];
      })
    );
  }, [answers, questions]);

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
          <Paper style={{ padding: "16px" }}>
            <List
              sx={{
                width: "95%",
                maxWidth: "95%",
                margin: "16px",
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
                          key={`section-${option.option}`}
                          label={option.option}
                          value={option.option}
                          control={<Radio />}
                          onChange={(e) => {
                            setAnswers((prev) => ({
                              ...prev,
                              [question._id]: option._id,
                            }));
                          }}
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
                disabled={!allAnswersMade}
                variant="contained"
                color="primary"
                onClick={() => {
                  sumbit();
                }}
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
                  // disabled={true}
                  value={`${location}`}
                  type={showVotingLocation ? "text" : "password"}
                  startAdornment={
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  }
                  onChange={(e) => {
                    setLocation(BigInt(e.target.value));
                  }}
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
