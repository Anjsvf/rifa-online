import React, { useState } from 'react';
import Account from './Account';
import PaymentsMethods from './PaymentsMethods';

const ConfigurationsTabs = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="configurations-tabs p-4 bg-white rounded-lg shadow-md">
      <nav>
        <ul className="flex flex-wrap space-x-4 border-b-2 border-gray-200 pb-2 mb-4">
          <li 
            className={`cursor-pointer pb-2 ${activeTab === 'account' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('account')}
          >
            Conta
          </li>
          <li 
            className={`cursor-pointer pb-2 ${activeTab === 'paymentMethods' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('paymentMethods')}
          >
            Métodos de Pagamento
          </li>
          <li 
            className={`cursor-pointer pb-2 ${activeTab === 'accessKeys' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('accessKeys')}
          >
            Redes Acessos
          </li>
          <li 
            className={`cursor-pointer pb-2 ${activeTab === 'financialReports' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('financialReports')}
          >
            Financeiro
          </li>
        </ul>
      </nav>
      <div className="tab-content">
        {activeTab === 'account' && <div>Conteúdo da Conta<Account/></div>}
        {activeTab === 'paymentMethods' && <div>Conteúdo dos Métodos de Pagamento<PaymentsMethods/></div>}
        {activeTab === 'accessKeys' && <div>Conteúdo das Redes Acessos</div>}
        {activeTab === 'financialReports' && <div>Conteúdo Financeiro</div>}
      </div>
    </div>
  );
};

export default ConfigurationsTabs;
