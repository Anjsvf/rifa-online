import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';

const Root = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onAuth={handleAuth} />} />
          <Route path="/register" element={<Register onAuth={handleAuth} />} />
          <Route
            path="/*"
            // element={isAuthenticated ? <App /> : <Navigate to="/login" />}
          />
        </Routes>
     <App/>
      </BrowserRouter>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<Root />);
