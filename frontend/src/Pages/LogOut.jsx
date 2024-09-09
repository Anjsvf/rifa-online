import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove o token de autenticação
    localStorage.removeItem("authToken");

    // Redireciona o usuário para a página de login
    navigate("/login");
  }, [navigate]);

  return (
    <div>
      <p>Saindo...</p>
    </div>
  );
}

export default LogOut;
