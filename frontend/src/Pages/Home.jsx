import React from 'react';

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black mb-4">Bem-vindo</h1>
        <p className="text-xl text-gray-500">
          Explore a plataforma e descubra funcionalidades incríveis!
        </p>
        <button className="mt-8 px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-all">
          Saiba mais
        </button>
      </div>
      
    </div>
  );
};

export default Home;
