"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    // Obtenção do token do cabeçalho de autorização
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        // Se não houver token, retorna erro 401
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        // Verificação e decodificação do token JWT
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Armazenando o payload decodificado (usuário) no objeto req
        req.user = decoded;
        // Continuação para o próximo middleware ou rota
        next();
    }
    catch (error) {
        // Em caso de token inválido, retorna erro 401
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
