import React from 'react';
import RankingFilter from '../components/RankingFilter';
import RankingTable from '../components/RankingTable';

const Ranking = () => {
  return (
    <div className="ranking-page p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Ranking</h2>
      <div className="mb-4">
        <RankingFilter />
      </div>
      <RankingTable />
    </div>
  );
};

export default Ranking;
