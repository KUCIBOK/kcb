import { useEffect } from "react";

export default function PrivacyPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="min-h-screen bg-gray-900 text-white/90">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Politique de Confidentialité
                    </h1>
                    <p className="text-white/60 text-sm">
                        Kucibok – Protection de vos données personnelles
                    </p>
                    <p className="text-white/50 text-xs mt-2">
                        Dernière mise à jour : 28 juillet 2025
                    </p>
                </div>

                {/* Articles */}
                <div className="space-y-10">
                    {/* Section 1 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            1. Introduction : Votre Confiance, Notre Priorité
                        </h2>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Chez Kucibok, nous accordons une importance primordiale à la protection de votre vie privée et à la sécurité de vos données personnelles. Cette Politique de Confidentialité vous informe de manière transparente sur la collecte, l'utilisation, le partage et la protection de vos informations. Notre engagement est de traiter vos données avec le plus grand soin, en respectant les normes les plus strictes en matière de confidentialité et de sécurité.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            2. Portée de la Politique
                        </h2>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Cette politique s'applique à tous les utilisateurs de Kucibok :</p>
                            <div className="grid md:grid-cols-3 gap-3">
                                <div className="bg-indigo-900/20 rounded p-3">
                                    <strong className="text-indigo-300">Artistes</strong>
                                    <p className="text-xs mt-1">Créateurs et promoteurs d'œuvres</p>
                                </div>
                                <div className="bg-purple-900/20 rounded p-3">
                                    <strong className="text-purple-300">Collectionneurs</strong>
                                    <p className="text-xs mt-1">Passionnés et acquéreurs d'art</p>
                                </div>
                                <div className="bg-green-900/20 rounded p-3">
                                    <strong className="text-green-300">Professionnels</strong>
                                    <p className="text-xs mt-1">Galeries, experts, curateurs</p>
                                </div>
                            </div>
                            <p>Elle couvre l'ensemble de nos services : applications web, solutions SaaS, certification numérique, gamification, ventes en ligne et abonnements.</p>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            3. Informations que Nous Recueillons
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-blue-900/20 rounded p-4">
                                <h3 className="text-blue-300 font-medium mb-3">3.1 Données fournies directement</h3>
                                <div className="text-white/70 text-sm space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Informations de compte : nom, prénom, email, téléphone</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Profil utilisateur : biographie, portfolio, informations professionnelles</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Œuvres : images, titres, dimensions, techniques, prix</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Communications : messages, support client, feedbacks</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-900/20 rounded p-4">
                                <h3 className="text-purple-300 font-medium mb-3">3.2 Données collectées automatiquement</h3>
                                <div className="text-white/70 text-sm space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Informations techniques : IP, navigateur, appareil, OS</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Comportement web : pages visitées, durée de session, clics</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Cookies et technologies de suivi</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-900/20 rounded p-4">
                                <h3 className="text-green-300 font-medium mb-3">3.3 Informations de tiers</h3>
                                <div className="text-white/70 text-sm space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Données de partenaires (logistique, assurance, certification)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Synchronisation réseaux sociaux (OAuth)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            4. Objectifs du Traitement
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-indigo-900/20 rounded p-4">
                                <h3 className="text-indigo-300 font-medium mb-2">Services essentiels</h3>
                                <p className="text-white/70 text-xs">Gestion de compte, publication d'œuvres, certification numérique, génération NFT</p>
                            </div>
                            <div className="bg-purple-900/20 rounded p-4">
                                <h3 className="text-purple-300 font-medium mb-2">Communication</h3>
                                <p className="text-white/70 text-xs">Notifications, newsletters, support client réactif</p>
                            </div>
                            <div className="bg-green-900/20 rounded p-4">
                                <h3 className="text-green-300 font-medium mb-2">Personnalisation</h3>
                                <p className="text-white/70 text-xs">Suggestions personnalisées, analyse comportementale</p>
                            </div>
                            <div className="bg-amber-900/20 rounded p-4">
                                <h3 className="text-amber-300 font-medium mb-2">Marketing</h3>
                                <p className="text-white/70 text-xs">Offres ciblées, programme de gamification (avec consentement)</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            5. Partage des Données
                        </h2>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <div className="bg-red-900/20 border border-red-700/30 rounded p-4 mb-4">
                                <p className="text-red-200"><strong>Engagement ferme :</strong> Nous ne vendons ni ne louons vos données personnelles à des tiers à des fins commerciales.</p>
                            </div>
                            <p>Nous pouvons partager vos données uniquement dans ces cas :</p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Prestataires techniques (paiement, hébergement, logistique)</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Partenaires contractuels (avec votre consentement explicite)</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Autorités légales (demandes légales valides)</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Autres utilisateurs (fonctionnalités collaboratives)</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            6. Conservation des Données
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-900/20 rounded p-4">
                                <h3 className="text-blue-300 font-medium mb-2">Données de compte</h3>
                                <p className="text-white/70 text-xs">Conservées tant que votre compte est actif et selon les obligations légales</p>
                            </div>
                            <div className="bg-purple-900/20 rounded p-4">
                                <h3 className="text-purple-300 font-medium mb-2">Données comportementales</h3>
                                <p className="text-white/70 text-xs">Maximum 24 mois, puis anonymisation pour analyses statistiques</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            7. Vos Droits (RGPD & Loi Sénégalaise)
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="bg-indigo-900/20 rounded p-3">
                                <strong className="text-indigo-300 text-sm">Droit d'accès</strong>
                                <p className="text-white/70 text-xs mt-1">Obtenir une copie de vos données</p>
                            </div>
                            <div className="bg-purple-900/20 rounded p-3">
                                <strong className="text-purple-300 text-sm">Droit de rectification</strong>
                                <p className="text-white/70 text-xs mt-1">Corriger les données inexactes</p>
                            </div>
                            <div className="bg-green-900/20 rounded p-3">
                                <strong className="text-green-300 text-sm">Droit à l'effacement</strong>
                                <p className="text-white/70 text-xs mt-1">Supprimer vos données</p>
                            </div>
                            <div className="bg-amber-900/20 rounded p-3">
                                <strong className="text-amber-300 text-sm">Droit de limitation</strong>
                                <p className="text-white/70 text-xs mt-1">Limiter le traitement</p>
                            </div>
                            <div className="bg-red-900/20 rounded p-3">
                                <strong className="text-red-300 text-sm">Droit d'opposition</strong>
                                <p className="text-white/70 text-xs mt-1">S'opposer au traitement</p>
                            </div>
                            <div className="bg-blue-900/20 rounded p-3">
                                <strong className="text-blue-300 text-sm">Droit de portabilité</strong>
                                <p className="text-white/70 text-xs mt-1">Récupérer vos données</p>
                            </div>
                        </div>
                        <div className="bg-indigo-900/20 rounded p-4 mt-4">
                            <p className="text-indigo-200 text-sm">
                                Pour exercer vos droits : <a href="mailto:privacy@kucibok.com" className="text-indigo-400 hover:text-indigo-300 underline">privacy@kucibok.com</a>
                            </p>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            8. Cookies et Technologies Similaires
                        </h2>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-green-900/20 rounded p-3">
                                    <strong className="text-green-300">Cookies de session</strong>
                                    <p className="text-xs mt-1">Temporaires, disparaissent à la fermeture du navigateur</p>
                                </div>
                                <div className="bg-blue-900/20 rounded p-3">
                                    <strong className="text-blue-300">Cookies persistants</strong>
                                    <p className="text-xs mt-1">Mémorisent vos préférences et maintiennent la connexion</p>
                                </div>
                                <div className="bg-purple-900/20 rounded p-3">
                                    <strong className="text-purple-300">Outils d'analyse</strong>
                                    <p className="text-xs mt-1">Google Analytics, Matomo pour comprendre l'usage</p>
                                </div>
                                <div className="bg-amber-900/20 rounded p-3">
                                    <strong className="text-amber-300">Pixels de suivi</strong>
                                    <p className="text-xs mt-1">Mesure de l'efficacité des campagnes</p>
                                </div>
                            </div>
                            <p className="text-xs">Vous pouvez gérer vos préférences via les paramètres de votre navigateur.</p>
                        </div>
                    </section>

                    {/* Section 9 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            9. Sécurité des Données
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-green-900/20 rounded p-4">
                                <h3 className="text-green-300 font-medium mb-2">Chiffrement</h3>
                                <p className="text-white/70 text-xs">Protocoles SSL/TLS pour toutes les transmissions sensibles</p>
                            </div>
                            <div className="bg-blue-900/20 rounded p-4">
                                <h3 className="text-blue-300 font-medium mb-2">Accès restreint</h3>
                                <p className="text-white/70 text-xs">Limité aux employés autorisés selon leurs fonctions</p>
                            </div>
                            <div className="bg-purple-900/20 rounded p-4">
                                <h3 className="text-purple-300 font-medium mb-2">Privacy by Design</h3>
                                <p className="text-white/70 text-xs">Protection intégrée dès la conception de nos services</p>
                            </div>
                            <div className="bg-indigo-900/20 rounded p-4">
                                <h3 className="text-indigo-300 font-medium mb-2">Hébergement sécurisé</h3>
                                <p className="text-white/70 text-xs">Serveurs conformes aux normes ISO-27001, SOC-2</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 10 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            10. Transfert International de Données
                        </h2>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Vos données peuvent être traitées hors du Sénégal via nos prestataires techniques. Nous garantissons :</p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Clauses contractuelles types approuvées</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Certificats de conformité reconnus</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Niveau de protection équivalent aux standards RGPD</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 11 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            11. Enfants et Mineurs
                        </h2>
                        <div className="bg-amber-900/20 border border-amber-700/30 rounded p-4">
                            <p className="text-amber-200 text-sm">
                                Kucibok n'est pas destiné aux personnes de moins de 18 ans. Nous ne collectons pas sciemment d'informations personnelles auprès des mineurs. Si vous pensez qu'un mineur nous a fourni des données, contactez-nous immédiatement à <a href="mailto:privacy@kucibok.com" className="text-amber-400 hover:text-amber-300 underline">privacy@kucibok.com</a>.
                            </p>
                        </div>
                    </section>

                    {/* Section 12 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            12. Liens Externes
                        </h2>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Nos services peuvent contenir des liens vers des sites tiers. Nous n'exerçons aucun contrôle sur leurs pratiques de confidentialité. Nous vous encourageons à consulter leur politique de confidentialité avant de fournir toute information personnelle.
                        </p>
                    </section>

                    {/* Section 13 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            13. Modifications de la Politique
                        </h2>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Nous pouvons modifier cette politique à tout moment pour refléter les changements dans nos pratiques ou la législation.</p>
                            <div className="bg-blue-900/20 rounded p-4">
                                <p className="text-blue-200 text-sm">En cas de modifications majeures, nous vous informerons par notification sur la plateforme ou par email. La version publiée sur notre site sera toujours la version valide.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 14 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            14. Contacts et Responsabilité
                        </h2>
                        <div className="bg-gray-800/50 rounded p-4">
                            <div className="text-white/70 text-sm space-y-2">
                                <div><strong className="text-white">Kucibok SARL</strong></div>
                                <div>Adresse : Liberté 6 Ext, Rue Ambassade de France, Villa 24, Dakar, Sénégal</div>
                                <div>Email confidentialité : <a href="mailto:msidibe@kucibok.com" className="text-indigo-400 hover:text-indigo-300">msidibe@kucibok.com</a></div>
                                <div>DPO : <a href="mailto:msidibe@kucibok.com" className="text-indigo-400 hover:text-indigo-300">msidibe@kucibok.com</a></div>
                                <div>Téléphone : <a href="tel:+2212750918" className="text-indigo-400 hover:text-indigo-300">+221 275 09 18</a></div>
                            </div>
                        </div>
                        <p className="text-white/60 text-xs mt-4">
                            En cas de litige non résolu, vous pouvez déposer une plainte auprès de la Commission de Protection des Données Personnelles (CDPD) du Sénégal.
                        </p>
                    </section>

                    {/* Section 15 */}
                    <section className="bg-gray-900/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            15. Résolution des Litiges
                        </h2>
                        <div className="text-white/70 text-sm leading-relaxed">
                            <p>Toute contestation relative à cette politique sera soumise aux termes de nos Conditions Générales d'Utilisation. La loi applicable sera celle du Sénégal ou celle du pays de localisation de l'utilisateur. Nous privilégions une résolution amiable des différends avant tout recours à la médiation ou l'arbitrage.</p>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                    <p className="text-white/50 text-xs">
                        Cette Politique de Confidentialité est établie à Dakar, Sénégal, le 28 juillet 2025.
                    </p>
                </div>
            </div>
        </div>
    )
}