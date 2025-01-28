import React, { useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi'; 

const Suggestions = () => {
  const [suggestion, setSuggestion] = useState('');

  const handleChange = (e) => {
    setSuggestion(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    console.log('Sugestão enviada:', suggestion);

  
    setSuggestion('');
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Deixe sua Sugestão</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <div className="flex items-center justify-center mb-4">
          <FiMessageSquare className="text-6xl text-green-600" />
        </div>
        <div>
          <textarea
            name="suggestion"
            value={suggestion}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Escreva sua sugestão aqui"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Enviar Sugestão
        </button>
      </form>
    </div>
  );
};

export default Suggestions;
