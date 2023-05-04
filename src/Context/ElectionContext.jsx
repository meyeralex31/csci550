import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io("http://localhost:8080", {
  autoConnect: false,
});
const ElectionContext = React.createContext({});
const ElectionProvider = ({ children }) => {
  const [title, setTitle] = useState("");
  const [registered, setRegistered] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [status, setStatus] = useState("");
  const [questions, setQuestions] = useState([]);
  const { profileId } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [collectorsSelectedIds, setCollectorsSelectedIds] = useState([]);
  const [collectorsUrl, setCollectorsUrls] = useState([]);

  const [registedVoters, setRegistedVoters] = useState([]);
  const [electionOwner, setElectionOwner] = useState([]);
  const [profilesNamesVoted, setProfilesNamesVoted] = useState([]);
  const [locationN, setLocationN] = useState(0n);

  const isElectionOwner = !!(
    profileId === electionOwner &&
    profileId &&
    electionOwner
  );

  const [socketId, setSocketId] = useState("");
  useEffect(() => {
    if (!searchParams.get("id")) {
      alert("No election id given returning to home page");
      navigate("/");
    } else {
      axios
        .post("http://localhost:8080/getElection", {
          electionId: searchParams.get("id"),
        })
        .then((res) => {
          setStatus(res.data[0]?.REGISTRATION_STATUS);
          setQuestions(res.data[0]?.questions);
          setCollectorsSelectedIds(
            res.data[0]?.collectors.map(({ collectorId }) => collectorId)
          );
          setCollectorsUrls(res.data[0]?.collectors.map(({ url }) => url));
          setTitle(res.data[0]?.electionTitle);
          setElectionOwner(res.data[0]?.adminProfileId);
          setLocationN(res.data[0]?.locationN);
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
          setHasVoted(res.data[0]?.hasVoted);
        });
    }
  }, [profileId]);
  const getRegisteredVoters = () => {
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
  };
  useEffect(() => {
    getRegisteredVoters();
  }, [profileId, isElectionOwner]);
  useEffect(() => {
    setSocketId(socket.id);
  }, [socket.id]);
  useEffect(() => {
    if (isElectionOwner && socketId) {
      socket.on(`registered-${searchParams.get("id")}`, getRegisteredVoters);
      socket.emit("electionOwnerListening", {
        profileId,
        electionId: searchParams.get("id"),
        socketID: socketId,
      });
    }
  }, [isElectionOwner, socketId]);

  const getUsersVoted = () => {
    axios
      .get(
        `http://localhost:8080/votedVoters?profileId=${profileId}&electionId=${searchParams.get(
          "id"
        )}`
      )
      .then((res) => {
        setProfilesNamesVoted(res.data.profilesNamesVoted);
      });
  };
  useEffect(getUsersVoted, []);
  useEffect(() => {
    socket.connect();
    socket.on(`voted-${searchParams.get("id")}`, getUsersVoted);

    socket.on(`status-${searchParams.get("id")}`, (event) => {
      if (event?.status) {
        setStatus(event?.status);
      }
    });

    return () => {
      socket.off(`registered-${searchParams.get("id")}`, getRegisteredVoters);
      socket.off(`voted-${searchParams.get("id")}`, () => {});
      socket.off(`status-${searchParams.get("id")}`, () => {});
      socket.disconnect();
    };
  }, [searchParams.get("id")]);
  return (
    <ElectionContext.Provider
      value={{
        collectorsUrl,
        title,
        registered,
        status,
        hasVoted,
        questions,
        collectorsSelectedIds: isElectionOwner
          ? collectorsSelectedIds
          : undefined,
        registedVoters: isElectionOwner ? registedVoters : undefined,
        setStatus: isElectionOwner ? setStatus : undefined,
        isElectionOwner,
        profilesNamesVoted,
        setRegistered,
        setCollectorsSelectedIds: isElectionOwner
          ? setCollectorsSelectedIds
          : undefined,
        locationN,
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
