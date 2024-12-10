import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../components/provider/AuthProvider"; // Adjust the import path as necessary
import { getAccessToken } from "../../../Utils";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If there is no user or no access token, redirect to login
  if (!user || !getAccessToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
