import { Shield } from "lucide-react";

export function InsuranceTab() {
    return (
        <div className="max-w-2xl mx-auto">
        <div className="text-center space-y-6">
            <div className="space-y-2">
                    <Shield className="w-12 h-12 text-indigo-kcb mx-auto" />
                    <h2 className="text-2xl font-semibold text-white">Assurance</h2>
                    <p className="text-gray-400 text-sm">
                    Protégez vos œuvres avec nos solutions d'assurance personnalisées
                    </p>
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
                    <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Consultation gratuite</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Discutez avec nos experts pour évaluer vos besoins en assurance
                    </p>
                    <a 
                        href="https://calendly.com/kucibok221/support-assurance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-indigo-kcb hover:bg-indigo-kcb/80 text-white px-6 py-3 rounded-lg transition font-medium text-sm"
                    >
                        <Shield className="w-4 h-4" />
                        Prendre rendez-vous
                    </a>
                    </div>
                </div>
                </div>
            </div>
    )
}