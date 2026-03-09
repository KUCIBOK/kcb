import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Download, Eye } from 'lucide-react';
import { usePayment } from '../hooks/usePayment';
import { DataLoader } from '../components/loaders/PageLoader';

const PayDunyaSuccess = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { verifyPayment } = usePayment();
  
  const [status, setStatus] = useState({
    loading: true,
    verified: false,
    error: null,
    transaction: null
  });

  useEffect(() => {
    const verifyTransaction = async () => {
      if (!transactionId) {
        setStatus({
          loading: false,
          verified: false,
          error: 'ID de transaction manquant',
          transaction: null
        });
        return;
      }

      try {
        const result = await verifyPayment(transactionId);
        
        if (result.success) {
          setStatus({
            loading: false,
            verified: true,
            error: null,
            transaction: result.data
          });
        } else {
          setStatus({
            loading: false,
            verified: false,
            error: result.error,
            transaction: null
          });
        }
      } catch (error) {
        setStatus({
          loading: false,
          verified: false,
          error: error.message,
          transaction: null
        });
      }
    };

    verifyTransaction();
  }, [transactionId, verifyPayment]);

  if (status.loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <DataLoader />
          <p className="text-gray-400 mt-4">Vérification du paiement en cours...</p>
        </div>
      </div>
    );
  }

  if (!status.verified) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="rounded-full bg-red-100 w-16 h-16 flex justify-center items-center mb-4 mx-auto">
            <CheckCircle className="text-red-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Erreur de vérification</h1>
          <p className="text-gray-400 text-sm mb-6">{status.error}</p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 bg-indigo-kcb hover:bg-indigo-kcb/90 text-white px-6 py-2 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'exploration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icône de succès */}
        <div className="rounded-full bg-green-100 w-16 h-16 flex justify-center items-center mb-4 mx-auto">
          <CheckCircle className="text-green-600 w-8 h-8" />
        </div>
        
        {/* Titre et message */}
        <h1 className="text-2xl font-bold text-white mb-2">Paiement réussi !</h1>
        <p className="text-gray-400 text-sm mb-6">
          Félicitations ! Votre achat a été traité avec succès.
        </p>

        {/* Détails de la transaction */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
          <h3 className="text-white font-semibold mb-3">Détails de la transaction</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Transaction ID:</span>
              <span className="text-white font-mono text-xs">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Statut:</span>
              <span className="text-green-400 font-medium">Confirmé</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Méthode:</span>
              <span className="text-white">PayDunya</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/profile/purchases"
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-kcb hover:bg-indigo-kcb/90 text-white px-6 py-3 rounded-lg transition"
          >
            <Eye className="w-4 h-4" />
            Voir mes achats
          </Link>
          
          <Link
            to="/explore"
            className="w-full inline-flex items-center justify-center gap-2 border border-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Continuer l'exploration
          </Link>
        </div>

        {/* Note */}
        <p className="text-xs text-gray-500 mt-6">
          Un email de confirmation vous a été envoyé avec tous les détails de votre achat.
        </p>
      </div>
    </div>
  );
};

export default PayDunyaSuccess;
