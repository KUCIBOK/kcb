import { useState, useCallback } from 'react';
import paymentService from '../services/PaymentService';
import { toast } from 'sonner';

/**
 * Hook pour gérer les paiements PayDunya
 */
export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Initier un paiement pour un artwork
   */
  const payForArtwork = useCallback(async (artworkId, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.initArtworkPayment(artworkId);

      if (!result.success) {
        throw new Error(result.error);
      }

      const { paymentUrl, token, transaction } = result.data;

      // Option de redirection directe ou popup
      if (options.usePopup) {
        // Ouvrir dans une popup
        paymentService.openPaymentWindow(paymentUrl, () => {
          // Callback quand la popup se ferme
          if (options.onPopupClose) {
            options.onPopupClose(token, transaction);
          }
        });
      } else {
        // Redirection directe
        paymentService.redirectToPayment(paymentUrl);
      }

      return {
        success: true,
        token,
        transaction,
        paymentUrl
      };

    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'initialisation du paiement';
      setError(errorMessage);
      toast.error(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initier un paiement pour un abonnement
   */
  const payForSubscription = useCallback(async (subscriptionId, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.initSubscriptionPayment(subscriptionId);

      if (!result.success) {
        throw new Error(result.error);
      }

      const { paymentUrl, token, subscription } = result.data;

      // Option de redirection directe ou popup
      if (options.usePopup) {
        paymentService.openPaymentWindow(paymentUrl, () => {
          if (options.onPopupClose) {
            options.onPopupClose(token, subscription);
          }
        });
      } else {
        paymentService.redirectToPayment(paymentUrl);
      }

      return {
        success: true,
        token,
        subscription,
        paymentUrl
      };

    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'initialisation du paiement';
      setError(errorMessage);
      toast.error(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Vérifier le statut d'un paiement
   */
  const verifyPayment = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.verifyPayment(token);

      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        data: result.data
      };

    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la vérification du paiement';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    payForArtwork,
    payForSubscription,
    verifyPayment,
    clearError: () => setError(null)
  };
};

export default usePayment;
