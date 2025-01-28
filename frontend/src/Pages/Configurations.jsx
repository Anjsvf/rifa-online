import React from 'react';
import ConfigurationsTabs from '../components/ConfigurationsTabs';

const Configurations = () => {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Configurações</h2>
      <ConfigurationsTabs />
    </div>
  );
};

export default Configurations;