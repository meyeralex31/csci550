import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

const RegisterButton = ({
  disabled = false,
  registered = false,
  onClick = () => {},
}) => {
  const style = { marginRight: "auto", marginLeft: "auto" };
  if (registered) {
    return (
      <Button
        startIcon={<ClearIcon />}
        sx={style}
        variant="contained"
        color="error"
        disabled={disabled}
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
        disabled={disabled}
        onClick={onClick}
      >
        Register
      </Button>
    );
  }
};
export default RegisterButton;
