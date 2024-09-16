"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cartelaRoutes_1 = __importDefault(require("./routes/cartelaRoutes"));
const rankingRoutes_1 = __importDefault(require("./routes/rankingRoutes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
}));
// Definição de Rotas
app.use('/api/users', userRoutes_1.default);
app.use('/api/cartelas', cartelaRoutes_1.default);
app.use('/api/rankings', rankingRoutes_1.default);
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
