import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import "./index.css";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [overviewCards, setOverviewCard] = useState([]);
  const [serviceSummary, setServiceSummary] = useState({});
  const [referral, setReferral] = useState({});
  const [tableData, setTableData] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [activeInputElement, setActiveInputElement] = useState("");
  const [sortInput, setSortInput] = useState("Newest first");

  // CLIENT-SIDE PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const jwtToken = Cookies.get("jwt_token");

  useEffect(() => {
    if (!jwtToken) {
      navigate("/login", { replace: true });
    }
  }, [jwtToken, navigate]);

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

        let sorted = sortInput === "Newest first" ? "desc" : "asc";

        const response = await fetch(
          `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?search=${activeInputElement}&q=${searchInput}&sort=${sorted}`,
          options,
        );

        const res = await response.json();

        if (response.ok) {
          setOverviewCard(res.data.metrics || []);
          setServiceSummary(res.data.serviceSummary || {});
          setReferral(res.data.referral || {});
          setTableData(res.data.referrals || []);

          // Reset to page 1 whenever a new search response or sort is resolved
          setCurrentPage(1);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (jwtToken) {
      referralData();
    }
  }, [jwtToken, activeInputElement, sortInput]);

  const onClickGoBussinessLogo = () => {
    navigate("/", { replace: true });
  };

  const onClickLogoutBtn = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
  };

  const handleKetelemnt = (e) => {
    if (e.key === "Enter") {
      setActiveInputElement(searchInput);
    }
  };

  // CLIENT-SIDE PAGINATION LOGIC
  const totalEntries = tableData.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage) || 1;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  // Slice the full dataset to get exactly up to 10 records for the active view
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  const startEntry = totalEntries === 0 ? 0 : indexOfFirstRow + 1;
  const endEntry =
    indexOfLastRow > totalEntries ? totalEntries : indexOfLastRow;

  // Generate an array of page numbers to render [1, 2, 3...] dynamically
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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

        {/* OVERVIEW CARDS GRID */}
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

        {/* SERVICE SUMMARY */}
        <section className="dashboard-section card">
          <h2 className="section-title">Service summary</h2>
          <div className="summary-row">
            <div className="summary-item">
              <span className="summary-label">SERVICE</span>
              <span className="summary-value highlight-blue">
                {serviceSummary.service || "N/A"}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">YOUR REFERRALS</span>
              <span className="summary-value">
                {serviceSummary.yourReferrals || 0}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">ACTIVE REFERRALS</span>
              <span className="summary-value">
                {serviceSummary.activeReferrals || 0}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">TOTAL REF. EARNINGS</span>
              <span className="summary-value">
                {serviceSummary.totalRefEarnings || "$0.00"}
              </span>
            </div>
          </div>
        </section>

        {/* REFER FRIENDS SECTION */}
        <section className="dashboard-section card">
          <h2 className="section-title">Refer friends and earn more</h2>
          <div className="referral-inputs">
            <div className="input-field-group">
              <label>YOUR REFERRAL LINK</label>
              <div className="copy-wrapper">
                <input type="text" readOnly value={referral.link || ""} />
                <button className="btn-copy">Copy</button>
              </div>
            </div>
            <div className="input-field-group">
              <label>YOUR REFERRAL CODE</label>
              <div className="copy-wrapper">
                <input type="text" readOnly value={referral.code || ""} />
                <button className="btn-copy">Copy</button>
              </div>
            </div>
          </div>
        </section>

        {/* ALL REFERRALS TABLE SECTION */}
        <section className="dashboard-section card">
          <div className="table-header-controls">
            <h2 className="section-title">All referrals</h2>
            <div className="table-filters">
              <div className="search-box">
                <label>Search </label>
                <input
                  type="text"
                  placeholder="Name or service..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKetelemnt}
                />
              </div>
              <div className="sort-box">
                <label>Sort by date </label>
                <select
                  onChange={(e) => setSortInput(e.target.value)}
                  value={sortInput}
                >
                  <option value="Newest first">Newest first</option>
                  <option value="Oldest first">Oldest first</option>
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
                {currentRows.length > 0 ? (
                  currentRows.map((row, index) => (
                    <tr
                      key={row.id || index}
                      onClick={() => navigate(`/referral/${row.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{row.name}</td>
                      <td>{row.serviceName || row.service}</td>
                      <td>{row.date}</td>
                      <td className="table-profit-value">{row.profit}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "24px",
                        color: "#64748b",
                      }}
                    >
                      No referrals found matching "{activeInputElement}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* DYNAMIC PAGINATION FOOTER */}
          <div className="table-footer-pagination">
            <span className="entries-text">
              Showing {startEntry}–{endEntry} of {totalEntries} entries
            </span>
            <div className="pagination-buttons">
              <button
                className="btn-page text-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  className={`btn-page ${currentPage === number ? "active" : ""}`}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </button>
              ))}

              <button
                className="btn-page text-btn"
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>

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
