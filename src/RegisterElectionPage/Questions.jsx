import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

const Questions = () => {
  //{ question: "", options: ["", ""] }
  const questions = [
    { question: "Which fruits do you prefer?", options: ["Apple", "Mango"] },
    { question: "Which animals do you prefer?", options: ["Dog", "Cat"] },
    { question: "Which fruits do you prefer?", options: ["Apple", "Mango"] },
    { question: "Which animals do you prefer?", options: ["Dog", "Cat"] },
    { question: "Which fruits do you prefer?", options: ["Apple", "Mango"] },
    { question: "Which animals do you prefer?", options: ["Dog", "Cat"] },
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
      {questions.map((question) => (
        <li key={`section-${question.question}`}>
          <ul>
            <ListSubheader>{question.question}</ListSubheader>
            {question.options.map((option) => (
              <ListItem key={`item-${question}-${option}`}>
                <ListItemText primary={option} />
              </ListItem>
            ))}
          </ul>
        </li>
      ))}
    </List>
  );
};

export default Questions;
