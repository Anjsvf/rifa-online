import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaTrophy, FaMoneyBillWave, FaClipboardList } from 'react-icons/fa';
const API_URL = import.meta.env.VITE_API_URL;

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('Token de autenticação não encontrado');
        }

        const response = await axios.get(`${API_URL}/api/campaigns/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setCampaign(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes da campanha:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Detalhes da Campanha</h2>
      {campaign ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4"><FaClipboardList className="inline mr-2" /> Informações da Campanha</h3>
            <p className="text-lg"><strong>Nome:</strong> <span className="text-gray-700">{campaign.name}</span></p>
            <p className="text-lg"><strong>Cotas:</strong> <span className="text-gray-700">{campaign.quota}</span></p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4"><FaMoneyBillWave className="inline mr-2" /> Detalhes Financeiros</h3>
            <p className="text-lg"><strong>Valor:</strong> <span className="text-gray-700">R$ {campaign.price}</span></p>
            <p className="text-lg"><strong>Prêmio:</strong> <span className="text-gray-700">{campaign.prizeType}</span></p>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500">Campanha não encontrada.</p>
      )}
    </div>
  );
};

export default CampaignDetails;