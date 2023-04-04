import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TitleIcon from "@mui/icons-material/Title";
import CircleIcon from "@mui/icons-material/Circle";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { REGISTRATION_STATUS } from "./PublicElectionPage";
import { useUser } from "./Context/UserContext";

const Create = () => {
  // structure {question: string, options: string[]}
  const [questions, setQuestions] = useState([
    { question: "", options: ["", ""] },
  ]);
  const { profileId } = useUser();
  const [title, setTitle] = useState("");

  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid style={{ width: "66%" }} container spacing={2}>
        <Grid xs={12} style={{ textAlign: "center" }}>
          Create Election:
        </Grid>
        <Grid xs={12}>
          <Paper>
            <Grid container style={{ padding: "10px" }}>
              <Grid item xs={9}>
                <TextField
                  required
                  fullWidth
                  id="outlined-required"
                  label="Title"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <QuestionMarkIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  value={title}
                />
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={2}>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Public?"
                  />
                </FormGroup>
              </Grid>
              {questions.map((questionObject, questionIndex) => (
                <React.Fragment key={questionIndex}>
                  <Grid item xs={12}>
                    <TextField
                      //  TODO make the first required
                      required
                      fullWidth
                      id="outlined-required"
                      label="Question"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TitleIcon />
                          </InputAdornment>
                        ),
                      }}
                      style={{ marginTop: "15px" }}
                      value={questionObject.question}
                      onChange={(event) => {
                        setQuestions((prev) => {
                          prev[questionIndex] = {
                            ...prev[questionIndex],
                            question: event.target.value,
                          };
                          return [...prev];
                        });
                      }}
                    />
                  </Grid>
                  {questionObject.options?.map(({ option }, index) => (
                    <React.Fragment key={`${questionIndex}-${index}`}>
                      <Grid item xs={5.75}>
                        <TextField
                          required
                          fullWidth
                          id="outlined-required"
                          label="Option"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CircleIcon />
                              </InputAdornment>
                            ),
                          }}
                          style={{ marginTop: "15px" }}
                          value={option}
                          onChange={(event) => {
                            setQuestions((prev) => {
                              prev[questionIndex].options[index] = {
                                option: event.target.value,
                              };
                              return [...prev];
                            });
                          }}
                        />
                      </Grid>
                      {index % 2 === 0 ? <Grid item xs={0.5} /> : null}
                    </React.Fragment>
                  ))}
                  <Grid item xs={5.75}>
                    <Button
                      style={{ width: "100%", marginTop: "15px" }}
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setQuestions((prev) => {
                          prev[questionIndex] = {
                            ...prev[questionIndex],
                            options: [...prev[questionIndex].options, ""],
                          };
                          return [...prev];
                        });
                      }}
                    >
                      Add Option
                    </Button>
                  </Grid>
                </React.Fragment>
              ))}
              <Grid item xs={12}>
                <Button
                  style={{ width: "100%", marginTop: "15px" }}
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() =>
                    setQuestions((prev) => [
                      ...prev,
                      {
                        question: "",
                        options: [{ option: "" }, { option: "" }],
                      },
                    ])
                  }
                >
                  Add Question
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  style={{ width: "100%", marginTop: "15px" }}
                  variant="contained"
                  disabled={
                    !title ||
                    !questions?.[0]?.question ||
                    !(
                      questions?.[0]?.options?.[0] &&
                      questions?.[0]?.options?.[1]
                    )
                  }
                  startIcon={<SaveAsIcon />}
                  onClick={() => {
                    axios
                      .post("http://localhost:8080/createElection", {
                        questions,
                        electionTitle: title,
                        REGISTRATION_STATUS,
                        adminProfileId: profileId,
                      })
                      .then((res) => {
                        navigate("/startElection?id=" + res.data.electionId);
                      })
                      .catch((e) => console.error(e));
                  }}
                >
                  Create Draft
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Create;
