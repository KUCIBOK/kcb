import RevealOnScroll from '../components/landing/RevealOnScroll'
import SectionLabel from '../components/landing/SectionLabel'
import GeoLine from '../components/landing/GeoLine'

/**
 * Privacy Policy page — RGPD compliant.
 * Uses Layout (main Header/Footer) with Africa (gold) accent theme.
 *
 * @returns {JSX.Element}
 */
export default function PrivacyPolicy() {
  return (
    <div
      className="min-h-screen bg-kcb-noir-deep text-white font-dm-sans"
      style={{ '--accent': '#C9A84C', '--accent-dark': '#8B6914' }}
    >
      {/* ── HEADER ── */}
      <section className="pt-40 pb-20 text-center">
        <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
          <RevealOnScroll>
            <SectionLabel text="Legal" />
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 className="font-playfair font-bold text-[clamp(32px,4vw,52px)] text-white mt-6 mb-4 leading-tight">
              Politique de Confidentialite
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="text-[13px] text-kcb-pierre">
              Kucibok — Protection de vos donnees personnelles
            </p>
            <p className="text-[11px] text-kcb-pierre/60 mt-2">
              Derniere mise a jour : 28 juillet 2025
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <GeoLine />

      {/* ── ARTICLES ── */}
      <section className="py-20 bg-kcb-noir-deep">
        <div className="max-w-4xl mx-auto px-[clamp(24px,5vw,80px)] space-y-10">
          {/* Section 1 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                1. Introduction : Votre Confiance, Notre Priorite
              </h2>
              <p className="text-kcb-sable text-[13px] leading-relaxed">
                Chez Kucibok, nous accordons une importance primordiale a la protection de votre vie
                privee et a la securite de vos donnees personnelles. Cette Politique de
                Confidentialite vous informe de maniere transparente sur la collecte, l'utilisation,
                le partage et la protection de vos informations. Notre engagement est de traiter vos
                donnees avec le plus grand soin, en respectant les normes les plus strictes en
                matiere de confidentialite et de securite.
              </p>
            </article>
          </RevealOnScroll>

          {/* Section 2 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                2. Portee de la Politique
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                <p>Cette politique s'applique a tous les utilisateurs de Kucibok :</p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="border border-white/[0.06] p-3">
                    <strong className="text-[var(--accent)]">Artistes</strong>
                    <p className="text-[11px] mt-1">Createurs et promoteurs d'oeuvres</p>
                  </div>
                  <div className="border border-white/[0.06] p-3">
                    <strong className="text-[var(--accent)]">Collectionneurs</strong>
                    <p className="text-[11px] mt-1">Passionnes et acquereurs d'art</p>
                  </div>
                  <div className="border border-white/[0.06] p-3">
                    <strong className="text-[var(--accent)]">Professionnels</strong>
                    <p className="text-[11px] mt-1">Galeries, experts, curateurs</p>
                  </div>
                </div>
                <p>
                  Elle couvre l'ensemble de nos services : applications web, solutions SaaS,
                  certification numerique, gamification, ventes en ligne et abonnements.
                </p>
              </div>
            </article>
          </RevealOnScroll>

          {/* Section 3 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                3. Informations que Nous Recueillons
              </h2>
              <div className="space-y-4">
                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium text-sm mb-3">
                    3.1 Donnees fournies directement
                  </h3>
                  <div className="text-kcb-sable text-[13px] space-y-2">
                    {[
                      'Informations de compte : nom, prenom, email, telephone',
                      'Profil utilisateur : biographie, portfolio, informations professionnelles',
                      'Oeuvres : images, titres, dimensions, techniques, prix',
                      'Communications : messages, support client, feedbacks',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium text-sm mb-3">
                    3.2 Donnees collectees automatiquement
                  </h3>
                  <div className="text-kcb-sable text-[13px] space-y-2">
                    {[
                      'Informations techniques : IP, navigateur, appareil, OS',
                      'Comportement web : pages visitees, duree de session, clics',
                      'Cookies et technologies de suivi',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium text-sm mb-3">
                    3.3 Informations de tiers
                  </h3>
                  <div className="text-kcb-sable text-[13px] space-y-2">
                    {[
                      'Donnees de partenaires (logistique, assurance, certification)',
                      'Synchronisation reseaux sociaux (OAuth)',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Section 4 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                4. Objectifs du Traitement
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  {
                    title: 'Services essentiels',
                    text: "Gestion de compte, publication d'oeuvres, certification numerique, generation NFT",
                  },
                  {
                    title: 'Communication',
                    text: 'Notifications, newsletters, support client reactif',
                  },
                  {
                    title: 'Personnalisation',
                    text: 'Suggestions personnalisees, analyse comportementale',
                  },
                  {
                    title: 'Marketing',
                    text: 'Offres ciblees, programme de gamification (avec consentement)',
                  },
                ].map((item, i) => (
                  <div key={i} className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium text-sm mb-2">{item.title}</h3>
                    <p className="text-kcb-sable text-[11px]">{item.text}</p>
                  </div>
                ))}
              </div>
            </article>
          </RevealOnScroll>

          {/* Section 5 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                5. Partage des Donnees
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                <div className="border border-[var(--accent)]/20 p-4">
                  <p>
                    <strong>Engagement ferme :</strong> Nous ne vendons ni ne louons vos donnees
                    personnelles a des tiers a des fins commerciales.
                  </p>
                </div>
                <p>Nous pouvons partager vos donnees uniquement dans ces cas :</p>
                {[
                  'Prestataires techniques (paiement, hebergement, logistique)',
                  'Partenaires contractuels (avec votre consentement explicite)',
                  'Autorites legales (demandes legales valides)',
                  'Autres utilisateurs (fonctionnalites collaboratives)',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
          </RevealOnScroll>

          {/* Section 6 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                6. Conservation des Donnees
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium text-sm mb-2">
                    Donnees de compte
                  </h3>
                  <p className="text-kcb-sable text-[11px]">
                    Conservees tant que votre compte est actif et selon les obligations legales
                  </p>
                </div>
                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium text-sm mb-2">
                    Donnees comportementales
                  </h3>
                  <p className="text-kcb-sable text-[11px]">
                    Maximum 24 mois, puis anonymisation pour analyses statistiques
                  </p>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Section 7 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                7. Vos Droits (RGPD & Loi Senegalaise)
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: "Droit d'acces", text: 'Obtenir une copie de vos donnees' },
                  { title: 'Droit de rectification', text: 'Corriger les donnees inexactes' },
                  { title: "Droit a l'effacement", text: 'Supprimer vos donnees' },
                  { title: 'Droit de limitation', text: 'Limiter le traitement' },
                  { title: "Droit d'opposition", text: "S'opposer au traitement" },
                  { title: 'Droit de portabilite', text: 'Recuperer vos donnees' },
                ].map((item, i) => (
                  <div key={i} className="border border-white/[0.06] p-3">
                    <strong className="text-[var(--accent)] text-sm">{item.title}</strong>
                    <p className="text-kcb-sable text-[11px] mt-1">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="border border-white/[0.06] p-4 mt-4">
                <p className="text-kcb-sable text-[13px]">
                  Pour exercer vos droits :{' '}
                  <a
                    href="mailto:privacy@kucibok.com"
                    className="text-[var(--accent)] hover:opacity-80 underline"
                  >
                    privacy@kucibok.com
                  </a>
                </p>
              </div>
            </article>
          </RevealOnScroll>

          {/* Section 8 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                8. Cookies et Technologies Similaires
              </h2>
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                {[
                  {
                    title: 'Cookies de session',
                    text: 'Temporaires, disparaissent a la fermeture du navigateur',
                  },
                  {
                    title: 'Cookies persistants',
                    text: 'Memorisent vos preferences et maintiennent la connexion',
                  },
                  {
                    title: "Outils d'analyse",
                    text: "Google Analytics, Matomo pour comprendre l'usage",
                  },
                  { title: 'Pixels de suivi', text: "Mesure de l'efficacite des campagnes" },
                ].map((item, i) => (
                  <div key={i} className="border border-white/[0.06] p-3">
                    <strong className="text-[var(--accent)] text-sm">{item.title}</strong>
                    <p className="text-kcb-sable text-[11px] mt-1">{item.text}</p>
                  </div>
                ))}
              </div>
              <p className="text-kcb-pierre text-[11px]">
                Vous pouvez gerer vos preferences via les parametres de votre navigateur.
              </p>
            </article>
          </RevealOnScroll>

          {/* Section 9 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                9. Securite des Donnees
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  {
                    title: 'Chiffrement',
                    text: 'Protocoles SSL/TLS pour toutes les transmissions sensibles',
                  },
                  {
                    title: 'Acces restreint',
                    text: 'Limite aux employes autorises selon leurs fonctions',
                  },
                  {
                    title: 'Privacy by Design',
                    text: 'Protection integree des la conception de nos services',
                  },
                  {
                    title: 'Hebergement securise',
                    text: 'Serveurs conformes aux normes ISO-27001, SOC-2',
                  },
                ].map((item, i) => (
                  <div key={i} className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium text-sm mb-2">{item.title}</h3>
                    <p className="text-kcb-sable text-[11px]">{item.text}</p>
                  </div>
                ))}
              </div>
            </article>
          </RevealOnScroll>

          {/* Section 10 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                10. Transfert International de Donnees
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                <p>
                  Vos donnees peuvent etre traitees hors du Senegal via nos prestataires techniques.
                  Nous garantissons :
                </p>
                {[
                  'Clauses contractuelles types approuvees',
                  'Certificats de conformite reconnus',
                  'Niveau de protection equivalent aux standards RGPD',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
          </RevealOnScroll>

          {/* Section 11 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                11. Enfants et Mineurs
              </h2>
              <div className="border border-[var(--accent)]/20 p-4">
                <p className="text-kcb-sable text-[13px]">
                  Kucibok n'est pas destine aux personnes de moins de 18 ans. Nous ne collectons pas
                  sciemment d'informations personnelles aupres des mineurs. Si vous pensez qu'un
                  mineur nous a fourni des donnees, contactez-nous immediatement a{' '}
                  <a
                    href="mailto:privacy@kucibok.com"
                    className="text-[var(--accent)] hover:opacity-80 underline"
                  >
                    privacy@kucibok.com
                  </a>
                  .
                </p>
              </div>
            </article>
          </RevealOnScroll>

          {/* Section 12 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                12. Liens Externes
              </h2>
              <p className="text-kcb-sable text-[13px] leading-relaxed">
                Nos services peuvent contenir des liens vers des sites tiers. Nous n'exercons aucun
                controle sur leurs pratiques de confidentialite. Nous vous encourageons a consulter
                leur politique de confidentialite avant de fournir toute information personnelle.
              </p>
            </article>
          </RevealOnScroll>

          {/* Section 13 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                13. Modifications de la Politique
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                <p>
                  Nous pouvons modifier cette politique a tout moment pour refleter les changements
                  dans nos pratiques ou la legislation.
                </p>
                <div className="border border-white/[0.06] p-4">
                  <p>
                    En cas de modifications majeures, nous vous informerons par notification sur la
                    plateforme ou par email. La version publiee sur notre site sera toujours la
                    version valide.
                  </p>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Section 14 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                14. Contacts et Responsabilite
              </h2>
              <div className="border border-white/[0.06] p-4">
                <div className="text-kcb-sable text-[13px] space-y-2">
                  <div>
                    <strong className="text-white">Kucibok SARL</strong>
                  </div>
                  <div>
                    Adresse : Liberte 6 Ext, Rue Ambassade de France, Villa 24, Dakar, Senegal
                  </div>
                  <div>
                    Email confidentialite :{' '}
                    <a
                      href="mailto:msidibe@kucibok.com"
                      className="text-[var(--accent)] hover:opacity-80"
                    >
                      msidibe@kucibok.com
                    </a>
                  </div>
                  <div>
                    DPO :{' '}
                    <a
                      href="mailto:msidibe@kucibok.com"
                      className="text-[var(--accent)] hover:opacity-80"
                    >
                      msidibe@kucibok.com
                    </a>
                  </div>
                  <div>
                    Telephone :{' '}
                    <a href="tel:+2212750918" className="text-[var(--accent)] hover:opacity-80">
                      +221 275 09 18
                    </a>
                  </div>
                </div>
              </div>
              <p className="text-kcb-pierre text-[11px] mt-4">
                En cas de litige non resolu, vous pouvez deposer une plainte aupres de la Commission
                de Protection des Donnees Personnelles (CDPD) du Senegal.
              </p>
            </article>
          </RevealOnScroll>

          {/* Section 15 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                15. Resolution des Litiges
              </h2>
              <p className="text-kcb-sable text-[13px] leading-relaxed">
                Toute contestation relative a cette politique sera soumise aux termes de nos
                Conditions Generales d'Utilisation. La loi applicable sera celle du Senegal ou celle
                du pays de localisation de l'utilisateur. Nous privilegions une resolution amiable
                des differends avant tout recours a la mediation ou l'arbitrage.
              </p>
            </article>
          </RevealOnScroll>

          {/* Footer */}
          <div className="pt-8 border-t border-white/[0.06] text-center">
            <p className="text-kcb-pierre text-[11px]">
              Cette Politique de Confidentialite est etablie a Dakar, Senegal, le 28 juillet 2025.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
