import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChartLine } from "react-icons/fa"; 

const Header = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []);

  return (
    <header className="bg-green-600 text-white p-4 flex flex-wrap justify-between items-center">
      <Link to="/" className="text-2xl font-bold mb-4 sm:mb-0">
        Rifa Digital
      </Link>

      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard"
          className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
        >
          <FaChartLine className="text-xl" />
          <span>Dashboard</span>
        </Link>

        <div className="text-lg">
          {userName ? `Olá, ${userName}` : "Carregando..."}
        </div>
      </div>
    </header>
  );
};

export default Header;
