import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckIcon from "@mui/icons-material/Check";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import LockIcon from "@mui/icons-material/Lock";
import WarningIcon from "@mui/icons-material/Warning";
const Status = () => {
  const publicElection = true;
  const openForRegisteration = true;
  const registered = true;

  const buttonstyle = {
    float: "right",
    cursor: "none",
    pointerEvents: "none",
  };
  const getStatusButton = () => {
    if (openForRegisteration) {
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
    } else {
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
  };

  const getPublicButton = () => {
    if (publicElection) {
      return (
        <Button
          startIcon={<LockOpenIcon />}
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
          style={buttonstyle}
          startIcon={<LockIcon />}
          variant="outlined"
          color="warning"
        >
          No
        </Button>
      );
    }
  };

  const getRegisteredButton = () => {
    if (registered) {
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
        {getPublicButton()}
      </Grid>
      <Grid item xs={3}>
        Registered?:
      </Grid>
      <Grid item xs={9} style={{ float: "right" }}>
        {getRegisteredButton()}
      </Grid>
    </Grid>
  );
};
export default Status;
