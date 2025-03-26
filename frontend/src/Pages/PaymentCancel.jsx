import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBackToHome = () => {
    navigate('/');
  };
  
  const handleTryAgain = () => {
    // Navigate back to reservations page
    navigate('/reservations');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-red-500 text-5xl mb-4">
          <FaTimesCircle className="mx-auto" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Pagamento Cancelado</h1>
        <p className="text-gray-600 mb-6">
          Seu pagamento foi cancelado ou não foi concluído. Seus números da rifa ainda estão reservados por um tempo limitado.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleTryAgain}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Tentar Novamente
          </button>
          
          <button
            onClick={handleBackToHome}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Voltar para a Página Inicial
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;