import React from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiLogOut, FiEdit } from "react-icons/fi";

import {
 
  FiSettings,
  FiMessageSquare,
  FiFileText,
} from "react-icons/fi"; // Ícones do menu
import { FaHistory, FaTrophy } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="lg:w-64 z-599  bg-white h-[100vh] min-h-screen text-sky-950 hidden lg:block">
      <nav className="p-4">
        <ul className="space-y-4">
          <li>
            <Link
              to="/create-campaign"
              className="text-lg font-medium  hover:bg-gray-100  p-2 rounded flex items-center space-x-2"
            >
              <FiEdit className="text-xl" />
              <span>Criar Campanhas</span>
            </Link>
          </li>
          <li>
            <Link
              to="/ranking"
              className="text-lg font-medium  hover:bg-gray-100  p-2 rounded flex items-center space-x-2"
            >
              <FaTrophy className="text-xl" />
              <span>Ranking</span>
            </Link>
          </li>
          <li>
            <Link
              to="/reservations"
              className="text-lg font-medium  hover:bg-gray-100  p-2 rounded flex items-center space-x-2"
            >
              <FaHistory className="text-xl" />
              <span>Históricos de rifas</span>
            </Link>
          </li>
          <li></li>
          <li>
            <Link
              to="/support"
              className="text-lg font-medium  hover:bg-gray-100  p-2 rounded flex items-center space-x-2"
            >
              <FiMessageSquare className="text-xl" />
              <span>Suporte</span>
            </Link>
          </li>
          <li>
            <Link
              to="/suggestions"
              className="text-lg font-medium  hover:bg-gray-100  p-2 rounded flex items-center space-x-2"
            >
              <FiFileText className="text-xl" />
              <span>Sugestões</span>
            </Link>
          
            <Link
              to="/settings"
              className="text-lg font-medium  hover:bg-gray-100  p-2 rounded flex items-center space-x-2"
            >
              <FiSettings className="text-xl" />
              <span>Configurações</span>
            </Link>

            <Link
              to="/aboutus"
              className="text-lg font-medium hover:bg-gray-100  p-2 rounded flex items-center space-x-2"
            >
              <FiUsers className="text-xl" />
              <span>Sobre Nós</span>
            </Link>
              <Link to='/logout'>
            <li className="p-4  hover:bg-gray-100  flex items-center text-red-600">
              <FiLogOut className="mr-2" size={20} />
              Sair
            </li>
              </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
