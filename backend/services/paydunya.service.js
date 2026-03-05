require('dotenv').config()
const {config} = require('../config/environnement');
const logger = require('../utils/logger');

// Service PayDunya simple et robuste
class PayDunyaService {
  constructor() {
    try {
      const PayDunya = require('paydunya');
      
      // Initialisation de base
      PayDunya.setup({
        masterKey: config.paydunya.masterKey,
        privateKey: config.paydunya.privateKey,
        token: config.paydunya.token,
        mode: config.paydunya.mode
      });

      PayDunya.store({
        name: config.paydunya.store.name,
        tagline: config.paydunya.store.tagline,
        phoneNumber: config.paydunya.store.phone,
        postalAddress: config.paydunya.store.address,
        websiteUrl: config.cors.origin,
        logoUrl: `${config.cors.origin}/kucibok-black.png`
      });

      this.PayDunya = PayDunya;
      this.isConfigured = true;
      
    } catch (error) {
      logger.error('Erreur configuration PayDunya:', { error: error.message });
      this.isConfigured = false;
    }
  }

  /**
   * Créer une facture pour un artwork
   */
  async createArtworkInvoice(transaction, artwork, user) {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'PayDunya non configuré'
      };
    }

    try {
      const invoice = new this.PayDunya.Invoice();

      // Configuration de la facture
      invoice.addItem(
        `Œuvre: ${artwork.title}`, 
        1, 
        transaction.amount, 
        transaction.amount, 
        `Achat de "${artwork.title}"`
      );

      invoice.setTotalAmount(transaction.amount);
      invoice.setDescription(`Achat œuvre d'art: ${artwork.title}`);

      // URLs de retour
      const frontendUrl = config.cors.origin;
      const backendUrl = `http://${config.host}:${config.port}`;
      
      invoice.setCancelUrl(`${frontendUrl}/payment-failed/${transaction._id}`);
      invoice.setReturnUrl(`${frontendUrl}/payment-success/${transaction._id}`);
      invoice.setCallbackUrl(`${backendUrl}/api/payments/paydunya/callback`);

      // Données personnalisées
      invoice.setCustomData([
        { transactionId: transaction._id.toString() },
        { artworkId: artwork._id.toString() },
        { buyerId: user._id.toString() },
        { type: 'artwork_purchase' }
      ]);

      // Créer la facture
      const result = await new Promise((resolve, reject) => {
        invoice.create((response) => {
          logger.info('Réponse PayDunya:', { response });
          
          if (response.response_code === '00' || response.response_code === 200) {
            resolve(response);
          } else {
            reject(new Error(response.response_text || response.message || 'Erreur PayDunya'));
          }
        });
      });

      return {
        success: true,
        invoiceToken: result.token,
        invoiceUrl: result.response_text || result.invoice_url,
        responseCode: result.response_code
      };

    } catch (error) {
      logger.error('Erreur createArtworkInvoice:', { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Créer une facture pour un abonnement
   */
  async createSubscriptionInvoice(subscription, plan, user) {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'PayDunya non configuré'
      };
    }

    try {
      const invoice = new this.PayDunya.Invoice();

      invoice.addItem(
        `Abonnement ${plan.name}`, 
        1, 
        subscription.amount, 
        subscription.amount, 
        `Plan ${plan.name} - ${plan.duration || 'mensuel'}`
      );

      invoice.setTotalAmount(subscription.amount);
      invoice.setDescription(`Abonnement ${plan.name}`);

      const frontendUrl = config.cors.origin;
      const backendUrl = `http://${config.host}:${config.port}`;
      
      invoice.setCancelUrl(`${frontendUrl}/subscription-failed/${subscription._id}`);
      invoice.setReturnUrl(`${frontendUrl}/subscription-success/${subscription._id}`);
      invoice.setCallbackUrl(`${backendUrl}/api/payments/paydunya/callback`);

      invoice.setCustomData([
        { subscriptionId: subscription._id.toString() },
        { planId: plan._id.toString() },
        { userId: user._id.toString() },
        { type: 'subscription_payment' }
      ]);

      const result = await new Promise((resolve, reject) => {
        invoice.create((response) => {
          logger.info('Réponse PayDunya subscription:', { response });
          
          if (response.response_code === '00' || response.response_code === 200) {
            resolve(response);
          } else {
            reject(new Error(response.response_text || response.message || 'Erreur PayDunya'));
          }
        });
      });

      return {
        success: true,
        invoiceToken: result.token,
        invoiceUrl: result.response_text || result.invoice_url,
        responseCode: result.response_code
      };

    } catch (error) {
      logger.error('Erreur createSubscriptionInvoice:', { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Vérifier le statut d'un paiement
   */
  async checkPaymentStatus(token) {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'PayDunya non configuré'
      };
    }

    try {
      const invoice = new this.PayDunya.Invoice();
      
      const result = await new Promise((resolve, reject) => {
        invoice.confirm(token, (response) => {
          logger.info('Vérification PayDunya:', { response });
          resolve(response);
        });
      });

      return {
        success: true,
        status: result.status,
        responseCode: result.response_code,
        transactionId: result.transaction_id,
        customData: result.custom_data
      };

    } catch (error) {
      logger.error('Erreur checkPaymentStatus:', { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Traiter le callback PayDunya
   */
  async processCallback(data) {
    logger.info('Callback PayDunya reçu:', { data });
    
    try {
      const { token, transaction_id, custom_data } = data;

      if (!token) {
        throw new Error('Token manquant dans le callback');
      }

      // Vérifier le statut du paiement
      const paymentStatus = await this.checkPaymentStatus(token);

      if (!paymentStatus.success) {
        throw new Error('Impossible de vérifier le statut du paiement');
      }

      return {
        success: true,
        token,
        transactionId: transaction_id,
        status: paymentStatus.status,
        customData: custom_data || paymentStatus.customData
      };

    } catch (error) {
      logger.error('Erreur processCallback:', { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test de configuration
   */
  testConfiguration() {
    logger.info('Test configuration PayDunya...');
    logger.info('Configuré:', { isConfigured: this.isConfigured });
    logger.info('Master Key:', { masterKey: process.env.PAYDUNYA_MASTER_KEY ? '***configuré***' : 'manquant' });
    logger.info('Mode:', { mode: process.env.PAYDUNYA_MODE || 'sandbox' });
    
    return this.isConfigured;
  }
}

module.exports = new PayDunyaService();
