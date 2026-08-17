import { apiRequestWithRetry, utils } from '../api/useAPI'

const BASE_URL = utils.api || '/api'

/**
 * Service pour les paiements PayDunya
 */
class PaymentService {
  /**
   * Initialiser un paiement PayDunya pour un artwork.
   * Route backend : POST /api/payments/paydunya-init { type, artwork_id, guest? }
   * @param {string} artworkId
   * @param {{name:string,email:string,phone?:string}|null} guest Infos invité, requis si non authentifié.
   */
  async initArtworkPayment(artworkId, guest = null) {
    try {
      const body = { type: 'artwork', artwork_id: artworkId }
      if (guest) body.guest = guest
      const response = await apiRequestWithRetry(`${BASE_URL}/payments/paydunya-init`, {
        method: 'POST',
        body: JSON.stringify(body),
      })
      const inner = response?.data ?? response
      return {
        success: true,
        data: {
          paymentUrl: inner.payment_url,
          token: inner.token,
          ref: inner.ref,
          transaction: inner,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Initialiser un paiement PayDunya pour un abonnement.
   * Route backend : POST /api/payments/paydunya-init { type, plan_id }
   */
  async initSubscriptionPayment(planId) {
    try {
      const response = await apiRequestWithRetry(`${BASE_URL}/payments/paydunya-init`, {
        method: 'POST',
        body: JSON.stringify({ type: 'plan', plan_id: planId }),
      })
      const inner = response?.data ?? response
      return {
        success: true,
        data: {
          paymentUrl: inner.payment_url,
          token: inner.token,
          ref: inner.ref,
          subscription: inner,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Vérifier le statut d'un paiement PayDunya.
   * Route backend : POST /api/payments/paydunya-callback { token }
   */
  async verifyPayment(token) {
    try {
      const response = await apiRequestWithRetry(`${BASE_URL}/payments/paydunya-callback`, {
        method: 'POST',
        body: JSON.stringify({ token }),
      })
      return {
        success: true,
        data: response,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Rediriger vers PayDunya pour le paiement
   */
  redirectToPayment(paymentUrl) {
    window.location.href = paymentUrl
  }

  /**
   * Ouvrir PayDunya dans une nouvelle fenêtre
   */
  openPaymentWindow(paymentUrl, onClose) {
    const popup = window.open(
      paymentUrl,
      'PayDunya',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    )

    // Surveiller la fermeture de la popup
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer)
        if (onClose) onClose()
      }
    }, 1000)

    return popup
  }
}

// Export singleton
const paymentService = new PaymentService()
export default paymentService
