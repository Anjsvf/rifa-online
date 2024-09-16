"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRanking = exports.getRankings = void 0;
const rankingModel_1 = __importDefault(require("../models/rankingModel"));
const getRankings = async (req, res) => {
    try {
        const rankings = await rankingModel_1.default.find().populate('userId', 'email');
        res.status(200).json(rankings);
    }
    catch (error) {
        res.status(500).json({ message: 'error' });
    }
};
exports.getRankings = getRankings;
const addRanking = async (req, res) => {
    const { userId, score } = req.body;
    if (!userId || typeof score !== 'number') {
        return res.status(400).json({ message: 'Invalid input' });
    }
    try {
        const newRanking = new rankingModel_1.default({ userId, score });
        await newRanking.save();
        res.status(201).json(newRanking);
    }
    catch (error) {
        res.status(500).json({ message: 'error' });
    }
};
exports.addRanking = addRanking;
