import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaHistory } from 'react-icons/fa'; // Ícone de menu hamburguer
import { MdClose } from 'react-icons/md'; // Ícone de fechar
import { FiSettings, FiShoppingCart, FiList, FiFileText, FiMessageSquare, FiLogOut, FiUser } from 'react-icons/fi'; // Ícones para o menu
import { GiTicket } from 'react-icons/gi'; // Ícone de ticket

const SidebarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button onClick={toggleSidebar} className="text-gray-500 p-2">
        <FaBars size={24} />
      </button>

      <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 z-50' : 'opacity-0 z-[-1]'}`} onClick={toggleSidebar}></div>

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center p-4">
          <h2 className="text-2xl font-semibold text-blue-950">RIFA DIGITAL</h2>
          <button onClick={toggleSidebar} className="text-gray-500">
            <MdClose size={24} />
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            <Link to='/dashboard'  >
            <li className="p-4 hover:bg-gray-100 flex items-center cursor-pointer">
              <GiTicket className="mr-2" size={20} />
              Campanhas
            </li>
            </Link>
            <Link to='/raking'>
            <li className="p-4 hover:bg-gray-100 flex items-center">
              <FiList className="mr-2" size={20} />
              Ranking
            </li>
            </Link>
            <li className="p-4 hover:bg-gray-100 flex items-center">
              <FaHistory className="mr-2" size={20} />
              Historico de rifas 
            </li>
            <Link to='/settings'>
            <li className="p-4 hover:bg-gray-100 flex items-center">
              <FiSettings className="mr-2" size={20} />
              Configurações
            </li>
            </Link>
            {/* <li className="p-4 hover:bg-gray-100 flex items-center">
              <FiFileText className="mr-2" size={20} />
              Tutoriais
            </li> */}
            <Link to='/support'>
            <li className="p-4 hover:bg-gray-100 flex items-center">
              <FiMessageSquare className="mr-2" size={20} />
              Suporte
            </li>
            </Link>
            <Link to='/suggestions'>
            <li className="p-4 hover:bg-gray-100 flex items-center">
              <FiFileText className="mr-2" size={20} />
              Sugestões
            </li>
            </Link>
            <Link to='/aboutus'>
            <li className="p-4 hover:bg-gray-100 flex items-center">
              <FiUser className="mr-2" size={20} />
              Sobre nós
            </li>
            </Link>
            <Link to='/logout'>
            <li className="p-4 hover:bg-gray-100 flex items-center text-red-600">
              <FiLogOut className="mr-2" size={20} />
              Sair
            </li>
            </Link>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default SidebarMobile;
