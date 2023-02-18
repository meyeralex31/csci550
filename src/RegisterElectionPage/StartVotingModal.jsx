import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MuiAlert from "@mui/material/Alert";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CancelIcon from "@mui/icons-material/Cancel";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const StartVotingModal = ({ open, handleClose, startVoting }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Open Voting</DialogTitle>
      <DialogContent>
        <MuiAlert severity="warning" elevation={6} variant="filled">
          Notice: This will open the election for voting and prevent further
          registration
        </MuiAlert>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<CancelIcon />}
          onClick={handleClose}
          variant="outlined"
          color="warning"
        >
          Cancel
        </Button>
        <Button
          startIcon={<PlayArrowIcon />}
          onClick={startVoting}
          variant="outlined"
          color="info"
        >
          Open Voting
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StartVotingModal;
