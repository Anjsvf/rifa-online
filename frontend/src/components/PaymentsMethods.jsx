import React from 'react';
import { FaBarcode } from 'react-icons/fa'; // Ícone para boleto
import { SiPix } from 'react-icons/si'; // Ícone para PIX, usando react-icons

const PaymentsMethods = () => {
  const handlePaymentSelection = (method) => {
    alert(`Você selecionou: ${method}`);
    // Aqui você pode adicionar a lógica para processar o pagamento com base no método selecionado
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Métodos de Pagamento</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Opção PIX */}
        <div
          className="border rounded p-6 flex flex-col items-center cursor-pointer hover:bg-gray-100 transition-all duration-300"
          onClick={() => handlePaymentSelection('PIX')}
        >
          <SiPix className="text-6xl text-green-500 mb-4" />
          <span className="text-lg font-semibold text-center">Pagar com PIX</span>
        </div>

        {/* Opção Boleto */}
        <div
          className="border rounded p-6 flex flex-col items-center cursor-pointer hover:bg-gray-100 transition-all duration-300"
          onClick={() => handlePaymentSelection('Boleto')}
        >
          <FaBarcode className="text-6xl text-gray-700 mb-4" />
          <span className="text-lg font-semibold text-center">Pagar com Boleto</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentsMethods;
