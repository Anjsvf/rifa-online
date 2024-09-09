import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-sky-950 text-white py-4 mt-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">© 2024 Rifa Digital. Todos os direitos reservados.</p>
        
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="/terms" className="text-sm hover:underline">
            Termos de Serviço
          </a>
          <a href="/privacy" className="text-sm hover:underline">
            Política de Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
