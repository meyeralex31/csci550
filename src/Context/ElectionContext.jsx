import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ElectionContext = React.createContext({});
const ElectionProvider = ({ children }) => {
  const [title, setTitle] = useState("");
  const [registered, setRegistered] = useState(false);
  const [status, setStatus] = useState("");
  const [questions, setQuestions] = useState([]);
  const { profileId } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [collectorsSelectedIds, setCollectorsSelectedIds] = useState([]);
  const [registedVoters, setRegistedVoters] = useState([]);
  const [electionOwner, setElectionOwner] = useState([]);
  const isElectionOwner =
    profileId === electionOwner && profileId && electionOwner;

  useEffect(() => {
    if (!searchParams.get("id")) {
      alert("No election id given returning to home page");
      navigate("/");
    } else {
      axios
        .post("http://localhost:8080/displayElections", {
          electionId: searchParams.get("id"),
        })
        .then((res) => {
          setStatus(res.data[0]?.REGISTRATION_STATUS);
          setQuestions(res.data[0]?.questions);
          setCollectorsSelectedIds(res.data[0]?.collectors);
          setTitle(res.data[0]?.electionTitle);
          setElectionOwner(res.data[0]?.adminProfileId);
        });
    }
  }, [profileId]);
  useEffect(() => {
    if (profileId) {
      axios
        .post("http://localhost:8080/getVoterDtls", {
          electionId: searchParams.get("id"),
          profileId,
        })
        .then((res) => {
          setRegistered(res.data[0]?.hasRegistered);
        });
    }
  }, [profileId]);
  useEffect(() => {
    if (isElectionOwner)
      axios
        .get(
          `http://localhost:8080/registerVoters?profileId=${profileId}&electionId=${searchParams.get(
            "id"
          )}`
        )
        .then((res) => {
          if (res.data) {
            setRegistedVoters(res.data.profilesNamesRegistered);
          }
        });
  }, [profileId, electionOwner, isElectionOwner]);

  return (
    <ElectionContext.Provider
      value={{
        title,
        registered,
        status,
        questions,
        collectorsSelectedIds: isElectionOwner
          ? collectorsSelectedIds
          : undefined,
        registedVoters: isElectionOwner ? registedVoters : undefined,
        setStatus: isElectionOwner ? setStatus : undefined,

        setRegistered,
        setCollectorsSelectedIds: isElectionOwner
          ? setCollectorsSelectedIds
          : undefined,
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
};

const useElectionContext = () => {
  return useContext(ElectionContext);
};

export default ElectionProvider;
export { useElectionContext };
