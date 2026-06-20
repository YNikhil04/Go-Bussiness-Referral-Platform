import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-bg-container">
      <div className="not-found-card-content">
        <h1 className="not-found-status-code">404</h1>
        <p className="not-found-message-text">Page not found</p>
        <button
          type="button"
          className="not-found-redirect-link"
          onClick={() => navigate("/", { replace: true })}
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
}
