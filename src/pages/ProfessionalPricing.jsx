import { ShieldCheck } from "lucide-react";
import { PlansList } from "../components/plans/PlansList";
import { usePlanStore } from "../store/PlanContext";
import { useEffect } from "react";

export default function ProfessionalPricing() {
    const {professionalPlans} = usePlanStore()
    useEffect(() => {
      window.scrollTo(0, 0)
    }, [])
    return (
        <>
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] py-15 via-[#232946] to-[#2c2c54] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-600 opacity-30 rounded-full blur-3xl animate-blob1 z-0"></div>
            <div className="absolute -bottom-40 right-0 w-[400px] h-[400px] bg-yellow-500 opacity-20 rounded-full blur-2xl animate-blob2 z-0"></div>
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-purple-700 opacity-20 rounded-full blur-2xl animate-blob3 z-0"></div>

            {/* Title with animated gradient text */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-400 animate-gradient mb-4 z-10 drop-shadow-lg">
                Découvrez nos plans Professionnel
            </h1>
            <p className="text-lg  text-center px-4 md:text-xl text-gray-300 mb-10 z-10 font-light animate-fadein">
                Choisissez l’abonnement qui vous ressemble et profitez d’une expérience unique.
            </p>

            <div className="w-full lg:max-w-6xl max-w-xl z-10 animate-float">
                <PlansList
                    plans={professionalPlans}
                    title={
                        <span className="flex items-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-yellow-400 animate-bounce" />
                            <span className="font-semibold text-white">Nos plans d'abonnements</span>
                        </span>
                    }
                />
            </div>

            {/* Custom CSS Animations */}
            <style>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 4s ease-in-out infinite;
                }
                @keyframes blob1 {
                    0%, 100% { transform: scale(1) translate(0, 0);}
                    50% { transform: scale(1.2) translate(40px, 60px);}
                }
                .animate-blob1 { animation: blob1 8s infinite ease-in-out; }
                @keyframes blob2 {
                    0%, 100% { transform: scale(1) translate(0, 0);}
                    50% { transform: scale(1.1) translate(-30px, 40px);}
                }
                .animate-blob2 { animation: blob2 7s infinite ease-in-out; }
                @keyframes blob3 {
                    0%, 100% { transform: scale(1) translate(0, 0);}
                    50% { transform: scale(1.15) translate(20px, -30px);}
                }
                .animate-blob3 { animation: blob3 9s infinite ease-in-out; }
                @keyframes float {
                    0%, 100% { transform: translateY(0);}
                    50% { transform: translateY(-12px);}
                }
                .animate-float { animation: float 3s ease-in-out infinite; }
                @keyframes fadein {
                    from { opacity: 0; transform: translateY(20px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                .animate-fadein { animation: fadein 1.2s cubic-bezier(.39,.575,.565,1) both; }
            `}</style>
        </div>
        </>
    );
}