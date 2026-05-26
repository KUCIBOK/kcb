export const buyerT = {
  fr: {
    profile: {
      // Tabs
      tabPersonal: 'Informations personnelles',
      tabInterests: 'Préférences',
      tabSecurity: 'Sécurité',

      // Personal tab — field labels & placeholders
      labelName: 'Nom complet',
      labelUsername: 'Pseudo',
      labelPhone: 'Téléphone',
      placeholderPhone: 'Votre numéro de téléphone',
      labelEmail: 'Email',
      labelCountry: 'Pays',

      // Interests tab
      labelArtisticInterests: 'Intérêts artistiques',
      placeholderInterests: 'Parlez-nous de vos préférences',

      // Security tab
      headingPassword: 'Changer le mot de passe',
      headingWallet: 'Portefeuille',
      labelWalletAddress: 'Adresse wallet',
      labelPrivateKey: 'Clé privée',
      titleCopyKey: 'Copier la clé privée',
      warningPrivateKey: 'Ne partagez jamais votre clé privée.',

      // Avatar section
      btnChangePhoto: 'Modifier la photo',
      labelAccountCreated: 'Compte créé',

      // Submit
      btnSave: 'Enregistrer les modifications',

      // Validation errors
      errorImageSize: "L'image ne doit pas dépasser 5 Mo.",
      errorInvalidEmail: 'Adresse email invalide.',
      errorInterestsTooShort: 'Les intérêts doivent contenir au moins 20 caractères.',
      errorSave: 'Erreur lors de la sauvegarde.',
      successUpdate: 'Profil mis à jour !',
    },

    certificates: {
      // Header
      heading: 'Mes Certificats KCB',
      subheading: "Certificats d'authenticité des œuvres de votre collection",

      // KPI labels
      kpiTotal: 'Œuvres totales',
      kpiCertified: 'Certifiées KCB',
      kpiPending: 'En attente',

      // Badges
      badgeCertified: 'Certifiée',
      badgeNotCertified: 'Non certifiée',

      // Pending certificate label
      noCertYet: 'Certificat non encore émis',

      // Tooltips
      titleVerify: 'Vérifier le certificat',
      titleDownload: 'Télécharger le PDF',

      // Empty state
      emptyTitle: 'Aucun certificat',
      emptyDescription:
        "Vous n'avez pas encore d'œuvres certifiées dans votre collection. Achetez une œuvre certifiée KCB pour voir vos certificats ici.",
      emptyAction: 'Explorer le marketplace',
    },

    synthesis: {
      // KPI labels
      kpiArtworks: 'Œuvres achetées',
      kpiValue: 'Valeur totale collection',
      kpiDeliveries: 'Livraisons actives',
      kpiPlan: 'Plan actuel',

      // Quick actions section
      headingActions: 'Actions rapides',
      linkExplore: 'Explorer le marketplace',

      // Last acquisitions
      headingAcquisitions: 'Dernières acquisitions',
      noTitle: 'Sans titre',
      emptyAcqTitle: 'Aucune acquisition',
      emptyAcqDescription:
        "Vous n'avez pas encore acheté d'œuvre. Explorez le marketplace pour commencer votre collection.",
      emptyAcqAction: 'Explorer le marketplace',

      // Active deliveries
      headingDeliveries: 'Livraisons en cours',
      deliveryTrack: 'Suivre →',
      unknownDestination: 'Destination inconnue',
      deliveryDefaultTitle: (id) => `Livraison #${id}`,
      emptyDeliveryTitle: 'Aucune livraison active',
      emptyDeliveryDescription: "Vous n'avez pas de livraison en cours pour le moment.",

      // Delivery status badges
      statusPending: 'En attente',
      statusProcessing: 'En cours',
      statusShipped: 'Expédiée',
      statusInTransit: 'En transit',
      statusDelivered: 'Livrée',
    },

    subscription: {
      // Header
      heading: 'Mon Abonnement',
      subheading: 'Gérez votre plan et votre expérience de collectionneur',
      btnViewPlans: 'Voir les plans',

      // Current plan card
      badgeCurrent: 'Actuel',
      badgeActive: 'Actif',
      priceFree: 'Gratuit pour toujours',
      pricePerMonth: (price) => `${price} CFA/mois`,
      labelNextBilling: 'Prochaine facturation',

      // Limit alert
      alertLimitTitle: 'Limite atteinte!',
      alertLimitDesc:
        'Vous avez atteint les limites de votre plan. Passez à un plan supérieur pour continuer.',
      alertLimitUpgrade: (name) => `Passer à ${name}`,

      // Usage stats
      headingFavorites: 'Favoris',
      headingViews: 'Vues Collection',
      labelUsage: 'Utilisation',
      kpiPurchases: 'Achats effectués',
      kpiPurchasesSub: 'oeuvres acquises',

      // Upgrade recommendation
      headingUpgrade: "Recommandation d'upgrade",
      upgradeDesc: (name) =>
        `Vous avez utilisé plus de 80% de vos ressources. Passez à ${name} pour bénéficier de:`,
      btnUpgrade: (name, price) => `Passer à ${name} - ${price} CFA/mois`,

      // Included features
      headingIncluded: 'Inclus dans votre plan',

      // Subscription history
      headingHistory: 'Historique',
      historyStarted: 'Abonnement démarré',
      badgeActiveHistory: 'Actif',
      historyTotalSpent: 'Total dépensé',
      historyMonths: (n) => `${n} mois d'abonnement`,

      // Free CTA
      ctaTitle: 'Débloquez votre potentiel de collectionneur',
      ctaDesc:
        "Avec un abonnement premium, accédez à plus de favoris, des ventes privées et des outils d'analyse de votre collection.",
      ctaBtn: 'Voir les plans premium',

      // Plan names
      planFree: 'Gratuit',
      planEnthusiast: 'Enthousiaste',
      planBuyer: 'Acheteur',
      planInvestor: 'Investisseur',

      // Plan features
      featuresFree: [
        '20 favoris maximum',
        '100 vues de collection',
        'Notifications basiques',
        'Support par email',
      ],
      featuresEnthusiast: [
        '100 favoris',
        '1000 vues de collection',
        'Notifications avancées',
        'Alertes prix',
        'Historique complet',
      ],
      featuresBuyer: [
        'Favoris illimités',
        'Vues illimitées',
        'Notifications en temps réel',
        'Accès aux ventes privées',
        "Estimation d'oeuvres",
        'Conseiller dédié',
      ],
      featuresInvestor: [
        'Tout illimité',
        'Ventes exclusives',
        'Analytique portfolio',
        'Rapports mensuels',
        'Conseiller VIP',
        'Formation art',
      ],
    },
  },

  en: {
    profile: {
      // Tabs
      tabPersonal: 'Personal information',
      tabInterests: 'Preferences',
      tabSecurity: 'Security',

      // Personal tab — field labels & placeholders
      labelName: 'Full name',
      labelUsername: 'Username',
      labelPhone: 'Phone',
      placeholderPhone: 'Your phone number',
      labelEmail: 'Email',
      labelCountry: 'Country',

      // Interests tab
      labelArtisticInterests: 'Artistic interests',
      placeholderInterests: 'Tell us about your preferences',

      // Security tab
      headingPassword: 'Change password',
      headingWallet: 'Wallet',
      labelWalletAddress: 'Wallet address',
      labelPrivateKey: 'Private key',
      titleCopyKey: 'Copy private key',
      warningPrivateKey: 'Never share your private key.',

      // Avatar section
      btnChangePhoto: 'Change photo',
      labelAccountCreated: 'Account created',

      // Submit
      btnSave: 'Save changes',

      // Validation errors
      errorImageSize: 'Image must not exceed 5 MB.',
      errorInvalidEmail: 'Invalid email address.',
      errorInterestsTooShort: 'Interests must contain at least 20 characters.',
      errorSave: 'Error while saving.',
      successUpdate: 'Profile updated!',
    },

    certificates: {
      // Header
      heading: 'My KCB Certificates',
      subheading: 'Authenticity certificates for artworks in your collection',

      // KPI labels
      kpiTotal: 'Total artworks',
      kpiCertified: 'KCB Certified',
      kpiPending: 'Pending',

      // Badges
      badgeCertified: 'Certified',
      badgeNotCertified: 'Not certified',

      // Pending certificate label
      noCertYet: 'Certificate not yet issued',

      // Tooltips
      titleVerify: 'Verify certificate',
      titleDownload: 'Download PDF',

      // Empty state
      emptyTitle: 'No certificates',
      emptyDescription:
        'You have no certified artworks in your collection yet. Purchase a KCB-certified artwork to see your certificates here.',
      emptyAction: 'Explore the marketplace',
    },

    synthesis: {
      // KPI labels
      kpiArtworks: 'Artworks purchased',
      kpiValue: 'Total collection value',
      kpiDeliveries: 'Active deliveries',
      kpiPlan: 'Current plan',

      // Quick actions section
      headingActions: 'Quick actions',
      linkExplore: 'Explore the marketplace',

      // Last acquisitions
      headingAcquisitions: 'Latest acquisitions',
      noTitle: 'Untitled',
      emptyAcqTitle: 'No acquisitions',
      emptyAcqDescription:
        "You haven't purchased any artwork yet. Explore the marketplace to start your collection.",
      emptyAcqAction: 'Explore the marketplace',

      // Active deliveries
      headingDeliveries: 'Ongoing deliveries',
      deliveryTrack: 'Track →',
      unknownDestination: 'Unknown destination',
      deliveryDefaultTitle: (id) => `Delivery #${id}`,
      emptyDeliveryTitle: 'No active deliveries',
      emptyDeliveryDescription: 'You have no ongoing deliveries at the moment.',

      // Delivery status badges
      statusPending: 'Pending',
      statusProcessing: 'Processing',
      statusShipped: 'Shipped',
      statusInTransit: 'In transit',
      statusDelivered: 'Delivered',
    },

    subscription: {
      // Header
      heading: 'My Subscription',
      subheading: 'Manage your plan and collector experience',
      btnViewPlans: 'View plans',

      // Current plan card
      badgeCurrent: 'Current',
      badgeActive: 'Active',
      priceFree: 'Free forever',
      pricePerMonth: (price) => `${price} CFA/month`,
      labelNextBilling: 'Next billing date',

      // Limit alert
      alertLimitTitle: 'Limit reached!',
      alertLimitDesc:
        "You've reached the limits of your plan. Upgrade to a higher plan to continue.",
      alertLimitUpgrade: (name) => `Upgrade to ${name}`,

      // Usage stats
      headingFavorites: 'Favorites',
      headingViews: 'Collection Views',
      labelUsage: 'Usage',
      kpiPurchases: 'Purchases made',
      kpiPurchasesSub: 'artworks acquired',

      // Upgrade recommendation
      headingUpgrade: 'Upgrade recommendation',
      upgradeDesc: (name) =>
        `You've used more than 80% of your resources. Upgrade to ${name} to benefit from:`,
      btnUpgrade: (name, price) => `Upgrade to ${name} - ${price} CFA/month`,

      // Included features
      headingIncluded: 'Included in your plan',

      // Subscription history
      headingHistory: 'History',
      historyStarted: 'Subscription started',
      badgeActiveHistory: 'Active',
      historyTotalSpent: 'Total spent',
      historyMonths: (n) => `${n} month(s) of subscription`,

      // Free CTA
      ctaTitle: 'Unlock your collector potential',
      ctaDesc:
        'With a premium subscription, access more favorites, private sales and collection analytics tools.',
      ctaBtn: 'View premium plans',

      // Plan names
      planFree: 'Free',
      planEnthusiast: 'Enthusiast',
      planBuyer: 'Buyer',
      planInvestor: 'Investor',

      // Plan features
      featuresFree: [
        'Up to 20 favorites',
        '100 collection views',
        'Basic notifications',
        'Email support',
      ],
      featuresEnthusiast: [
        '100 favorites',
        '1,000 collection views',
        'Advanced notifications',
        'Price alerts',
        'Full history',
      ],
      featuresBuyer: [
        'Unlimited favorites',
        'Unlimited views',
        'Real-time notifications',
        'Access to private sales',
        'Artwork valuation',
        'Dedicated advisor',
      ],
      featuresInvestor: [
        'Everything unlimited',
        'Exclusive sales',
        'Portfolio analytics',
        'Monthly reports',
        'VIP advisor',
        'Art training',
      ],
    },
  },
}
