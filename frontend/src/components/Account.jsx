import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const Account = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const navigate = useNavigate();

  const openConfirmationModal = () => setIsConfirmationModalOpen(true);
  const closeConfirmationModal = () => setIsConfirmationModalOpen(false);

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setIsDeleting(true);
      const response = await axios.delete(`${API_URL}/account/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success('Conta excluída com sucesso.');
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao excluir a conta:', error);
      if (error.response?.status === 401) {
        toast.error('Sua sessão expirou. Faça login novamente.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Ocorreu um erro ao tentar excluir sua conta. Tente novamente.');
      }
    } finally {
      setIsDeleting(false);
      closeConfirmationModal();
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Configurações da Conta</h1>
      <div className="text-center">
        <button
          onClick={openConfirmationModal}
          className={`bg-red-600 text-white px-4 py-2 rounded ${
            isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
          }`}
          disabled={isDeleting}
        >
          {isDeleting ? 'Excluindo conta...' : 'Excluir Conta'}
        </button>
      </div>

      {isConfirmationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
            <p className="mb-4">Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeConfirmationModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Excluir Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;