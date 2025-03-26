import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import CampaignPayment from '../components/CampaignPayment';

const API_URL = import.meta.env.VITE_API_URL;

const CampaignPaymentPage = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/campaigns/${campaignId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        setCampaign(response.data);
        setLoading(false);

    
        if (response.data.paymentStatus === 'completed') {
          toast.info('Esta campanha já foi publicada.');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Erro ao buscar dados da campanha:', err);
        setError('Não foi possível carregar os dados da campanha. Tente novamente.');
        setLoading(false);
        
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      }
    };

    fetchCampaign();
  }, [campaignId, navigate]);

  const handlePaymentComplete = (paymentData) => {
   
    console.log('Pagamento concluído:', paymentData);
    
   
    setTimeout(() => {
      navigate('/dashboard', { 
        state: { message: 'Pagamento processado com sucesso! Sua campanha foi publicada.' } 
      });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-bold">Erro</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Voltar para o Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
        <p className="font-bold">Publicação de Campanha</p>
        <p>Para tornar sua campanha visível para todos, é necessário efetuar o pagamento da taxa de publicação.</p>
      </div>
      
      {campaign && (
        <CampaignPayment 
          campaignData={campaign} 
          onPaymentComplete={handlePaymentComplete} 
        />
      )}
    </div>
  );
};

export default CampaignPaymentPage;