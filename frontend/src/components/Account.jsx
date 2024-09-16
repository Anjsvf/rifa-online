import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const [isDeleting, setIsDeleting] = useState(false); 
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');

    if (confirmed) {
      try {
        setIsDeleting(true);
     
        const response = await axios.delete('http://localhost:5000/account/delete', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          alert('Conta excluída com sucesso.');
          localStorage.removeItem('token'); 
          navigate('/');
        }
      } catch (error) {
        console.error('Erro ao excluir a conta:', error);
        alert('Ocorreu um erro ao tentar excluir sua conta. Tente novamente.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Configurações da Conta</h1>
      <div className="text-center">
        <button
          onClick={handleDeleteAccount}
          className={`bg-red-600 text-white px-4 py-2 rounded ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isDeleting}
        >
          {isDeleting ? 'Excluindo conta...' : 'Excluir Conta'}
        </button>
      </div>
    </div>
  );
};

export default Account;
