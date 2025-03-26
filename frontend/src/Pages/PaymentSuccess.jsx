import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const sessionId = queryParams.get('session_id');
        
        if (!sessionId) {
          setError('ID da sessão de pagamento não encontrado');
          setLoading(false);
          return;
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Usuário não autenticado');
          setLoading(false);
          return;
        }
        
        // Verificar o status do pagamento no backend
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        // Aqui você pode implementar uma chamada para verificar o status do pagamento
        // Por enquanto, vamos apenas simular um pagamento bem-sucedido
        setPaymentDetails({
          status: 'completed',
          method: 'Stripe',
          date: new Date().toLocaleDateString()
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao verificar pagamento:', err);
        setError('Erro ao verificar o status do pagamento');
        setLoading(false);
      }
    };
    
    verifyPayment();
  }, [location]);
  
  const handleBackToHome = () => {
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Erro no Pagamento</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToHome}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Voltar para a Página Inicial
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-green-500 text-5xl mb-4">
          <FaCheckCircle className="mx-auto" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Pagamento Confirmado!</h1>
        <p className="text-gray-600 mb-6">
          Seu pagamento foi processado com sucesso. Seus números da rifa estão confirmados!
        </p>
        
        {paymentDetails && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md text-left">
            <p><span className="font-medium">Status:</span> {paymentDetails.status === 'completed' ? 'Confirmado' : paymentDetails.status}</p>
            <p><span className="font-medium">Método:</span> {paymentDetails.method}</p>
            <p><span className="font-medium">Data:</span> {paymentDetails.date}</p>
          </div>
        )}
        
        <button
          onClick={handleBackToHome}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Voltar para a Página Inicial
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;