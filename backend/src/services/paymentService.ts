import { IPayment } from '../model/Payment'; // Importe a interface IPayment

interface PixDetails {
  code: string;
  qrCode: string;
}

interface BoletoDetails {
  code: string;
  url: string;
}

interface PaymentStatus {
  status: string;
  lastCheck: Date;
}

// Gera um código PIX mockado
export const generatePixCode = async (payment: IPayment): Promise<PixDetails> => {
  const mockPixCode = `PIX${Date.now()}${payment._id.toString().slice(-6)}`;
  const mockQRCode = `QR${mockPixCode}`;

  return {
    code: mockPixCode,
    qrCode: mockQRCode
  };
};


export const generateBoleto = async (payment: IPayment): Promise<BoletoDetails> => {
  const mockBoletoCode = `34191.79001 01043.510047 91020.150008 7 ${Date.now()}`;
  const mockBoletoUrl = `https://example.com/boleto/${payment._id}`;

  return {
    code: mockBoletoCode,
    url: mockBoletoUrl
  };
};


export const checkPaymentStatus = async (paymentId: string): Promise<PaymentStatus> => {
  return {
    status: 'pending',
    lastCheck: new Date()
  };
};