"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URL || '', {});
        console.log('MongoDB: successful connecting');
    }
    catch (error) {
        console.error('connection to MongoDB fails:', error);
        process.exit(1);
    }
};
exports.default = connectDB;
