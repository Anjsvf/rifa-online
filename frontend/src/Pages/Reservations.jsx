import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;


const Reservations = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${authToken}` };

      const [campaignResponse, reservationResponse] = await Promise.all([
        axios.get(`${API_URL}/api/campaigns`, { headers }),
        axios.get(`${API_URL}/api/reservations`, { headers })
      ]);

      console.log("Dados das campanhas:", campaignResponse.data);
      console.log("Dados das reservas:", reservationResponse.data);

      setCampaigns(campaignResponse.data);
      setReservations(reservationResponse.data);
      setFilteredReservations(reservationResponse.data);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        setError("Erro ao carregar os dados. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = reservations;
    console.log("Reservas antes dos filtros:", filtered);

    if (selectedCampaign) {
      filtered = filtered.filter(
        (reservation) => reservation.campaignId?._id === selectedCampaign
      );
      console.log("Após filtro de campanha:", filtered);
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (reservation) => reservation.status === statusFilter
      );
      console.log("Após filtro de status:", filtered);
    }

    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase();
      filtered = filtered.filter((reservation) => {
        const userName = `${reservation.userId?.firstName || ''} ${reservation.userId?.lastName || ''}`.toLowerCase();
        const numbers = reservation.numbers?.join(", ") || '';
        const campaignName = reservation.campaignId?.name?.toLowerCase() || '';
        
        return userName.includes(searchLower) || 
               numbers.includes(searchLower) ||
               campaignName.includes(searchLower);
      });
      console.log("Após filtro de pesquisa:", filtered);
    }

    if (dateFilter === "today") {
      const today = new Date().toISOString().split("T")[0];
      filtered = filtered.filter(
        (reservation) => reservation.createdAt?.split("T")[0] === today
      );
      console.log("Após filtro de data:", filtered);
    }

    console.log("Reservas após todos os filtros:", filtered);
    setFilteredReservations(filtered);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return 'Data inválida';
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campanha
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
            >
              <option value="">Todas as campanhas</option>
              {campaigns.map((campaign) => (
                <option key={campaign._id} value={campaign._id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="pending">Pendentes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pesquisar
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar por nome, números ou campanha..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="dateFilter"
                  value=""
                  checked={dateFilter === ""}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="mr-2"
                />
                Todas as datas
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="dateFilter"
                  value="today"
                  checked={dateFilter === "today"}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="mr-2"
                />
                Hoje
              </label>
            </div>
          </div>

          <button
            onClick={applyFilters}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            Aplicar Filtros
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Histórico de Reservas</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : filteredReservations.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            Nenhuma reserva encontrada.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <div key={reservation._id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Campanha</p>
                    <p className="text-gray-600">{reservation.campaignId?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Cliente</p>
                    <p className="text-gray-600">
                      {`${reservation.userId?.firstName || ''} ${reservation.userId?.lastName || ''}`}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Números</p>
                    <p className="text-gray-600">{reservation.numbers?.join(", ") || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusBadgeColor(reservation.status)}`}>
                      {reservation.status || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Status do Pagamento</p>
                    <p className="text-gray-600">{reservation.paymentStatus || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Data da Reserva</p>
                    <p className="text-gray-600">{formatDate(reservation.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;