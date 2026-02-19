import { Link } from "react-router-dom";
import { Modal, Button } from "../ui";

export function RegisterOrConnect({ open = true, onClose }) {
    if (!open) return null;
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Bienvenue sur Kucibok"
            size="sm"
        >
            <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center mb-4 mx-auto">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4Z" /></svg>
                </div>
                <p className="text-gray-400 text-sm">Connecte-toi ou crée un compte pour profiter de toutes les fonctionnalités.</p>
            </div>
            <div className="flex flex-col gap-3">
                <Link
                    to="/sign-in"
                    className="w-full py-2 rounded-lg bg-purple-600 text-white font-medium text-center hover:bg-purple-700 transition"
                >
                    Se connecter
                </Link>
                <Link
                    to="/sign-up"
                    className="w-full py-2 rounded-lg border border-purple-600 text-purple-400 font-medium text-center hover:bg-purple-900/20 transition"
                >
                    S'inscrire
                </Link>
            </div>
        </Modal>
    );
}