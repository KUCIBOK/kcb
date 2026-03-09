import React from 'react';
import { CreditCard, Smartphone, Banknote } from 'lucide-react';

const PaymentMethodSelector = ({ 
  selectedMethod, 
  onMethodChange, 
  showTitle = true,
  className = "" 
}) => {
  const paymentMethods = [
    {
      id: 'paydunya',
      name: 'PayDunya',
      description: 'Mobile Money, Cartes bancaires',
      icon: CreditCard,
      color: 'text-orange-500',
      available: true,
      popular: true
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      description: 'Cartes internationales',
      icon: CreditCard,
      color: 'text-yellow-500',
      available: false,
      popular: false
    },
    {
      id: 'cinetpay',
      name: 'CinetPay',
      description: 'Mobile Money local',
      icon: Smartphone,
      color: 'text-blue-500',
      available: false,
      popular: false
    },
    {
      id: 'bank_transfer',
      name: 'Virement bancaire',
      description: 'Transfert direct',
      icon: Banknote,
      color: 'text-green-500',
      available: false,
      popular: false
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {showTitle && (
        <label className="block text-sm font-medium text-gray-300">
          Méthode de paiement
        </label>
      )}
      
      <div className="space-y-2">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          
          return (
            <label
              key={method.id}
              className={`
                flex items-center p-3 border rounded-lg transition-colors relative
                ${method.available 
                  ? 'border-gray-700 cursor-pointer hover:bg-gray-800' 
                  : 'border-gray-800 cursor-not-allowed opacity-50'
                }
                ${selectedMethod === method.id 
                  ? 'border-indigo-kcb bg-indigo-kcb/10' 
                  : ''
                }
              `}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => onMethodChange(e.target.value)}
                disabled={!method.available}
                className="w-4 h-4 text-indigo-kcb"
              />
              
              <div className="ml-3 flex items-center gap-2 flex-1">
                <IconComponent className={`w-5 h-5 ${method.color}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{method.name}</span>
                    {method.popular && (
                      <span className="text-xs bg-indigo-kcb text-white px-2 py-0.5 rounded-full">
                        Populaire
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{method.description}</span>
                </div>
              </div>

              {!method.available && (
                <span className="text-xs text-gray-500 ml-2">
                  Bientôt disponible
                </span>
              )}
            </label>
          );
        })}
      </div>

      {/* Informations de sécurité */}
      <div className="text-xs text-gray-500 bg-gray-800/50 rounded-lg p-3 mt-4">
        <p className="font-medium text-gray-400 mb-1">🔒 Paiement sécurisé</p>
        <p>Toutes les transactions sont cryptées et sécurisées. Vos données bancaires ne sont jamais stockées sur nos serveurs.</p>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
