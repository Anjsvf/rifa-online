import React, { useState } from 'react';
import Account from './Account';
import PaymentsMethods from './PaymentsMethods';
import { 
  LuUser, 
  LuCreditCard, 
  LuClipboardList, 
  LuSettings, 
  LuBarChart3, 
  LuWallet 
} from 'react-icons/lu';

const ConfigurationsTabs = () => {
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    {
      id: 'account',
      label: 'Conta',
      icon: LuUser,
      component: <Account />
    },
    {
      id: 'paymentMethods',
      label: 'Métodos de Pagamento',
      icon: LuCreditCard,
      component: <PaymentsMethods />
    },
    {
      id: 'financialReports',
      label: 'Relatórios Financeiros',
      icon: LuBarChart3,
      component: (
        <div className=" p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <LuBarChart3 className="mr-2 text-blue-600" />
            Relatórios Financeiros
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-700">Resumo Mensal</h3>
              <p className="text-sm text-gray-600">Visualize suas receitas e despesas</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-700">Fluxo de Caixa</h3>
              <p className="text-sm text-gray-600">Acompanhe seus ganhos e gastos</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="configurations-tabs bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
      <nav className="bg-gray-100 border-b border-gray-200">
        <ul className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <li 
              key={tab.id}
              className={`
                flex-1 text-center cursor-pointer py-4 px-4 transition-all duration-300 
                flex items-center justify-center space-x-2 
                ${activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'}
              `}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="text-xl" />
              <span className="hidden md:inline">{tab.label}</span>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="tab-content p-6">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default ConfigurationsTabs;