import { useEffect } from "react"

export default function EthicChart() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="min-h-screen bg-gray-900 text-white/90">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Charte Éthique Kucibok
                    </h1>
                    <p className="text-white/60 text-sm">
                        Curateurs & Galeries – Engagement Professionnel
                    </p>
                    <p className="text-white/50 text-xs mt-2">
                        Dernière mise à jour : 28 juillet 2025
                    </p>
                </div>

                {/* Préambule */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        Préambule : L'Engagement Éthique au Cœur de Kucibok
                    </h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        La plateforme Kucibok s'est construite sur les principes de la transparence, du respect et de la promotion de l'art et du patrimoine culturel. Cette charte définit les engagements éthiques et professionnels que nous attendons de chaque curateur et galerie collaborant avec Kucibok. Elle sert de guide pour assurer une collaboration harmonieuse, respectueuse des artistes, de l'intégrité des œuvres, des droits des collectionneurs, et du patrimoine culturel mondial.
                    </p>
                </div>

                {/* Articles */}
                <div className="space-y-10">
                    {/* Article 1 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 1 : Objectif de la Charte – Bâtir un Écosystème de Confiance
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Cette charte est la pierre angulaire de notre collaboration. Ses objectifs précis sont de :</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-indigo-900/20 rounded p-4">
                                    <h4 className="text-indigo-300 font-medium mb-2">Encadrement</h4>
                                    <p className="text-xs">Cadrer les pratiques de curation, d'exposition et de vente en ligne</p>
                                </div>
                                <div className="bg-green-900/20 rounded p-4">
                                    <h4 className="text-green-300 font-medium mb-2">Protection</h4>
                                    <p className="text-xs">Protéger artistes et acheteurs contre abus et fraudes</p>
                                </div>
                                <div className="bg-purple-900/20 rounded p-4">
                                    <h4 className="text-purple-300 font-medium mb-2">Responsabilité</h4>
                                    <p className="text-xs">Promouvoir des pratiques équitables et culturellement respectueuses</p>
                                </div>
                                <div className="bg-amber-900/20 rounded p-4">
                                    <h4 className="text-amber-300 font-medium mb-2">Traçabilité</h4>
                                    <p className="text-xs">Renforcer la transparence dans le circuit des œuvres</p>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 2 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 2 : Engagements Éthiques – Agir avec Intégrité
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-blue-900/20 rounded p-4">
                                <h4 className="text-blue-300 font-medium mb-3">2.1. Respect de l'Artiste</h4>
                                <div className="text-white/70 text-sm space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Ne jamais proposer une œuvre sans l'accord exprès et documenté de l'artiste</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Ne pas exiger d'exclusivité abusive ou contraignante</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Assurer une représentation fidèle du message et de l'histoire de l'œuvre</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-900/20 rounded p-4">
                                <h4 className="text-purple-300 font-medium mb-3">2.2. Intégrité Intellectuelle</h4>
                                <div className="text-white/70 text-sm space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Éviter toute falsification, plagiat ou réinterprétation abusive</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Mentionner clairement sources, provenances et certificats d'authenticité</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-900/20 rounded p-4">
                                <h4 className="text-green-300 font-medium mb-3">2.3. Confidentialité et Loyauté</h4>
                                <div className="text-white/70 text-sm space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Ne pas divulguer d'informations privées sans autorisation écrite</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Ne pas détourner les contacts ou opportunités générés par Kucibok</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 3 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 3 : Sélection et Valorisation des Œuvres
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-indigo-900/20 rounded p-4">
                                <h4 className="text-indigo-300 font-medium mb-3">3.1. Critères de Sélection</h4>
                                <p className="text-white/70 text-sm">Évaluation artistique, patrimoniale ou culturelle sincère et professionnelle basée sur des critères pertinents et non arbitraires.</p>
                            </div>

                            <div className="bg-amber-900/20 rounded p-4">
                                <h4 className="text-amber-300 font-medium mb-3">3.2. Objectivité et Représentativité</h4>
                                <div className="text-white/70 text-sm space-y-2">
                                    <p>Valoriser la diversité sous toutes ses formes :</p>
                                    <div className="grid md:grid-cols-2 gap-2 text-xs">
                                        <div>• Disciplines artistiques variées</div>
                                        <div>• Diversité géographique</div>
                                        <div>• Représentation générationnelle</div>
                                        <div>• Absence de biais discriminatoires</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-900/20 rounded p-4">
                                <h4 className="text-red-300 font-medium mb-3">3.3. Absence de Pratiques Spéculatives</h4>
                                <div className="text-white/70 text-sm space-y-2">
                                    <div className="text-red-200">Strictement prohibé :</div>
                                    <div className="text-xs space-y-1">
                                        <div>• Manipulation des prix ou enchères fictives</div>
                                        <div>• Ententes illicites avec collectionneurs</div>
                                        <div>• Pratiques de "wash trading"</div>
                                        <div>• Schémas frauduleux d'influence des prix</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 4 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 4 : Respect des Législations
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <div className="bg-amber-900/20 border border-amber-700/30 rounded p-4">
                                <p className="text-amber-200"><strong>Conformité inconditionnelle :</strong> Respect des lois du pays de résidence, du Sénégal et de l'UE selon applicabilité.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-red-900/20 rounded p-4">
                                    <h4 className="text-red-300 font-medium mb-2">Interdictions formelles</h4>
                                    <div className="text-xs space-y-1">
                                        <div>• Œuvres volées, contrefaites ou pillées</div>
                                        <div>• Objets archéologiques non déclarés</div>
                                        <div>• Biens culturels spoliés</div>
                                        <div>• Provenance douteuse ou illicite</div>
                                    </div>
                                </div>
                                <div className="bg-green-900/20 rounded p-4">
                                    <h4 className="text-green-300 font-medium mb-2">Transparence obligatoire</h4>
                                    <p className="text-xs">Information immédiate à Kucibok de tout contentieux, soupçon ou information pertinente relative à l'authenticité ou la légalité d'une œuvre.</p>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 5 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 5 : Responsabilités lors des Ventes
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-4">
                            <div className="bg-blue-900/20 rounded p-4">
                                <h4 className="text-blue-300 font-medium mb-2">Information des ventes</h4>
                                <p className="text-xs">Communication obligatoire à Kucibok de toute vente réalisée avec détails nécessaires à la traçabilité.</p>
                            </div>
                            <div className="bg-purple-900/20 rounded p-4">
                                <h4 className="text-purple-300 font-medium mb-3">Protocole événementiel</h4>
                                <p className="text-xs mb-2">En cas de co-organisation d'événements, respect scrupuleux du protocole défini :</p>
                                <div className="grid md:grid-cols-2 gap-2 text-xs">
                                    <div>• Fiches d'inventaire détaillées</div>
                                    <div>• Assurance durant transport/exposition</div>
                                    <div>• Conditions d'emballage sécurisées</div>
                                    <div>• Respect des délais convenus</div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 6 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 6 : Engagement Culturel et Pédagogique
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-4">
                            <p>Kucibok encourage ses partenaires à s'engager activement dans la mission culturelle :</p>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-green-900/20 rounded p-4">
                                    <h4 className="text-green-300 font-medium mb-2">Médiation culturelle</h4>
                                    <p className="text-xs">Webinaires, interviews, discussions, ateliers, conférences</p>
                                </div>
                                <div className="bg-blue-900/20 rounded p-4">
                                    <h4 className="text-blue-300 font-medium mb-2">Contenus valorisants</h4>
                                    <p className="text-xs">Fiches explicatives, analyses d'œuvres, articles, lives thématiques</p>
                                </div>
                                <div className="bg-purple-900/20 rounded p-4">
                                    <h4 className="text-purple-300 font-medium mb-2">Approche pédagogique</h4>
                                    <p className="text-xs">Démythifier l'art, rendre l'histoire accessible à tous</p>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 7 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 7 : Sanctions en cas de Manquement
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-4">
                            <div className="bg-red-900/20 border border-red-700/30 rounded p-4">
                                <p className="text-red-200 text-sm"><strong>Sanctions possibles :</strong> Le non-respect de cette charte entraîne des conséquences graves.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-red-900/20 rounded p-4">
                                    <h4 className="text-red-300 font-medium mb-2">Sanctions immédiates</h4>
                                    <div className="text-xs space-y-1">
                                        <div>• Suspension temporaire ou définitive</div>
                                        <div>• Annulation des expositions/ventes</div>
                                        <div>• Perte d'accès à la plateforme</div>
                                    </div>
                                </div>
                                <div className="bg-amber-900/20 rounded p-4">
                                    <h4 className="text-amber-300 font-medium mb-2">Actions légales</h4>
                                    <div className="text-xs space-y-1">
                                        <div>• Poursuites civiles ou pénales</div>
                                        <div>• Information des autorités</div>
                                        <div>• Protection de la communauté</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 8 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 8 : Entrée en Vigueur et Adhésion
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-4">
                            <div className="bg-indigo-900/20 rounded p-4">
                                <h4 className="text-indigo-300 font-medium mb-2">Condition préalable</h4>
                                <p className="text-xs">L'engagement à respecter cette Charte Éthique est obligatoire pour toute collaboration avec Kucibok.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-green-900/20 rounded p-4">
                                    <h4 className="text-green-300 font-medium mb-2">Validation</h4>
                                    <p className="text-xs">Signature ou acceptation électronique via l'interface de la plateforme</p>
                                </div>
                                <div className="bg-purple-900/20 rounded p-4">
                                    <h4 className="text-purple-300 font-medium mb-2">Durée</h4>
                                    <p className="text-xs">Effet immédiat et valide pour toute la durée de la collaboration</p>
                                </div>
                            </div>
                            <div className="bg-blue-900/20 border border-blue-700/30 rounded p-4 mt-4">
                                <p className="text-blue-200 text-sm text-center">
                                    <strong>En acceptant cette charte, le partenaire s'engage à œuvrer pour un marché de l'art plus transparent, plus juste et plus respectueux de la création.</strong>
                                </p>
                            </div>
                        </div>
                    </article>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                    <p className="text-white/50 text-xs">
                        Cette Charte Éthique est établie à Dakar, Sénégal, le 28 juillet 2025.
                    </p>
                </div>
            </div>
        </div>
    )
}