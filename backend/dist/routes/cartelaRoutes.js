"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartelaController_1 = require("../controllers/cartelaController");
const router = (0, express_1.Router)();
router.post('/', cartelaController_1.createCartela);
router.get('/', cartelaController_1.getCartelas);
exports.default = router;
