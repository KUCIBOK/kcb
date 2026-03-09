import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCcw, HelpCircle } from 'lucide-react';

const PayDunyaFailed = () => {
  const { transactionId } = useParams();

  useEffect(() => {
    // Log de l'échec pour analytics
    console.log('Échec de paiement PayDunya:', transactionId);
  }, [transactionId]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icône d'erreur */}
        <div className="rounded-full bg-red-100 w-16 h-16 flex justify-center items-center mb-4 mx-auto">
          <XCircle className="text-red-600 w-8 h-8" />
        </div>
        
        {/* Titre et message */}
        <h1 className="text-2xl font-bold text-white mb-2">Paiement échoué</h1>
        <p className="text-gray-400 text-sm mb-6">
          Nous n'avons pas pu traiter votre paiement. Aucun montant n'a été débité de votre compte.
        </p>

        {/* Raisons possibles */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
          <h3 className="text-white font-semibold mb-3">Raisons possibles :</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Solde insuffisant</li>
            <li>• Informations de paiement incorrectes</li>
            <li>• Problème de connexion réseau</li>
            <li>• Transaction annulée</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-kcb hover:bg-indigo-kcb/90 text-white px-6 py-3 rounded-lg transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Réessayer le paiement
          </button>
          
          <Link
            to="/explore"
            className="w-full inline-flex items-center justify-center gap-2 border border-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'exploration
          </Link>
          
          <Link
            to="/contact"
            className="w-full inline-flex items-center justify-center gap-2 text-gray-400 hover:text-white transition text-sm"
          >
            <HelpCircle className="w-4 h-4" />
            Besoin d'aide ? Contactez-nous
          </Link>
        </div>

        {/* Information */}
        {transactionId && (
          <div className="mt-6 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500">
              Référence: <span className="font-mono">{transactionId}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Conservez cette référence pour toute assistance
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayDunyaFailed;
