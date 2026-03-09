import { Award, Brush, ShoppingBag } from "lucide-react";
import { useRef } from "react";
import { DataLoader } from "../loaders/PageLoader";

export function Step3({ formState, setFormState }) {
    const artistRef = useRef();
    const collectorRef = useRef();
    const proRef = useRef();

    // Animation simple : shake ou scale sur le choix sélectionné
    const animateRole = (role) => {
      let ref = null;
      if (role === 'artist') ref = artistRef;
      if (role === 'collector') ref = collectorRef;
      if (role === 'professional') ref = proRef;
      if (ref && ref.current) {
        ref.current.classList.remove('animate-bounce-scale');
        void ref.current.offsetWidth;
        ref.current.classList.add('animate-bounce-scale');
        // Remove the class after animation ends
        const handler = () => {
          ref.current && ref.current.classList.remove('animate-bounce-scale');
          ref.current && ref.current.removeEventListener('animationend', handler);
        };
        ref.current.addEventListener('animationend', handler);
      }
    };

    const handleRoleClick = (role) => {
      setFormState({ ...formState, role });
      animateRole(role);
    };

    const handleNext = () => {
        if (formState.role) {
            setFormState({ ...formState, step: 3 });
        }
    };
    return (
        <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background px-4">
          <div className="w-full max-w-sm mx-auto">
            {formState.error && (
              <div className="mb-4 text-red-300 text-center bg-red-900/20 border border-red-900 rounded-md p-2 text-xs">
                {formState.error}
              </div>
            )}
            <div className="bg-card rounded-xl border border-gray-800 shadow-sm p-6">
              <p className="text-center text-xl font-bold text-white mb-2">Choisissez votre rôle</p>
              <p className="text-xs text-center text-gray-400 mb-6">Comment souhaitez-vous utiliser Kucibok ?</p>
              <div className="space-y-3">
                <div
                  ref={artistRef}
                  onClick={() => handleRoleClick('artist')}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg border cursor-pointer transition ${formState.role === 'artist' ? 'border-indigo-kcb bg-indigo-kcb/10' : 'border-gray-800 hover:border-indigo-kcb/60'}`}
                  style={{ userSelect: 'none' }}
                >
                  <span className="rounded-full bg-indigo-kcb/10 p-2"><Brush className="text-indigo-kcb/80" /></span>
                  <span className="text-white text-base font-medium">Artiste</span>
                </div>
                <div
                  ref={collectorRef}
                  onClick={() => handleRoleClick('collector')}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg border cursor-pointer transition ${formState.role === 'collector' ? 'border-indigo-kcb bg-indigo-kcb/10' : 'border-gray-800 hover:border-indigo-kcb/60'}`}
                  style={{ userSelect: 'none' }}
                >
                  <span className="rounded-full bg-indigo-kcb/10 p-2"><ShoppingBag className="text-indigo-kcb/80" /></span>
                  <span className="text-white text-base font-medium">Collectionneur</span>
                </div>
                <div
                  ref={proRef}
                  onClick={() => handleRoleClick('professional')}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg border cursor-pointer transition ${formState.role === 'professional' ? 'border-indigo-kcb bg-indigo-kcb/10' : 'border-gray-800 hover:border-indigo-kcb/60'}`}
                  style={{ userSelect: 'none' }}
                >
                  <span className="rounded-full bg-indigo-kcb/10 p-2"><Award className="text-indigo-kcb/80" /></span>
                  <span className="text-white text-base font-medium">Professionnel de l'art</span>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full py-2 rounded-md bg-indigo-kcb text-white font-semibold text-sm hover:bg-indigo-700 transition mt-2"
                >
                  {formState.loading ? <DataLoader /> : 'Suivant'}
                </button>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setFormState({ ...formState, error: '', step: 1, loading: false })}
                  className="text-xs text-gray-400 hover:underline w-full"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes bounce-scale {
            0% { transform: scale(1); }
            30% { transform: scale(1.08); }
            50% { transform: scale(0.96); }
            70% { transform: scale(1.04); }
            100% { transform: scale(1); }
          }
          .animate-bounce-scale {
            animation: bounce-scale 0.5s cubic-bezier(.36,1.5,.64,1) 1;
          }
        `}</style>
        </>
    )
}
