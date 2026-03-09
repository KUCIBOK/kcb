import { useEffect } from "react";

export default function TermsAndConditions(){
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="min-h-screen bg-gray-900 text-white/90">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Conditions Générales d'Utilisation
                    </h1>
                    <p className="text-white/60 text-sm">
                        Plateforme Kucibok (Utilisateur Standard)
                    </p>
                    <p className="text-white/50 text-xs mt-2">
                        Dernière mise à jour : 28 juillet 2025
                    </p>
                </div>

                {/* Introduction */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        Bienvenue sur Kucibok – Votre Espace Artistique Numérique
                    </h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Les présentes Conditions Générales d'Utilisation (ci-après dénommées « CGU ») ont pour objectif de définir le cadre légal et les règles d'accès, de navigation et d'utilisation de la plateforme numérique Kucibok, accessible en ligne à l'adresse www.kucibok.com (ci-après la « Plateforme »). En accédant à Kucibok, que ce soit pour une simple consultation ou pour une utilisation active de ses services, vous, en tant qu'utilisateur, reconnaissez avoir lu, compris et accepté sans réserve l'intégralité des dispositions énoncées dans les présentes CGU. Cette acceptation est obligatoire et s'impose à tout utilisateur, quelle que soit sa localisation géographique. Kucibok est conçue pour être une interface intuitive et sécurisée, et ces CGU sont là pour garantir une expérience juste et transparente pour tous.
                    </p>
                </div>

                {/* Articles */}
                <div className="space-y-10">
                    {/* Article 1 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 1 : Identification de Kucibok – L'Éditeur de Votre Plateforme Artistique
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>La plateforme Kucibok est éditée et gérée par :</p>
                            <div className="bg-gray-800/50 rounded p-4">
                                <p><strong>KUCIBOK SARL</strong>, Une entreprise dûment immatriculée au registre du commerce et du crédit mobilier du Sénégal, sous le numéro [à insérer, si disponible]. Ayant son siège social situé à : Liberté 6 Ext, Rue Ambassade de France, Villa 24, Dakar, Sénégal.</p>
                                <p className="mt-2">Email de contact : <a href="mailto:contact@kucibok.com" className="text-indigo-400 hover:text-indigo-300">contact@kucibok.com</a></p>
                            </div>
                            <p>Nous nous engageons à répondre à vos requêtes avec diligence et professionnalisme.</p>
                        </div>
                    </article>

                    {/* Article 2 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 2 : Définitions – Comprendre les Termes Clés
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Pour une meilleure compréhension des présentes CGU, les termes suivants, employés avec une majuscule, auront la signification définie ci-dessous :</p>
                            <div className="grid gap-3">
                                <div className="bg-gray-800/30 rounded p-3">
                                    <strong className="text-white">Utilisateur :</strong> Désigne toute personne physique ou morale qui accède à la Plateforme, qu'elle soit enregistrée ou non, et qui consulte ou utilise les services offerts par Kucibok.
                                </div>
                                <div className="bg-gray-800/30 rounded p-3">
                                    <strong className="text-white">Artiste :</strong> Désigne un Utilisateur créateur d'œuvres d'art qui utilise la Plateforme pour proposer ses créations à la numérisation haute définition, à la certification (notamment via blockchain), à la promotion, et/ou à la mise en vente.
                                </div>
                                <div className="bg-gray-800/30 rounded p-3">
                                    <strong className="text-white">Collectionneur :</strong> Désigne un Utilisateur, particulier ou institutionnel, qui utilise la Plateforme pour découvrir, acquérir, faire expertiser, numériser ou vendre des œuvres d'art ou des biens patrimoniaux.
                                </div>
                                <div className="bg-gray-800/30 rounded p-3">
                                    <strong className="text-white">Galerie / Curateur :</strong> Désigne un Utilisateur professionnel du marché de l'art (galeriste, curateur indépendant, expert, institution culturelle) utilisant la Plateforme à des fins de sélection d'œuvres, d'organisation d'expositions virtuelles ou physiques, de gestion de collection ou de vente.
                                </div>
                                <div className="bg-gray-800/30 rounded p-3">
                                    <strong className="text-white">Œuvre :</strong> Désigne toute création artistique, qu'elle soit de nature physique (peinture, sculpture, photographie, etc.) ou numérique (art numérique, NFT, etc.), qui est référencée, publiée, mise en vente, exposée ou proposée en prêt sur la Plateforme Kucibok.
                                </div>
                                <div className="bg-gray-800/30 rounded p-3">
                                    <strong className="text-white">Services :</strong> Désigne l'ensemble des fonctionnalités et outils mis à disposition des Utilisateurs sur la Plateforme Kucibok.
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 3 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 3 : Objet de la Plateforme – Notre Mission dans le Monde de l'Art
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-4">
                            <p>Kucibok est bien plus qu'une simple plateforme numérique ; c'est un écosystème dynamique dont l'objectif est de démocratiser l'accès au marché de l'art africain et international, en rendant les œuvres accessibles, traçables et sécurisées. Nous proposons une gamme de services technologiques innovants et à forte valeur ajoutée :</p>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="bg-indigo-900/20 rounded p-3">
                                    <strong className="text-indigo-300">Numérisation haute définition</strong> : Permettant une reproduction fidèle et détaillée des œuvres physiques.
                                </div>
                                <div className="bg-purple-900/20 rounded p-3">
                                    <strong className="text-purple-300">Certification basée sur la blockchain</strong> : Offrant une preuve d'authenticité, de provenance et de propriété immuable et transparente.
                                </div>
                                <div className="bg-green-900/20 rounded p-3">
                                    <strong className="text-green-300">Traçabilité</strong> : Garantissant le suivi des œuvres tout au long de leur cycle de vie.
                                </div>
                                <div className="bg-amber-900/20 rounded p-3">
                                    <strong className="text-amber-300">Gestion des droits</strong> : Facilitant la protection et l'exploitation des droits d'auteur.
                                </div>
                                <div className="bg-red-900/20 rounded p-3 md:col-span-2">
                                    <strong className="text-red-300">Mise en vente</strong> : Proposant un espace sécurisé et global pour l'acquisition et la cession d'œuvres.
                                </div>
                            </div>
                            <p>La plateforme Kucibok s'adresse à un large éventail d'acteurs du monde de l'art, incluant les artistes émergents, les collectionneurs passionnés, les galeries et curateurs professionnels, ainsi que les institutions culturelles.</p>
                        </div>
                    </article>

                    {/* Article 4 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 4 : Acceptation et Modification des CGU – Un Cadre Évolutif
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>L'utilisation de la Plateforme Kucibok implique l'acceptation pleine et entière, sans aucune réserve, des présentes CGU. Par votre seule navigation ou interaction avec les services, vous reconnaissez avoir lu, compris et adhéré à ces conditions.</p>
                            <p>Kucibok se réserve le droit de modifier unilatéralement et à tout moment les présentes CGU pour tenir compte de l'évolution de nos services, s'adapter aux pratiques du secteur, et se conformer aux réglementations.</p>
                            <div className="bg-amber-900/20 border border-amber-700/30 rounded p-4">
                                <p className="text-amber-200">Les Utilisateurs seront informés de toute mise à jour significative des CGU par une notification visible sur la Plateforme ou par email. L'utilisation continue de la Plateforme après la publication des modifications vaut acceptation tacite.</p>
                            </div>
                        </div>
                    </article>

                    {/* Article 5 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 5 : Accès au Service – Disponibilité et Restrictions
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>La Plateforme Kucibok est conçue pour être accessible de manière continue : 24 heures sur 24 et 7 jours sur 7.</p>
                            <p>Cependant, des interruptions peuvent survenir dans les cas suivants :</p>
                            <div className="grid gap-3">
                                <div className="bg-blue-900/20 rounded p-3">
                                    <strong className="text-blue-300">Maintenance planifiée :</strong> Pour assurer l'optimisation, la sécurité ou la mise à jour de la Plateforme.
                                </div>
                                <div className="bg-red-900/20 rounded p-3">
                                    <strong className="text-red-300">Cas de force majeure :</strong> Des événements imprévisibles, irrésistibles et extérieurs à notre volonté.
                                </div>
                            </div>
                            <p>Certains services spécifiques peuvent être réservés à certaines catégories d'Utilisateurs, notamment les professionnels certifiés.</p>
                        </div>
                    </article>

                    {/* Article 6 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 6 : Création de Compte et Obligations de l'Utilisateur
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Pour accéder à l'ensemble des services personnalisés offerts par Kucibok, l'inscription et la création d'un compte utilisateur sont obligatoires. L'Utilisateur s'engage à :</p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-3">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Fournir des informations exactes et sincères</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Ne pas usurper l'identité d'un tiers</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Maintenir à jour son profil</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Utiliser la Plateforme dans le respect des lois et des droits des tiers</span>
                                </div>
                            </div>
                            <div className="bg-red-900/20 border border-red-700/30 rounded p-4">
                                <p className="text-red-200">Tout manquement à ces obligations pourra entraîner la suspension ou la résiliation du compte de l'Utilisateur.</p>
                            </div>
                        </div>
                    </article>

                    {/* Article 7 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 7 : Propriété Intellectuelle – Vos Œuvres, Nos Outils
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-4">
                            <div className="bg-purple-900/20 rounded p-4">
                                <h4 className="text-purple-300 font-medium mb-2">Protection des contenus de la Plateforme</h4>
                                <p>L'intégralité des contenus présents sur la Plateforme sont la propriété exclusive de Kucibok ou de ses partenaires, et sont protégés par les lois relatives à la propriété intellectuelle.</p>
                            </div>
                            <div className="bg-green-900/20 rounded p-4">
                                <h4 className="text-green-300 font-medium mb-2">Propriété des œuvres de l'Utilisateur</h4>
                                <p>L'Utilisateur conserve l'entière et pleine propriété de ses œuvres qu'il télécharge ou référence sur la Plateforme. Kucibok ne revendique aucun droit de propriété sur les œuvres des Utilisateurs.</p>
                            </div>
                            <div className="bg-amber-900/20 rounded p-4">
                                <h4 className="text-amber-300 font-medium mb-2">Licence d'exploitation concédée à Kucibok</h4>
                                <p>En téléchargeant une œuvre sur Kucibok, l'Utilisateur concède à Kucibok une licence non exclusive, mondiale, cessible, sous-licenciable et temporaire d'exploitation de ces œuvres, strictement limitée aux besoins du service.</p>
                            </div>
                        </div>
                    </article>

                    {/* Article 8 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 8 : Données Personnelles et Confidentialité
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Kucibok s'engage fermement à respecter la confidentialité et la sécurité de toutes les données personnelles collectées, en conformité avec le RGPD et la loi sénégalaise sur la protection des données personnelles.</p>
                            <div className="bg-indigo-900/20 rounded p-4">
                                <h4 className="text-indigo-300 font-medium mb-2">Vos droits :</h4>
                                <div className="grid md:grid-cols-2 gap-2 text-xs">
                                    <div>• Droit d'accès</div>
                                    <div>• Droit de rectification</div>
                                    <div>• Droit d'opposition</div>
                                    <div>• Droit à la portabilité</div>
                                    <div>• Droit à la suppression</div>
                                </div>
                                <p className="mt-3">Contact : <a href="mailto:msidibe@kucibok.com" className="text-indigo-400 hover:text-indigo-300">msidibe@kucibok.com</a></p>
                            </div>
                        </div>
                    </article>

                    {/* Article 9 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 9 : Sécurité et Traçabilité – L'Intégrité au Cœur de Kucibok
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>La sécurité et la fiabilité sont des piliers fondamentaux de la plateforme Kucibok :</p>
                            <div className="grid gap-3">
                                <div className="bg-green-900/20 rounded p-3">
                                    <strong className="text-green-300">Traçabilité des opérations :</strong> Toutes les opérations sensibles font l'objet d'une traçabilité automatique et rigoureuse.
                                </div>
                                <div className="bg-blue-900/20 rounded p-3">
                                    <strong className="text-blue-300">Protocoles de sécurité :</strong> Utilisation de protocoles avancés et de technologies de chiffrement robustes (SSL/TLS).
                                </div>
                                <div className="bg-purple-900/20 rounded p-3">
                                    <strong className="text-purple-300">Technologie Blockchain :</strong> Certification et traçabilité avec une couche de sécurité et d'immuabilité supplémentaire.
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 10 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 10 : Responsabilités – Délimitation des Rôles
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Kucibok opère en tant qu'intermédiaire technique et commercial, fournissant la Plateforme et les outils nécessaires pour que les Utilisateurs puissent interagir, présenter et transacter des œuvres.</p>
                            <div className="bg-amber-900/20 border border-amber-700/30 rounded p-4">
                                <p className="text-amber-200"><strong>Important :</strong> Kucibok n'est pas partie prenante directe aux contrats de vente conclus entre les vendeurs et les acheteurs. Par conséquent, Kucibok ne saurait être tenue responsable des litiges qui pourraient survenir directement entre Utilisateurs.</p>
                            </div>
                            <p>Kucibok se réserve le droit de suspendre ou de désactiver un compte d'Utilisateur en cas de suspicion ou de preuve avérée de fraude, de comportement illicite, de violation des présentes CGU, ou d'atteinte aux droits de tiers.</p>
                        </div>
                    </article>

                    {/* Article 11 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 11 : Suspension ou Résiliation de Compte
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <div className="bg-green-900/20 rounded p-4">
                                <h4 className="text-green-300 font-medium mb-2">Suppression par l'Utilisateur</h4>
                                <p>Un Utilisateur peut à tout moment décider de supprimer son compte Kucibok directement via l'interface de son tableau de bord personnel. Cette action est irréversible.</p>
                            </div>
                            <div className="bg-red-900/20 rounded p-4">
                                <h4 className="text-red-300 font-medium mb-2">Suspension par Kucibok</h4>
                                <p>Kucibok se réserve le droit de suspendre temporairement ou de résilier définitivement le compte d'un Utilisateur, sans préavis ni indemnité, en cas de :</p>
                                <div className="mt-2 text-xs space-y-1">
                                    <div>• Manquement grave aux présentes CGU</div>
                                    <div>• Atteinte aux droits d'un tiers</div>
                                    <div>• Utilisation malveillante ou frauduleuse</div>
                                    <div>• Comportement inapproprié</div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Article 12 */}
                    <article className="bg-gray-900/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Article 12 : Loi Applicable et Juridiction Compétente
                        </h3>
                        <div className="text-white/70 text-sm leading-relaxed space-y-3">
                            <p>Le présent contrat, ainsi que toutes les relations juridiques découlant de l'utilisation de la plateforme Kucibok, sont exclusivement régis par le droit sénégalais.</p>
                            <p>En cas de litige qui n'aurait pu être résolu à l'amiable, les tribunaux de Dakar, Sénégal, seront les juridictions compétentes pour connaître de ces litiges.</p>
                        </div>
                    </article>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                    <p className="text-white/50 text-xs">
                        Les présentes Conditions Générales d'Utilisation sont établies à Dakar, Sénégal, le 28 juillet 2025.
                    </p>
                </div>
            </div>
        </div>
    )
}