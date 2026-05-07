export const globalT = {
  en: {
    nav: {
      home: 'Home',
      catalogue: 'Catalogue',
      logistics: 'Logistics',
      sourcing: 'Sourcing',
      pricing: 'Pricing',
      cta: 'Sign Up',
      switchPortal: 'Portail Afrique',
    },
    hero: {
      label: 'Global Portal',
      title1: 'The Standard for',
      title2: 'African Art',
      titleAccent: 'Circulation',
      subtitle:
        'Access a curated catalogue of certified African contemporary art. Every piece verified. Every artist documented. Every shipment insured.',
      cta1: 'Browse Catalogue',
      cta2: 'Request Sourcing',
    },
    pillars: [
      {
        num: '01',
        title: 'KCB Certification',
        text: 'Unique identifier, provenance record, certificate of authenticity. Verified by our expert team.',
      },
      {
        num: '02',
        title: 'Door-to-Door Logistics',
        text: 'Specialized art shipping from West Africa to Europe. Insurance, customs, real-time tracking.',
      },
      {
        num: '03',
        title: 'B2B Sourcing',
        text: 'Access our network of verified African artists for exhibitions, fairs, and private collections.',
      },
    ],
    catalogue: {
      label: 'Certified Collection',
      title: 'Curated, Not Aggregated',
      linkLabel: 'View full catalogue',
    },
    logistics: {
      label: 'Global Logistics Network',
      title: 'Africa to the World — Every Continent, One Standard',
      desc: 'Museum-grade packing, climate-controlled transport, customs clearance, and last-mile delivery. From Dakar to Dubai, Abidjan to Tokyo — one fully managed corridor.',
      cta: 'Estimate in seconds',
      steps: [
        {
          num: '01',
          title: 'Collection',
          desc: "Pickup from artist's studio or gallery in West Africa",
        },
        {
          num: '02',
          title: 'Professional Packing',
          desc: 'Museum-grade materials, custom crating for large pieces',
        },
        {
          num: '03',
          title: 'Customs & Transit',
          desc: 'Export/import clearance, insured transport, real-time tracking',
        },
        {
          num: '04',
          title: 'Delivery',
          desc: 'White-glove delivery to gallery, collector, or venue',
        },
      ],
    },
    sourcing: {
      label: 'B2B Sourcing',
      title: 'Source African Art for Your Programme',
      desc: "Whether you're curating an exhibition, building a corporate collection, or scouting for a gallery programme — we connect you with verified African artists and handle everything from selection to delivery.",
      cta: 'Request Sourcing',
      features: [
        {
          title: 'Curated Selection',
          text: 'We match your brief with artists from our certified network.',
          icon: 'M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z',
        },
        {
          title: 'Full Documentation',
          text: 'Provenance records, certificates, artist portfolios.',
          icon: 'M14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zM8 8h4M8 12h2',
        },
        {
          title: 'End-to-End Logistics',
          text: 'Studio to exhibition space. Packing, shipping, customs.',
          icon: 'M10 2a8 8 0 100 16 8 8 0 000-16zM2 10h16M10 2c2 2.5 3 5 3 8s-1 5.5-3 8c-2-2.5-3-5-3-8s1-5.5 3-8z',
        },
        {
          title: 'Dedicated Account Manager',
          text: 'Single point of contact. Fluent in both art markets.',
          icon: 'M10 10a8 8 0 100-16 8 8 0 000 16zM10 6v4l3 3',
        },
      ],
    },
    pricing: {
      label: 'Pricing',
      title: 'Choose Your Access Level',
      subtitle:
        'From browsing to institutional sourcing. Every plan includes access to the certified catalogue.',
      plans: [
        {
          name: 'Explorer',
          desc: 'Browse and connect with artists',
          price: 'Free',
          period: 'No commitment',
          features: [
            'Browse certified artworks',
            'View artist profiles',
            'Verify KCB certificates',
            'Request information',
          ],
          cta: { label: 'Get Started', to: '/sign-up' },
        },
        {
          name: 'Collector',
          desc: 'Full access with priority logistics',
          price: '27',
          priceSuffix: ' EUR',
          period: 'per month',
          features: [
            'Everything in Explorer',
            'Purchase certified artworks',
            'Priority logistics booking',
            'Dedicated account manager',
            'Provenance reports',
          ],
          featured: true,
          cta: { label: 'Start Collecting', to: '/sign-up' },
        },
        {
          name: 'Institution',
          desc: 'Galleries, museums, corporate',
          price: 'Custom',
          period: 'Annual contract',
          features: [
            'Everything in Collector',
            'B2B sourcing access',
            'Exhibition logistics',
            'Volume discounts',
            'API integration',
          ],
          cta: { label: 'Contact Sales', to: '/contact' },
        },
      ],
    },
    cta: {
      heading: 'Access the Collection',
      sub: 'Join collectors, curators, and institutions sourcing certified African art through the Kucibok standard.',
      primary: 'Create Account',
      secondary: 'Contact Sales',
    },
    simulator: {
      label: 'Quote Simulator',
      title: 'Estimate your shipment in seconds',
      desc: "Select your origin, destination, and artwork parameters. We'll break down every cost — transport, insurance, customs, and packing — before you commit to anything.",
      step1: '01 — Shipment Parameters',
      step2: '02 — Cost Breakdown',
      originLabel: 'Origin',
      destLabel: 'Destination',
      typeLabel: 'Artwork type',
      valueLabel: 'Declared value',
      sizeLabel: 'Artwork size (largest dimension)',
      valueRangeLabel: 'Value range',
      rows: {
        transport: 'International transport',
        packing: 'Museum-grade packing',
        insurance: 'Declared value insurance',
        importFees: 'Customs & transit fees',
        kucibok: 'Kucibok Bridge fee',
        total: 'Estimated total',
      },
      transitTo: 'Estimated transit to',
      cert: 'KCB certificate of authenticity',
      tracking: 'Real-time tracking',
      included: 'included',
      cta: 'Get a formal quote',
      disclaimer:
        'Indicative estimate. Formal binding quote within 24h. Customs fees may vary depending on the exact customs classification of the artwork.',
    },
    footer: {
      description:
        'The standard for African art certification and cross-border circulation. Curated catalogue, certified provenance, door-to-door logistics.',
      columns: [
        {
          title: 'Platform',
          links: [
            { label: 'Home', to: '/global' },
            { label: 'Catalogue', to: '/global/catalogue' },
            { label: 'Sourcing', to: '/global/sourcing' },
            { label: 'Artists', to: '/global/artists' },
          ],
        },
        {
          title: 'Resources',
          links: [
            { label: 'Blog', to: '/global/blog' },
            { label: 'FAQ', to: '/global/faq' },
            { label: 'Contact', to: '/global/contact' },
            { label: 'About', to: '/global/about' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { label: 'Privacy Policy', to: '/privacy-policy' },
            { label: 'Terms', to: '/terms-and-conditions' },
            { label: 'Sales Conditions', to: '/sales-conditions' },
            { label: 'Ethics Charter', to: '/ethic-chart' },
          ],
        },
      ],
      copyright: 'Kucibok — Certified African Art',
      privacy: 'Privacy',
      terms: 'Terms',
    },
  },

  fr: {
    nav: {
      home: 'Accueil',
      catalogue: 'Catalogue',
      logistics: 'Logistique',
      sourcing: 'Sourcing',
      pricing: 'Tarifs',
      cta: 'Inscription',
      switchPortal: 'Portail Afrique',
    },
    hero: {
      label: 'Portail Global',
      title1: 'Le Standard de',
      title2: "l'Art Africain",
      titleAccent: 'Circulation',
      subtitle:
        "Accédez à un catalogue sélectionné d'art africain contemporain certifié. Chaque pièce vérifiée. Chaque artiste documenté. Chaque expédition assurée.",
      cta1: 'Parcourir le Catalogue',
      cta2: 'Demander un Sourcing',
    },
    pillars: [
      {
        num: '01',
        title: 'Certification KCB',
        text: "Identifiant unique, fiche de provenance, certificat d'authenticité. Vérifié par notre équipe d'experts.",
      },
      {
        num: '02',
        title: 'Logistique Porte-à-Porte',
        text: "Transport d'art spécialisé d'Afrique de l'Ouest vers l'Europe. Assurance, douanes, tracking temps réel.",
      },
      {
        num: '03',
        title: 'Sourcing B2B',
        text: "Accédez à notre réseau d'artistes africains vérifiés pour vos expositions, foires et collections privées.",
      },
    ],
    catalogue: {
      label: 'Collection Certifiée',
      title: 'Sélectionné, Pas Agrégé',
      linkLabel: 'Voir le catalogue complet',
    },
    logistics: {
      label: 'Réseau Logistique Global',
      title: "L'Afrique vers le Monde — Tous les Continents, Un Seul Standard",
      desc: "Emballage muséal, transport climatisé, dédouanement et livraison dernier kilomètre. De Dakar à Dubaï, d'Abidjan à Tokyo — un corridor entièrement géré.",
      cta: 'Estimer en quelques secondes',
      steps: [
        {
          num: '01',
          title: 'Collecte',
          desc: "Enlèvement depuis l'atelier de l'artiste ou la galerie en Afrique de l'Ouest",
        },
        {
          num: '02',
          title: 'Emballage Professionnel',
          desc: 'Matériaux de qualité muséale, caisses sur mesure pour les grandes pièces',
        },
        {
          num: '03',
          title: 'Douanes & Transit',
          desc: 'Dédouanement export/import, transport assuré, tracking temps réel',
        },
        {
          num: '04',
          title: 'Livraison',
          desc: "Livraison white-glove en galerie, chez le collectionneur ou sur le lieu d'exposition",
        },
      ],
    },
    sourcing: {
      label: 'Sourcing B2B',
      title: "Sourcez l'Art Africain pour Votre Programme",
      desc: "Que vous curiez une exposition, constituiez une collection d'entreprise ou cherchiez pour un programme de galerie — nous vous connectons à des artistes africains vérifiés et gérons tout de la sélection à la livraison.",
      cta: 'Demander un Sourcing',
      features: [
        {
          title: 'Sélection sur mesure',
          text: 'Nous associons votre brief à des artistes de notre réseau certifié.',
          icon: 'M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z',
        },
        {
          title: 'Documentation complète',
          text: "Fiches de provenance, certificats, portfolios d'artistes.",
          icon: 'M14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zM8 8h4M8 12h2',
        },
        {
          title: 'Logistique de bout en bout',
          text: "De l'atelier à l'espace d'exposition. Emballage, transport, douanes.",
          icon: 'M10 2a8 8 0 100 16 8 8 0 000-16zM2 10h16M10 2c2 2.5 3 5 3 8s-1 5.5-3 8c-2-2.5-3-5-3-8s1-5.5 3-8z',
        },
        {
          title: 'Gestionnaire de compte dédié',
          text: "Interlocuteur unique. Maîtrise des deux marchés de l'art.",
          icon: 'M10 10a8 8 0 100-16 8 8 0 000 16zM10 6v4l3 3',
        },
      ],
    },
    pricing: {
      label: 'Tarifs',
      title: "Choisissez Votre Niveau d'Accès",
      subtitle:
        "De la navigation à l'acquisition institutionnelle. Chaque plan inclut l'accès au catalogue certifié.",
      plans: [
        {
          name: 'Explorer',
          desc: 'Parcourez et connectez-vous avec les artistes',
          price: 'Gratuit',
          period: 'Sans engagement',
          features: [
            'Parcourir les œuvres certifiées',
            "Voir les profils d'artistes",
            'Vérifier les certificats KCB',
            'Demander des informations',
          ],
          cta: { label: 'Commencer', to: '/sign-up' },
        },
        {
          name: 'Collector',
          desc: 'Accès complet avec logistique prioritaire',
          price: '27',
          priceSuffix: ' EUR',
          period: 'par mois',
          features: [
            'Tout dans Explorer',
            'Acheter des œuvres certifiées',
            'Réservation logistique prioritaire',
            'Gestionnaire de compte dédié',
            'Rapports de provenance',
          ],
          featured: true,
          cta: { label: 'Commencer à Collecter', to: '/sign-up' },
        },
        {
          name: 'Institution',
          desc: 'Galeries, musées, entreprises',
          price: 'Sur devis',
          period: 'Contrat annuel',
          features: [
            'Tout dans Collector',
            'Accès sourcing B2B',
            "Logistique d'exposition",
            'Remises sur volume',
            'Intégration API',
          ],
          cta: { label: 'Contacter les Ventes', to: '/contact' },
        },
      ],
    },
    cta: {
      heading: 'Accéder à la Collection',
      sub: "Rejoignez les collectionneurs, curateurs et institutions qui sourcent l'art africain certifié via le standard Kucibok.",
      primary: 'Créer un Compte',
      secondary: 'Contacter les Ventes',
    },
    simulator: {
      label: 'Simulateur de Cotation',
      title: 'Estimez votre expédition en quelques secondes',
      desc: "Sélectionnez votre origine, destination et les paramètres de l'œuvre. Nous détaillerons chaque coût — transport, assurance, douanes et emballage — avant tout engagement.",
      step1: "01 — Paramètres d'Expédition",
      step2: '02 — Détail des Coûts',
      originLabel: 'Origine',
      destLabel: 'Destination',
      typeLabel: "Type d'œuvre",
      valueLabel: 'Valeur déclarée',
      sizeLabel: "Taille de l'œuvre (dimension principale)",
      valueRangeLabel: 'Plage de valeur',
      rows: {
        transport: 'Transport international',
        packing: 'Emballage muséal',
        insurance: 'Assurance valeur déclarée',
        importFees: 'Frais douane & transit',
        kucibok: 'Kucibok Bridge fee',
        total: 'Total estimé',
      },
      transitTo: 'Transit estimé vers',
      cert: "Certificat d'authenticité KCB",
      tracking: 'Tracking en temps réel',
      included: 'inclus',
      cta: 'Obtenir une cotation formelle',
      disclaimer:
        "Estimation indicative. Cotation précise et contractuelle sous 24h. Les frais de douane peuvent varier selon la classification douanière exacte de l'œuvre.",
    },
    footer: {
      description:
        "Le standard pour la certification et la circulation transfrontalière de l'art africain. Catalogue sélectionné, provenance certifiée, logistique porte-à-porte.",
      columns: [
        {
          title: 'Plateforme',
          links: [
            { label: 'Accueil', to: '/global' },
            { label: 'Catalogue', to: '/global/catalogue' },
            { label: 'Sourcing', to: '/global/sourcing' },
            { label: 'Artistes', to: '/global/artists' },
          ],
        },
        {
          title: 'Ressources',
          links: [
            { label: 'Blog', to: '/global/blog' },
            { label: 'FAQ', to: '/global/faq' },
            { label: 'Contact', to: '/global/contact' },
            { label: 'À propos', to: '/global/about' },
          ],
        },
        {
          title: 'Légal',
          links: [
            { label: 'Confidentialité', to: '/privacy-policy' },
            { label: 'CGU', to: '/terms-and-conditions' },
            { label: 'CGV', to: '/sales-conditions' },
            { label: 'Charte éthique', to: '/ethic-chart' },
          ],
        },
      ],
      copyright: 'Kucibok — Art Africain Certifié',
      privacy: 'Confidentialité',
      terms: 'CGU',
    },
  },
}
