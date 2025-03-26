"use strict";
// import Card from "../model/Card";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCampaignCards = void 0;
const generateCampaignCards = (campaignId, quota) => __awaiter(void 0, void 0, void 0, function* () {
    const cards = [];
    for (let i = 1; i <= quota; i++) {
        const numbers = Array.from({ length: 10 }, (_, index) => i * 10 + index);
        cards.push({
            campaignId,
            numbers,
            status: "available",
        });
    }
    return cards;
});
exports.generateCampaignCards = generateCampaignCards;
