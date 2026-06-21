// ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const jwtToken = Cookies.get("jwt_token");

  // If the token doesn't exist, redirect to the login page immediately
  if (!jwtToken) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child route elements
  return <Outlet />;
};

export default ProtectedRoute;
