import apiService from './ApiService';

/**
 * Service pour les paiements PayDunya
 */
class PaymentService {
  /**
   * Initialiser un paiement PayDunya pour un artwork.
   * Route backend : POST /api/payments/paydunya-init { type, artwork_id }
   */
  async initArtworkPayment(artworkId) {
    try {
      const response = await apiService.post('/payments/paydunya-init', {
        type: 'artwork',
        artwork_id: artworkId,
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Initialiser un paiement PayDunya pour un abonnement.
   * Route backend : POST /api/payments/paydunya-init { type, plan_id }
   */
  async initSubscriptionPayment(planId) {
    try {
      const response = await apiService.post('/payments/paydunya-init', {
        type: 'plan',
        plan_id: planId,
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Vérifier le statut d'un paiement PayDunya.
   * Route backend : POST /api/payments/paydunya-callback { token }
   */
  async verifyPayment(token) {
    try {
      const response = await apiService.post('/payments/paydunya-callback', { token });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Rediriger vers PayDunya pour le paiement
   */
  redirectToPayment(paymentUrl) {
    window.location.href = paymentUrl;
  }

  /**
   * Ouvrir PayDunya dans une nouvelle fenêtre
   */
  openPaymentWindow(paymentUrl, onClose) {
    const popup = window.open(
      paymentUrl,
      'PayDunya',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    );

    // Surveiller la fermeture de la popup
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        if (onClose) onClose();
      }
    }, 1000);

    return popup;
  }
}

// Export singleton
const paymentService = new PaymentService();
export default paymentService;
