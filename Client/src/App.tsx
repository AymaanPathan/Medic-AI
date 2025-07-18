import React from "react";
import LoginPage from "./pages/Auth/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import LandingPage from "./pages/Home/LandingPage";
import SymptomForm from "./pages/Chat/SymptomForm";
import FollowupQuestions from "./pages/Chat/FollowupQuestions";
import MedicalChat from "./pages/Chat/MedicalChat";
import VoiceImageDiagnosis from "./pages/Chat/VoiceImageDiagnosis";
import DiagnosisReport from "./pages/Chat/DiagnosisReport";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<MedicalChat />} />
        <Route path="/diagnosis-report" element={<DiagnosisReport />} />
        <Route path="/symptoms-checker" element={<SymptomForm />} />
        <Route path="/diagnosis" element={<FollowupQuestions />} />
        <Route path="/upload-image" element={<VoiceImageDiagnosis />} />
      </Routes>
    </Router>
  );
};
export default App;
