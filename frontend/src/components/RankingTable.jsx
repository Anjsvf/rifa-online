import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrophy, FaMedal } from "react-icons/fa";
import RankingFilter from './RankingFilter';
const API_URL = import.meta.env.VITE_API_URL;

const RankingTable = () => {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRanking = async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/api/ranking`, {
        params: filters,
      });
      setRankingData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dados do ranking:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  const handleFilter = (filters) => {
    fetchRanking(filters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Erro ao carregar o ranking: {error}</p>
      </div>
    );
  }

  return (
    <div className="ranking-table p-4 md:p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
        Ranking
      </h2>
      <RankingFilter onFilter={handleFilter} />
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-xs md:text-sm leading-normal">
              <th className="py-2 px-3 md:py-3 md:px-6 text-center">Posição</th>
              <th className="py-2 px-3 md:py-3 md:px-6">Nome</th>
              <th className="py-2 px-3 md:py-3 md:px-6 text-center">Prêmios</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-xs md:text-sm">
            {rankingData.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-2 px-3 md:py-3 md:px-6 text-center font-medium">
                  {index + 1}
                  {index === 0 && (
                    <FaTrophy className="inline-block text-yellow-500 ml-2" />
                  )}
                  {index === 1 && (
                    <FaMedal className="inline-block text-gray-500 ml-2" />
                  )}
                  {index === 2 && (
                    <FaMedal className="inline-block text-orange-400 ml-2" />
                  )}
                </td>
                <td className="py-2 px-3 md:py-3 md:px-6 truncate">
                  {user.name}
                </td>
                <td className="py-2 px-3 md:py-3 md:px-6 text-center">
                  {user.prizes}{" "}
                  <FaTrophy className="inline-block text-yellow-400 ml-2" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingTable;