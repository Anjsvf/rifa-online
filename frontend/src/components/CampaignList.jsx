import React, { useEffect, useState } from "react";
import axios from "axios";
import CampaignCard from "./CampaignCard";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";
const API_URL = import.meta.env.VITE_API_URL;

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/campaign`)
      .then((response) => {
        setCampaigns(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4">
      <Button
        text="Criar Campanha"
        onClick={() => {
         
        }}
        className="mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign._id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
};

export default CampaignList;
