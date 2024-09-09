import React, { useState } from 'react';
import axios from 'axios';
import { FaRegFileAlt, FaDice, FaCheckCircle } from 'react-icons/fa'; // Importando ícones

const GenerateCard = () => {
  const [cards, setCards] = useState([]);
  const [numCards, setNumCards] = useState(1); // Number of cards to generate

  const handleGenerateCards = () => {
    const newCards = [];
    for (let i = 0; i < numCards; i++) {
      const numbers = [];
      while (numbers.length < 10) { // Gerando 10 números por cartela
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        if (!numbers.includes(randomNumber)) {
          numbers.push(randomNumber);
        }
      }
      newCards.push(numbers);
    }
    setCards(newCards);

    // Enviar as cartelas geradas para o backend
    axios.post('/api/cards', { cards: newCards })
      .then(response => {
        console.log('Cards saved:', response.data);
      })
      .catch(error => {
        console.error('Error saving cards:', error);
      });
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <FaRegFileAlt /> Gerar Cartelas 
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700">Número de Cartelas</label>
        <input
          type="number"
          value={numCards}
          onChange={(e) => setNumCards(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="qunatidade de Cartelas"
          min="1"
        />
      </div>
      <button
        onClick={handleGenerateCards}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2"
      >
        <FaDice /> Gerar cartelas 
      </button>

      <div className="mt-6">
        {cards.map((card, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <FaCheckCircle /> Cartela {index + 1}
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {card.map((number, idx) => (
                <span key={idx} className="p-2 bg-gray-100 rounded text-center">
                  {number}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerateCard;
