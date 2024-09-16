import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUpload } from "react-icons/fa"; // Importando o ícone de upload

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    name: "",
    quota: "",
    price: "",
    phone: "",
    prizeType: "", // novo campo para tipo de prêmio
    customPrize: "", // campo para prêmio personalizado
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({
        ...formData,
        image: file,
      });
      if (file) {
        setImagePreview(URL.createObjectURL(file)); // Mostrando a pré-visualização da imagem
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/campaign", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const campaignId = response.data.id; // ID da campanha recém-criada
      navigate("/dashboard");

      // Aguarda 2 minutos (120000 milissegundos) e depois gera as cartelas
      setTimeout(() => {
        generateCards(campaignId);
      }, 120000); // 2 minutos
    } catch (error) {
      console.error("Erro ao criar a campanha:", error);
    }
  };

  // Função para gerar cartelas
  const generateCards = async (campaignId) => {
    try {
      await axios.post(
        `https://sua-api.com/campaigns/${campaignId}/generate-cards`
      );
      console.log("Cartelas geradas com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar as cartelas:", error);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Criar Campanha</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Nome da campanha</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Nome da campanha"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Quantidade de cotas</label>
          <input
            type="number"
            name="quota"
            value={formData.quota}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Quantidade de cotas"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Valor da cota (R$)</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="R$ 0,00"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Número de celular</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="(99) 99999-9999"
            required
          />
        </div>

        {/* Select para o tipo de prêmio */}
        <div>
          <label className="block text-gray-700">Tipo de Prêmio</label>
          <select
            name="prizeType"
            value={formData.prizeType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Selecione o prêmio</option>
            <option value="Carro">Carro</option>
            <option value="Moto">Moto</option>
            <option value="Bicicleta">Bicicleta</option>
            <option value="Celular">Celular</option>
            <option value="Fogão">Fogão</option>
            <option value="Geladeira">Geladeira</option>
            <option value="Microondas">Microondas</option>
            <option value="Outro">Outro (especifique abaixo)</option>
          </select>
        </div>

        {/* Input para prêmio personalizado */}
        {formData.prizeType === "Outro" && (
          <div>
            <label className="block text-gray-700">Especifique o Prêmio</label>
            <input
              type="text"
              name="customPrize"
              value={formData.customPrize}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Descreva o prêmio"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-2">Imagem do prêmio</label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-600"
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
              />
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="bg-sky-950 text-white px-4 py-2 rounded w-full"
        >
          Criar Campanha
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
