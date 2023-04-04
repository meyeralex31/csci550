import { useUser } from "./Context/UserContext";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import AddIcon from "@mui/icons-material/Add";
import ButtonCard from "./ButtonCard";
import GroupIcon from "@mui/icons-material/Group";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import KeyIcon from "@mui/icons-material/Key";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const { userName } = useUser();
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid style={{ width: "50%" }} container spacing={2}>
        <Grid xs={12} style={{ textAlign: "center" }}>
          Welcome, {userName}
        </Grid>
        <Grid xs={12}>
          <Paper
            style={{
              background: "#D3D3D3",
            }}
            elevation={3}
          >
            <Grid container style={{ padding: "10px" }}>
              <ButtonCard
                onClick={() => {
                  navigate("/create");
                }}
              >
                <AddIcon /> <span>Create Election</span>
              </ButtonCard>
              <ButtonCard
                onClick={() => {
                  console.log("My Election");
                }}
              >
                <NoteAltIcon /> <span>My Election</span>
              </ButtonCard>
              <ButtonCard
                onClick={() => {
                  navigate("/publicElection");
                }}
              >
                <GroupIcon /> <span>Public Elections</span>
              </ButtonCard>
              <ButtonCard
                onClick={() => {
                  console.log("Registered Elections");
                }}
              >
                <ContentPasteIcon /> <span>Registered Elections</span>
              </ButtonCard>
              <ButtonCard
                onClick={() => {
                  console.log("Access Code");
                }}
              >
                <KeyIcon /> <span>Access Code</span>
              </ButtonCard>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
