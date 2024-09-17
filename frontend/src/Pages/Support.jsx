import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaCommentDots, FaPaperPlane } from 'react-icons/fa';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar o formulário ao backend
    console.log('Form Data:', formData);
    // Limpar formulário após envio
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Suporte</h2>
      <p className="text-center mb-4">
        Se você tiver dúvidas, problemas ou sugestões, entre em contato conosco através do formulário abaixo. Nossa equipe de suporte responderá o mais rápido possível.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
        <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
          <FaUser className="text-gray-600 mr-3" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-transparent outline-none"
            placeholder="Seu nome"
            required
          />
        </div>
        <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
          <FaEnvelope className="text-gray-600 mr-3" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent outline-none"
            placeholder="Seu email"
            required
          />
        </div>
        <div className="flex items-start border rounded px-3 py-2 bg-gray-100">
          <FaCommentDots className="text-gray-600 mr-3 mt-1" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-transparent outline-none"
            placeholder="Descreva sua dúvida ou problema"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white flex items-center justify-center px-4 py-2 rounded w-full hover:bg-green-700 transition-colors"
        >
          <FaPaperPlane className="mr-2" />
          Enviar Mensagem
        </button>
      </form>
    </div>
  );
};

export default Support;
