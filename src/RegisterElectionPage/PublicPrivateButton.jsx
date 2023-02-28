import React from "react";
import Button from "@mui/material/Button";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
const buttonstyle = {
  float: "right",
  cursor: "none",
  pointerEvents: "none",
};
const PublicPrivateButton = ({ publicElection }) => {
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

export default PublicPrivateButton;
