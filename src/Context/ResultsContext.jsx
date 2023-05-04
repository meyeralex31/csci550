import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
/* global BigInt */

const ResultsContext = React.createContext({});
const ResultsProvider = ({ children }) => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [ballotVoted, setBallotVoted] = useState([]);
  const [reverseBallotVoted, setReverseBallotVoted] = useState([]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const indexOfMax = (arr) => {
    if (arr.length === 0) {
      return -1;
    }

    var max = arr[0].total || 0;
    var maxIndex = 0;
    arr.forEach((item, i) => {
      if (item.total > max) {
        maxIndex = i;
        max = item.total;
      }
    });

    return maxIndex;
  };
  useEffect(() => {
    if (!searchParams.get("id")) {
      alert("No election id given returning to home page");
      navigate("/");
    } else {
      axios
        .get(
          "http://localhost:8080/getResults?electionId=" +
            searchParams.get("id")
        )
        .then((res) => {
          const q = res.data?.election?.questions;
          setQuestions(
            q.map((question) => {
              const chunkBallot = (ballot) => {
                let binaryString = BigInt(ballot)?.toString(2).padStart(5, "0");
                const targetLength =
                  Math.ceil(binaryString?.length / question?.options?.length) *
                  question?.options?.length;
                binaryString = binaryString?.padStart(targetLength, "0");
                return binaryString?.match(
                  new RegExp(".{1," + question?.options.length + "}", "g")
                );
              };
              //reverse due to array, might want to look more into
              chunkBallot(question?.forwardBallot)
                ?.reverse()
                ?.forEach((chunck, index) => {
                  let voteLocation = chunck.indexOf("1");
                  if (voteLocation >= 0) {
                    voteLocation = question.options.length - voteLocation - 1;
                    setBallotVoted((prev) => {
                      prev[index] = {
                        ...prev?.[index],
                        [question._id]: voteLocation,
                      };
                      return prev;
                    });
                    let total = question.options[voteLocation]?.total;
                    question.options[voteLocation].total = total
                      ? total + 1
                      : 1;
                  }
                });

              chunkBallot(question?.reverseBallot)
                ?.reverse()
                ?.forEach((chunck, index) => {
                  let voteLocation = chunck.indexOf("1");
                  if (voteLocation >= 0) {
                    setReverseBallotVoted((prev) => {
                      prev[index] = {
                        ...prev?.[index],
                        [question._id]: voteLocation,
                      };
                      return prev;
                    });
                  }
                });
              question.choosenIndex = indexOfMax(question.options);
              return question;
            })
          );
          setTitle(res.data?.election?.electionTitle);
        });
    }
  }, []);

  return (
    <ResultsContext.Provider
      value={{
        title,
        questions,
        ballotVoted,
        reverseBallotVoted,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};

const useResultsContext = () => {
  return useContext(ResultsContext);
};

export default ResultsProvider;
export { useResultsContext };
