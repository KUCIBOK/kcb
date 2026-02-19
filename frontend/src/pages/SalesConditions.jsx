import { useEffect } from "react";

export default function SalesConditions() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="min-h-screen bg-gray-900 text-white/90">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Conditions Générales de Vente
                    </h1>
                    <p className="text-white/60 text-sm">
                        Plateforme Kucibok (Acheteurs / Collectionneurs)
                    </p>
                    <p className="text-white/50 text-xs mt-2">
                        Dernière mise à jour : 28 juillet 2025
                    </p>
                </div>

                {/* Préambule */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        Préambule : L'Expérience Kucibok et Votre Engagement
                    </h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Les présentes Conditions Générales de Vente (ci-après dénommées « CGV ») définissent les modalités d'acquisition d'œuvres d'art et de biens patrimoniaux sur Kucibok. En validant toute commande d'achat, vous reconnaissez avoir lu, compris et accepté sans réserve l'intégralité des dispositions contenues dans les présentes CGV. Cette acceptation est matérialisée par un processus de validation explicite lors de chaque transaction.
                    </p>
                </div>

                {/* Articles */}
                <div className="space-y-10">
                    {/* Article 1 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 1 : Identification de Kucibok, Votre Partenaire de Confiance
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed">
                            <p className="mb-3">La plateforme Kucibok est éditée et gérée par :</p>
                            <div className="bg-gray-800/50 rounded p-4">
                                <p><strong>KUCIBOK SARL</strong>, Entreprise immatriculée au registre du commerce et du crédit mobilier du Sénégal, sous le numéro [à insérer, si disponible]. Ayant son siège social à : Liberté 6 Ext, Rue Ambassade de France, Villa 24, Dakar, Sénégal.</p>
                                <p className="mt-2">Email de contact : <a href="mailto:msidibe@kucibok.com" className="text-indigo-400 hover:text-indigo-300">msidibe@kucibok.com</a></p>
                            </div>
                            <p className="mt-3">Nous nous engageons à vous fournir un environnement sûr et transparent pour toutes vos transactions.</p>
                        </div>
                    </article>

                    {/* Article 2 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 2 : Champ d'Application des CGV
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Ces CGV s'appliquent universellement à tous les acheteurs et collectionneurs, quelle que soit leur localisation géographique.</p>
                            <div className="bg-indigo-900/20 rounded p-4">
                                <h4 className="text-indigo-300 font-medium mb-2">Conformité législative</h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                        <span>Législation sénégalaise (loi de référence principale)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                        <span>Droit OHADA (harmonisation juridique africaine)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                        <span>Directives européennes (protection du consommateur UE)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 3 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 3 : Nature des Produits Proposés à la Vente
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-4">
                            <p>Kucibok offre une gamme diversifiée de biens culturels et artistiques :</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-900/20 rounded p-4">
                                    <h4 className="text-blue-300 font-medium mb-2">Œuvres physiques</h4>
                                    <p className="text-xs">Peintures, sculptures, photographies avec livraison par transporteurs spécialisés</p>
                                </div>
                                <div className="bg-purple-900/20 rounded p-4">
                                    <h4 className="text-purple-300 font-medium mb-2">Œuvres numériques</h4>
                                    <p className="text-xs">Créations digitales certifiées avec authentification Kucibok</p>
                                </div>
                                <div className="bg-green-900/20 rounded p-4">
                                    <h4 className="text-green-300 font-medium mb-2">Jetons KuciCoin/NFT</h4>
                                    <p className="text-xs">Tokens numériques représentant la propriété sur blockchain</p>
                                </div>
                                <div className="bg-amber-900/20 rounded p-4">
                                    <h4 className="text-amber-300 font-medium mb-2">Pièces patrimoniales</h4>
                                    <p className="text-xs">Objets historiques avec documentation et certifications</p>
                                </div>
                            </div>
                            <p>Chaque produit bénéficie d'une fiche descriptive détaillée incluant certificats de numérisation et d'authenticité.</p>
                        </div>
                    </article>

                    {/* Article 4 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 4 : Processus de Commande
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-4">
                            <p>Commander sur Kucibok est un processus intuitif et sécurisé :</p>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="bg-indigo-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">1</span>
                                    <div>
                                        <strong className="text-white">Sélection de l'œuvre</strong>
                                        <p className="text-xs mt-1">Navigation, exploration des collections et ajout au panier</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="bg-indigo-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">2</span>
                                    <div>
                                        <strong className="text-white">Acceptation du prix</strong>
                                        <p className="text-xs mt-1">Récapitulatif détaillé avec frais annexes et taxes</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="bg-indigo-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">3</span>
                                    <div>
                                        <strong className="text-white">Paiement sécurisé</strong>
                                        <p className="text-xs mt-1">Interface sécurisée pour la validation du paiement</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="bg-indigo-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">4</span>
                                    <div>
                                        <strong className="text-white">Confirmation</strong>
                                        <p className="text-xs mt-1">Email de confirmation avec récapitulatif et numéro de commande</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-amber-900/20 border border-amber-700/30 rounded p-4">
                                <p className="text-amber-200 text-sm"><strong>Droit d'annulation :</strong> Kucibok se réserve le droit d'annuler toute commande en cas de suspicion de fraude, d'indisponibilité de l'œuvre, ou de non-respect des conditions d'achat.</p>
                            </div>
                        </div>
                    </article>

                    {/* Article 5 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 5 : Prix, Taxes et Devises
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-green-900/20 rounded p-3">
                                    <strong className="text-green-300">Devises acceptées</strong>
                                    <p className="text-xs mt-1">XOF, EUR, USD avec taux mis à jour</p>
                                </div>
                                <div className="bg-blue-900/20 rounded p-3">
                                    <strong className="text-blue-300">Taxes incluses</strong>
                                    <p className="text-xs mt-1">TVA selon législation applicable</p>
                                </div>
                                <div className="bg-purple-900/20 rounded p-3">
                                    <strong className="text-purple-300">Transparence totale</strong>
                                    <p className="text-xs mt-1">Prix affichés incluent tous les frais</p>
                                </div>
                            </div>
                            <div className="bg-red-900/20 border border-red-700/30 rounded p-4">
                                <p className="text-red-200 text-sm"><strong>Ventes transfrontalières :</strong> L'acheteur est responsable des droits de douane, taxes à l'importation et autres redevances locales. Kucibok ne peut être tenue responsable de ces frais supplémentaires.</p>
                            </div>
                        </div>
                    </article>

                    {/* Article 6 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 6 : Modalités de Paiement
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-indigo-900/20 rounded p-4">
                                    <h4 className="text-indigo-300 font-medium mb-2">Options de paiement</h4>
                                    <div className="space-y-2 text-xs">
                                        <div>• Carte bancaire (Visa, Mastercard)</div>
                                        <div>• Mobile Money (Orange Money, Wave)</div>
                                        <div>• Jetons KuciCoin (œuvres éligibles)</div>
                                        <div>• Transfert bancaire (sur demande)</div>
                                    </div>
                                </div>
                                <div className="bg-green-900/20 rounded p-4">
                                    <h4 className="text-green-300 font-medium mb-2">Sécurité maximale</h4>
                                    <div className="space-y-2 text-xs">
                                        <div>• Chiffrement SSL/TLS</div>
                                        <div>• Protocole 3D Secure</div>
                                        <div>• Conformité PCI DSS</div>
                                        <div>• Aucune donnée stockée</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 7 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 7 : Livraison et Transfert de Propriété
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-900/20 rounded p-4">
                                    <h4 className="text-blue-300 font-medium mb-2">Œuvres physiques</h4>
                                    <div className="text-xs space-y-1">
                                        <div>• Transporteurs spécialisés agréés</div>
                                        <div>• Numéro de suivi en temps réel</div>
                                        <div>• Assurance à hauteur de la valeur</div>
                                        <div>• Transfert à la remise effective</div>
                                    </div>
                                </div>
                                <div className="bg-purple-900/20 rounded p-4">
                                    <h4 className="text-purple-300 font-medium mb-2">Œuvres numériques</h4>
                                    <div className="text-xs space-y-1">
                                        <div>• Transfert immédiat après paiement</div>
                                        <div>• Confirmation blockchain/systèmes</div>
                                        <div>• Accès instantané aux contenus</div>
                                        <div>• Certificats numériques fournis</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 8 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 8 : Droit de Rétractation (UE)
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <div className="bg-blue-900/20 rounded p-4">
                                <h4 className="text-blue-300 font-medium mb-2">Pour les consommateurs UE</h4>
                                <p className="text-xs">Délai de 14 jours calendaires à compter de la réception pour exercer votre droit de rétractation, conformément à la Directive 2011/83/UE.</p>
                            </div>
                            <div className="bg-amber-900/20 rounded p-4">
                                <h4 className="text-amber-300 font-medium mb-2">Conditions de retour</h4>
                                <div className="text-xs space-y-1">
                                    <div>• Œuvre en état d'origine</div>
                                    <div>• Emballage d'origine conservé</div>
                                    <div>• Frais de retour à votre charge</div>
                                </div>
                            </div>
                            <div className="bg-red-900/20 rounded p-4">
                                <h4 className="text-red-300 font-medium mb-2">Exclusions</h4>
                                <div className="text-xs space-y-1">
                                    <div>• Œuvres numériques livrées immédiatement</div>
                                    <div>• Œuvres personnalisées/sur mesure</div>
                                    <div>• Biens périssables</div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 9 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 9 : Garanties Légales
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-green-900/20 rounded p-4">
                                    <h4 className="text-green-300 font-medium mb-2">Conformité (UE)</h4>
                                    <p className="text-xs">Garantie légale selon le Code de la consommation européen</p>
                                </div>
                                <div className="bg-blue-900/20 rounded p-4">
                                    <h4 className="text-blue-300 font-medium mb-2">Vices cachés</h4>
                                    <p className="text-xs">Protection selon Code civil sénégalais et droit OHADA</p>
                                </div>
                                <div className="bg-purple-900/20 rounded p-4">
                                    <h4 className="text-purple-300 font-medium mb-2">Authenticité</h4>
                                    <p className="text-xs">Certificat d'authenticité avec validation Kucibok</p>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 10 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 10 : Responsabilités
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Kucibok opère en tant que tiers de confiance et intermédiaire technique facilitant la connexion entre vendeurs et acheteurs.</p>
                            <div className="bg-indigo-900/20 rounded p-4">
                                <h4 className="text-indigo-300 font-medium mb-2">Notre responsabilité</h4>
                                <p className="text-xs">Limitée au bon fonctionnement de la plateforme et au respect du processus de commande tel que décrit dans ces CGV.</p>
                            </div>
                            <div className="bg-amber-900/20 border border-amber-700/30 rounded p-4">
                                <p className="text-amber-200 text-sm"><strong>Important :</strong> La responsabilité de la conformité et de l'authenticité des œuvres incombe principalement au vendeur. Kucibok facilite la résolution amiable des litiges.</p>
                            </div>
                        </div>
                    </article>

                    {/* Article 11 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 11 : Données Personnelles
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>La protection de vos données personnelles est une priorité absolue, en conformité avec :</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-900/20 rounded p-3">
                                    <strong className="text-blue-300">RGPD (UE)</strong>
                                    <p className="text-xs mt-1">Pour nos utilisateurs européens</p>
                                </div>
                                <div className="bg-green-900/20 rounded p-3">
                                    <strong className="text-green-300">Loi sénégalaise</strong>
                                    <p className="text-xs mt-1">Protection des données personnelles</p>
                                </div>
                            </div>
                            <div className="bg-indigo-900/20 rounded p-4">
                                <h4 className="text-indigo-300 font-medium mb-2">Utilisation des données</h4>
                                <div className="text-xs space-y-1">
                                    <div>• Facturation et abonnements</div>
                                    <div>• Gestion et suivi de livraison</div>
                                    <div>• Relation client et support</div>
                                    <div>• Amélioration des services</div>
                                </div>
                            </div>
                            <p className="text-xs">Consultez notre Politique de Confidentialité complète pour plus de détails.</p>
                        </div>
                    </article>

                    {/* Article 12 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 12 : Force Majeure
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Kucibok ne peut être tenue responsable en cas d'événements imprévisibles et irrésistibles :</p>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="bg-red-900/20 rounded p-3">
                                    <strong className="text-red-300 text-sm">Événements majeurs</strong>
                                    <p className="text-xs mt-1">Guerres, terrorisme, pandémies</p>
                                </div>
                                <div className="bg-amber-900/20 rounded p-3">
                                    <strong className="text-amber-300 text-sm">Grèves</strong>
                                    <p className="text-xs mt-1">Transporteurs, services postaux</p>
                                </div>
                                <div className="bg-blue-900/20 rounded p-3">
                                    <strong className="text-blue-300 text-sm">Catastrophes naturelles</strong>
                                    <p className="text-xs mt-1">Séismes, inondations, tempêtes</p>
                                </div>
                                <div className="bg-purple-900/20 rounded p-3">
                                    <strong className="text-purple-300 text-sm">Pannes techniques</strong>
                                    <p className="text-xs mt-1">Réseaux, télécommunications</p>
                                </div>
                            </div>
                            <p className="text-xs">En cas de force majeure, nous vous informons rapidement et prenons toutes les mesures raisonnables pour minimiser l'impact.</p>
                        </div>
                    </article>

                    {/* Article 13 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 13 : Droit Applicable et Juridictions Compétentes
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Le présent contrat est exclusivement régi par le droit sénégalais.</p>
                            <div className="bg-indigo-900/20 rounded p-4">
                                <h4 className="text-indigo-300 font-medium mb-2">Juridictions compétentes</h4>
                                <div className="text-xs space-y-1">
                                    <div>• Tribunaux de Dakar, Sénégal (si accepté)</div>
                                    <div>• Juridictions du pays de résidence de l'acheteur (selon loi applicable)</div>
                                </div>
                            </div>
                            <p className="text-xs">Nous encourageons toujours le dialogue et la recherche de solutions amiables.</p>
                        </div>
                    </article>

                    {/* Article 14 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 14 : Contacts et Réclamations
                        </h3>
                        <div className="bg-gray-800/50 rounded p-4">
                            <div className="text-white/70 text-sm space-y-2">
                                <div><strong className="text-white">Kucibok SARL</strong></div>
                                <div>Adresse : Liberté 6 Ext, Rue Ambassade de France, Villa 24, Dakar, Sénégal</div>
                                <div>Email général : <a href="mailto:msidibe@kucibok.com" className="text-indigo-400 hover:text-indigo-300">msidibe@kucibok.com</a></div>
                                <div>Réclamations CGV/achats : <a href="mailto:msidibe@kucibok.com" className="text-indigo-400 hover:text-indigo-300">msidibe@kucibok.com</a></div>
                                <div>Téléphone : <a href="tel:+22176275018" className="text-indigo-400 hover:text-indigo-300">+221 76 275 09 18</a></div>
                                <div className="text-xs text-white/50">Horaires : Lundi au vendredi, 9h-17h GMT</div>
                            </div>
                        </div>
                    </article>

                    {/* Article 15 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 15 : Résolution des Litiges et Médiation
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Toute contestation sera d'abord soumise à une tentative de résolution amiable. Nous encourageons nos utilisateurs à nous contacter directement pour exprimer leurs préoccupations.</p>
                            <div className="bg-green-900/20 rounded p-4">
                                <p className="text-green-200 text-sm">Les parties s'engagent à privilégier la médiation ou tout autre mode alternatif de règlement des litiges avant toute action judiciaire.</p>
                            </div>
                        </div>
                    </article>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                    <p className="text-white/50 text-xs">
                        Les présentes CGV sont établies à Dakar, Sénégal, le 28 juillet 2025.
                    </p>
                </div>
            </div>
        </div>
    )
}