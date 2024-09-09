import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Header = () => {
  const [userName, setUserName] = useState(''); // Estado para armazenar o nome do usuário

  // Simulação de chamada ao backend para buscar o nome do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://sua-api.com/user-profile');
        setUserName(response.data.name); // Atualiza o nome do usuário com os dados recebidos
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="bg-sky-950 text-white p-4 flex justify-between items-center">
       <Link to='/'><h1 className="text-2xl font-bold">Rifa Digital</h1></Link>
      <div className="text-lg">
        {userName ? `Olá, ${userName}` : 'Carregando...'}
      </div>
    </header>
  );
};

export default Header;
