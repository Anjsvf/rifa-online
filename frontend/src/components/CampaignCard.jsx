import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaGlobe } from 'react-icons/fa';

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();

  const handlePublish = async () => {
    try {
      
      console.log('Publicando campanha:', campaign._id);
    } catch (error) {
      console.error('Erro ao publicar campanha:', error);
    }
  };

  const handleViewDemo = () => {
    navigate(`/campaign/${campaign._id}/preview`);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
      {campaign.image && (
        <img 
          src={`${process.env.REACT_APP_API_URL}${campaign.image}`}
          alt={campaign.title} 
          className="w-full h-48 object-cover rounded-t-lg mb-4" 
        />
      )}
      <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
      <p className="text-gray-700 mb-4">
        {campaign.soldTickets} de {campaign.totalTickets} cotas vendidas
      </p>
      <div className="flex space-x-4">
        <button
          onClick={handlePublish}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <FaGlobe /> Publicar
        </button>
        <button
          onClick={handleViewDemo}
          className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <FaEye /> Visualizar
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;