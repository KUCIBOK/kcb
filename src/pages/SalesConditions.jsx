import PortalLayout from "../components/landing/PortalLayout"
import RevealOnScroll from "../components/landing/RevealOnScroll"
import SectionLabel from "../components/landing/SectionLabel"
import GeoLine from "../components/landing/GeoLine"

export default function SalesConditions() {
    return (
        <PortalLayout portal="africa">
            {/* Header */}
            <section className="pt-40 pb-20 text-center px-6">
                <RevealOnScroll delay={0}>
                    <SectionLabel text="Legal" />
                </RevealOnScroll>
                <RevealOnScroll delay={0.1}>
                    <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mt-6 mb-4">
                        Conditions Générales de{" "}
                        <em className="not-italic text-[var(--accent)]">Vente</em>
                    </h1>
                </RevealOnScroll>
                <RevealOnScroll delay={0.2}>
                    <p className="text-kcb-sable text-[13px] mb-1">
                        Plateforme Kucibok (Acheteurs / Collectionneurs)
                    </p>
                    <p className="text-kcb-pierre text-[11px]">
                        Dernière mise à jour : 28 juillet 2025
                    </p>
                </RevealOnScroll>
            </section>

            <GeoLine />

            {/* Articles */}
            <section className="py-20 bg-kcb-noir-deep px-6">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Préambule */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Préambule : L'Expérience Kucibok et Votre Engagement
                            </h2>
                            <p className="text-kcb-sable text-[13px] leading-relaxed">
                                Les présentes Conditions Générales de Vente (ci-après dénommées « CGV ») définissent les modalités d'acquisition d'œuvres d'art et de biens patrimoniaux sur Kucibok. En validant toute commande d'achat, vous reconnaissez avoir lu, compris et accepté sans réserve l'intégralité des dispositions contenues dans les présentes CGV. Cette acceptation est matérialisée par un processus de validation explicite lors de chaque transaction.
                            </p>
                        </article>
                    </RevealOnScroll>

                    {/* Article 1 */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Article 1 : Identification de Kucibok, Votre Partenaire de Confiance
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed">
                                <p className="mb-3">La plateforme Kucibok est éditée et gérée par :</p>
                                <div className="border border-[var(--accent)]/20 p-4">
                                    <p><strong className="text-white">KUCIBOK SARL</strong>, Entreprise immatriculée au registre du commerce et du crédit mobilier du Sénégal, sous le numéro [à insérer, si disponible]. Ayant son siège social à : Liberté 6 Ext, Rue Ambassade de France, Villa 24, Dakar, Sénégal.</p>
                                    <p className="mt-2">Email de contact : <a href="mailto:msidibe@kucibok.com" className="text-[var(--accent)] hover:opacity-80 transition-opacity">msidibe@kucibok.com</a></p>
                                </div>
                                <p className="mt-3">Nous nous engageons à vous fournir un environnement sûr et transparent pour toutes vos transactions.</p>
                            </div>
                        </article>
                    </RevealOnScroll>

                    {/* Article 2 */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Article 2 : Champ d'Application des CGV
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                                <p>Ces CGV s'appliquent universellement à tous les acheteurs et collectionneurs, quelle que soit leur localisation géographique.</p>
                                <div className="border border-[var(--accent)]/20 p-4">
                                    <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Conformité législative</h3>
                                    <div className="space-y-2 text-[11px]">
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Législation sénégalaise (loi de référence principale)</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Droit OHADA (harmonisation juridique africaine)</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Directives européennes (protection du consommateur UE)</span>
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
                                Article 3 : Nature des Produits Proposés à la Vente
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                                <p>Kucibok offre une gamme diversifiée de biens culturels et artistiques :</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="border border-white/[0.06] p-4">
                                        <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Œuvres physiques</h3>
                                        <p className="text-[11px]">Peintures, sculptures, photographies avec livraison par transporteurs spécialisés</p>
                                    </div>
                                    <div className="border border-white/[0.06] p-4">
                                        <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Œuvres numériques</h3>
                                        <p className="text-[11px]">Créations digitales certifiées avec authentification Kucibok</p>
                                    </div>
                                    <div className="border border-white/[0.06] p-4">
                                        <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Jetons KuciCoin/NFT</h3>
                                        <p className="text-[11px]">Tokens numériques représentant la propriété sur blockchain</p>
                                    </div>
                                    <div className="border border-white/[0.06] p-4">
                                        <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Pièces patrimoniales</h3>
                                        <p className="text-[11px]">Objets historiques avec documentation et certifications</p>
                                    </div>
                                </div>
                                <p>Chaque produit bénéficie d'une fiche descriptive détaillée incluant certificats de numérisation et d'authenticité.</p>
                            </div>
                        </article>
                    </RevealOnScroll>

                    {/* Article 4 */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Article 4 : Processus de Commande
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                                <p>Commander sur Kucibok est un processus intuitif et sécurisé :</p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <span className="bg-[var(--accent)] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">1</span>
                                        <div>
                                            <strong className="text-white">Sélection de l'œuvre</strong>
                                            <p className="text-[11px] mt-1">Navigation, exploration des collections et ajout au panier</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="bg-[var(--accent)] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">2</span>
                                        <div>
                                            <strong className="text-white">Acceptation du prix</strong>
                                            <p className="text-[11px] mt-1">Récapitulatif détaillé avec frais annexes et taxes</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="bg-[var(--accent)] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">3</span>
                                        <div>
                                            <strong className="text-white">Paiement sécurisé</strong>
                                            <p className="text-[11px] mt-1">Interface sécurisée pour la validation du paiement</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="bg-[var(--accent)] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">4</span>
                                        <div>
                                            <strong className="text-white">Confirmation</strong>
                                            <p className="text-[11px] mt-1">Email de confirmation avec récapitulatif et numéro de commande</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-[var(--accent)]/20 p-4">
                                    <p className="text-kcb-sable text-[13px]"><strong className="text-white">Droit d'annulation :</strong> Kucibok se réserve le droit d'annuler toute commande en cas de suspicion de fraude, d'indisponibilité de l'œuvre, ou de non-respect des conditions d'achat.</p>
                                </div>
                            </div>
                        </article>
                    </RevealOnScroll>

                    {/* Article 5 */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Article 5 : Prix, Taxes et Devises
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="border border-white/[0.06] p-3">
                                        <strong className="text-[var(--accent)]">Devises acceptées</strong>
                                        <p className="text-[11px] mt-1">XOF, EUR, USD avec taux mis à jour</p>
                                    </div>
                                    <div className="border border-white/[0.06] p-3">
                                        <strong className="text-[var(--accent)]">Taxes incluses</strong>
                                        <p className="text-[11px] mt-1">TVA selon législation applicable</p>
                                    </div>
                                    <div className="border border-white/[0.06] p-3">
                                        <strong className="text-[var(--accent)]">Transparence totale</strong>
                                        <p className="text-[11px] mt-1">Prix affichés incluent tous les frais</p>
                                    </div>
                                </div>
                                <div className="border border-[var(--accent)]/20 p-4">
                                    <p className="text-kcb-sable text-[13px]"><strong className="text-white">Ventes transfrontalières :</strong> L'acheteur est responsable des droits de douane, taxes à l'importation et autres redevances locales. Kucibok ne peut être tenue responsable de ces frais supplémentaires.</p>
                                </div>
                            </div>
                        </article>
                    </RevealOnScroll>

                    {/* Article 6 */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Article 6 : Modalités de Paiement
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="border border-white/[0.06] p-4">
                                        <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Options de paiement</h3>
                                        <div className="space-y-2 text-[11px]">
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Carte bancaire (Visa, Mastercard)</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Mobile Money (Orange Money, Wave)</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Jetons KuciCoin (œuvres éligibles)</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Transfert bancaire (sur demande)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border border-white/[0.06] p-4">
                                        <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Sécurité maximale</h3>
                                        <div className="space-y-2 text-[11px]">
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Chiffrement SSL/TLS</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Protocole 3D Secure</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Conformité PCI DSS</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Aucune donnée stockée</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </RevealOnScroll>

                    {/* Article 7 */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Article 7 : Livraison et Transfert de Propriété
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="border border-white/[0.06] p-4">
                                        <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Œuvres physiques</h3>
                                        <div className="text-[11px] space-y-2">
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Transporteurs spécialisés agréés</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Numéro de suivi en temps réel</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Assurance à hauteur de la valeur</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Transfert à la remise effective</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border border-white/[0.06] p-4">
                                        <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Œuvres numériques</h3>
                                        <div className="text-[11px] space-y-2">
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Transfert immédiat après paiement</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Confirmation blockchain/systèmes</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Accès instantané aux contenus</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                                <span>Certificats numériques fournis</span>
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
                                Article 8 : Droit de Rétractation (UE)
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                                <div className="border border-white/[0.06] p-4">
                                    <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Pour les consommateurs UE</h3>
                                    <p className="text-[11px]">Délai de 14 jours calendaires à compter de la réception pour exercer votre droit de rétractation, conformément à la Directive 2011/83/UE.</p>
                                </div>
                                <div className="border border-white/[0.06] p-4">
                                    <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Conditions de retour</h3>
                                    <div className="text-[11px] space-y-2">
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Œuvre en état d'origine</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Emballage d'origine conservé</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Frais de retour à votre charge</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-white/[0.06] p-4">
                                    <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Exclusions</h3>
                                    <div className="text-[11px] space-y-2">
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Œuvres numériques livrées immédiatement</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Œuvres personnalisées/sur mesure</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Biens périssables</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </RevealOnScroll>

                    {/* Article 9 */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Article 9 : Garanties Légales
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="border border-white/[0.06] p-4">
                                        <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Conformité (UE)</h3>
                                        <p className="text-[11px]">Garantie légale selon le Code de la consommation européen</p>
                                    </div>
                                    <div className="border border-white/[0.06] p-4">
                                        <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Vices cachés</h3>
                                        <p className="text-[11px]">Protection selon Code civil sénégalais et droit OHADA</p>
                                    </div>
                                    <div className="border border-white/[0.06] p-4">
                                        <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Authenticité</h3>
                                        <p className="text-[11px]">Certificat d'authenticité avec validation Kucibok</p>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </RevealOnScroll>

                    {/* Article 10 */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Article 10 : Responsabilités
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                                <p>Kucibok opère en tant que tiers de confiance et intermédiaire technique facilitant la connexion entre vendeurs et acheteurs.</p>
                                <div className="border border-white/[0.06] p-4">
                                    <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Notre responsabilité</h3>
                                    <p className="text-[11px]">Limitée au bon fonctionnement de la plateforme et au respect du processus de commande tel que décrit dans ces CGV.</p>
                                </div>
                                <div className="border border-[var(--accent)]/20 p-4">
                                    <p className="text-kcb-sable text-[13px]"><strong className="text-white">Important :</strong> La responsabilité de la conformité et de l'authenticité des œuvres incombe principalement au vendeur. Kucibok facilite la résolution amiable des litiges.</p>
                                </div>
                            </div>
                        </article>
                    </RevealOnScroll>

                    {/* Article 11 */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Article 11 : Données Personnelles
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                                <p>La protection de vos données personnelles est une priorité absolue, en conformité avec :</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="border border-white/[0.06] p-3">
                                        <strong className="text-[var(--accent)]">RGPD (UE)</strong>
                                        <p className="text-[11px] mt-1">Pour nos utilisateurs européens</p>
                                    </div>
                                    <div className="border border-white/[0.06] p-3">
                                        <strong className="text-[var(--accent)]">Loi sénégalaise</strong>
                                        <p className="text-[11px] mt-1">Protection des données personnelles</p>
                                    </div>
                                </div>
                                <div className="border border-white/[0.06] p-4">
                                    <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Utilisation des données</h3>
                                    <div className="text-[11px] space-y-2">
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Facturation et abonnements</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Gestion et suivi de livraison</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Relation client et support</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Amélioration des services</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[11px]">Consultez notre Politique de Confidentialité complète pour plus de détails.</p>
                            </div>
                        </article>
                    </RevealOnScroll>

                    {/* Article 12 */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Article 12 : Force Majeure
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                                <p>Kucibok ne peut être tenue responsable en cas d'événements imprévisibles et irrésistibles :</p>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <div className="border border-white/[0.06] p-3">
                                        <strong className="text-[var(--accent)] text-[13px]">Événements majeurs</strong>
                                        <p className="text-[11px] mt-1">Guerres, terrorisme, pandémies</p>
                                    </div>
                                    <div className="border border-white/[0.06] p-3">
                                        <strong className="text-[var(--accent)] text-[13px]">Grèves</strong>
                                        <p className="text-[11px] mt-1">Transporteurs, services postaux</p>
                                    </div>
                                    <div className="border border-white/[0.06] p-3">
                                        <strong className="text-[var(--accent)] text-[13px]">Catastrophes naturelles</strong>
                                        <p className="text-[11px] mt-1">Séismes, inondations, tempêtes</p>
                                    </div>
                                    <div className="border border-white/[0.06] p-3">
                                        <strong className="text-[var(--accent)] text-[13px]">Pannes techniques</strong>
                                        <p className="text-[11px] mt-1">Réseaux, télécommunications</p>
                                    </div>
                                </div>
                                <p className="text-[11px]">En cas de force majeure, nous vous informons rapidement et prenons toutes les mesures raisonnables pour minimiser l'impact.</p>
                            </div>
                        </article>
                    </RevealOnScroll>

                    {/* Article 13 */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Article 13 : Droit Applicable et Juridictions Compétentes
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                                <p>Le présent contrat est exclusivement régi par le droit sénégalais.</p>
                                <div className="border border-white/[0.06] p-4">
                                    <h3 className="font-playfair font-semibold text-lg text-[var(--accent)] mb-2">Juridictions compétentes</h3>
                                    <div className="text-[11px] space-y-2">
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Tribunaux de Dakar, Sénégal (si accepté)</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                                            <span>Juridictions du pays de résidence de l'acheteur (selon loi applicable)</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[11px]">Nous encourageons toujours le dialogue et la recherche de solutions amiables.</p>
                            </div>
                        </article>
                    </RevealOnScroll>

                    {/* Article 14 */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Article 14 : Contacts et Réclamations
                            </h2>
                            <div className="border border-[var(--accent)]/20 p-4">
                                <div className="text-kcb-sable text-[13px] space-y-2">
                                    <div><strong className="text-white">Kucibok SARL</strong></div>
                                    <div>Adresse : Liberté 6 Ext, Rue Ambassade de France, Villa 24, Dakar, Sénégal</div>
                                    <div>Email général : <a href="mailto:msidibe@kucibok.com" className="text-[var(--accent)] hover:opacity-80 transition-opacity">msidibe@kucibok.com</a></div>
                                    <div>Réclamations CGV/achats : <a href="mailto:msidibe@kucibok.com" className="text-[var(--accent)] hover:opacity-80 transition-opacity">msidibe@kucibok.com</a></div>
                                    <div>Téléphone : <a href="tel:+22176275018" className="text-[var(--accent)] hover:opacity-80 transition-opacity">+221 76 275 09 18</a></div>
                                    <div className="text-[11px] text-kcb-pierre">Horaires : Lundi au vendredi, 9h-17h GMT</div>
                                </div>
                            </div>
                        </article>
                    </RevealOnScroll>

                    {/* Article 15 */}
                    <RevealOnScroll>
                        <article className="bg-kcb-noir border border-white/[0.06] p-8">
                            <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                                Article 15 : Résolution des Litiges et Médiation
                            </h2>
                            <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                                <p>Toute contestation sera d'abord soumise à une tentative de résolution amiable. Nous encourageons nos utilisateurs à nous contacter directement pour exprimer leurs préoccupations.</p>
                                <div className="border border-white/[0.06] p-4">
                                    <p className="text-kcb-sable text-[13px]">Les parties s'engagent à privilégier la médiation ou tout autre mode alternatif de règlement des litiges avant toute action judiciaire.</p>
                                </div>
                            </div>
                        </article>
                    </RevealOnScroll>

                    {/* Footer */}
                    <RevealOnScroll>
                        <div className="pt-8 border-t border-white/[0.06] text-center">
                            <p className="text-kcb-pierre text-[11px]">
                                Les présentes CGV sont établies à Dakar, Sénégal, le 28 juillet 2025.
                            </p>
                        </div>
                    </RevealOnScroll>

                </div>
            </section>
        </PortalLayout>
    )
}
