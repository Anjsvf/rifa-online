import React from "react";
import { FaRocket } from "react-icons/fa";

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="text-center bg-gray-100 p-8 rounded-lg  max-w-md mx-4 relative z-10">
        <div className="flex justify-center mb-6">
          <FaRocket className="text-6xl text-green-500 animate-bounce" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bem-vindo à Rifa Digital
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          Explore a plataforma e descubra funcionalidades incríveis para criar e
          gerenciar suas rifas de forma fácil e segura!
        </p>
      </div>
    </div>
  );
};

export default Home;
