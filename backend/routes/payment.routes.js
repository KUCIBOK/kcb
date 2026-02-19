const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { auth } = require('../middleware/auth');

// Routes pour les paiements PayDunya
router.post('/paydunya/artwork/:artworkId', auth, paymentController.initArtworkPayment);
router.post('/paydunya/subscription/:subscriptionId', auth, paymentController.initSubscriptionPayment);
router.post('/paydunya/callback', paymentController.handlePayDunyaCallback);
router.get('/paydunya/verify/:token', paymentController.verifyPayDunyaPayment);

// Routes pour les autres méthodes de paiement (future)
router.post('/flutterwave/init', auth, paymentController.initFlutterwavePayment);
router.post('/cinetpay/init', auth, paymentController.initCinetPayPayment);

module.exports = router;
