export const globalT = {
  en: {
    nav: {
      home: 'Home',
      catalogue: 'Catalogue',
      logistics: 'Logistics',
      sourcing: 'Sourcing',
      pricing: 'Pricing',
      cta: 'Sign Up',
      switchPortal: 'Tu es Artiste?',
    },
    hero: {
      label: 'Professional SaaS Infrastructure',
      title1: 'Professional Infrastructure for',
      title2: 'African Art',
      titleAccent: 'at Scale',
      subtitle:
        'Trade, scale, and manage African art on one integrated platform. Complete infrastructure for curators, advisors, and institutions.',
      cta1: 'Explore Platform',
      cta2: 'Request Demo',
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
      title: 'Africa to the World',
      desc: 'Museum-grade packing. Climate-controlled transport. Customs clearance. Real-time tracking. One fully managed corridor.',
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
      title: 'Source Vetted African Art',
      desc: "Curate exhibitions. Build collections. Scout galleries. We connect you with verified artists and handle every step from selection to delivery.",
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
      label: 'Professional Pricing',
      title: 'Plans for Every Role',
      subtitle:
        'All plans include certified catalogue access, logistics integration, and certification tools.',
      plans: [
        {
          name: 'Curator Plan',
          desc: 'For individual curators & small galleries',
          price: '21-49',
          priceSuffix: ' EUR',
          period: 'per month',
          features: [
            'Inventory Management Dashboard',
            'Digital Certification & Provenance',
            'Logistics Integration',
            'Valuation & Analytics',
            'Dedicated Support',
          ],
          cta: { label: 'Start Free Trial', to: '/sign-up' },
        },
        {
          name: 'Advisor Plan',
          desc: 'For art advisors & portfolio managers',
          price: '49-99',
          priceSuffix: ' EUR',
          period: 'per month',
          features: [
            'Client Portfolio Management',
            'Curated Deal Flow & Sourcing',
            'Market Intelligence Dashboard',
            'Secure Transaction Management',
            'Commission Tracking & Reporting',
          ],
          cta: { label: 'Start Free Trial', to: '/sign-up' },
        },
        {
          name: 'Enterprise',
          desc: 'For institutions & large operations',
          price: 'Custom',
          period: 'Let\'s talk',
          features: [
            'Everything in Curator + Advisor',
            'Multi-entity Governance',
            'API Access & Integration',
            'Dedicated Account Manager',
            'Custom Integrations',
          ],
          featured: true,
          cta: { label: 'Request Demo', to: '/contact' },
        },
      ],
    },
    cta: {
      heading: 'Start Scaling Now',
      sub: 'Join professionals trading certified African art on Kucibok.',
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
      switchPortal: 'Tu es Artiste?',
    },
    hero: {
      label: 'Infrastructure Professionnelle',
      title1: "L'Infrastructure Professionnelle pour",
      title2: "l'Art Africain",
      titleAccent: 'à Échelle',
      subtitle:
        "Commercer, développer et gérer l'art africain sur une seule plateforme. Infrastructure complète pour curateurs, conseillers et institutions.",
      cta1: 'Découvrir la Plateforme',
      cta2: 'Demander une Démo',
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
      title: "L'Afrique vers le Monde",
      desc: "Emballage muséal. Transport climatisé. Dédouanement. Tracking temps réel. Un corridor entièrement géré.",
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
      title: "Sourcez l'Art Africain Vérifié",
      desc: "Curez des expositions. Constituez des collections. Explorez les galeries. Nous connectons vous à des artistes vérifiés et gérons chaque étape.",
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
      label: 'Tarification Professionnelle',
      title: 'Plans pour Chaque Rôle',
      subtitle:
        "Tous les plans incluent l'accès au catalogue certifié, l'intégration logistique et les outils de certification.",
      plans: [
        {
          name: 'Plan Curateur',
          desc: 'Pour les curateurs indépendants et petites galeries',
          price: '21-49',
          priceSuffix: ' EUR',
          period: 'par mois',
          features: [
            'Tableau de bord de Gestion d\'Inventaire',
            'Certification & Provenance Numériques',
            'Intégration Logistique',
            'Évaluation & Analyse',
            'Support Dédié',
          ],
          cta: { label: 'Commencer l\'Essai Gratuit', to: '/sign-up' },
        },
        {
          name: 'Plan Conseiller',
          desc: 'Pour les conseillers en art et gestionnaires de portefeuille',
          price: '49-99',
          priceSuffix: ' EUR',
          period: 'par mois',
          features: [
            'Gestion du Portefeuille Client',
            'Flux d\'Affaires & Sourçage Curés',
            'Tableau de Bord Intelligence Marché',
            'Gestion Transactions Sécurisée',
            'Suivi & Rapports Commissions',
          ],
          cta: { label: 'Commencer l\'Essai Gratuit', to: '/sign-up' },
        },
        {
          name: 'Enterprise',
          desc: 'Pour les institutions et grandes opérations',
          price: 'Personnalisé',
          period: 'Parlons-en',
          features: [
            'Tout dans Plan Curateur + Conseiller',
            'Gouvernance Multi-Entités',
            'Accès API & Intégrations',
            'Gestionnaire de Compte Dédié',
            'Intégrations Sur-Mesure',
          ],
          featured: true,
          cta: { label: 'Demander une Démo', to: '/contact' },
        },
      ],
    },
    cta: {
      heading: 'Commencez à Développer',
      sub: "Rejoignez les professionnels qui commercent l'art africain certifié sur Kucibok.",
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
