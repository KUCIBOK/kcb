import RevealOnScroll from "../components/landing/RevealOnScroll"
import SectionLabel from "../components/landing/SectionLabel"
import GeoLine from "../components/landing/GeoLine"

/**
 * Terms and Conditions page — CGU Kucibok.
 * Uses Layout (main Header/Footer) with Africa (gold) accent theme.
 *
 * @returns {JSX.Element}
 */
export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-kcb-noir-deep text-white font-dm-sans" style={{ "--accent": "#C9A84C", "--accent-dark": "#8B6914" }}>
      {/* ── HEADER ── */}
      <section className="pt-40 pb-20 text-center">
        <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
          <RevealOnScroll>
            <SectionLabel text="Legal" />
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 className="font-playfair font-bold text-[clamp(32px,4vw,52px)] text-white mt-6 mb-4 leading-tight">
              Conditions Generales d&apos;<em className="text-[var(--accent)] not-italic">Utilisation</em>
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="text-[13px] text-kcb-pierre">
              Plateforme Kucibok (Utilisateur Standard)
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

          {/* Introduction */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Bienvenue sur Kucibok — Votre Espace Artistique Numerique
              </h2>
              <p className="text-kcb-sable text-[13px] leading-relaxed">
                Les presentes Conditions Generales d&apos;Utilisation (ci-apres denominees « CGU ») ont pour objectif de definir le cadre legal et les regles d&apos;acces, de navigation et d&apos;utilisation de la plateforme numerique Kucibok, accessible en ligne a l&apos;adresse www.kucibok.com (ci-apres la « Plateforme »). En accedant a Kucibok, que ce soit pour une simple consultation ou pour une utilisation active de ses services, vous, en tant qu&apos;utilisateur, reconnaissez avoir lu, compris et accepte sans reserve l&apos;integralite des dispositions enoncees dans les presentes CGU. Cette acceptation est obligatoire et s&apos;impose a tout utilisateur, quelle que soit sa localisation geographique. Kucibok est concue pour etre une interface intuitive et securisee, et ces CGU sont la pour garantir une experience juste et transparente pour tous.
              </p>
            </article>
          </RevealOnScroll>

          {/* Article 1 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 1 : Identification de Kucibok — L&apos;Editeur de Votre Plateforme Artistique
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                <p>La plateforme Kucibok est editee et geree par :</p>
                <div className="border border-[var(--accent)]/20 p-4">
                  <p>
                    <strong className="text-white">KUCIBOK SARL</strong>, Une entreprise dument immatriculee au registre du commerce et du credit mobilier du Senegal, sous le numero [a inserer, si disponible]. Ayant son siege social situe a : Liberte 6 Ext, Rue Ambassade de France, Villa 24, Dakar, Senegal.
                  </p>
                  <p className="mt-2">
                    Email de contact :{" "}
                    <a href="mailto:contact@kucibok.com" className="text-[var(--accent)] hover:opacity-80">
                      contact@kucibok.com
                    </a>
                  </p>
                </div>
                <p>Nous nous engageons a repondre a vos requetes avec diligence et professionnalisme.</p>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 2 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 2 : Definitions — Comprendre les Termes Cles
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                <p>Pour une meilleure comprehension des presentes CGU, les termes suivants, employes avec une majuscule, auront la signification definie ci-dessous :</p>
                <div className="grid gap-3">
                  {[
                    {
                      term: "Utilisateur",
                      def: "Designe toute personne physique ou morale qui accede a la Plateforme, qu'elle soit enregistree ou non, et qui consulte ou utilise les services offerts par Kucibok.",
                    },
                    {
                      term: "Artiste",
                      def: "Designe un Utilisateur createur d'oeuvres d'art qui utilise la Plateforme pour proposer ses creations a la numerisation haute definition, a la certification (notamment via blockchain), a la promotion, et/ou a la mise en vente.",
                    },
                    {
                      term: "Collectionneur",
                      def: "Designe un Utilisateur, particulier ou institutionnel, qui utilise la Plateforme pour decouvrir, acquerir, faire expertiser, numeriser ou vendre des oeuvres d'art ou des biens patrimoniaux.",
                    },
                    {
                      term: "Galerie / Curateur",
                      def: "Designe un Utilisateur professionnel du marche de l'art (galeriste, curateur independant, expert, institution culturelle) utilisant la Plateforme a des fins de selection d'oeuvres, d'organisation d'expositions virtuelles ou physiques, de gestion de collection ou de vente.",
                    },
                    {
                      term: "Oeuvre",
                      def: "Designe toute creation artistique, qu'elle soit de nature physique (peinture, sculpture, photographie, etc.) ou numerique (art numerique, NFT, etc.), qui est referencee, publiee, mise en vente, exposee ou proposee en pret sur la Plateforme Kucibok.",
                    },
                    {
                      term: "Services",
                      def: "Designe l'ensemble des fonctionnalites et outils mis a disposition des Utilisateurs sur la Plateforme Kucibok.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="border border-white/[0.06] p-3">
                      <strong className="text-[var(--accent)]">{item.term} :</strong>
                      <span className="text-kcb-sable text-[13px]"> {item.def}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 3 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 3 : Objet de la Plateforme — Notre Mission dans le Monde de l&apos;Art
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                <p>Kucibok est bien plus qu&apos;une simple plateforme numerique ; c&apos;est un ecosysteme dynamique dont l&apos;objectif est de democratiser l&apos;acces au marche de l&apos;art africain et international, en rendant les oeuvres accessibles, tracables et securisees. Nous proposons une gamme de services technologiques innovants et a forte valeur ajoutee :</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { title: "Numerisation haute definition", text: "Permettant une reproduction fidele et detaillee des oeuvres physiques." },
                    { title: "Certification basee sur la blockchain", text: "Offrant une preuve d'authenticite, de provenance et de propriete immuable et transparente." },
                    { title: "Tracabilite", text: "Garantissant le suivi des oeuvres tout au long de leur cycle de vie." },
                    { title: "Gestion des droits", text: "Facilitant la protection et l'exploitation des droits d'auteur." },
                  ].map((item, i) => (
                    <div key={i} className="border border-white/[0.06] p-4">
                      <h3 className="text-[var(--accent)] font-medium text-sm mb-1">{item.title}</h3>
                      <p className="text-[11px]">{item.text}</p>
                    </div>
                  ))}
                  <div className="border border-white/[0.06] p-4 md:col-span-2">
                    <h3 className="text-[var(--accent)] font-medium text-sm mb-1">Mise en vente</h3>
                    <p className="text-[11px]">Proposant un espace securise et global pour l&apos;acquisition et la cession d&apos;oeuvres.</p>
                  </div>
                </div>
                <p>La plateforme Kucibok s&apos;adresse a un large eventail d&apos;acteurs du monde de l&apos;art, incluant les artistes emergents, les collectionneurs passionnes, les galeries et curateurs professionnels, ainsi que les institutions culturelles.</p>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 4 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 4 : Acceptation et Modification des CGU — Un Cadre Evolutif
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                <p>L&apos;utilisation de la Plateforme Kucibok implique l&apos;acceptation pleine et entiere, sans aucune reserve, des presentes CGU. Par votre seule navigation ou interaction avec les services, vous reconnaissez avoir lu, compris et adhere a ces conditions.</p>
                <p>Kucibok se reserve le droit de modifier unilateralement et a tout moment les presentes CGU pour tenir compte de l&apos;evolution de nos services, s&apos;adapter aux pratiques du secteur, et se conformer aux reglementations.</p>
                <div className="border border-[var(--accent)]/20 p-4">
                  <p className="text-kcb-sable">Les Utilisateurs seront informes de toute mise a jour significative des CGU par une notification visible sur la Plateforme ou par email. L&apos;utilisation continue de la Plateforme apres la publication des modifications vaut acceptation tacite.</p>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 5 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 5 : Acces au Service — Disponibilite et Restrictions
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                <p>La Plateforme Kucibok est concue pour etre accessible de maniere continue : 24 heures sur 24 et 7 jours sur 7.</p>
                <p>Cependant, des interruptions peuvent survenir dans les cas suivants :</p>
                <div className="grid gap-3">
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium text-sm mb-1">Maintenance planifiee</h3>
                    <p className="text-[11px]">Pour assurer l&apos;optimisation, la securite ou la mise a jour de la Plateforme.</p>
                  </div>
                  <div className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium text-sm mb-1">Cas de force majeure</h3>
                    <p className="text-[11px]">Des evenements imprevisibles, irresistibles et exterieurs a notre volonte.</p>
                  </div>
                </div>
                <p>Certains services specifiques peuvent etre reserves a certaines categories d&apos;Utilisateurs, notamment les professionnels certifies.</p>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 6 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 6 : Creation de Compte et Obligations de l&apos;Utilisateur
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                <p>Pour acceder a l&apos;ensemble des services personnalises offerts par Kucibok, l&apos;inscription et la creation d&apos;un compte utilisateur sont obligatoires. L&apos;Utilisateur s&apos;engage a :</p>
                <div className="space-y-2">
                  {[
                    "Fournir des informations exactes et sinceres",
                    "Ne pas usurper l'identite d'un tiers",
                    "Maintenir a jour son profil",
                    "Utiliser la Plateforme dans le respect des lois et des droits des tiers",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="border border-[var(--accent)]/20 p-4">
                  <p className="text-kcb-sable">Tout manquement a ces obligations pourra entrainer la suspension ou la resiliation du compte de l&apos;Utilisateur.</p>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 7 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 7 : Propriete Intellectuelle — Vos Oeuvres, Nos Outils
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                {[
                  {
                    title: "Protection des contenus de la Plateforme",
                    text: "L'integralite des contenus presents sur la Plateforme sont la propriete exclusive de Kucibok ou de ses partenaires, et sont proteges par les lois relatives a la propriete intellectuelle.",
                  },
                  {
                    title: "Propriete des oeuvres de l'Utilisateur",
                    text: "L'Utilisateur conserve l'entiere et pleine propriete de ses oeuvres qu'il telecharge ou reference sur la Plateforme. Kucibok ne revendique aucun droit de propriete sur les oeuvres des Utilisateurs.",
                  },
                  {
                    title: "Licence d'exploitation concedee a Kucibok",
                    text: "En telechargeant une oeuvre sur Kucibok, l'Utilisateur concede a Kucibok une licence non exclusive, mondiale, cessible, sous-licenciable et temporaire d'exploitation de ces oeuvres, strictement limitee aux besoins du service.",
                  },
                ].map((item, i) => (
                  <div key={i} className="border border-white/[0.06] p-4">
                    <h3 className="text-[var(--accent)] font-medium text-sm mb-2">{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 8 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 8 : Donnees Personnelles et Confidentialite
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                <p>Kucibok s&apos;engage fermement a respecter la confidentialite et la securite de toutes les donnees personnelles collectees, en conformite avec le RGPD et la loi senegalaise sur la protection des donnees personnelles.</p>
                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium text-sm mb-3">Vos droits :</h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      "Droit d'acces",
                      "Droit de rectification",
                      "Droit d'opposition",
                      "Droit a la portabilite",
                      "Droit a la suppression",
                    ].map((right, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-[5px] flex-shrink-0" />
                        <span className="text-[11px]">{right}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[13px]">
                    Contact :{" "}
                    <a href="mailto:msidibe@kucibok.com" className="text-[var(--accent)] hover:opacity-80">
                      msidibe@kucibok.com
                    </a>
                  </p>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 9 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 9 : Securite et Tracabilite — L&apos;Integrite au Coeur de Kucibok
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                <p>La securite et la fiabilite sont des piliers fondamentaux de la plateforme Kucibok :</p>
                <div className="grid gap-3">
                  {[
                    {
                      title: "Tracabilite des operations",
                      text: "Toutes les operations sensibles font l'objet d'une tracabilite automatique et rigoureuse.",
                    },
                    {
                      title: "Protocoles de securite",
                      text: "Utilisation de protocoles avances et de technologies de chiffrement robustes (SSL/TLS).",
                    },
                    {
                      title: "Technologie Blockchain",
                      text: "Certification et tracabilite avec une couche de securite et d'immuabilite supplementaire.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="border border-white/[0.06] p-4">
                      <h3 className="text-[var(--accent)] font-medium text-sm mb-1">{item.title}</h3>
                      <p className="text-[11px]">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 10 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 10 : Responsabilites — Delimitation des Roles
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                <p>Kucibok opere en tant qu&apos;intermediaire technique et commercial, fournissant la Plateforme et les outils necessaires pour que les Utilisateurs puissent interagir, presenter et transacter des oeuvres.</p>
                <div className="border border-[var(--accent)]/20 p-4">
                  <p className="text-kcb-sable">
                    <strong className="text-white">Important :</strong> Kucibok n&apos;est pas partie prenante directe aux contrats de vente conclus entre les vendeurs et les acheteurs. Par consequent, Kucibok ne saurait etre tenue responsable des litiges qui pourraient survenir directement entre Utilisateurs.
                  </p>
                </div>
                <p>Kucibok se reserve le droit de suspendre ou de desactiver un compte d&apos;Utilisateur en cas de suspicion ou de preuve averee de fraude, de comportement illicite, de violation des presentes CGU, ou d&apos;atteinte aux droits de tiers.</p>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 11 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 11 : Suspension ou Resiliation de Compte
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-4">
                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium text-sm mb-2">Suppression par l&apos;Utilisateur</h3>
                  <p>Un Utilisateur peut a tout moment decider de supprimer son compte Kucibok directement via l&apos;interface de son tableau de bord personnel. Cette action est irreversible.</p>
                </div>
                <div className="border border-white/[0.06] p-4">
                  <h3 className="text-[var(--accent)] font-medium text-sm mb-2">Suspension par Kucibok</h3>
                  <p>Kucibok se reserve le droit de suspendre temporairement ou de resilier definitivement le compte d&apos;un Utilisateur, sans preavis ni indemnite, en cas de :</p>
                  <div className="mt-3 space-y-2">
                    {[
                      "Manquement grave aux presentes CGU",
                      "Atteinte aux droits d'un tiers",
                      "Utilisation malveillante ou frauduleuse",
                      "Comportement inapproprie",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-[5px] flex-shrink-0" />
                        <span className="text-[11px]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          {/* Article 12 */}
          <RevealOnScroll>
            <article className="bg-kcb-noir border border-white/[0.06] p-8">
              <h2 className="font-playfair font-semibold text-lg text-white mb-4">
                Article 12 : Loi Applicable et Juridiction Competente
              </h2>
              <div className="text-kcb-sable text-[13px] leading-relaxed space-y-3">
                <p>Le present contrat, ainsi que toutes les relations juridiques decoulant de l&apos;utilisation de la plateforme Kucibok, sont exclusivement regis par le droit senegalais.</p>
                <p>En cas de litige qui n&apos;aurait pu etre resolu a l&apos;amiable, les tribunaux de Dakar, Senegal, seront les juridictions competentes pour connaitre de ces litiges.</p>
              </div>
            </article>
          </RevealOnScroll>

          {/* Footer */}
          <div className="pt-8 border-t border-white/[0.06] text-center">
            <p className="text-kcb-pierre text-[11px]">
              Les presentes Conditions Generales d&apos;Utilisation sont etablies a Dakar, Senegal, le 28 juillet 2025.
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
