# 🎨 KuciBoK Design System

Design System cohérent et réutilisable pour la plateforme KuciBoK.

## 📦 Composants Disponibles

### Button

Boutons avec variants, tailles, états de chargement et icônes.

```jsx
import { Button } from '@/components/ui'
;<Button variant="primary" size="md" icon={Plus} loading={false}>
  Ajouter
</Button>
```

**Variants:** `primary`, `secondary`, `danger`, `ghost`, `outline`, `success`  
**Sizes:** `sm`, `md`, `lg`, `icon`

---

### Input

Champs de saisie avec validation, icônes et états.

```jsx
import { Input } from '@/components/ui'
;<Input
  label="Email"
  type="email"
  placeholder="exemple@email.com"
  leftIcon={Mail}
  error="Email invalide"
  required
/>
```

---

### Card

Conteneurs de contenu avec header, content et footer.

```jsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui'
;<Card variant="elevated" hover>
  <CardHeader title="Titre" subtitle="Sous-titre" actions={<Button />} />
  <CardContent>Votre contenu ici</CardContent>
  <CardFooter justify="end">
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Variants:** `default`, `elevated`, `outline`, `glass`

---

### KPICard

Cartes KPI avec icône, valeur, trend et métriques.

```jsx
import { KPICard } from '@/components/ui'
;<KPICard
  icon={Users}
  label="Total Utilisateurs"
  value="2,543"
  trend={{ value: '+12%', direction: 'up' }}
  subtitle="vs mois dernier"
  loading={false}
/>
```

**Trend directions:** `up`, `down`, `neutral`

---

### Badge

Indicateurs de statut et labels.

```jsx
import { Badge, StatusBadge } from '@/components/ui';

<Badge variant="success" icon={Check} dot removable>
  Active
</Badge>

<StatusBadge status="approved" />
```

**Variants:** `default`, `success`, `warning`, `danger`, `info`, `primary`  
**Status:** `active`, `pending`, `approved`, `rejected`, `draft`, `error`

---

### Toast

Notifications temporaires pour feedback utilisateur.

```jsx
import { toast } from '@/components/ui'

// Simple
toast.success('Sauvegardé!')
toast.error('Erreur lors de la sauvegarde')
toast.warning('Vérifiez vos données')
toast.info('Nouvelle mise à jour disponible')

// Promise
toast.promise(fetchData(), {
  loading: 'Chargement...',
  success: 'Données chargées!',
  error: 'Erreur de chargement',
})
```

---

## 🎨 Design Tokens

### Couleurs

```css
/* Primary */
--indigo-400: #818cf8 --indigo-500: #6366f1 --indigo-600: #4f46e5 /* Success */ --green-400: #4ade80
  --green-600: #16a34a /* Warning */ --yellow-400: #facc15 --yellow-600: #ca8a04 /* Danger */
  --red-400: #f87171 --red-600: #dc2626 /* Neutral */ --gray-300: #d1d5db --gray-400: #9ca3af
  --gray-700: #374151 --gray-800: #1f2937 --gray-900: #111827;
```

### Espacements

```javascript
const spacing = {
  section: 'mb-8', // Entre sections
  component: 'mb-6', // Entre composants
  element: 'mb-4', // Entre éléments
  tight: 'mb-2', // Espacement serré
}
```

### Typographie

```css
.text-display: text-4xl font-bold
.text-title: text-2xl font-semibold
.text-heading: text-lg font-medium
.text-body: text-base
.text-caption: text-sm text-gray-400
```

---

## 🚀 Installation

Le Design System est déjà installé dans le projet.

Pour utiliser le ToastProvider, ajoutez-le dans votre App.jsx:

```jsx
import { ToastProvider } from './components/ui'

function App() {
  return <ToastProvider>{/* Votre application */}</ToastProvider>
}
```

---

## 📖 Voir la Demo

Accédez à `/design-system` pour voir tous les composants en action.

Ajoutez cette route dans `Router.jsx`:

```jsx
import { DesignSystemDemo } from '../components/ui/DesignSystemDemo'
;<Route path="/design-system" element={<DesignSystemDemo />} />
```

---

## 🎯 Bonnes Pratiques

1. **Toujours utiliser les composants du Design System** plutôt que de créer des styles custom
2. **Respecter les variants** - Ne pas créer de nouveaux variants sans raison
3. **Utiliser les espacements standards** - mb-8, mb-6, mb-4, mb-2
4. **Loading states** - Toujours afficher un indicateur pendant les appels API
5. **Toast pour feedback** - Confirmer les actions importantes
6. **Validation visuelle** - Montrer les erreurs en temps réel

---

## 🔧 Extension

Pour ajouter un nouveau composant au Design System:

1. Créer le fichier dans `/components/ui/`
2. Documenter les props avec JSDoc
3. Ajouter à `/components/ui/index.js`
4. Créer un exemple dans `DesignSystemDemo.jsx`
5. Documenter dans ce README

---

## 📝 Changelog

### v1.0.0 (2024)

- ✅ Button component with variants
- ✅ Input component with validation
- ✅ Card component with composition
- ✅ KPICard for metrics
- ✅ Badge for status
- ✅ Toast notifications
- ✅ Design tokens documented
- ✅ Demo page created

---

**Maintenu par:** Équipe KuciBoK  
**Dernière mise à jour:** 2024
