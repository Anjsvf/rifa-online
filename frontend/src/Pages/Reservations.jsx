import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiFilter } from "react-icons/fi"; // Ícone de filtro

const Reservations = () => {
  const [campaigns, setCampaigns] = useState([]); // Dados das campanhas
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [reservations, setReservations] = useState([]); // Histórico das rifas

  // Exemplo de chamada para buscar as campanhas e reservas (pode ajustar conforme o backend)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const campaignResponse = await axios.get(
          "http://localhost:5000/api/campaigns"
        ); // URL do backend
        setCampaigns(campaignResponse.data);
        const reservationResponse = await axios.get(
          "http://localhost:5000/reservations"
        ); // URL do backend
        setReservations(reservationResponse.data);
      } catch (error) {
        console.error("Erro ao buscar os dados", error);
      }
    };
    fetchData();
  }, []);

  const handleCampaignChange = (e) => {
    setSelectedCampaign(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
  };

  const applyFilters = () => {
    // Lógica para aplicar filtros nas reservas
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-6">Histórico</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Selecione uma campanha
          </label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={selectedCampaign}
            onChange={handleCampaignChange}
          >
            <option value="">Escolha uma opção</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Status das reservas
          </label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="">Sem filtro</option>
            <option value="confirmed">Confirmadas</option>
            <option value="pending">Pendentes</option>
            <option value="canceled">Canceladas</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Filtro da Pesquisa
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={searchFilter}
            onChange={handleSearchChange}
            placeholder="Pesquise por nome, data..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Filtro da data
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <label>
              <input
                type="radio"
                name="dateFilter"
                value=""
                checked={dateFilter === ""}
                onChange={handleDateChange}
              />
              <span className="ml-2">Nenhum filtro</span>
            </label>
            <label>
              <input
                type="radio"
                name="dateFilter"
                value="today"
                checked={dateFilter === "today"}
                onChange={handleDateChange}
              />
              <span className="ml-2">Hoje</span>
            </label>
          </div>
        </div>

        <button
          className="flex items-center bg-sky-950 text-white px-4 py-2 rounded-md"
          onClick={applyFilters}
        >
          <FiFilter className="mr-2" /> {/* Ícone de filtro */}
          Aplicar filtros
        </button>
      </div>

      {/* Exibe histórico das reservas */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Histórico de Reservas</h3>
        {reservations.length === 0 ? (
          <p>Nenhuma reserva encontrada.</p>
        ) : (
          <ul>
            {reservations.map((reservation) => (
              <li key={reservation.id} className="mb-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p>
                    <strong>Campanha:</strong> {reservation.campaignName}
                  </p>
                  <p>
                    <strong>Status:</strong> {reservation.status}
                  </p>
                  <p>
                    <strong>Data:</strong> {reservation.date}
                  </p>
                  <p>
                    <strong>Detalhes:</strong> {reservation.details}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Reservations;
