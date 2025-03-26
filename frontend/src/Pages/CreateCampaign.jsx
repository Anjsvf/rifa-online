import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import GenerateCard from "../components/GenerateCart";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    name: "",
    quota: "",
    price: "",
    phone: "",
    prizeType: "",
    customPrize: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCards, setGeneratedCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) setImagePreview(URL.createObjectURL(file));
    } else if (name === "price") {
      const numericValue = value.replace(/\D/g, ""); // Remove não dígitos
      setFormData({ ...formData, [name]: numericValue });
    } else if (name === "phone") {
      const numericPhone = value.replace(/\D/g, ""); // Remove formatação
      setFormData({ ...formData, [name]: numericPhone });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // No handleSubmit do CreateCampaign:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
  
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }
  
    const data = new FormData();
    data.append("name", formData.name);
    data.append("quota", formData.quota);
    data.append("price", formData.price);
    data.append("phone", formData.phone);
    data.append("prizeType", formData.prizeType);
    if (formData.image) data.append("image", formData.image);
    data.append("cards", JSON.stringify(generatedCards)); // Envia as cartelas geradas
  
    try {
      // Cria a campanha
      const response = await axios.post(`${API_URL}/api/campaigns`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      // Captura o ID da campanha criada
      const campaignId = response.data.id;
  
      // Salva as cartelas usando o campaignId
      await axios.post(
        `${API_URL}/api/campaigns/${campaignId}/cards`,
        { cards: generatedCards },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      toast.success("Campanha e cartelas salvas com sucesso!");
      // Redireciona para a página de pagamento da campanha
      navigate("/campaign-success", { state: { campaign: response.data } });
    } catch (error) {
      console.error("Erro ao criar a campanha:", error);
      setError(error.response?.data?.error || "Erro interno. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Criar Campanha</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Nome da Campanha</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Nome da Campanha"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Quantidade de Cotas</label>
          <input
            type="number"
            name="quota"
            value={formData.quota}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Quantidade de Cotas"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Valor da Cota (R$)</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="R$ 0,00"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Número de Celular</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="(99) 99999-9999"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Tipo de Prêmio</label>
          <select
            name="prizeType"
            value={formData.prizeType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            disabled={isLoading}
            required
          >
            <option value="">Selecione o prêmio</option>
            <option value="Carro">Carro</option>
            <option value="Moto">Moto</option>
            <option value="Bicicleta">Bicicleta</option>
            <option value="Celular">Celular</option>
            <option value="Outro">Outro (especifique abaixo)</option>
          </select>
        </div>

        {formData.prizeType === "Outro" && (
          <div>
            <label className="block text-gray-700">Especifique o Prêmio</label>
            <input
              type="text"
              name="customPrize"
              value={formData.customPrize}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Descreva o prêmio"
              disabled={isLoading}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-2">Imagem do Prêmio</label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-600 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full"
                />
              ) : (
                <>
                  <FaUpload className="text-gray-500 text-2xl" />
                  <span className="text-gray-500 mt-2">Upload da Imagem</span>
                </>
              )}
              <input
                id="file-upload"
                type="file"
                name="image"
                onChange={handleChange}
                className="hidden"
                accept="image/jpeg,image/png"
                disabled={isLoading}
              />
            </label>
          </div>
        </div>

        <GenerateCard onGenerate={(cards) => setGeneratedCards(cards)} />

        <button
          type="submit"
          className={`w-full px-4 py-2 rounded text-white font-semibold ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Criando..." : "Criar Campanha"}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;