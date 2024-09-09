import { Route, Routes } from "react-router-dom";
import React from "react";

import Header from "./components/Header";
import Sidebar from "./components/Siderbar";
import Dashboard from "./Pages/Dashboard";
import Ranking from "./Pages/Ranking";
import Configurations from "./Pages/Configurations";
import CreateCampaign from "./Pages/CreateCampaign";
import SidebarMobile from "./components/SiderbarMobile";
import Home from "./Pages/Home";

import AboutUs from "./Pages/AboutUs";
import Support from "./Pages/Support";
import Suggestions from "./Pages/Suggestions";
import LogOut from "./Pages/LogOut";
import Reservations from "./Pages/Reservations";
import GenerateCard from "./components/GenerateCart";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-100">
        {" "}
        {/* Full height layout com fundo cinza */}
        <Header /> {/* Cabeçalho no topo */}
        {/* Menu lateral e conteúdo principal */}
        <div className="flex flex-grow">
          {/* Sidebar Mobile: Visível apenas em telas menores */}
          <div className="md:hidden">
            {" "}
            {/* hidden para md e acima */}
            <SidebarMobile />
          </div>

          {/* Sidebar para telas maiores */}
          <div className="hidden md:flex md:w-1/5 bg-white  shadow-md">
            <Sidebar />
          </div>

          {/* Conteúdo principal */}
          <div className="w-full md:w-3/4 p-6">
            {" "}
            {/* Ajustando o espaço para o conteúdo */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/settings" element={<Configurations />} />
              <Route path="/create-campaign" element={<CreateCampaign />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/support" element={<Support />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/reservations" element={<Reservations/>} />
              <Route path="/logout" element={<LogOut />} />
              <Route path="/generatecard" element={<GenerateCard/>} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
