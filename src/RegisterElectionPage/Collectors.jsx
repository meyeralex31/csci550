import React from "react";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const Collectors = () => {
  const collectors = [
    { name: "Indiana" },
    { name: "Ohio" },
    { name: "Penn" },
    { name: "Tennesse" },
    { name: "Indiana" },
    { name: "Ohio" },
    { name: "Penn" },
    { name: "Tennesse" },
    { name: "Indiana" },
    { name: "Ohio" },
    { name: "Penn" },
    { name: "Tennesse" },
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
        paddingLeft: "10px",
        "& ul": { padding: 0 },
      }}
      subheader={<li />}
    >
      <ListSubheader>Choose atleast 2 Collectors</ListSubheader>
      {collectors.map((collector) => (
        <ListItem>
          <FormControlLabel
            key={`section-${collector.name}`}
            label={collector.name}
            control={<Checkbox defaultChecked />}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default Collectors;
