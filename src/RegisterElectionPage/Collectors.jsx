import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
const Collectors = ({ collectorsSelectedIds, setCollectorsSelectedIds }) => {
  const [collectors, setCollectors] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8080/collectorDtls").then((res) => {
      setCollectors(res.data.collectors);
    });
  }, []);
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
      {collectors.map((collector) => {
        const checked = collectorsSelectedIds.includes(collector.collectorId);
        return (
          <ListItem key={collector.collectorId}>
            <FormControlLabel
              key={`section-${collector.name}`}
              label={collector.name}
              control={
                <Checkbox
                  checked={checked}
                  onClick={() => {
                    setCollectorsSelectedIds((ids) => {
                      if (checked) {
                        const index = ids.indexOf(collector.collectorId);
                        if (index > -1) {
                          ids.splice(index, 1);
                        }
                      } else if (!ids.includes(collector.collectorId)) {
                        ids.push(collector.collectorId);
                      }
                      return [...ids];
                    });
                  }}
                />
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default Collectors;
