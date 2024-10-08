import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaHeadset, FaHistory, FaTrophy } from 'react-icons/fa'; // Ícones do menu
import { MdClose } from 'react-icons/md'; // Ícone de fechar
import { FiSettings, FiFileText, FiMessageSquare, FiLogOut, FiUsers, FiEdit } from 'react-icons/fi'; // Outros ícones

const SidebarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = (event) => {
    event.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Botão para abrir o menu */}
      <button onClick={toggleSidebar} className="text-gray-500 p-2">
        <FaBars size={24} />
      </button>

      {/* Menu lateral */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-2xl font-semibold text-blue-950">RIFA DIGITAL</h2>
          <button onClick={closeSidebar} className="text-gray-500">
            <MdClose size={24} />
          </button>
        </div>
        <nav className="mt-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/create-campaign"
                onClick={closeSidebar}
                className="text-lg font-medium hover:bg-gray-100 p-2 rounded flex items-center space-x-2"
              >
                <FiEdit className="text-xl" />
                <span>Criar Campanhas</span>
              </Link>
            </li>
            <li>
              <Link
                to="/ranking"
                onClick={closeSidebar}
                className="text-lg font-medium hover:bg-gray-100 p-2 rounded flex items-center space-x-2"
              >
                <FaTrophy className="text-xl" />
                <span>Ranking</span>
              </Link>
            </li>
            <li>
              <Link
                to="/reservations"
                onClick={closeSidebar}
                className="text-lg font-medium hover:bg-gray-100 p-2 rounded flex items-center space-x-2"
              >
                <FaHistory className="text-xl" />
                <span>Histórico de rifas</span>
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                onClick={closeSidebar}
                className="text-lg font-medium hover:bg-gray-100 p-2 rounded flex items-center space-x-2"
              >
                <FaHeadset className="text-xl" />
                <span>Suporte</span>
              </Link>
            </li>
            <li>
              <Link
                to="/suggestions"
                onClick={closeSidebar}
                className="text-lg font-medium hover:bg-gray-100 p-2 rounded flex items-center space-x-2"
              >
                <FiFileText className="text-xl" />
                <span>Sugestões</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                onClick={closeSidebar}
                className="text-lg font-medium hover:bg-gray-100 p-2 rounded flex items-center space-x-2"
              >
                <FiSettings className="text-xl" />
                <span>Configurações</span>
              </Link>
            </li>
            <li>
              <Link
                to="/aboutus"
                onClick={closeSidebar}
                className="text-lg font-medium hover:bg-gray-100 p-2 rounded flex items-center space-x-2"
              >
                <FiUsers className="text-xl" />
                <span>Sobre Nós</span>
              </Link>
            </li>
            <li>
              <Link
                to="/logout"
                onClick={closeSidebar}
                className="text-lg font-medium hover:bg-gray-100 p-2 rounded flex items-center text-red-600 space-x-2"
              >
                <FiLogOut className="text-xl" />
                <span>Sair</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default SidebarMobile;
