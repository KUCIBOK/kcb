# KUCIBOK — Design System
**Version** 1.1 — Mars 2026
**Statut** ACTIF — Validé Mars 2026
**Design actif** — Palette noir/ivoire/or (Africa) + noir/argent (Global)
**Aligne sur** PRD.md · Branding institutionnel premium
**Langue** FR/EN — Confidentiel

---

## 1. PHILOSOPHIE DESIGN

### Principe Central
> Kucibok n'est pas une startup. Kucibok est une institution privée en construction.
> Chaque décision de design doit renforcer cette perception.

### Les 3 Tensions à Résoudre

| Tension | Mauvaise résolution | Bonne résolution |
|---------|--------------------|--------------------|
| Premium vs Accessible | Froid et distant | Chaleureux mais rigoureux |
| Institutionnel vs Africain | Effacer l'Afrique | Sublimer l'Afrique |
| Minimaliste vs Informatif | Vide et stérile | Sobre et dense de sens |

### Ce que le design doit évoquer
- Un coffre-fort qui a de l'âme
- Christie's qui aurait été fondée à Dakar
- Un musée privé, pas une galerie commerciale

---

## 2. LOGO

Le logo Kucibok existant (icône + wordmark) est conservé.

**Règles d'usage**
- Version blanche sur fond sombre : usage principal
- Version sombre sur fond clair : usage secondaire
- Espace de protection : minimum 1x la hauteur du logo
- Jamais déformé, jamais colorisé autrement que blanc/noir/or
- Gradient violet uniquement sur l'icône — jamais sur le wordmark

---

## 3. PALETTE DE COULEURS

### Couleurs Primaires

| Nom | Hex | Usage |
|-----|-----|-------|
| **Noir Profond** | `#0A0A0A` | Backgrounds principaux, hero sections |
| **Ivoire** | `#F5F0E8` | Backgrounds secondaires, cartes, surfaces |
| **Or Kucibok** | `#C9A84C` | Accents, CTAs primaires, highlights |
| **Bronze** | `#8B6914` | Accents secondaires, hover states |

### Couleurs Secondaires

| Nom | Hex | Usage |
|-----|-----|-------|
| **Ardoise** | `#1C1C1E` | Cards sur fond noir, sidebars |
| **Pierre** | `#3A3A3C` | Texte secondaire sur fond sombre |
| **Sable** | `#D4C5A9` | Texte secondaire sur fond clair |
| **Blanc Pur** | `#FFFFFF` | Texte principal sur fond sombre |

### Couleurs Portail Global

| Nom | Hex | Usage |
|-----|-----|-------|
| **Silver** | `#A8B0BC` | Accent principal portail Global |
| **Silver Light** | `#C4CAD4` | Highlights, titres accent Global |
| **Silver Dark** | `#6B7280` | Hover states, texte secondaire Global |
| **Steel** | `#1A1D24` | Cards, sidebars portail Global |
| **Platinum** | `#D6DAE0` | Surfaces claires portail Global |
| **Noir Deep** | `#050505` | Background hero, sections sombres |
| **Ardoise Cool** | `#16181E` | Background piliers, sections alternatives |

### Couleurs Fonctionnelles

| Nom | Hex | Usage |
|-----|-----|-------|
| **Succes** | `#2D6A4F` | Certifie, valide, livre |
| **Alerte** | `#D4A017` | En attente, en transit |
| **Erreur** | `#8B1A1A` | Refuse, erreur |
| **Info** | `#1A3A5C` | Information neutre |

### Couleurs Charts (Chart.js / Dashboards)

Les graphiques doivent utiliser exclusivement les couleurs suivantes :

| Usage | Couleur | Hex |
|-------|---------|-----|
| Primaire | Or Kucibok | `#C9A84C` / `rgba(201,168,76,1)` |
| Secondaire | Bronze | `#8B6914` / `rgba(139,105,20,1)` |
| Tertiaire | Vert fonce | `#2D6A4F` |
| Quaternaire | Or sombre | `#D4A017` |
| Fond zone | Or transparent | `rgba(201,168,76,0.1)` |
| Grille | Blanc subtil | `rgba(255,255,255,0.06)` |

Interdit dans les charts : `#a855f7` (violet), `#3b82f6` (bleu), `#22c55e` (vert vif), `#f97316` (orange).

### Ce qu'on supprime
- Violet #9B59B6 — supprime du design system
- Orange #F39C12 — supprime
- Gradients flashy multi-couleurs
- Couleurs saturees sur fonds colores

---

## 4. TYPOGRAPHIE

| Niveau | Police | Poids | Usage |
|--------|--------|-------|-------|
| **Display** | `Playfair Display` | 700 | Titres hero, noms d'oeuvres |
| **Heading** | `Playfair Display` | 600 | H1, H2, titres sections |
| **Subheading** | `DM Sans` | 600 | H3, H4, labels importants |
| **Body** | `DM Sans` | 400 | Texte courant |
| **Caption** | `DM Sans` | 400 | Metadonnees, dates |
| **Mono** | `JetBrains Mono` | 400 | IDs certificats, numeros reference |

