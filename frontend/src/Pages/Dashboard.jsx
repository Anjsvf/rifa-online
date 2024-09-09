import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Substitua pela URL correta do seu backend
    axios.get('/api/campaigns')
      .then((response) => {
        setCampaigns(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching campaigns", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Minhas Campanhas</h2>
      {loading ? (
        <p className="text-center text-gray-600">Carregando campanhas...</p>
      ) : campaigns.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600">Não há campanhas</p>
          <Link
            to="/create-campaign"
            className="bg-black text-white px-4 py-2 rounded mt-4 inline-block"
          >
            Criar Campanha
          </Link>
        </div>
      ) : (
        <div>
          {/* Aqui você pode mapear as campanhas */}
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-item">
              {/* Renderize os detalhes da campanha */}
              <p>{campaign.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
