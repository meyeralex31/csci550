import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useUser } from "./UserContext";

export const REGISTRATION_STATUS = "Registeration Open";
export const VOTING_IN_PROGRESS_STATUS = "Voting Started";
export const VOTING_ENDED_STATUS = "Voting Ended";
const getElections = async (profileId) => {
  const voteDetails = await axios
    .post("http://localhost:8080/getVoterDtls", { profileId })
    .then((res) => {
      return res.data;
    });
  return await axios
    .post("http://localhost:8080/displayElections")
    .then((res) => {
      return res.data.map((item) => {
        // const vd = voteDetails.find((detail) => (detail.electionId = item.id));
        const vd = { hasRegistered: false };
        return { ...item, registered: vd?.hasRegistered, public: true };
      });
    })
    .catch((e) => console.error(e));
};
const PublicElection = () => {
  const nonbuttonstyle = {
    float: "right",
    cursor: "none",
    pointerEvents: "none",
    marginRight: "auto",
    marginLeft: "auto",
  };
  const centerStyle = { marginRight: "auto", marginLeft: "auto" };
  const [elections, setElections] = useState([]);
  const navigate = useNavigate();
  const { profileId } = useUser();
  useEffect(() => {
    if (profileId)
      getElections(profileId).then((electionsRes) =>
        setElections(electionsRes)
      );
  }, [profileId]);
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
                      {row.electionTitle}
                    </TableCell>
                    <TableCell align="center">
                      {getStatus(row.REGISTRATION_STATUS)}
                    </TableCell>
                    <TableCell align="center">
                      <PublicPrivateButton publicElection={row.public} />
                    </TableCell>
                    <TableCell align="center">
                      <RegisterButton
                        disabled={!row.public}
                        status={row.REGISTRATION_STATUS}
                        onClick={() =>
                          navigate("/registerElection?id=" + row._id)
                        }
                        registered={row.registered}
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
