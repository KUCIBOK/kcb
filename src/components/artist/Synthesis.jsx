import { Clock, Image, TrendingUp, Truck, Users } from "lucide-react"
import { useArtist } from "../../store/ArtistContext"
import { useArtworks } from "../../store/ArtworkContext"
import { Link } from "react-router-dom"
import { ArtistTable } from "../artists/ArtistTable"
import { ArtworksList } from "../artworks/ArtworksList"
import { Bar, Pie } from "react-chartjs-2";
import { ArcElement,
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { CreateCollection } from "../artworks/CreateCollection"
import { KPICard } from "../ui";

export function Synthesis(){
    const {myArtworks} = useArtworks()
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlySales = myArtworks
    ?.filter(
        (artwork) =>
            artwork.sold &&
            artwork.soldPrice &&
            artwork.soldAt &&
            new Date(artwork.soldAt).getMonth() === currentMonth &&
            new Date(artwork.soldAt).getFullYear() === currentYear
    )
    .reduce((sum, artwork) => sum + Number(artwork.soldPrice || 0), 0);

    const deliveredArtworks = myArtworks?.filter(item => item?.isDelivered == "delivered")?.length
    const soldArtworksNumber = myArtworks?.filter(item => item?.sold == true)?.length

    // Calcul du chiffre d'affaires pour chaque mois de l'année courante
    const monthlyRevenue = Array.from({ length: 12 }, (_, month) => {
        return myArtworks
            ?.filter(
                (artwork) =>
                    artwork.sold &&
                    artwork.soldPrice &&
                    artwork.soldAt &&
                    new Date(artwork.soldAt).getMonth() === month &&
                    new Date(artwork.soldAt).getFullYear() === currentYear
            )
            .reduce((sum, artwork) => sum + Number(artwork.soldPrice || 0), 0) || 0;
    });

    // Préparation des labels pour les mois
    const monthLabels = [
        "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
        "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"
    ];

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const barData = {
        labels: monthLabels,
        datasets: [
            {
                label: "Chiffre d'affaires (CFA)",
                data: monthlyRevenue,
                backgroundColor: "rgba(34,197,94,0.7)",
                borderRadius: 6,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => value.toLocaleString(),
                    color: "#fff"
                },
                grid: { color: "#333" }
            },
            x: {
                ticks: { color: "#fff" },
                grid: { color: "#333" }
            }
        }
    };
    ChartJS.register(ArcElement);

    const soldCount = myArtworks?.filter(a => a.sold)?.length || 0;
    const forSaleCount = myArtworks?.filter(a => a.status == "approved" && a.forSale)?.length || 0;
    const pendingCount = myArtworks?.filter(a => a.status == "pending")?.length || 0;

    const pieData = {
        labels: ["Vendues", "En vente", "En attente"],
        datasets: [
            {
                data: [soldCount, forSaleCount, pendingCount],
                backgroundColor: [
                    "rgba(34,197,94,0.8)",   // green for sold
                    "rgba(59,130,246,0.8)",  // blue for for sale
                    "rgba(251,191,36,0.8)",  // yellow for pending
                ],
                borderWidth: 1,
                
            },
        ],
    };

    const pieOptions = {
        plugins: {
            legend: {
                labels: {
                    color: "#fff",
                    font: { size: 14 },
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
      <>
        {/* Statistiques synthétiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full lg:px-2">
            <KPICard
                icon={Image}
                label="Total œuvres"
                value={myArtworks?.length}
                iconColor="text-blue-400"
                iconBgColor="bg-blue-900/20"
            />
            
            <KPICard
                icon={TrendingUp}
                label="Ventes totales"
                value={`${monthlySales?.toLocaleString('fr-FR')} CFA`}
                iconColor="text-green-400"
                iconBgColor="bg-green-900/20"
            />
            
            <KPICard
                icon={Truck}
                label="Oeuvres livrées"
                value={`${deliveredArtworks}/${soldArtworksNumber}`}
                subtitle={`${((deliveredArtworks/soldArtworksNumber)*100 || 0).toFixed(0)}% livrées`}
                iconColor="text-orange-400"
                iconBgColor="bg-orange-900/20"
            />
        </div>

        {/* Actions rapides */}
        <div className="rounded-xl border p-4 my-4">
            <h3 className="flex gap-2 items-center my-2"> <Clock className="w-6 h-6" /> Actions rapides</h3>
            <div className="grid grid-cols-2 gap-4">
                <Link to="submit-artwork" className="rounded-lg border p-4 grid place-items-center gap-2 hover:bg-gray-900 cursor-pointer">
                    <Image className="w-4 h-4" />
                    Ajouter une oeuvre
                </Link>
                <CreateCollection />
            </div>
        </div>

        {/* Graphiques et liste */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl bg-card border border-gray-800 p-4 shadow-sm">
            <h3 className="text-base font-semibold text-white mb-2">Chiffre d'affaires mensuel</h3>
            <Bar data={barData} options={barOptions} height={220} />
          </div>
          <div className="rounded-xl bg-card border border-gray-800 p-4 shadow-sm">
            <ArtworksList title="Mes œuvres" artworks={myArtworks?.slice(0, 5) || []} />
          </div>
        </div>

        {/* Pie chart */}
        <div className="rounded-xl bg-card border border-gray-800 p-4 shadow-sm">
          <h3 className="text-base font-semibold text-white mb-2">Répartition des œuvres</h3>
          <div className="h-56 flex items-center justify-center">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </>
    );
}