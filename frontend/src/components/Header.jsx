import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName"); 
    if (savedUserName) {
      setUserName(savedUserName); 
    }
  }, []);

  return (
    <header className="bg-green-600 text-white p-4 flex justify-between items-center">
      <Link to="/">
        <h1 className="text-2xl font-bold">Rifa Digital</h1>
      </Link>
      <div className="text-lg">
        {userName ? `Olá, ${userName}` : "Carregando..."}
      </div>
    </header>
  );
};

export default Header;
