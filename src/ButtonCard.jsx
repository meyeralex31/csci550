import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";

const ButtonCard = ({ children, onClick }) => {
  return (
    <Grid xs={4} style={{ padding: "10px" }}>
      <Card style={{ height: "100px" }} raised>
        <CardActionArea
          onClick={onClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          {children}
        </CardActionArea>
      </Card>
    </Grid>
  );
};
export default ButtonCard;
