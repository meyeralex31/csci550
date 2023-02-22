import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import BallotIcon from "@mui/icons-material/Ballot";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import {
  REGISTRATION_STATUS,
  VOTING_IN_PROGRESS_STATUS,
  VOTING_ENDED_STATUS,
} from "../PublicElectionPage";

const RegisterButton = ({
  disabled = false,
  registered = true,
  onClick = () => {},
  status = REGISTRATION_STATUS,
}) => {
  const style = { marginRight: "auto", marginLeft: "auto" };
  const buttonDisabled =
    disabled || (status !== REGISTRATION_STATUS && !registered);
  if (status === REGISTRATION_STATUS) {
    if (registered) {
      return (
        <Button
          startIcon={<ClearIcon />}
          sx={style}
          variant="contained"
          color="error"
          disabled={buttonDisabled}
          onClick={onClick}
        >
          Unregister
        </Button>
      );
    } else {
      return (
        <Button
          startIcon={<AppRegistrationIcon />}
          sx={style}
          variant="contained"
          color="info"
          disabled={buttonDisabled}
          onClick={onClick}
        >
          Register
        </Button>
      );
    }
  } else if (status === VOTING_IN_PROGRESS_STATUS) {
    return (
      <Button
        startIcon={<BallotIcon />}
        sx={style}
        variant="contained"
        color="primary"
        disabled={buttonDisabled}
        onClick={onClick}
      >
        Vote
      </Button>
    );
  } else if (status === VOTING_ENDED_STATUS) {
    return (
      <Button
        startIcon={<ConfirmationNumberIcon />}
        sx={style}
        variant="contained"
        color="secondary"
        disabled={disabled}
        onClick={onClick}
      >
        View Results
      </Button>
    );
  }
};
export default RegisterButton;
