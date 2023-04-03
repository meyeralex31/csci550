import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import Grid from "@mui/material/Grid";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "./Context/UserContext";
const Login = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useUser();
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
          <Paper elevation={5}>
            <Grid style={{ padding: "0 10px 10px 10px" }} container spacing={2}>
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
                  value={userName}
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
                <Button
                  disabled={!userName || !password}
                  style={{ width: "100%" }}
                  variant="contained"
                  startIcon={<LoginIcon />}
                  onClick={async () => {
                    await signIn(userName, password)
                      .then(() => {
                        navigate("/");
                      })
                      .catch((e) => {
                        alert("Failed to login: " + e.message);
                      });
                  }}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            background
            elevation={0}
            style={{
              background: "#D3D3D3",
              textAlign: "center",
              padding: "10px 0px 10px 0px",
            }}
          >
            Don't Have an account yet? <Link to="/register">Register</Link>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
export default Login;
