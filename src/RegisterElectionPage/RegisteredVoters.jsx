import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const RegisterVoters = () => {
  const voters = [
    { name: "Alex" },
    { name: "Archer" },
    { name: "Lana" },
    { name: "Cheryl" },
    { name: "Pam" },
    { name: "Malory" },
    { name: "Alex" },
    { name: "Archer" },
    { name: "Lana" },
    { name: "Cheryl" },
    { name: "Pam" },
    { name: "Malory" },
  ];
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: "100%",
        position: "relative",
        overflow: "auto",
        maxHeight: "320px",
        border: ".5px solid #EAEAEA",
        "& ul": { padding: 0 },
        paddingLeft: "10px",
      }}
      subheader={<li />}
    >
      {voters.map((voter) => (
        <ListItem key={`item-${voter.name}`}>
          <ListItemText primary={voter.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default RegisterVoters;
