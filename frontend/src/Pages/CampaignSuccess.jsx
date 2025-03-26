import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CampaignPayment from '../components/CampaignPayment';
import { toast } from 'react-toastify';

const CampaignSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    // Verificar se há dados da campanha no state da navegação
    if (location.state?.campaign) {
      setCampaign(location.state.campaign);
    } else {
      // Se não houver dados, redirecionar para o dashboard
      toast.error('Nenhuma informação de campanha encontrada.');
      navigate('/dashboard');
    }
  }, [location, navigate]);

  const handlePaymentComplete = (paymentData) => {
    // Aqui você pode adicionar lógica adicional após o pagamento
    console.log('Pagamento concluído:', paymentData);
    // Após alguns segundos, redirecionar para o dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  if (!campaign) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
        <p className="font-bold">Campanha criada com sucesso!</p>
        <p>Para publicar sua campanha e torná-la visível para todos, é necessário efetuar o pagamento da taxa de publicação.</p>
      </div>
      
      <CampaignPayment 
        campaignData={campaign} 
        onPaymentComplete={handlePaymentComplete} 
      />
    </div>
  );
};

export default CampaignSuccess;