import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PublicPrivateButton from "./RegisterElectionPage/PublicPrivateButton";
import RegisterButton from "./RegisterElectionPage/RegisterButton";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DoneIcon from "@mui/icons-material/Done";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
export const REGISTRATION_STATUS = "Registeration Open";
export const VOTING_IN_PROGRESS_STATUS = "Voting Started";
export const VOTING_ENDED_STATUS = "Voting Ended";

const PublicElection = () => {
  const nonbuttonstyle = {
    float: "right",
    cursor: "none",
    pointerEvents: "none",
    marginRight: "auto",
    marginLeft: "auto",
  };
  const centerStyle = { marginRight: "auto", marginLeft: "auto" };
  const elections = [
    { title: "2024 election", public: true, status: REGISTRATION_STATUS },
    { title: "2022 election", public: true, status: VOTING_IN_PROGRESS_STATUS },
    { title: "2020 election", public: true, status: VOTING_ENDED_STATUS },
    { title: "Private election", public: false, status: REGISTRATION_STATUS },
  ];
  const navigate = useNavigate();

  const getStatus = (status) => {
    if (status === REGISTRATION_STATUS) {
      return (
        <Button
          style={nonbuttonstyle}
          startIcon={<PendingActionsIcon />}
          variant="outlined"
          color="success"
        >
          Open for Registration
        </Button>
      );
    } else if (status === VOTING_IN_PROGRESS_STATUS) {
      return (
        <Button
          style={nonbuttonstyle}
          startIcon={<DonutLargeIcon />}
          variant="outlined"
          color="warning"
        >
          Voting In Progress
        </Button>
      );
    } else if (status === VOTING_ENDED_STATUS) {
      return (
        <Button
          style={nonbuttonstyle}
          startIcon={<DoneIcon />}
          variant="outlined"
          color="error"
        >
          Voting Complete
        </Button>
      );
    }
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid style={{ width: "75%" }} container spacing={2}>
        <Grid item xs={12}>
          <h1 style={{ textAlign: "center" }}>Public Elections:</h1>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Title</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Public</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {elections.map((row, index) => (
                  <TableRow
                    key={`${row.title}-${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell align="center">
                      {getStatus(row.status)}
                    </TableCell>
                    <TableCell align="center">
                      <PublicPrivateButton publicElection={row.public} />
                    </TableCell>
                    <TableCell align="center">
                      <RegisterButton
                        disabled={!row.public}
                        status={row.status}
                        onClick={() => navigate("/registerElection")}
                        registered={true}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default PublicElection;
