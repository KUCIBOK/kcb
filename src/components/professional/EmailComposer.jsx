import { useState, useEffect } from "react";
import { 
  Plus, Trash2, Save, Eye, 
  Type, Image as ImageIcon, MousePointer, Minus, 
  Layout, Mail, Send, Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card, CardHeader, CardContent, toast } from "../ui";

export function EmailComposer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailName, setEmailName] = useState('Nouvel email');
  const [subject, setSubject] = useState('');
  const [preheader, setPreheader] = useState('');
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader 
            title="Email Marketing Composer"
            subtitle="Créez des emails professionnels pour votre galerie"
          />
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Nom de la campagne"
                value={emailName}
                onChange={(e) => setEmailName(e.target.value)}
                placeholder="Ex: Newsletter Janvier 2024"
              />

              <Input
                label="Objet de l'email"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Nouvelle exposition - Art Contemporain Africain"
                required
                leftIcon={Mail}
              />

              <Input
                label="Pré-header (texte d'aperçu)"
                value={preheader}
                onChange={(e) => setPreheader(e.target.value)}
                placeholder="Ex: Découvrez nos nouvelles œuvres exclusives"
              />
            </div>
          </CardContent>
        </Card>

        {/* Templates disponibles */}
        <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Templates Disponibles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TemplateCard
              title="Nouvelle Exposition"
              description="Annoncez une nouvelle exposition"
              icon={<Layout className="w-6 h-6" />}
              color="bg-kcb-or"
            />
            <TemplateCard
              title="Newsletter"
              description="Newsletter mensuelle"
              icon={<Mail className="w-6 h-6" />}
              color="bg-green-500"
            />
            <TemplateCard
              title="Invitation Événement"
              description="Invitez à un vernissage"
              icon={<Type className="w-6 h-6" />}
              color="bg-orange-500"
            />
          </div>
        </div>

        {/* Blocs disponibles */}
        <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Blocs de Construction</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BlockCard icon={<Layout />} label="Hero" />
            <BlockCard icon={<Type />} label="Texte" />
            <BlockCard icon={<ImageIcon />} label="Image" />
            <BlockCard icon={<MousePointer />} label="Bouton" />
            <BlockCard icon={<Minus />} label="Séparateur" />
            <BlockCard icon={<Plus />} label="Colonnes" />
          </div>
        </div>

        {/* Aperçu de l'éditeur */}
        <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Aperçu</h2>
            <div className="flex gap-2">
              <Button variant="secondary" icon={Eye}>
                Prévisualiser
              </Button>
              <Button 
                variant="primary" 
                icon={Save}
                onClick={() => toast.success('Email sauvegardé!')}
              >
                Sauvegarder
              </Button>
              <Button 
                variant="success"
                icon={Send}
                onClick={() => setShowCampaignModal(true)}
              >
                Créer Campagne
              </Button>
            </div>
          </div>

          <div className="bg-kcb-ardoise rounded-[4px] p-8 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Mail className="w-16 h-16 text-kcb-pierre mx-auto mb-4" />
              <p className="text-kcb-pierre mb-2">Constructeur d'email drag & drop</p>
              <p className="text-kcb-pierre text-sm">Fonctionnalité avancée en cours de développement</p>
              <p className="text-kcb-pierre text-sm mt-4">
                Cette interface permettra de créer des emails visuellement<br />
                avec des blocs réutilisables, des templates et des merge tags
              </p>
            </div>
          </div>
        </div>

        {/* Features à venir */}
        <div className="mt-6 bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Fonctionnalités à venir</h3>
          <ul className="space-y-2 text-kcb-pierre">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-kcb-or rounded-full"></span>
              Éditeur drag & drop complet
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-kcb-or rounded-full"></span>
              Merge tags dynamiques (prénom, nom, etc.)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-kcb-or rounded-full"></span>
              Templates prédéfinis et personnalisables
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-kcb-or rounded-full"></span>
              Aperçu mobile et desktop
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-kcb-or rounded-full"></span>
              Envoi et planification de campagnes
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-kcb-or rounded-full"></span>
              Analytics détaillées (opens, clicks, etc.)
            </li>
          </ul>
        </div>

        {/* Campaign Modal */}
        {showCampaignModal && (
          <CampaignModal
            onClose={() => setShowCampaignModal(false)}
            emailName={emailName}
            subject={subject}
            preheader={preheader}
          />
        )}
      </div>
    </div>
  );
}

// Campaign Modal
function CampaignModal({ onClose, emailName, subject, preheader }) {
  const navigate = useNavigate();

  const handleCreateCampaign = () => {
    // Navigate to Campaigns tab with pre-filled data
    onClose();
    alert('Redirection vers l\'onglet Campagnes pour configurer les destinataires et envoyer');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">Créer une Campagne</h3>
        
        <div className="space-y-4">
          <div className="bg-kcb-ardoise rounded-[4px] p-4">
            <p className="text-sm text-kcb-pierre mb-2">Email préparé:</p>
            <p className="text-white font-medium">{emailName}</p>
            <p className="text-kcb-pierre text-sm mt-1">Objet: {subject || 'Non défini'}</p>
          </div>

          <div className="bg-kcb-or/10 border border-kcb-or/30 rounded-[4px] p-4">
            <p className="text-kcb-sable text-sm">
              <Users className="w-4 h-4 inline mr-2" />
              Vous allez pouvoir sélectionner vos destinataires:
            </p>
            <ul className="text-kcb-pierre text-sm mt-2 space-y-1">
              <li>• Listes de contacts</li>
              <li>• Contacts CRM individuels</li>
              <li>• Segmentation avancée</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-kcb-ardoise hover:bg-white/[0.08] rounded text-white transition"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateCampaign}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white transition"
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ title, description, icon, color }) {
  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4 hover:border-kcb-or transition cursor-pointer group">
      <div className={`w-12 h-12 ${color} rounded-[4px] flex items-center justify-center mb-3 text-white group-hover:scale-110 transition`}>
        {icon}
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-kcb-pierre text-sm">{description}</p>
    </div>
  );
}

function BlockCard({ icon, label }) {
  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4 hover:border-kcb-or transition cursor-pointer text-center group">
      <div className="text-kcb-pierre group-hover:text-kcb-or transition mb-2">
        {icon}
      </div>
      <p className="text-kcb-pierre text-sm">{label}</p>
    </div>
  );
}

export default EmailComposer;
