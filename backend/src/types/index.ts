export interface User {
    _id: string;
    firstName: string;
    email: string;
    password: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Campaign {
    _id: string;
    userId: string;
    name: string;
    quota: number;
    price: number;
    phone: string;
    prizeType: string;
    customPrize?: string;
    image: string;
    status: 'active' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Reservation {
    _id: string;
    campaignId: string;
    userId: string;
    numbers: number[];
    status: 'pending' | 'confirmed' | 'cancelled';
    paymentStatus: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
  }