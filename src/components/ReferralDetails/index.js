import React, { useEffect, useState } from "react";
import "./index.css";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

export default function ReferralDetails() {
  const [referralDetails, setReferralDetails] = useState({});
  const { id } = useParams();
  //   console.log(id);
  const navigate = useNavigate();
  const token = Cookies.get("jwt_token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchIdrefrral = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        // const referralId = id;

        const response = await fetch(
          `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`,
          options,
        );

        const res = await response.json();

        if (response.ok) {
          setReferralDetails(res.data.referrals[0]);
          console.log(res.data.referrals[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchIdrefrral();
  }, []);

  const onClickbackToDashBoardBtn = () => {
    navigate("/", { replace: true });
  };

  const onClickLogOutBtn = () => {
    Cookies.remove("jwt_token");
    navigate("/login", { replace: true });
  };
  return (
    <div className="details-layout">
      <nav className="details-nav">
        <div
          className="nav-logo-brand"
          onClick={() => navigate("/", { replace: true })}
        >
          Go Business
        </div>
        <div className="nav-actions-group">
          <button type="button" className="btn-try-free">
            Try for free
          </button>
          <button
            type="button"
            className="btn-logout-action"
            onClick={onClickLogOutBtn}
          >
            Log out
          </button>
        </div>
      </nav>

      <main className="details-main-content">
        <button
          type="button"
          className="back-dashboard-link"
          onClick={onClickbackToDashBoardBtn}
        >
          ← Back to dashboard
        </button>

        <header className="details-header-title">
          <h1>Referral Details</h1>
          <p>Full information for this referral partner.</p>
        </header>

        <div className="details-card">
          <div className="card-header-row">
            <h2 className="partner-name-heading">{referralDetails.name}</h2>
            <span className="service-badge-pill">
              {referralDetails.serviceName}
            </span>
          </div>

          <div className="info-metadata-table">
            <div className="metadata-row">
              <span className="metadata-label">REFERRAL ID</span>
              <span className="metadata-value strong-text">
                {referralDetails.id}
              </span>
            </div>

            <div className="metadata-row">
              <span className="metadata-label">NAME</span>
              <span className="metadata-value">{referralDetails.name}</span>
            </div>

            <div className="metadata-row">
              <span className="metadata-label">SERVICE NAME</span>
              <span className="metadata-value">
                {referralDetails.serviceName}
              </span>
            </div>

            <div className="metadata-row">
              <span className="metadata-label">DATE</span>
              <span className="metadata-value">{referralDetails.date}</span>
            </div>

            <div className="metadata-row no-border">
              <span className="metadata-label">PROFIT</span>
              <span className="metadata-value strong-text">
                {referralDetails.profit}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