### Tailles
- Display : 48–64px
- H1 : 36px / H2 : 28px / H3 : 22px / H4 : 18px
- Body : 16px / Small : 14px / Caption : 12px

---

## 5. COMPOSANTS UI

### Boutons

```
PRIMARY
  Background: Or Kucibok (#C9A84C)
  Text: Noir Profond (#0A0A0A)
  Border-radius: 2px
  Font: DM Sans 600 14px uppercase letter-spacing: 0.05em
  Hover: Bronze (#8B6914)

SECONDARY
  Background: transparent
  Border: 1px solid Or Kucibok
  Text: Or Kucibok

GHOST
  Background: transparent
  Text: Sable (#D4C5A9)
```

### Cards

```
CARD STANDARD (fond clair)
  Background: Ivoire (#F5F0E8)
  Border: 1px solid rgba(0,0,0,0.08)
  Border-radius: 4px
  Padding: 24px

CARD DARK (fond sombre)
  Background: Ardoise (#1C1C1E)
  Border: 1px solid rgba(255,255,255,0.06)
  Padding: 24px

CARD OEUVRE
  Ratio image: 3/4 (portrait)
  Overlay: transparent -> rgba(0,0,0,0.7)
  Badge certification Or en haut a droite
```

### Badge Certification

```
CERTIFIE KUCIBOK
  Background: Or Kucibok (#C9A84C)
  Text: Noir, DM Sans 600 10px uppercase
  Padding: 4px 8px / Border-radius: 2px
```

---

## 6. CERTIFICAT KUCIBOK — TEMPLATE

```
+--------------------------------------------------+
| [LOGO]              CERTIFICAT D'AUTHENTICITE    |
|                                                  |
| [IMAGE OEUVRE 40% gauche]   Titre oeuvre         |
|                             Artiste              |
|                             Annee, Medium, Dim.  |
|                             Provenance           |
|                                                  |
| N KCB-XXXX  [QR CODE]  Blockchain: ETH           |
| Emis le: JJ/MM/AAAA                              |
| kucibok.com/verify/KCB-XXXX                      |
+--------------------------------------------------+
```

- Format A4 portrait
- Fond Ivoire #F5F0E8
- Titres Playfair Display noir
- Numero certificat JetBrains Mono or
- Filigrane geometrique africain subtil (3% opacite)

---

## 7. DIRECTION UX PAR PORTAIL

### Portail Afrique (`/africa`)
- Ton : accueillant, protecteur, structurant
- FR prioritaire
- Hero : Kuzi mascotte animee (GIF) + particules fumee
- Titre principal : "Votre art merite un standard mondial"

### Portail Global (`/global`)
- Ton : institutionnel, sobre, autorite
- EN prioritaire
- Hero : cadre artwork geometrique + stats flottantes
- Titre principal : "The Standard for African Art Circulation"

> **Note** : Les portails utilisent des routes (`/africa`, `/global`), pas des sous-domaines. Migration vers sous-domaines prevue Phase 3 (voir ADR-003 dans TECH_SPEC.md).

---

## 8. REGLES ANTI-PATTERNS

| Interdit | Alternative |
|----------|-------------|
| Gradients violet/rose/orange | Aplats noir, ivoire, or |
| Animations rapides / flashy | Transitions 300-500ms max |
| Emojis dans l'interface | Icones vectorielles sobres |
| Photos stock sourire generique | Photos documentaires, artistiques |
| Illustrations vectorielles startup | Photographie, typographie, espace |

---

## 9. ACCESSIBILITE

### Composants UI

