import { CheckCircle, ClockFading, Scan } from "lucide-react";
import { useNumerisation } from "../../store/NumerisationStore";
import { AddNumerisation } from "./AddNumerisation";
import { NumerisationList } from "./NumeristionList";

export function NumerisationTab() {
    const { myNumerisations } = useNumerisation();
    const pendingNumerisations = myNumerisations?.filter(num => num?.status === "pending");
    return (
        <div className="space-y-4">
            <div className="flex md:flex-row flex-col gap-6 w-full lg:px-2">
                <div className="flex md:flex-row flex-col gap-6 w-full lg:px-2">
                    <div className="md:w-1/2 min-h-[18vh] w-full rounded-xl p-4 border text-sm space-4">
                        <div className="flex justify-between items-center">
                            <h6>Total des numérisations</h6>
                            <Scan className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-2xl font-bold text-white mt-2">
                            {myNumerisations?.length}
                        </p>
                    </div>
                    <div className="md:w-1/2 min-h-[18vh] w-full rounded-xl p-4 border text-sm space-4">
                        <div className="flex justify-between items-center">
                            <h6>En attente</h6>
                            <ClockFading className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-2xl font-bold text-white mt-2">
                            {myNumerisations.length > 0 ? myNumerisations?.filter(numerisation => numerisation?.status === "pending")?.length : 0}
                        </p>
                    </div>
                    <div className="md:w-1/2 min-h-[18vh] w-full rounded-xl p-4 border text-sm space-4">
                        <div className="flex justify-between items-center">
                            <h6>Terminées</h6>
                            <CheckCircle className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-2xl font-bold text-white mt-2">
                            {myNumerisations?.filter(numerisation => numerisation?.status === "delivered")?.length}
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:px-2">
                <AddNumerisation />
            </div>
            <div className="w-full lg:px-2">
                <h3 className="text-white text-2xl flex items-center gap-2 mb-2"> <Scan className="w-6 h-6" /> Historique des numérisations </h3>
                <NumerisationList numerisations={myNumerisations} />
            </div>
        </div>
    );
}
