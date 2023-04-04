import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../UserContext";
import { useSearchParams } from "react-router-dom";

const RegisterVoters = ({ setCanStartElection }) => {
  const [voters, setVotes] = useState([]);
  const { profileId } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (profileId)
      axios
        .get(
          `http://localhost:8080/registerVoters?profileId=${profileId}&electionId=${searchParams.get(
            "id"
          )}`
        )
        .then((res) => {
          if (res.data) {
            setVotes(res.data.profilesNamesRegistered);
          }
        });
  }, [profileId]);
  useEffect(() => {
    setCanStartElection(voters?.length >= 3);
  }, [voters]);
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
