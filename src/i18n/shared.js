export const sharedT = {
  fr: {
    artworksList: {
      // Column headers
      colPreview: 'Aperçu',
      colTitle: 'Titre',
      colArtist: 'Artiste',
      colCreated: 'Créé',
      colAcquired: 'Acquis le',
      colStatus: 'Statut',
      colPrice: 'Prix',
      colVisited: 'Visitée',
      colEtherscan: 'Etherscan',
      colCertificate: 'Certificat',
      colActions: 'Actions',

      // Status labels
      statusApproved: 'Approuvée',
      statusPending: 'En attente',
      statusRejected: 'Refusée',

      // Etherscan cell
      etherscanSee: 'Voir',
      etherscanPending: 'À venir',

      // Empty state
      emptyMessage: 'Aucune œuvre trouvée',
      emptyNoArtwork: "Vous n'avez pas encore soumis d'œuvre.",
      emptySubmitBtn: 'Soumettre une première œuvre',
    },

    artworkCard: {
      // Certification badge
      certifiedBadge: 'Certifié KCB',

      // Hover CTA
      viewArtwork: "Voir l'œuvre",
    },

    delivery: {
      // Header
      heading: 'Interface Logistique Mondiale',
      subheading: 'Powered by Logidoo API - Livraison dans le monde entier',
      btnSync: 'Synchroniser avec Logidoo',
      btnSyncing: 'Synchronisation...',

      // Sync result
      syncSuccess: (n) => `Synchronisé: ${n} livraisons`,
      syncError: 'Erreur de synchronisation',

      // Stats cards
      statsTotal: 'Total',
      statsPending: 'En attente',
      statsInPreparation: 'En préparation',
      statsInTransit: 'En transit',
      statsDelivered: 'Livrées',

      // Form — section heading
      formHeading: 'Demande de Cotation',

      // Form — field labels / placeholders
      labelDeliveryZone: 'Pays/Zone de livraison',
      optionSelectZone: 'Sélectionnez votre destination',
      optionLoadingZones: 'Chargement des zones...',
      labelPickupPoint: 'Point de retrait (optionnel)',
      optionDeliveryToAddress: "Livraison à l'adresse",
      labelDeliveryAddress: 'Adresse de livraison',
      placeholderAddress: 'Adresse complète, Ville, Code Postal',
      labelRecipientName: 'Nom du destinataire',
      placeholderName: 'Nom complet',
      labelPhone: 'Téléphone',
      placeholderPhone: 'Numéro international',
      labelCollectDate: 'Date de collecte',
      labelDeliveryDate: 'Date de livraison',
      labelSize: 'Taille',
      sizeSmall: 'Petit',
      sizeMedium: 'Moyen',
      sizeLarge: 'Grand',
      labelWeight: 'Poids (kg)',
      labelPriority: 'Priorité',
      priorityStandard: 'Standard',
      priorityPriority: 'Prioritaire',
      priorityExpress: 'Express',

      // Rate calculation
      btnCalculate: 'Calculer la cotation',
      btnCalculating: 'Calcul...',
      rateLabel: 'Tarif estimé:',
      rateDelay: (days) => `Délai estimé: ${days}`,
      rateApprox: '* Tarif approximatif',

      // Submit button
      btnSubmit: "Créer l'expedition",
      btnSubmitting: 'Création en cours...',

      // Validation errors
      errorNoArtwork: 'Vous devez choisir au moins une œuvre',
      errorNoDates: 'Les dates de collecte et livraison sont obligatoires',
      errorNoRecipient: 'Le nom et téléphone du destinataire sont obligatoires',
      errorCreate: 'Erreur lors de la création',

      // Success message
      successCreated: (tracking) =>
        `Expedition créée! ${tracking ? 'Tracking: ' + tracking : '(Données de test)'}`,

      // History table
      historyHeading: 'Historique des expeditions',
      colTracking: 'Tracking',
      colRecipient: 'Destinataire',
      colZone: 'Zone',
      colStatus: 'Statut',
      colDate: 'Date',

      // Delivery status labels (history table)
      statusPending: 'En attente',
      statusInPreparation: 'En préparation',
      statusOnTheWay: 'En transit',
      statusDelivered: 'Livrée',

      // Empty history
      emptyHistory: 'Aucune expedition trouvée',
      emptyHistorySub: 'Créez votre première expedition ci-dessus',
    },

    support: {
      // Page heading
      heading: 'Support & Tickets',
      btnNewTicket: 'Nouveau ticket',

      // Ticket list empty state
      emptyTickets: 'Aucun ticket',
      emptyCreateLink: 'Créer un ticket →',

      // Ticket detail — placeholder
      selectTicket: 'Sélectionnez un ticket',

      // Ticket detail — history
      historyHeading: (n) => `Historique (${n})`,

      // Reply textarea
      placeholderReply: 'Votre réponse...',
      btnSend: 'Envoyer',

      // Create modal
      modalHeading: 'Créer un ticket',
      labelCategory: 'Catégorie',
      labelPriority: 'Priorité',
      labelSubject: 'Sujet',
      placeholderSubject: 'Résumé du problème...',
      labelDescription: 'Description',
      placeholderDescription: 'Décrivez votre problème...',
      btnCancel: 'Annuler',
      btnCreate: 'Créer',
      btnCreating: 'Création...',

      // Loading
      loading: 'Chargement...',

      // Categories
      catPayment: '💳 Paiement',
      catDelivery: '🚚 Livraison',
      catArtwork: '🎨 Œuvre',
      catAccount: '👤 Compte',
      catAuctions: '⚒️ Enchères',
      catOther: '❓ Autre',

      // Priorities
      priorityLow: 'Basse',
      priorityNormal: 'Normale',
      priorityHigh: 'Haute',
      priorityCritical: 'Critique',
    },
  },

  en: {
    artworksList: {
      // Column headers
      colPreview: 'Preview',
      colTitle: 'Title',
      colArtist: 'Artist',
      colCreated: 'Created',
      colAcquired: 'Acquired on',
      colStatus: 'Status',
      colPrice: 'Price',
      colVisited: 'Views',
      colEtherscan: 'Etherscan',
      colCertificate: 'Certificate',
      colActions: 'Actions',

      // Status labels
      statusApproved: 'Approved',
      statusPending: 'Pending',
      statusRejected: 'Rejected',

      // Etherscan cell
      etherscanSee: 'View',
      etherscanPending: 'Coming soon',

      // Empty state
      emptyMessage: 'No artworks found',
      emptyNoArtwork: "You haven't submitted any artwork yet.",
      emptySubmitBtn: 'Submit your first artwork',
    },

    artworkCard: {
      // Certification badge
      certifiedBadge: 'KCB Certified',

      // Hover CTA
      viewArtwork: 'View artwork',
    },

    delivery: {
      // Header
      heading: 'Global Logistics Interface',
      subheading: 'Powered by Logidoo API - Worldwide delivery',
      btnSync: 'Sync with Logidoo',
      btnSyncing: 'Syncing...',

      // Sync result
      syncSuccess: (n) => `Synced: ${n} deliveries`,
      syncError: 'Sync error',

      // Stats cards
      statsTotal: 'Total',
      statsPending: 'Pending',
      statsInPreparation: 'In preparation',
      statsInTransit: 'In transit',
      statsDelivered: 'Delivered',

      // Form — section heading
      formHeading: 'Quote Request',

      // Form — field labels / placeholders
      labelDeliveryZone: 'Country / Delivery zone',
      optionSelectZone: 'Select your destination',
      optionLoadingZones: 'Loading zones...',
      labelPickupPoint: 'Pickup point (optional)',
      optionDeliveryToAddress: 'Deliver to address',
      labelDeliveryAddress: 'Delivery address',
      placeholderAddress: 'Full address, City, Postal Code',
      labelRecipientName: 'Recipient name',
      placeholderName: 'Full name',
      labelPhone: 'Phone',
      placeholderPhone: 'International number',
      labelCollectDate: 'Collection date',
      labelDeliveryDate: 'Delivery date',
      labelSize: 'Size',
      sizeSmall: 'Small',
      sizeMedium: 'Medium',
      sizeLarge: 'Large',
      labelWeight: 'Weight (kg)',
      labelPriority: 'Priority',
      priorityStandard: 'Standard',
      priorityPriority: 'Priority',
      priorityExpress: 'Express',

      // Rate calculation
      btnCalculate: 'Calculate quote',
      btnCalculating: 'Calculating...',
      rateLabel: 'Estimated rate:',
      rateDelay: (days) => `Estimated time: ${days}`,
      rateApprox: '* Approximate rate',

      // Submit button
      btnSubmit: 'Create shipment',
      btnSubmitting: 'Creating...',

      // Validation errors
      errorNoArtwork: 'You must select at least one artwork',
      errorNoDates: 'Collection and delivery dates are required',
      errorNoRecipient: 'Recipient name and phone are required',
      errorCreate: 'Error while creating',

      // Success message
      successCreated: (tracking) =>
        `Shipment created! ${tracking ? 'Tracking: ' + tracking : '(Test data)'}`,

      // History table
      historyHeading: 'Shipment history',
      colTracking: 'Tracking',
      colRecipient: 'Recipient',
      colZone: 'Zone',
      colStatus: 'Status',
      colDate: 'Date',

      // Delivery status labels (history table)
      statusPending: 'Pending',
      statusInPreparation: 'In preparation',
      statusOnTheWay: 'In transit',
      statusDelivered: 'Delivered',

      // Empty history
      emptyHistory: 'No shipments found',
      emptyHistorySub: 'Create your first shipment above',
    },

    support: {
      // Page heading
      heading: 'Support & Tickets',
      btnNewTicket: 'New ticket',

      // Ticket list empty state
      emptyTickets: 'No tickets',
      emptyCreateLink: 'Create a ticket →',

      // Ticket detail — placeholder
      selectTicket: 'Select a ticket',

      // Ticket detail — history
      historyHeading: (n) => `History (${n})`,

      // Reply textarea
      placeholderReply: 'Your reply...',
      btnSend: 'Send',

      // Create modal
      modalHeading: 'Create a ticket',
      labelCategory: 'Category',
      labelPriority: 'Priority',
      labelSubject: 'Subject',
      placeholderSubject: 'Summary of the issue...',
      labelDescription: 'Description',
      placeholderDescription: 'Describe your issue...',
      btnCancel: 'Cancel',
      btnCreate: 'Create',
      btnCreating: 'Creating...',

      // Loading
      loading: 'Loading...',

      // Categories
      catPayment: '💳 Payment',
      catDelivery: '🚚 Delivery',
      catArtwork: '🎨 Artwork',
      catAccount: '👤 Account',
      catAuctions: '⚒️ Auctions',
      catOther: '❓ Other',

      // Priorities
      priorityLow: 'Low',
      priorityNormal: 'Normal',
      priorityHigh: 'High',
      priorityCritical: 'Critical',
    },
  },
}
