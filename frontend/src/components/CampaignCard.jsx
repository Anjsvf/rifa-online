import React from 'react';
import Button from './Button';

const CampaignCard = ({ campaign }) => {
  const handlePublish = () => {
    
  };

  const handleViewDemo = () => {
 
  };

  return (
    <div className="campaign-card bg-white shadow-lg rounded-lg p-4 mb-6">
      <img 
        src={campaign.image} 
        alt={campaign.title} 
        className="campaign-image w-full h-48 object-cover rounded-t-lg mb-4" 
      />
      <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
      <p className="text-gray-700 mb-4">{campaign.soldTickets} de {campaign.totalTickets} cotas vendidas</p>
      <div className="flex space-x-4">
        <Button text="Publicar" onClick={handlePublish} />
        <Button text="Visualizar Demonstração" onClick={handleViewDemo} />
      </div>
    </div>
  );
};

export default CampaignCard;
