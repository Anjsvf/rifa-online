"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const reservationRoutes_1 = __importDefault(require("./routes/reservationRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const rankingRoutes_1 = __importDefault(require("./routes/rankingRoutes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
(0, database_1.connectDB)();
app.use((0, cors_1.default)({
    origin: "https://rifa-online-frontend.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.resolve(__dirname, "..", "uploads")));
app.use("/api/users", userRoutes_1.default);
app.use('/api', rankingRoutes_1.default);
app.use("/api/reservations", reservationRoutes_1.default);
app.use("/api/campaigns", campaignRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
app.get("/", (req, res) => {
    res.json({
        message: "Server is working",
        status: "OK",
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
