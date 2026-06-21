import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { replace, useNavigate } from "react-router-dom";
import "./index.css";

// const overviewCards = [
//   { id: 1, label: "Total Balance", value: "$9,568.00", icon: "💵" },
//   { id: 2, label: "Discount Percentage", value: "60%", icon: "💳" },
//   { id: 3, label: "Total Referral", value: "50", icon: "🔗" },
//   { id: 4, label: "Discount Amount", value: "$300", icon: "⌛" },
//   { id: 5, label: "Commission Amount", value: "$465.00", icon: " % " },
//   { id: 6, label: "Total Earning", value: "$158.00", icon: "💰" },
//   { id: 7, label: "Commission Discount", value: "40%", icon: "👥" },
//   { id: 8, label: "Total Bank Transfer", value: "$534.00", icon: "🔄" },
// ];

// Mock data for the Table rows
// const tableData = [
//   {
//     name: "Geeta",
//     service: "Frontend",
//     date: "2013/07/29",
//     profit: "$259,300",
//   },
//   {
//     name: "Vinod",
//     service: "Graphics",
//     date: "2013/06/16",
//     profit: "$176,900",
//   },
//   { name: "Rekha", service: "HR", date: "2013/05/08", profit: "$88,400" },
//   { name: "Ashok", service: "B2B", date: "2013/04/20", profit: "$147,500" },
//   { name: "Sonal", service: "PM", date: "2013/03/14", profit: "$302,100" },
//   { name: "Mohit", service: "QA", date: "2013/02/26", profit: "$113,800" },
//   { name: "Anjali", service: "DevOps", date: "2013/01/12", profit: "$158,700" },
//   {
//     name: "Srinivas",
//     service: "Frontend",
//     date: "2012/12/02",
//     profit: "$372,000",
//   },
//   {
//     name: "Harish",
//     service: "Frontend",
//     date: "2012/11/05",
//     profit: "$241,200",
//   },
//   { name: "Moumita", service: "HR", date: "2012/10/13", profit: "$132,000" },
// ];

export default function DashboardPage() {
  const navigate = useNavigate();

  const [overviewCards, setOverviewCard] = useState([]);
  const [serviceSummary, setServiceSummary] = useState([]);
  const [referral, setReferral] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [searchInput, setSearchInput] = useState("");

  // const [filterSearchData, setFilterSearchData] = useState(tableData);
  const [activeInputElement, setActiveInputElemnt] = useState("");

  const jwtToken = Cookies.get("jwt_token");
  useEffect(() => {
    if (!jwtToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const referralData = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        };
        const response = await fetch(
          "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals",
          options,
        );

        const res = await response.json();

        if (response.ok) {
          setOverviewCard(res.data.metrics);
          setServiceSummary(res.data.serviceSummary);
          setReferral(res.data.referral);
          setTableData(res.data.referrals);
          console.log(res);
        }

        // console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    referralData();
  }, [jwtToken]);

  const onClickGoBussinessLogo = () => {
    navigate("/", { replace: true });
  };

  const onClickLogoutBtn = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
  };

  const handleKetelemnt = (e) => {
    if (e.key === "Enter") {
      setActiveInputElemnt(searchInput);
    }
  };

  const filteredData = tableData.filter((item) => {
    const inputName = item.name
      .toLowerCase()
      .includes(activeInputElement.toLowerCase());
    const serviceName = item.serviceName
      .toLowerCase()
      .includes(searchInput.toLowerCase());

    return inputName || serviceName;
  });

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        <div className="nav-logo" onClick={onClickGoBussinessLogo}>
          Go Business
        </div>
        <div className="nav-actions">
          <button className="btn-primary">Try for free</button>
          <button className="btn-logout" onClick={onClickLogoutBtn}>
            Log out
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        {/* HEADER TITLE */}
        <header className="main-header">
          <h1>Referral Dashboard</h1>
          <p>
            Track your referrals, earnings, and partner activity in one place.
          </p>
        </header>

        {/* 2. OVERVIEW CARDS GRID */}
        <section className="dashboard-section card">
          <h2 className="section-title">Overview</h2>
          <div className="overview-grid">
            {overviewCards.map((card) => (
              <div key={card.id} className="overview-item">
                <div className="icon-badge">{card.icon}</div>
                <div className="overview-value">{card.value}</div>
                <div className="overview-label">{card.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SERVICE SUMMARY */}
        <section className="dashboard-section card">
          <h2 className="section-title">Service summary</h2>
          <div className="summary-row">
            <div className="summary-item">
              <span className="summary-label">SERVICE</span>
              <span className="summary-value highlight-blue">
                {serviceSummary.service}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">YOUR REFERRALS</span>
              <span className="summary-value">
                {serviceSummary.yourReferrals}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">ACTIVE REFERRALS</span>
              <span className="summary-value">
                {serviceSummary.activeReferrals}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">TOTAL REF. EARNINGS</span>
              <span className="summary-value">
                {serviceSummary.totalRefEarnings}
              </span>
            </div>
          </div>
        </section>

        {/* 4. REFER FRIENDS SECTION */}
        <section className="dashboard-section card">
          <h2 className="section-title">Refer friends and earn more</h2>
          <div className="referral-inputs">
            <div className="input-field-group">
              <label>YOUR REFERRAL LINK</label>
              <div className="copy-wrapper">
                <input type="text" readOnly value={referral.link} />
                <button className="btn-copy">Copy</button>
              </div>
            </div>
            <div className="input-field-group">
              <label>YOUR REFERRAL CODE</label>
              <div className="copy-wrapper">
                <input type="text" readOnly value={referral.code} />
                <button className="btn-copy">Copy</button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ALL REFERRALS TABLE SECTION */}
        <section className="dashboard-section card">
          <div className="table-header-controls">
            <h2 className="section-title">All referrals</h2>
            <div className="table-filters">
              <div className="search-box">
                <label>Search </label>
                <input
                  type="text"
                  placeholder="Name or service..."
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKetelemnt}
                />
              </div>
              <div className="sort-box">
                <label>Sort by date </label>
                <select>
                  <option>Newest first</option>
                </select>
              </div>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="referrals-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>SERVICE</th>
                  <th>DATE</th>
                  <th>PROFIT</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.name}</td>
                    <td>{row.serviceName}</td>
                    <td>{row.date}</td>
                    <td className="table-profit-value">{row.profit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="table-footer-pagination">
            <span className="entries-text">Showing 1–10 of 50 entries</span>
            <div className="pagination-buttons">
              <button className="btn-page text-btn">Previous</button>
              <button className="btn-page active">1</button>
              <button className="btn-page">2</button>
              <button className="btn-page">3</button>
              <button className="btn-page">4</button>
              <button className="btn-page">5</button>
              <button className="btn-page text-btn">Next</button>
            </div>
          </div>
        </section>
      </main>

      {/* 6. SYSTEM FOOTER */}
      <footer className="dashboard-footer">
        <div className="footer-logo">Go Business</div>
        <div className="footer-links">
          <span>About</span>
          <span>Contact</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
        <div className="footer-copy">© 2024 Go Business, Inc.</div>
      </footer>
    </div>
  );
}
