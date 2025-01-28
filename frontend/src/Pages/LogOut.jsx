import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken");

    navigate("/login");
  }, [navigate]);

  return (
    <div>
      <p>Saindo...</p>
    </div>
  );
};

export default LogOut;
