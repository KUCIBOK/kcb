import { Bookmark, Clock, Image, TrendingUp } from "lucide-react"
import { useArtworks } from "../../store/ArtworkContext"
import { ArtworksList } from "../artworks/ArtworksList"
import { AddArtistAction } from "../professional/AddArtistAction";
import { CreateCollection } from "../artworks/CreateCollection";
import { Link } from "react-router-dom";
import { KPICard } from "../ui";



export function Synthesis() {
    const { buyed } = useArtworks();
    const totalValue = buyed?.reduce((acc, artwork) => acc + (artwork.price || 0), 0);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full lg:px-2">
                <KPICard
                    icon={Bookmark}
                    label="Total des œuvres"
                    value={buyed?.length}
                    iconColor="text-purple-400"
                    iconBgColor="bg-purple-900/20"
                />
                
                <KPICard
                    icon={TrendingUp}
                    label="Valeur totale œuvres"
                    value={`${totalValue?.toLocaleString('fr-FR')} CFA`}
                    iconColor="text-green-400"
                    iconBgColor="bg-green-900/20"
                />
            </div>
            <div className="rounded-xl border p-4 my-4">
                <h3 className="flex gap-2 items-center my-2"> <Clock className="w-6 h-6" /> Actions rapides</h3>
                <div className="grid grid-cols-2 mt-2 gap-4">
                    <AddArtistAction/>
                    <CreateCollection/>
                </div>
            </div>
            <ArtworksList artworks={buyed} />
        </div>
    );
}