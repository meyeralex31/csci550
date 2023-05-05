import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useElectionContext } from "./ElectionContext";
import { useUser } from "./UserContext";
/* global BigInt */

const SharesContext = React.createContext({});
const SharesProvider = ({ children }) => {
  const { profileId } = useUser();
  const { collectorsUrl, locationN } = useElectionContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(-1n);
  // { questionId:{reverseShare, forwardShare}}
  const [questionShares, setQuestionShares] = useState();
  useEffect(() => {
    const getData = async () => {
      if (profileId && searchParams.get("id") && collectorsUrl.length) {
        const results = await Promise.all(
          collectorsUrl.map((url) =>
            axios
              .post(`${url}/collectorProfileShares`, {
                voterId: profileId,
                electionId: searchParams.get("id"),
              })
              .then((res) => {
                return res.data.response;
              })
          )
        );
        setLocation(
          results.reduce(
            (prev, current) => prev + BigInt(current.locationShare),
            0n
          ) % BigInt(locationN)
        );
        setQuestionShares(
          results.reduce((prev, current) => {
            current.secretShares.map(
              ({ questionId, fowardShare, reverseShare }) => {
                if (prev[questionId]) {
                  prev[questionId] = {
                    fowardShare:
                      BigInt(fowardShare) + prev[questionId].fowardShare,
                    reverseShare:
                      BigInt(reverseShare) + prev[questionId].reverseShare,
                  };
                } else {
                  prev[questionId] = {
                    fowardShare: BigInt(fowardShare),
                    reverseShare: BigInt(reverseShare),
                  };
                }
              }
            );
            return prev;
          }, {})
        );
      }
    };
    getData();
  }, [profileId && searchParams.get("id") && collectorsUrl]);

  return (
    <SharesContext.Provider value={{ location, questionShares }}>
      {children}
    </SharesContext.Provider>
  );
};

const useSharesContext = () => {
  return useContext(SharesContext);
};

export default SharesProvider;
export { useSharesContext };
