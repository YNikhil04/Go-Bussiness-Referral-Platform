import { Navigate, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./index.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = Cookies.get("jwt_token");

    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  //   const token = Cookies.get("jwt_token");

  //   if (token) {
  //     <Navigate to="/" replace />;
  //   }

  const validCrendiatls = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });
  };

  const onClickSignInBtn = async () => {
    try {
      const payLoad = {
        email: userName,
        password: password,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payLoad),
      };

      const data = await fetch(
        "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin",
        options,
      );

      const res = await data.json();

      if (data.ok) {
        validCrendiatls(res.data.token);
        console.log(res.data.token);
        navigate("/");
      } else {
        setErrorMsg(res.message);
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Go Business</h1>
        <p className="login-subtitle">
          Sign in to open your referral dashboard.
        </p>

        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            className="login-input"
            placeholder="you@example.com"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            className="login-input"
            placeholder="••••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button" onClick={onClickSignInBtn}>
          Sign in
        </button>

        <p>{errorMsg}</p>
      </div>
    </div>
  );
}
