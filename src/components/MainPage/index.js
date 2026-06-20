import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = Cookies.get("jwt-token");

    if (!jwtToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  return (
    <div>
      <h1>This is Main Page</h1>
    </div>
  );
}
