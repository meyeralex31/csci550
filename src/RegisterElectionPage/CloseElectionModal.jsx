import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MuiAlert from "@mui/material/Alert";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CancelIcon from "@mui/icons-material/Cancel";
import StopCircleIcon from "@mui/icons-material/StopCircle";

const CloseElectionModal = ({ open, handleClose, stopVoting }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Close Voting</DialogTitle>
      <DialogContent>
        <MuiAlert severity="warning" elevation={6} variant="filled">
          Notice: This will stop the election for voting and prevent further
          voting.
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
          startIcon={<StopCircleIcon />}
          onClick={stopVoting}
          variant="outlined"
          color="info"
        >
          Close Voting
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloseElectionModal;
