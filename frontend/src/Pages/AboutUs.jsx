import React from 'react';
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <>
    <div className="bg-gray-100 p-8 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Sobre Nós</h2>
        <p className="text-lg text-gray-700 mb-6">
          O Rifa Digital é uma plataforma inovadora que permite a criação de rifas online de forma fácil e segura. Nossa missão é conectar pessoas através de campanhas de rifas, promovendo oportunidades para todos, seja para angariar fundos ou para realizar sonhos.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Oferecemos uma interface intuitiva e diversas opções de personalização para que você possa criar e gerenciar suas rifas de maneira rápida. Com nosso sistema, é possível organizar campanhas transparentes, acompanhando cada passo desde a criação até a entrega dos prêmios.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          No Rifa Digital, a segurança é prioridade. Trabalhamos com os melhores métodos de pagamento, como Pix e boleto bancário, garantindo transações rápidas e confiáveis para todos os participantes.
        </p>
        <p className="text-lg text-gray-700">
          Venha fazer parte da nossa comunidade e descubra como o Rifa Digital pode transformar suas ideias em realidade. Estamos aqui para apoiar sua jornada!
        </p>
      </div>
    </div>
      <Footer/>
    </>
  );
};

export default AboutUs;
