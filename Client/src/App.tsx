import React from "react";
import LoginPage from "./pages/Auth/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import LandingPage from "./pages/Home/LandingPage";
import ChatPage from "./pages/Chat/MainChatPage";
import SymptomForm from "./pages/Chat/SymptomForm";
import FollowupQuestions from "./pages/Chat/FollowupQuestions";
import MedicalChat from "./pages/MedicalChat";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chatPage" element={<ChatPage />} />
        <Route path="/chat" element={<MedicalChat />} />
        <Route path="/symptoms-checker" element={<SymptomForm />} />
        <Route path="/diagnosis" element={<FollowupQuestions />} />
      </Routes>
    </Router>
  );
};
export default App;
