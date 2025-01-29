import React, { useState } from "react";
import axios from "axios";
import { FaRegFileAlt, FaDice, FaCheckCircle, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";

const GenerateCard = ({ campaignId, onGenerate }) => {
  const [cards, setCards] = useState([]);
  const [numCards, setNumCards] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateCards = () => {
    setError(null);
    setIsLoading(true);

    try {
      const newCards = Array.from({ length: numCards }, () => {
        const numbers = new Set();
        while (numbers.size < 10) {
          numbers.add(Math.floor(Math.random() * 100) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
      });

      setCards(newCards);
      if (onGenerate) onGenerate(newCards);
    } catch (error) {
      setError("Erro ao gerar cartelas. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCards = async () => {
    if (cards.length === 0) {
      setError("Nenhuma cartela gerada para salvar.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const authToken = localStorage.getItem("authToken");
    const API_URL = import.meta.env.VITE_API_URL;

    if (!API_URL) {
      setError("A URL da API não está definida.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/campaigns/${campaignId}/cards`,
        { cards },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      toast.success("Cartelas salvas com sucesso!");
      setCards([]); 
      setNumCards(1); 
    } catch (error) {
      console.error("Erro ao salvar as cartelas:", error);
      toast.error(error.response?.data?.message || "Erro ao salvar as cartelas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <FaRegFileAlt /> Gerar Cartelas
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Número de Cartelas</label>
        <input
          type="number"
          value={numCards}
          onChange={(e) => setNumCards(Math.max(1, Math.min(100, Number(e.target.value))))}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Quantidade de Cartelas"
          min="1"
          max="100"
          disabled={isLoading}
        />
      </div>

      <button
        onClick={handleGenerateCards}
        className={`bg-black text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2 mb-4 ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900"
        }`}
        disabled={isLoading}
      >
        <FaDice /> {isLoading ? "Gerando..." : "Gerar Cartelas"}
      </button>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mt-6">
        {cards.map((card, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <FaCheckCircle className="text-green-600" /> Cartela {index + 1}
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {card.map((number, idx) => (
                <span key={idx} className="p-2 bg-gray-100 rounded text-center">
                  {number}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {cards.length > 0 && (
        <button
          onClick={handleSaveCards}
          className={`bg-green-600 text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2 mt-4 ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
          }`}
          disabled={isLoading}
        >
          <FaSave /> {isLoading ? "Salvando..." : "Salvar Cartelas"}
        </button>
      )}
    </div>
    //aqui
  );
};

export default GenerateCard;