import React, { useState } from 'react';
// import StripePayment from './StripePayment';
import { FaBarcode, FaCreditCard } from 'react-icons/fa';

import { SiPix } from 'react-icons/si';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;
const PaymentsMethods = ({ reservationData, onPaymentComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const processPayment = async (method) => {
    setLoading(true);
    setError(null);

    try {
      const authToken = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${authToken}` };

      // Check if reservationData exists before accessing its properties
      if (!reservationData) {
        throw new Error('Dados da reserva não encontrados. Por favor, selecione uma reserva primeiro.');
      }

      const paymentData = {
        method,
        reservationId: reservationData._id,
        amount: reservationData.amount
       
      };

      console.log('Dados enviados:', { paymentData, headers });
      const response = await axios.post(
        `${API_URL}/api/payments/process`,
        paymentData,
        { headers }
      );

      if (response.data.success) {
        onPaymentComplete?.(response.data);
       
        if (method === 'PIX') {
         
          navigate('/payment/pix', { state: { paymentData: response.data } });
        } else if (method === 'Boleto') {
          // Mostrar boleto ou link para download
          navigate('/payment/boleto', { state: { paymentData: response.data } });
        }
      }
    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      setError(err.response?.data?.message || 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-md rounded-lg">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-center">Escolha o Método de Pagamento</h1>
      
      {reservationData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Resumo da Reserva</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><span className="font-medium">Campanha:</span> {reservationData.campaignName}</p>
            <p><span className="font-medium">Números:</span> {reservationData.numbers?.join(', ')}</p>
            <p><span className="font-medium">Valor Total:</span> R$ {reservationData.amount?.toFixed(2)}</p>
          </div>
        </div>
      )}

      {!reservationData ? (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg mb-4">
          <p className="font-medium">Nenhuma reserva selecionada</p>
          <p className="text-sm mt-1">Este componente está sendo usado na área de configurações sem dados de reserva. Para fazer um pagamento, você precisa selecionar uma reserva primeiro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <button
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
            onClick={() => processPayment('PIX')}
            disabled={loading}
          >
            <SiPix className="text-xl" />
            Pagar com PIX
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
            onClick={() => processPayment('Boleto')}
            disabled={loading}
          >
            <FaBarcode className="text-xl" />
            Pagar com Boleto
          </button>
          
          <button
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors"
            onClick={() => processPayment('Stripe')}
            disabled={loading}
          >
            <FaCreditCard className="text-xl" />
            Pagar com Cartão
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}
    </div>
  );
};

export default PaymentsMethods;