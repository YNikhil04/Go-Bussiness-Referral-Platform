import DashboardPage from "./components/DashboardPage";
import LoginPage from "./components/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import ReferralDetails from "./components/ReferralDetails";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<DashboardPage />} />

          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/referral/:id" element={<ReferralDetails />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
