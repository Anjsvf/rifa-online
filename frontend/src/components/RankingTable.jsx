import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrophy, FaMedal } from 'react-icons/fa';

const RankingTable = () => {
  const [rankingData, setRankingData] = useState([]);

//   useEffect(() => {
//     axios.get('/api/ranking')
//       .then(response => {
//         setRankingData(response.data);
//       })
//       .catch(error => {
//         console.error('Erro ao buscar dados do ranking:', error);
//       });
//   }, []);

  return (
    <div className="ranking-table p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Ranking</h2>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full text-left table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">Posição</th>
              <th className="py-3 px-6">Nome</th>
              <th className="py-3 px-6 text-center">Prêmios</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {rankingData.map((user, index) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-center font-medium">
                  {index + 1}
                  {index === 0 && <FaTrophy className="inline-block text-yellow-500 ml-2" />}
                  {index === 1 && <FaMedal className="inline-block text-gray-500 ml-2" />}
                  {index === 2 && <FaMedal className="inline-block text-orange-400 ml-2" />}
                </td>
                <td className="py-3 px-6">{user.name}</td>
                <td className="py-3 px-6 text-center">{user.prizes} <FaTrophy className="inline-block text-yellow-400 ml-2" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingTable;
