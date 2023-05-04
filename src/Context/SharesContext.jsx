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
        console.log(results);
        setLocation(
          results.reduce(
            (prev, current) => prev + BigInt(current.locationShare),
            0n
          ) % BigInt(locationN)
        );
      }
    };
    getData();
  }, [profileId && searchParams.get("id") && collectorsUrl]);

  return (
    <SharesContext.Provider value={{ location }}>
      {children}
    </SharesContext.Provider>
  );
};

const useSharesContext = () => {
  return useContext(SharesContext);
};

export default SharesProvider;
export { useSharesContext };
