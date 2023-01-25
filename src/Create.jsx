import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TitleIcon from "@mui/icons-material/Title";
import CircleIcon from "@mui/icons-material/Circle";

const Create = () => {
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
                />
              </Grid>
              {["x", "y", "z"].map((element, index) => (
                <>
                  <Grid item xs={5.75}>
                    <TextField
                      //  TODO make the first required
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
                    />
                  </Grid>
                  {index % 2 === 0 ? <Grid item xs={0.5} /> : null}
                </>
              ))}
              <Grid item xs={5.75}>
                <Button
                  style={{ width: "100%", marginTop: "15px" }}
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Add Option
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  style={{ width: "100%", marginTop: "15px" }}
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Add Question
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
