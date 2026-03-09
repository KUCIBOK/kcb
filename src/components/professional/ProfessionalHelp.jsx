import { Accordion, Button } from "../ui";
import { HelpCircle } from "lucide-react";

/**
 * Professional Dashboard Help & FAQ Section
 * Demonstrates Accordion component usage
 */

export function ProfessionalHelp() {
  const faqItems = [
    {
      value: "crm",
      label: "Comment gérer mes clients?",
      content: (
        <div className="space-y-2 text-sm text-gray-400">
          <p>Utilisez le module CRM pour:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ajouter et organiser vos clients</li>
            <li>Segmenter par type (collectionneurs, galeries, etc.)</li>
            <li>Synchroniser avec vos campagnes email</li>
            <li>Suivre les interactions et transactions</li>
          </ul>
        </div>
      )
    },
    {
      value: "entities",
      label: "Qu'est-ce qu'une entité dans Multi-Entité?",
      content: (
        <div className="space-y-2 text-sm text-gray-400">
          <p>Une entité représente une structure commerciale:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Galerie</strong>: Espace d'exposition</li>
            <li><strong>Studio</strong>: Atelier d'artiste</li>
            <li><strong>Collectif</strong>: Groupe d'artistes</li>
            <li><strong>Marketplace</strong>: Plateforme de vente</li>
          </ul>
          <p className="mt-2">Chaque entité a ses propres membres, paramètres et configurations.</p>
        </div>
      )
    },
    {
      value: "analytics",
      label: "Comment interpréter mes statistiques?",
      content: (
        <div className="space-y-2 text-sm text-gray-400">
          <p><strong>Métriques principales:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Chiffre d'affaires</strong>: Total des ventes mensuelles</li>
            <li><strong>Ventes par artiste</strong>: Performance de chaque artiste</li>
            <li><strong>Taux de conversion</strong>: % de visiteurs convertis en acheteurs</li>
            <li><strong>Temps moyen de vente</strong>: Délai avant achat</li>
          </ul>
        </div>
      )
    },
    {
      value: "integrations",
      label: "Quels services puis-je intégrer?",
      content: (
        <div className="space-y-2 text-sm text-gray-400">
          <p>Connectez vos outils favoris:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Email</strong>: Campagnes newsletters</li>
            <li><strong>Calendrier</strong>: Événements et expositions</li>
            <li><strong>Réseaux sociaux</strong>: Partage automatique</li>
            <li><strong>Webhooks</strong>: Intégrations personnalisées</li>
          </ul>
        </div>
      )
    },
    {
      value: "contacts",
      label: "Comment organiser mes contacts?",
      content: (
        <div className="space-y-2 text-sm text-gray-400">
          <p>Utilisez les listes de contacts pour:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Créer des <strong>listes statiques</strong> manuelles</li>
            <li>Configurer des <strong>listes dynamiques</strong> (critères auto)</li>
            <li>Segmenter par événement ou campagne</li>
            <li>Importer depuis CSV/XLSX</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="bg-gray-900 rounded-2xl shadow-md border border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-6 h-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Centre d'aide</h2>
      </div>

      <p className="text-gray-400 text-sm mb-6">
        Questions fréquemment posées sur la gestion de votre dashboard professionnel.
      </p>

      <Accordion 
        items={faqItems}
        defaultValue="crm"
        variant="line"
        className="space-y-2"
      />

      <div className="mt-8 p-4 bg-indigo-900/20 border border-indigo-700/30 rounded-lg">
        <p className="text-sm text-indigo-300">
          💡 <strong>Besoin d'aide supplémentaire?</strong> Contactez notre équipe support à support@kucibok.com
        </p>
      </div>
    </div>
  );
}

export default ProfessionalHelp;
