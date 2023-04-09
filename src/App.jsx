import React from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserProvider from "./Context/UserContext";
import RequireAuth from "./RequireAuth";
import HomePage from "./HomePage";
import Create from "./Create";
import RegisterElectionPage from "./RegisterElectionPage/RegisterElectionPage";
import StartElection from "./RegisterElectionPage/StartElection";
import PublicElection from "./PublicElectionPage";
import VotingPage from "./VotingPage";
import Results from "./Results/Results";
import ElectionProvider from "./Context/ElectionContext";
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
          <Route
            path="/create"
            element={
              <RequireAuth>
                <Create />
              </RequireAuth>
            }
          />
          <Route
            path="/registerElection"
            element={
              <RequireAuth>
                <ElectionProvider>
                  <RegisterElectionPage />
                </ElectionProvider>
              </RequireAuth>
            }
          />
          <Route
            path="/startElection"
            element={
              <RequireAuth>
                <ElectionProvider>
                  <StartElection />
                </ElectionProvider>
              </RequireAuth>
            }
          />
          <Route
            path="/publicElection"
            element={
              <RequireAuth>
                <PublicElection />
              </RequireAuth>
            }
          />
          <Route
            path="/votingPage"
            element={
              <ElectionProvider>
                <RequireAuth>
                  <VotingPage />
                </RequireAuth>
              </ElectionProvider>
            }
          />
          <Route
            path="/results"
            element={
              <RequireAuth>
                <Results />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
