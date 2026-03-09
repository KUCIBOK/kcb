# KUCIBOK — DESIGN.md
**Version** 1.0 — Mars 2026
**Statut** PHASE 3+ — Proposition future, non adoptée en l'état
**Design actif** `DESIGN-SYSTEM.md` à la racine (indigo/violet — validé Mars 2026)
**Aligné sur** PRD V2 · Branding institutionnel premium
**Langue** FR/EN — Confidentiel

> ⚠️ Ce document décrit la direction visuelle cible pour la Phase 3 (reconnaissance institutionnelle).
> La palette noir/ivoire/or sera adoptée lors de la refonte des landing pages institutionnelles.
> En attendant : utiliser `DESIGN-SYSTEM.md` comme référence exclusive.

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

### Couleurs Fonctionnelles

| Nom | Hex | Usage |
|-----|-----|-------|
| **Succes** | `#2D6A4F` | Certifie, valide, livre |
| **Alerte** | `#D4A017` | En attente, en transit |
| **Erreur** | `#8B1A1A` | Refuse, erreur |
| **Info** | `#1A3A5C` | Information neutre |

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
| **Subheading** | `Inter` | 600 | H3, H4, labels importants |
| **Body** | `Inter` | 400 | Texte courant |
| **Caption** | `Inter` | 400 | Metadonnees, dates |
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
  Font: Inter 600 14px uppercase letter-spacing: 0.05em
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
  Text: Noir, Inter 600 10px uppercase
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

### Portail Afrique (africa.kucibok.com)
- Ton : accueillant, protecteur, structurant
- FR prioritaire
- Hero : artiste africain en train de creer, fond noir
- Titre principal : "Votre art merite un standard mondial"

### Portail Global (global.kucibok.com)
- Ton : institutionnel, sobre, autorite
- EN prioritaire
- Hero : oeuvre africaine premium, fond noir quasi-total
- Titre principal : "The Standard for African Art Circulation"

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

## 9. TOKENS CSS (index.css)

```css
:root {
  --kcb-noir: #0A0A0A;
  --kcb-ardoise: #1C1C1E;
  --kcb-pierre: #3A3A3C;
  --kcb-sable: #D4C5A9;
  --kcb-ivoire: #F5F0E8;
  --kcb-blanc: #FFFFFF;
  --kcb-or: #C9A84C;
  --kcb-bronze: #8B6914;

  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
}
```

---

## 10. ORDRE DE MIGRATION UI

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

*Kucibok DESIGN.md V1 — Mars 2026 — Confidentiel*
