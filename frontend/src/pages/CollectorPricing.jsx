import { PlansList } from "../components/plans/PlansList";
import { usePlanStore } from "../store/PlanContext";
import { useEffect } from "react";

export default function CollectorPricing() {
  const { collectorPlans } = usePlanStore();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181824] px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 mt-10 text-center tracking-tight">Plans Collectionneur</h1>
      <p className="text-base md:text-lg text-gray-400 mb-8 text-center max-w-xl">
        Choisissez l’abonnement qui vous convient et accédez à toutes les fonctionnalités pour gérer et valoriser votre collection d’art.
      </p>
      <div className="w-full max-w-5xl">
        <PlansList plans={collectorPlans} title={null} />
      </div>
    </div>
  );
}