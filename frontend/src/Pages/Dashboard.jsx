import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaEye, FaList } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }
    fetchCampaigns();
  }, [navigate]);

  const fetchCampaigns = async () => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.get(`${API_URL}/api/campaigns`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCampaigns(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar campanhas:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        setError("Erro ao carregar campanhas. Tente novamente mais tarde.");
      }
      setLoading(false);
    }
  };

  const openModal = (campaignId) => {
    setCampaignToDelete(campaignId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCampaignToDelete(null);
  };

  const deleteCampaign = async (campaignId) => {
    const authToken = localStorage.getItem("authToken");

    try {
      await axios.delete(`${API_URL}/api/campaigns/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setCampaigns((prevCampaigns) =>
        prevCampaigns.filter((campaign) => campaign._id !== campaignId)
      );

      toast.success("Campanha excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir campanha:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      } else if (error.response?.status === 404) {
        toast.error("Campanha não encontrada.");
      } else {
        toast.error("Erro ao excluir campanha. Tente novamente.");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (campaignToDelete) {
      await deleteCampaign(campaignToDelete);
      closeModal();
    }
  };

  const successMessage = location.state?.message;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">Minhas Campanhas</h2>
          <Link
            to="/create-campaign"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FaPlus /> Nova Campanha
          </Link>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">
              Você ainda não tem campanhas ativas
            </p>
            <Link
              to="/create-campaign"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2 justify-center"
            >
              <FaPlus /> Criar Primeira Campanha
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
              >
                {campaign.image && (
                  <div className="mb-4">
                    <img
                      src={`${API_URL}${campaign.image}`}
                      alt={campaign.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{campaign.name}</h3>
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    to={`/campaign/${campaign._id}`}
                    className="block w-full text-center bg-[#80808011] text-black py-2 px-4 rounded hover:bg-[#60d77c5e] transition-colors flex items-center gap-2 justify-center"
                  >
                    <FaEye /> Ver Detalhes
                  </Link>
                  <Link
                    to={`/campaigns/${campaign._id}/cards`}
                    className="block w-full text-center bg-[#80808011] text-black py-2 px-4 rounded hover:bg-[#60d77c5e] transition-colors flex items-center gap-2 justify-center"
                  >
                    <FaList /> Ver Cartelas
                  </Link>
                  <button
                    onClick={() => openModal(campaign._id)}
                    className="block w-full text-center bg-[#80808011] text-black py-2 px-4 rounded hover:bg-[#60d77c5e] transition-colors flex items-center gap-2 justify-center"
                  >
                    <FaTrash /> Excluir Campanha
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
              <p className="mb-4">Tem certeza que deseja excluir esta campanha?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FaTrash /> Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;