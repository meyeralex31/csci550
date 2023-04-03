import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import { useNavigate } from "react-router-dom";
import { useUser } from "./Context/UserContext";
import Grid from "@mui/material/Grid";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [secondPassword, setSecondPassword] = useState();
  const [username, setUserName] = useState();
  const { register } = useUser();
  const passwordMatches = password === secondPassword;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid style={{ width: "33%" }} container spacing={2}>
        <Grid item xs={12}>
          <h1 style={{ textAlign: "center" }}>Register New Account:</h1>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={5}>
            <Grid style={{ padding: "0 10px 10px 10px" }} container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="outlined-required"
                  label="Name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="outlined-required"
                  label="User Name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="outlined-required"
                  label="Password"
                  hintText="Password"
                  type="password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="outlined-required"
                  label="Retype Password"
                  type="password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  error={!passwordMatches}
                  helperText={!passwordMatches ? "Passwords Must Match" : ""}
                  onChange={(e) => {
                    setSecondPassword(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  disabled={!username || !password || !name || !passwordMatches}
                  style={{ width: "100%" }}
                  variant="contained"
                  startIcon={<CreateIcon />}
                  onClick={async () => {
                    await register(username, password, name)
                      .then(() => {
                        navigate("/login");
                      })
                      .catch((e) => {
                        alert("Failed to register: " + e.message);
                      });
                  }}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
export default Register;
