import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Check if user is logged in
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    // redirect to login  , if not authenticated
    return <Navigate to="/login" replace />;
  }

  // passing the protected component if authenticated
  return children;
};

export default PrivateRoute;
