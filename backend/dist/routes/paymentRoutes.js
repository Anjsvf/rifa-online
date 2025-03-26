"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const paymentController_1 = require("../controllers/paymentController");
const webhookController_1 = require("../controllers/webhookController");
const router = express_1.default.Router();
router.post('/process', auth_1.auth, paymentController_1.processPayment);
router.get('/status/:paymentId', auth_1.auth, paymentController_1.getPaymentStatus);
router.post('/cancel/:paymentId', auth_1.auth, paymentController_1.cancelPayment);
// Stripe webhook endpoint - no auth middleware as it's called by Stripe
router.post('/webhook/stripe', express_1.default.raw({ type: 'application/json' }), webhookController_1.stripeWebhookHandler);
exports.default = router;
