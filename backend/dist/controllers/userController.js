"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const registerUser = async (req, res) => {
    const { email, password, firstName, phone } = req.body;
    try {
        const user = await userModel_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new userModel_1.default({
            email,
            password: hashedPassword,
            firstName,
            phone,
        });
        await newUser.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel_1.default.findOne({ email });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
};
exports.loginUser = loginUser;
