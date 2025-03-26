import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaCreditCard } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const StripePayment = ({ reservationData, onPaymentComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const initiateStripePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const paymentData = {
        method: 'Stripe',
        reservationId: reservationData?._id,
        amount: reservationData?.amount,
      };
      
      const response = await axios.post(
        `${API_URL}/api/payments/process`,
        paymentData,
        { headers }
      );
      
      if (response.data.success) {
        // Store payment info for later reference
        onPaymentComplete?.(response.data);
        
        // Redirect to Stripe checkout
        window.location.href = response.data.paymentDetails.checkoutUrl;
      } else {
        setError('Falha ao iniciar pagamento');
      }
    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      setError(err.response?.data?.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };
  
  // Check URL parameters for payment status on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');
    
    if (sessionId) {
      // Handle successful payment return
      // You could verify the payment status here if needed
      console.log('Payment session ID:', sessionId);
    }
  }, [location]);
  
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-4">Pagamento com Cartão de Crédito</h3>
      
      {reservationData && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p><span className="font-medium">Campanha:</span> {reservationData.campaignName}</p>
          <p><span className="font-medium">Números:</span> {reservationData.numbers?.join(', ')}</p>
          <p><span className="font-medium">Valor Total:</span> R$ {reservationData.amount?.toFixed(2)}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <button
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        onClick={initiateStripePayment}
        disabled={loading}
      >
        <FaCreditCard />
        {loading ? 'Processando...' : 'Pagar com Cartão'}
      </button>
      
      <p className="mt-3 text-sm text-gray-500 text-center">
        Você será redirecionado para o checkout seguro do Stripe
      </p>
    </div>
  );
};

export default StripePayment;