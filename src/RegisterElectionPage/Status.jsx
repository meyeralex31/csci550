import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckIcon from "@mui/icons-material/Check";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import WarningIcon from "@mui/icons-material/Warning";
import PublicPrivateButton from "./PublicPrivateButton";
import {
  REGISTRATION_STATUS,
  VOTING_IN_PROGRESS_STATUS,
  VOTING_ENDED_STATUS,
} from "../PublicElectionPage";
const Status = ({ hasVoted = false, status, registered }) => {
  const publicElection = false;

  const buttonstyle = {
    float: "right",
    cursor: "none",
    pointerEvents: "none",
  };
  const getStatusButton = () => {
    if (status === REGISTRATION_STATUS) {
      return (
        <Button
          style={buttonstyle}
          startIcon={<PendingActionsIcon />}
          variant="outlined"
          color="warning"
        >
          Open for Registration
        </Button>
      );
    } else if (status === VOTING_IN_PROGRESS_STATUS) {
      if (!registered) {
        return (
          <Button
            style={buttonstyle}
            startIcon={<AssignmentLateIcon />}
            variant="outlined"
            color="error"
          >
            Closed for Registration
          </Button>
        );
      }
      return (
        <Button
          style={buttonstyle}
          startIcon={<PendingActionsIcon />}
          variant="outlined"
          color="success"
        >
          Open for Voting
        </Button>
      );
    } else if (status === VOTING_ENDED_STATUS) {
      return (
        <Button
          style={buttonstyle}
          startIcon={<AssignmentLateIcon />}
          variant="outlined"
          color="error"
        >
          Voting Complete
        </Button>
      );
    }
  };

  const getYesNoButton = (booleanValue) => {
    if (booleanValue) {
      return (
        <Button
          startIcon={<CheckIcon />}
          style={buttonstyle}
          variant="outlined"
          color="success"
        >
          Yes
        </Button>
      );
    } else {
      return (
        <Button
          startIcon={<WarningIcon />}
          style={buttonstyle}
          variant="outlined"
          color="warning"
        >
          No
        </Button>
      );
    }
  };
  return (
    <Grid
      container
      spacing={2}
      rowSpacing={5}
      style={{
        marginLeft: "0",
        marginTop: "0",
        width: "100%",
        paddingRight: "5px",
      }}
    >
      <Grid item xs={3}>
        Status:
      </Grid>
      <Grid item xs={9} style={{ float: "right" }}>
        {getStatusButton()}
      </Grid>
      <Grid item xs={3}>
        Is Public?:
      </Grid>
      <Grid item xs={9} style={{ float: "right" }}>
        <PublicPrivateButton />
      </Grid>
      <Grid item xs={3}>
        Registered?:
      </Grid>
      <Grid item xs={9} style={{ float: "right" }}>
        {getYesNoButton(registered)}
      </Grid>
      {status !== REGISTRATION_STATUS && registered && (
        <>
          <Grid item xs={3}>
            Has Voted?:
          </Grid>
          <Grid item xs={9} style={{ float: "right" }}>
            {getYesNoButton(hasVoted)}
          </Grid>
        </>
      )}
    </Grid>
  );
};
export default Status;
