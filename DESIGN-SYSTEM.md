# Design System — Kucibok

Référence centralisée des tokens, composants et règles de style de la plateforme.

---

## 1. Tokens de couleur (définis dans `frontend/src/index.css` @theme)

### Palette de marque

| Token Tailwind       | Valeur hexadécimale | Utilisation                        |
|----------------------|---------------------|------------------------------------|
| `indigo-kcb`         | `#7072c5`           | CTA principal, boutons primaires   |
| `purple-kcb`         | `#b132a7`           | Accents, gradients de marque       |
| `bg-gradient`        | indigo → purple 90° | Boutons hero, bandeaux principaux  |
| `text-gradient`      | indigo → purple     | Titres en relief                   |

### Palette thématique (art africain)

| Token Tailwind  | Valeur hexadécimale | Signification               |
|-----------------|---------------------|-----------------------------|
| `earth`         | `#c56c39`           | Terracotta — art primitif   |
| `clay`          | `#d2a86e`           | Ocre/sable — naturalité     |
| `night`         | `#1f2a44`           | Bleu nuit — profondeur      |
| `forest`        | `#4d7c5a`           | Vert forêt — nature         |
| `kente`         | `#c73e3a`           | Rouge kente — tissu africain|

### Palette système (sémantique)

| Usage             | Classes Tailwind                          |
|-------------------|-------------------------------------------|
| Fond principal    | `bg-background` → `hsl(220 40% 10%)`     |
| Carte/panneau     | `bg-card` → `#141b29`                    |
| Bordure           | `border-border` → `#242e42`              |
| Texte secondaire  | `text-gray-400`                           |
| Succès            | `text-green-400` / `bg-green-900/30`     |
| Danger            | `text-red-300` / `bg-red-900/20`         |
| Avertissement     | `text-yellow-400` / `bg-yellow-900/30`  |

---

## 2. Typographie

| Classe utilitaire | Police              | Usage                                      |
|-------------------|---------------------|--------------------------------------------|
| `font-sans`       | Poppins             | Corps de texte, UI générale               |
| `font-serif`      | Playfair Display    | Titres d'œuvres, identité artistique      |
| `font-open-sans`  | Open Sans           | Descriptions longues, lectures étendues   |
| `font-playfair`   | Playfair Display    | Alias explicite pour `font-serif`          |

### Échelle typographique recommandée

```
text-2xl font-bold font-serif   → Titre de page / hero
text-xl font-semibold           → Titre de section
text-lg font-medium             → Titre de composant
text-base                       → Corps de texte
text-sm text-gray-400           → Description, légende
text-xs                         → Étiquettes, badges, métadonnées
```

---

## 3. Espacements standards

```
Sections principales   : py-8 / mb-8
Entre composants       : mb-6
Entre éléments         : mb-4
Serré (inline)         : mb-2 / gap-2
Très serré             : gap-1
```

---

## 4. Composants UI disponibles

Tous dans `frontend/src/components/ui/` — importables via `from '../../components/ui'`.

| Composant        | Import                              | Description                           |
|------------------|-------------------------------------|---------------------------------------|
| `Button`         | `{ Button }`                        | Variantes : primary, secondary, danger, ghost, outline, success |
| `Input`          | `{ Input }`                         | Avec validation, icône, état d'erreur |
| `Card`           | `{ Card, CardHeader, CardContent }` | Variantes : default, elevated, outline, glass |
| `KPICard`        | `{ KPICard }`                       | Métriques avec trend up/down/neutral  |
| `Badge`          | `{ Badge, StatusBadge }`            | Statuts : approved, pending, rejected |
| `Modal`          | `{ Modal }`                         | Modale accessible avec overlay        |
| `Tabs`           | `{ Tabs }`                          | Navigation par onglets                |
| `Select`         | `{ Select }`                        | Sélecteur avec options               |
| `DataTable`      | `{ DataTable }`                     | Tableau avec tri et pagination        |
| `Tooltip`        | `{ Tooltip }`                       | Info-bulle au survol                  |
| `Progress`       | `{ Progress }`                      | Barre de progression                  |
| `Toast`          | `{ toast }`                         | `toast.success/error/warning/info()`  |

> **Demo interactive** : ajouter `<Route path="/design-system" element={<DesignSystemDemo />} />` dans Router.jsx

---

## 5. Composants partagés

| Composant              | Chemin                                       | Usage                                  |
|------------------------|----------------------------------------------|----------------------------------------|
| `DashboardSidebar`     | `components/shared/DashboardSidebar.jsx`     | Sidebar commune Artist/Collector/Pro   |
| `PageLoader`           | `components/loaders/PageLoader.jsx`          | Chargement de page / inline spinner    |
| `RevealOnScroll`       | `components/decoratives/RevealOnScroll.jsx`  | Animation apparition au scroll         |

---

## 6. Règles d'utilisation

### ✅ À FAIRE
- Utiliser `bg-indigo-kcb` / `text-indigo-kcb` pour les actions primaires
- Utiliser `bg-gradient` pour les CTA hero uniquement (pas pour les listes)
- Utiliser `font-serif` pour les titres d'œuvres d'art
- Utiliser `toast` de `react-hot-toast` (déjà configuré) — pas d'`alert()`
- Utiliser `StatusBadge` du design system pour tous les statuts d'œuvres/enchères

### ❌ NE PAS FAIRE
- `alert()` ou `confirm()` dans les composants — utiliser `toast` ou `Modal`
- `console.log()` en production — utiliser le système de logs backend
- `class=` au lieu de `className=` en JSX
- Dupliquer le code sidebar — utiliser `DashboardSidebar`
- Créer de nouveaux styles custom si un token ou composant existant répond au besoin
- Hardcoder des valeurs métier (TVA, taux, intervalles) — extraire en constantes nommées

---

## 7. Constantes métier

Extraire dans un fichier `frontend/src/constants/business.js` (à créer si besoin) :

```js
export const TVA_RATE = 0.20;           // Taux TVA France — sync backend
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_FILE_SIZE_MB = 10;
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
```

---

## 8. Patterns d'animation

| Classe Tailwind         | Effet                          |
|-------------------------|-------------------------------|
| `animate-fade-in-up`    | Apparition de bas en haut     |
| `animate-fade-in`       | Fondu entrant (0.5s)          |
| `animate-fade-out`      | Fondu sortant (1s)            |
| `animate-slide-left`    | Glissement vers la gauche     |
| `animate-scale-up`      | Mise à l'échelle rapide       |
| `bounce-kcb`            | Rebond infini (icônes déco)   |
| `hover-card`            | Élévation au survol           |

---

## 9. Adoption — état actuel (27 fév 2026)

| Composant UI   | Adopté dans les pages ? | Action requise                        |
|----------------|-------------------------|---------------------------------------|
| `Button`       | ❌ Partiel              | Migrer les `<button>` dans les forms  |
| `Input`        | ❌ Non utilisé          | Migrer les `<input>` dans les forms   |
| `Card`         | ❌ Non utilisé          | Remplacer les divs `bg-gray-900/rounded-xl` |
| `Badge`        | ❌ Non utilisé          | Remplacer les spans de statut         |
| `Modal`        | ❌ Non utilisé          | Remplacer les modales custom          |
| `DashboardSidebar` | ✅ Artist, Collector, Pro | —                                 |

> Priorité recommandée : commencer par les formulaires (SignIn, SignUp, Profile) en phase P4-UX-002.
