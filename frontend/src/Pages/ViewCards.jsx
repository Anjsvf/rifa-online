import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { 
  FaCheckCircle, 
  FaTicketAlt, 
  FaTags, 
  FaClipboardList 
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL ;

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'disponível':
      return 'bg-green-100 text-green-800';
    case 'vendido':
      return 'bg-red-100 text-red-800';
    case 'reservado':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ViewCards = () => {
  const { campaignId } = useParams();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ 
    key: 'number', 
    direction: 'asc' 
  });

  useEffect(() => {
    const fetchCards = async () => {
      const authToken = localStorage.getItem("authToken");
      
      if (!authToken) {
        setError("Autenticação necessária");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/campaigns/${campaignId}/cards`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setCards(response.data);
      } catch (error) {
        console.error("Erro ao buscar cartelas:", error);
        setError(
          error.response?.status === 401
            ? "Sessão expirada. Por favor, faça login novamente."
            : "Erro ao carregar as cartelas. Tente novamente."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [campaignId]);

  const sortCards = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    
    const sortedCards = [...cards].sort((a, b) => {
      const aValue = a[key]?.toLowerCase?.() || a[key];
      const bValue = b[key]?.toLowerCase?.() || b[key];
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setCards(sortedCards);
    setSortConfig({ key, direction });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <FaCheckCircle className="mx-auto text-4xl mb-4 text-red-500" />
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <FaClipboardList /> Cartelas da Campanha
      </h2>

      <div className="flex justify-end mb-4 space-x-2">
        <button 
          onClick={() => sortCards('number')}
          className="flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaTicketAlt className="mr-2" />
          Ordenar por Número {sortConfig.key === 'number' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </button>
        <button 
          onClick={() => sortCards('status')}
          className="flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaTags className="mr-2" />
          Ordenar por Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div 
            key={card._id} 
            className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg flex items-center">
                <FaTicketAlt className="mr-2 text-green-600" />
                Cartela #{card.number}
              </h3>
              <span 
                className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(card.status)}`}
              >
                {card.status}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {card.purchaseDate && (
                <div>
                  <strong>Data de Compra:</strong> {new Date(card.purchaseDate).toLocaleDateString()}
                </div>
              )}
              {card.purchasedBy && (
                <div>
                  <strong>Comprado por:</strong> {card.purchasedBy}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-gray-600">
        Total de Cartelas: {cards.length} | 
        Disponíveis: {cards.filter(card => card.status.toLowerCase() === 'disponível').length} | 
        Vendidas: {cards.filter(card => card.status.toLowerCase() === 'vendido').length}
      </div>
    </div>
  );
};

export default ViewCards;