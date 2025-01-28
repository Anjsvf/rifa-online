import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import userRoutes from "./routes/userRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import campaignRoutes from "./routes/campaignRoutes";
import rankingRoutes from './routes/rankingRoutes';
import path from "path";

const app = express();

connectDB();

app.use(
  cors({
    origin: "https://rifa-online-frontend.onrender.com/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());


app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));


app.use("/api/users", userRoutes);
app.use('/api', rankingRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Server is working",
    status: "OK",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));