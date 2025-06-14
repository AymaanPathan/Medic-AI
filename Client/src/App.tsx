import React from "react";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Chat from "./components/Chat";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<div>chat</div>} />
        <Route
          path="/symptoms-checker"
          element={<div>Csymptoms-checker</div>}
        />
      </Routes>
    </Router>
  );
};
export default App;
