import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import cartelaRoutes from './routes/cartelaRoutes';
import rankingRoutes from './routes/rankingRoutes';

import cors from 'cors';


dotenv.config();


const app = express();


connectDB();


app.use(express.json());


app.use(
  cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], 
    credentials: true, 
  })
);







// Definição de Rotas
app.use('/api/users', userRoutes);
app.use('/api/cartelas', cartelaRoutes);
app.use('/api/rankings', rankingRoutes);






app.get('/', (req, res) => {
  res.json({
    message: 'Server is working',
    status: 'OK',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
