import { useUser } from "./Context/UserContext";
import { Navigate } from "react-router-dom";
const RequireAuth = ({ children }) => {
  const { isSignedIn } = useUser();
  if (isSignedIn()) {
    return children;
  } else {
    return <Navigate to="/login" state={{ from: window.location }} />;
  }
};

export default RequireAuth;
