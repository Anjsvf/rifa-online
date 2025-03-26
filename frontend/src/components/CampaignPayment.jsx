import React, { useState } from 'react';
import { FaBarcode, FaCreditCard } from 'react-icons/fa';
import { SiPix } from 'react-icons/si';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const CampaignPayment = ({ campaignData, onPaymentComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const processPayment = async (method) => {
    setLoading(true);
    setError(null);

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const headers = { Authorization: `Bearer ${authToken}` };

      if (!campaignData || !campaignData._id) {
        throw new Error('Dados da campanha não encontrados.');
      }

      // Valor fixo para publicação da campanha
      const paymentAmount = 9.9;

      const paymentData = {
        method,
        campaignId: campaignData._id,
        amount: paymentAmount,
        paymentType: 'campaign_publication'
      };

      console.log('Dados de pagamento:', paymentData); // Log dos dados de pagamento

      const response = await axios.post(
        `${API_URL}/api/payments/process`,
        paymentData,
        { headers }
      );

      console.log('Resposta do backend:', response.data); // Log da resposta do backend

      if (response.data.success) {
        onPaymentComplete?.(response.data);
        toast.success('Pagamento processado com sucesso!');

        if (method === 'PIX') {
          navigate('/payment/pix', { state: { paymentData: response.data } });
        } else if (method === 'Boleto') {
          navigate('/payment/boleto', { state: { paymentData: response.data } });
        } else if (method === 'Stripe') {
          // Redirecionar para o checkout do Stripe
          window.location.href = response.data.paymentDetails.checkoutUrl;
        }
      } else {
        throw new Error(response.data.message || 'Erro ao processar pagamento.');
      }
    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao processar pagamento. Tente novamente.');
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

      <h1 className="text-2xl font-bold mb-6 text-center">Publicar Campanha</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Resumo da Campanha</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><span className="font-medium">Nome:</span> {campaignData?.name}</p>
          <p><span className="font-medium">Cotas:</span> {campaignData?.quota}</p>
          <p><span className="font-medium">Valor da Cota:</span> R$ {campaignData?.price?.toFixed(2)}</p>
          <p><span className="font-medium">Prêmio:</span> {campaignData?.prizeType}</p>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="font-medium text-blue-700">Taxa de publicação: R$ 9,90</p>
          <p className="text-sm text-blue-600 mt-1">Para publicar sua campanha e torná-la visível para todos, é necessário efetuar o pagamento da taxa de publicação.</p>
        </div>
      </div>

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

      {loading && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}
    </div>
  );
};

export default CampaignPayment;