| Composant | Requis |
|-----------|--------|
| **Modal** | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap |
| **Select** | `aria-expanded`, `aria-haspopup="listbox"`, navigation fleches, `aria-activedescendant` |
| **Tabs** | `role="tablist/tab/tabpanel"`, navigation fleches, `aria-selected` |
| **Accordion** | `aria-expanded`, `aria-controls`, `id` sur panneau |
| **Tooltip** | Declenchement hover + focus (`onFocus`/`onBlur`) |
| **Card (cliquable)** | `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter/Space), `focus-visible:ring` |

### Contraste minimum

- Texte courant : 4.5:1 minimum
- Texte large (>18px) et composants UI : 3:1 minimum
- Placeholder : utiliser `kcb-sable` (#D4C5A9) et non `kcb-pierre` (#3A3A3C) sur fond sombre
- Sous-titres : eviter l'opacite reduite sur `kcb-pierre` (utiliser `kcb-sable` a la place)

### Navigation clavier

- Tous les elements interactifs doivent avoir `focus-visible:ring-2 focus-visible:ring-kcb-or`
- Sidebar : boutons de navigation avec styles focus visibles
- Drag-and-drop : fallback `role="button"` + `tabIndex={0}` + `onKeyDown`

---

## 10. TOKENS CSS (index.css)

```css
:root {
  --kcb-noir: #0A0A0A;
  --kcb-noir-deep: #050505;
  --kcb-ardoise: #1C1C1E;
  --kcb-ardoise-cool: #16181E;
  --kcb-pierre: #3A3A3C;
  --kcb-sable: #D4C5A9;
  --kcb-ivoire: #F5F0E8;
  --kcb-blanc: #FFFFFF;
  --kcb-or: #C9A84C;
  --kcb-bronze: #8B6914;
  --kcb-silver: #A8B0BC;
  --kcb-silver-light: #C4CAD4;
  --kcb-silver-dark: #6B7280;
  --kcb-steel: #1A1D24;
  --kcb-platinum: #D6DAE0;

  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
}
```

---

## 11. ANTI-PATTERNS APPLIQUES

L'audit UX/UI de Mars 2026 a identifie et corrige les violations suivantes. Ces regles sont maintenant appliquees dans tout le codebase :

| Violation | Correction appliquee |
|-----------|---------------------|
| `bg-purple-*`, `bg-orange-*`, gradients multi-couleurs | Tokens KCB (`bg-kcb-or`, `bg-kcb-ardoise`, `border-kcb-or/30`) |
| `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full` | `rounded-[4px]` (badges : `rounded-[2px]`) |
| `font-serif` (Georgia) | `font-playfair` |
| Emoji dans l'UI (`✓`, `⏸`) | Icones Lucide (`Check`, `Pause`) |
| Hex hardcode (`#1f2937`, `#374151`) | Tokens CSS (`var(--kcb-ardoise)`, `text-kcb-pierre`) |
| `alert()` en production | `toast()` utility |
| `console.log` | Sentry |

---

## 12. STRUCTURE LANDING PAGES

### Gateway (route `/`)
Split-screen plein ecran. Cote gauche: Kuzi + "Portail Afrique" + CTA or. Cote droite: carte corridor + "Global Portal" + CTA silver. Centre: logo Kucibok dans cercle, change couleur au hover. Click navigue vers /africa ou /global.

### Portail Afrique (`/africa`)
Sections dans l'ordre:
1. **Hero** — Kuzi.gif + particules fumee CSS + titre "Votre art merite un standard mondial"
2. **Pillars** — 3 colonnes: Certification gratuite / Logistique vers le monde / Visibilite internationale
3. **Services** — Grille 6 cartes (Certification, Portfolio, Logistique, Tracking, Visibilite, Paiements)
4. **Timeline** — 4 etapes onboarding (Soumission -> Numerisation -> Certification -> Circulation)
5. **Temoignages** — 3 cartes fond ivoire
6. **CTA final** — Titre + 2 boutons

### Portail Global (`/global`)
Sections dans l'ordre:
1. **Hero** — Cadre artwork geometric + stats flottantes + titre "The Standard for African Art Circulation"
2. **Pillars** — 3 colonnes: Certified Catalogue / Door-to-Door Logistics / B2B Network
3. **Catalogue** — Grille 4 oeuvres avec badges certification
4. **Logistique** — Carte SVG corridor animee + 4 etapes (Request -> Packaging -> Transit -> Delivery)
5. **Sourcing B2B** — 4 features
6. **Pricing** — 3 plans (Explorer / Collector / Institution)
7. **CTA final**

### Animations
- Scroll reveal: Framer Motion `useInView`, translateY(24px)->0, opacity 0->1, 0.6s cubic-bezier
- Particules fumee: CSS keyframes smoke-drift, radial gradients
- Carte corridor: SVG `animateMotion` pour points mobiles, stroke-dasharray pour routes
- Stats flottantes: CSS keyframes float, translateY bounce

### Breakpoints
| Breakpoint | Cible | Changements |
|------------|-------|-------------|
| > 1024px | Desktop | Grilles multi-colonnes, hero side-by-side |
| 640-1024px | Tablet | Grilles single-column, hero stacked |
| < 640px | Mobile | Navigation masquee, Gateway vertical |

---

## 13. ORDRE DE MIGRATION UI

| Priorite | Page | Impact |
|----------|------|--------|
| 1 | AfricaLanding.jsx + GlobalPage.jsx | Premiere impression |
| 2 | Certificat PDF template | Credibilite institutionnelle |
| 3 | Page /verify/:id | Vue publique partagee |
| 4 | Dashboard Artiste | Usage quotidien |
| 5 | Dashboard Galerie Africaine | Client principal |
| 6 | Dashboard Pro / Global | Client payant |
| 7 | Onboarding flows | Conversion |
| 8 | Emails transactionnels | Touch points |

---

*Kucibok DESIGN_SYSTEM V1.1 — Mars 2026 — Confidentiel*
