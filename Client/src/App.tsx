import React from "react";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import DiagnosisSection from "./components/steps/diagnosis";
import LandingPage from "./pages/LandingPage";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<div>chat</div>} />
        <Route
          path="/symptoms-checker"
          element={<div>Csymptoms-checker</div>}
        />
        <Route path="/diagnosis" element={<DiagnosisSection />} />
      </Routes>
    </Router>
  );
};
export default App;
