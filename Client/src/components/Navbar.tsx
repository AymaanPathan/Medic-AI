import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white text-xl font-bold">Medic AI</div>
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/login"
              className="text-white hover:text-blue-200 transition-colors"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/chat"
              className="text-white hover:text-blue-200 transition-colors"
            >
              Chat
            </Link>
          </li>
          <li>
            <Link
              to="/symptoms-checker"
              className="text-white hover:text-blue-200 transition-colors"
            >
              Symptoms Checker
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
