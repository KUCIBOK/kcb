import RevealOnScroll from '../components/landing/RevealOnScroll'
import SectionLabel from '../components/landing/SectionLabel'
import GeoLine from '../components/landing/GeoLine'

export default function EthicChart() {
  return (
    <div
      className="min-h-screen bg-kcb-noir-deep text-white font-dm-sans"
      style={{ '--accent': '#C9A84C', '--accent-dark': '#8B6914' }}
    >
      {/* Header */}
      <section className="pt-40 pb-20 text-center px-6">
        <RevealOnScroll delay={0}>
          <SectionLabel text="Legal" />
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Charte <em className="text-[var(--accent)] not-italic">Éthique</em>
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <p className="text-kcb-sable text-[13px]">
            Curateurs &amp; Galeries — Engagement Professionnel
          </p>
          <p className="text-kcb-pierre text-[11px] mt-2">Dernière mise à jour : 28 juillet 2025</p>
        </RevealOnScroll>
      </section>

      <GeoLine />

      {/* Articles */}
      <section className="py-20 bg-kcb-noir-deep">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          {/* Préambule */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Préambule : L'Engagement Éthique au Cœur de Kucibok
              </h2>
              <p className="text-kcb-sable text-[13px] leading-relaxed">
                La plateforme Kucibok s'est construite sur les principes de la transparence, du
                respect et de la promotion de l'art et du patrimoine culturel. Cette charte définit
                les engagements éthiques et professionnels que nous attendons de chaque curateur et
                galerie collaborant avec Kucibok. Elle sert de guide pour assurer une collaboration
                harmonieuse, respectueuse des artistes, de l'intégrité des œuvres, des droits des
                collectionneurs, et du patrimoine culturel mondial.
              </p>
            </article>
          </RevealOnScroll>

          {/* Article 1 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 1 : Objectif de la Charte – Bâtir un Écosystème de Confiance
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                <p>
                  Cette charte est la pierre angulaire de notre collaboration. Ses objectifs précis
                  sont de :
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                      Encadrement
                    </h3>
                    <p className="text-[11px] text-kcb-sable">
                      Cadrer les pratiques de curation, d'exposition et de vente en ligne
                    </p>
                  </div>
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                      Protection
                    </h3>
                    <p className="text-[11px] text-kcb-sable">
                      Protéger artistes et acheteurs contre abus et fraudes
                    </p>
                  </div>
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                      Responsabilité
                    </h3>
                    <p className="text-[11px] text-kcb-sable">
                      Promouvoir des pratiques équitables et culturellement respectueuses
                    </p>
                  </div>
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                      Traçabilité
                    </h3>
                    <p className="text-[11px] text-kcb-sable">
                      Renforcer la transparence dans le circuit des œuvres
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 2 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 2 : Engagements Éthiques – Agir avec Intégrité
              </h2>
              <div className="space-y-4">
                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium mb-3 text-[13px]">
                    2.1. Respect de l'Artiste
                  </h3>
                  <div className="text-kcb-sable text-[13px] space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                      <span>
                        Ne jamais proposer une œuvre sans l'accord exprès et documenté de l'artiste
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                      <span>Ne pas exiger d'exclusivité abusive ou contraignante</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                      <span>
                        Assurer une représentation fidèle du message et de l'histoire de l'œuvre
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium mb-3 text-[13px]">
                    2.2. Intégrité Intellectuelle
                  </h3>
                  <div className="text-kcb-sable text-[13px] space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                      <span>Éviter toute falsification, plagiat ou réinterprétation abusive</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                      <span>
                        Mentionner clairement sources, provenances et certificats d'authenticité
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium mb-3 text-[13px]">
                    2.3. Confidentialité et Loyauté
                  </h3>
                  <div className="text-kcb-sable text-[13px] space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                      <span>Ne pas divulguer d'informations privées sans autorisation écrite</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                      <span>Ne pas détourner les contacts ou opportunités générés par Kucibok</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 3 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 3 : Sélection et Valorisation des Œuvres
              </h2>
              <div className="space-y-4">
                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium mb-3 text-[13px]">
                    3.1. Critères de Sélection
                  </h3>
                  <p className="text-kcb-sable text-[13px]">
                    Évaluation artistique, patrimoniale ou culturelle sincère et professionnelle
                    basée sur des critères pertinents et non arbitraires.
                  </p>
                </div>

                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium mb-3 text-[13px]">
                    3.2. Objectivité et Représentativité
                  </h3>
                  <div className="text-kcb-sable text-[13px] space-y-2">
                    <p>Valoriser la diversité sous toutes ses formes :</p>
                    <div className="grid md:grid-cols-2 gap-2 text-[11px] text-kcb-sable">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Disciplines artistiques variées</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Diversité géographique</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Représentation générationnelle</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Absence de biais discriminatoires</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium mb-3 text-[13px]">
                    3.3. Absence de Pratiques Spéculatives
                  </h3>
                  <div className="text-kcb-sable text-[13px] space-y-2">
                    <p>Strictement prohibé :</p>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Manipulation des prix ou enchères fictives</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Ententes illicites avec collectionneurs</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Pratiques de "wash trading"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Schémas frauduleux d'influence des prix</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 4 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 4 : Respect des Législations
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                <div className="border border-[var(--accent)]/20 p-4">
                  <p className="text-kcb-sable text-[13px]">
                    <strong>Conformité inconditionnelle :</strong> Respect des lois du pays de
                    résidence, du Sénégal et de l'UE selon applicabilité.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                      Interdictions formelles
                    </h3>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Œuvres volées, contrefaites ou pillées</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Objets archéologiques non déclarés</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Biens culturels spoliés</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Provenance douteuse ou illicite</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                      Transparence obligatoire
                    </h3>
                    <p className="text-[11px] text-kcb-sable">
                      Information immédiate à Kucibok de tout contentieux, soupçon ou information
                      pertinente relative à l'authenticité ou la légalité d'une œuvre.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 5 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 5 : Responsabilités lors des Ventes
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                    Information des ventes
                  </h3>
                  <p className="text-[11px] text-kcb-sable">
                    Communication obligatoire à Kucibok de toute vente réalisée avec détails
                    nécessaires à la traçabilité.
                  </p>
                </div>
                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium mb-3 text-[13px]">
                    Protocole événementiel
                  </h3>
                  <p className="text-[11px] text-kcb-sable mb-3">
                    En cas de co-organisation d'événements, respect scrupuleux du protocole défini :
                  </p>
                  <div className="grid md:grid-cols-2 gap-2 text-[11px] text-kcb-sable">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                      <span>Fiches d'inventaire détaillées</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                      <span>Assurance durant transport/exposition</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                      <span>Conditions d'emballage sécurisées</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                      <span>Respect des délais convenus</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 6 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 6 : Engagement Culturel et Pédagogique
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                <p>
                  Kucibok encourage ses partenaires à s'engager activement dans la mission
                  culturelle :
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                      Médiation culturelle
                    </h3>
                    <p className="text-[11px] text-kcb-sable">
                      Webinaires, interviews, discussions, ateliers, conférences
                    </p>
                  </div>
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                      Contenus valorisants
                    </h3>
                    <p className="text-[11px] text-kcb-sable">
                      Fiches explicatives, analyses d'œuvres, articles, lives thématiques
                    </p>
                  </div>
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                      Approche pédagogique
                    </h3>
                    <p className="text-[11px] text-kcb-sable">
                      Démythifier l'art, rendre l'histoire accessible à tous
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 7 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 7 : Sanctions en cas de Manquement
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                <div className="border border-[var(--accent)]/20 p-4">
                  <p className="text-kcb-sable text-[13px]">
                    <strong>Sanctions possibles :</strong> Le non-respect de cette charte entraîne
                    des conséquences graves.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                      Sanctions immédiates
                    </h3>
                    <div className="space-y-1 text-[11px] text-kcb-sable">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Suspension temporaire ou définitive</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Annulation des expositions/ventes</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Perte d'accès à la plateforme</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                      Actions légales
                    </h3>
                    <div className="space-y-1 text-[11px] text-kcb-sable">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Poursuites civiles ou pénales</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Information des autorités</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
                        <span>Protection de la communauté</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 8 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 8 : Entrée en Vigueur et Adhésion
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                    Condition préalable
                  </h3>
                  <p className="text-[11px] text-kcb-sable">
                    L'engagement à respecter cette Charte Éthique est obligatoire pour toute
                    collaboration avec Kucibok.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">
                      Validation
                    </h3>
                    <p className="text-[11px] text-kcb-sable">
                      Signature ou acceptation électronique via l'interface de la plateforme
                    </p>
                  </div>
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium mb-2 text-[13px]">Durée</h3>
                    <p className="text-[11px] text-kcb-sable">
                      Effet immédiat et valide pour toute la durée de la collaboration
                    </p>
                  </div>
                </div>
                <div className="border border-[var(--accent)]/20 p-4">
                  <p className="text-kcb-sable text-[13px] text-center">
                    <strong>
                      En acceptant cette charte, le partenaire s'engage à œuvrer pour un marché de
                      l'art plus transparent, plus juste et plus respectueux de la création.
                    </strong>
                  </p>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Footer */}
          <RevealOnScroll>
            <div className="pt-8 border-t border-white/[0.06] text-center">
              <p className="text-kcb-pierre text-[11px]">
                Cette Charte Éthique est établie à Dakar, Sénégal, le 28 juillet 2025.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  )
}
