import React, { useState } from 'react';
import { FaCalendarAlt, FaSearch, FaFilter } from 'react-icons/fa'; // Ícones importados
import axios from 'axios'; // Para fazer a requisição para o backend

const RankingFilter = () => {
  const [startDate, setStartDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilter = () => {
    // Enviar os filtros para o backend
    axios.post('/api/ranking/filter', { startDate, searchQuery })
      .then(response => {
        console.log('Filtered data:', response.data);
        // Aqui você pode atualizar o estado ou exibir os resultados
      })
      .catch(error => {
        console.error('Error filtering data:', error);
      });
  };

  return (
    <div className="ranking-filter bg-white p-6 rounded-lg shadow-lg space-y-4">
      <div className="date-filter">
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Data de Início:
        </label>
        <div className="mt-1 relative">
          <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)} // Armazenando o valor da data
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="search-filter">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          Filtrar:
        </label>
        <div className="mt-1 relative">
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            id="search"
            placeholder="Digite um nome ou data"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Armazenando o valor da pesquisa
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <button
        onClick={handleFilter} // Chama a função ao clicar no botão
        className="bg-sky-950 text-white px-4 py-2 rounded-md w-full flex items-center justify-center space-x-2"
      >
        <FaFilter /> {/* Ícone adicionado */}
        <span>Aplicar Filtros</span>
      </button>
    </div>
  );
};

export default RankingFilter;
