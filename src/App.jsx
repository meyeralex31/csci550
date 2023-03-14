import React from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserProvider from "./UserContext";
import RequireAuth from "./RequireAuth";
import HomePage from "./HomePage";
import Create from "./Create";
import RegisterElectionPage from "./RegisterElectionPage/RegisterElectionPage";
import StartElection from "./RegisterElectionPage/StartElection";
import PublicElection from "./PublicElectionPage";
import VotingPage from "./VotingPage";
import Results from "./Results/Results";
const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<Create />} />
          <Route path="/registerElection" element={<RegisterElectionPage />} />
          <Route path="/startElection" element={<StartElection />} />
          <Route path="/publicElection" element={<PublicElection />} />
          <Route path="/votingPage" element={<VotingPage />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
