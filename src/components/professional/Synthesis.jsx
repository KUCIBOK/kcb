import { Clock, Image, Palette, TrendingUp, Truck, BarChart3, TrendingDown, Target, Award, DollarSign, ArrowUp, ArrowDown } from "lucide-react"
import { useArtist } from "../../store/ArtistContext"
import { useArtworks } from "../../store/ArtworkContext"
import { AddArtistAction } from "./AddArtistAction"
import { Link } from "react-router-dom"
import { ArtistTable } from "../artists/ArtistTable"
import { ArtworksList } from "../artworks/ArtworksList"
import { Bar, Pie, Line } from "react-chartjs-2";
import { ArcElement,
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { CreateCollection } from "../artworks/CreateCollection"
import { KPICard } from "../ui";

export function Synthesis(){
    const {myArtists} = useArtist()
    const {myArtworks} = useArtworks()
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // ===== DONNÉES DE BASE =====
    const monthlySales = myArtworks
        ?.filter(
            (artwork) =>
                artwork.sold &&
                artwork.sold_price &&
                artwork.sold_at &&
                new Date(artwork.sold_at).getMonth() === currentMonth &&
                new Date(artwork.sold_at).getFullYear() === currentYear
        )
        .reduce((sum, artwork) => sum + Number(artwork.sold_price || 0), 0);

    const deliveredArtworks = myArtworks?.filter(item => item?.isDelivered == "delivered")?.length
    const soldArtworksNumber = myArtworks?.filter(item => item?.sold == true)?.length

    // ===== REVENUE MENSUEL =====
    const monthlyRevenue = Array.from({ length: 12 }, (_, month) => {
        return myArtworks
            ?.filter(
                (artwork) =>
                    artwork.sold &&
                    artwork.sold_price &&
                    artwork.sold_at &&
                    new Date(artwork.sold_at).getMonth() === month &&
                    new Date(artwork.sold_at).getFullYear() === currentYear
            )
            .reduce((sum, artwork) => sum + Number(artwork.sold_price || 0), 0) || 0;
    });

    const monthLabels = [
        "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
        "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"
    ];

    ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement, Filler);

    // ===== GRAPHIQUE 1: CHIFFRE D'AFFAIRES MENSUEL =====
    const barData = {
        labels: monthLabels,
        datasets: [
            {
                label: "Chiffre d'affaires (CFA)",
                data: monthlyRevenue,
                backgroundColor: "rgba(34,197,94,0.7)",
                borderRadius: 6,
                borderColor: "rgba(34,197,94,1)",
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
                    callback: (value) => (value / 1000000).toFixed(0) + "M",
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

    // ===== GRAPHIQUE 2: VENTES PAR ARTISTE =====
    const artistsData = myArtists
        ?.map(artist => {
            const sales = myArtworks?.filter(
                artwork => artwork.artist_id === artist.id && artwork.sold
            ) || [];
            const totalSales = sales.reduce((sum, a) => sum + Number(a.sold_price || 0), 0);
            return { name: artist.name, salesCount: sales.length, totalSales };
        })
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 8) || [];

    const artistBarData = {
        labels: artistsData.map(a => a.name),
        datasets: [
            {
                label: "Ventes par artiste",
                data: artistsData.map(a => a.totalSales),
                backgroundColor: "rgba(59,130,246,0.7)",
                borderColor: "rgba(59,130,246,1)",
                borderRadius: 6,
            },
        ],
    };

    const artistBarOptions = {
        indexAxis: "y",
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    color: "#fff",
                    callback: (value) => (value / 1000000).toFixed(0) + "M",
                },
                grid: { color: "#333" }
            },
            y: {
                ticks: { color: "#fff" },
                grid: { color: "#333" }
            }
        }
    };

    // ===== GRAPHIQUE 3: TENDANCE VENTES (LIGNE) =====
    const lineData = {
        labels: monthLabels,
        datasets: [
            {
                label: "Tendance des ventes",
                data: monthlyRevenue,
                borderColor: "rgba(168,85,247,1)",
                backgroundColor: "rgba(168,85,247,0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "rgba(168,85,247,1)",
                pointRadius: 5,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: "#fff" } },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#fff",
                    callback: (value) => (value / 1000000).toFixed(0) + "M",
                },
                grid: { color: "#333" }
            },
            x: {
                ticks: { color: "#fff" },
                grid: { color: "#333" }
            }
        }
    };

    // ===== ROI PAR ARTWORK =====
    const artworksWithROI = myArtworks
        ?.filter(a => a.sold && a.estimated_price && a.sold_price)
        .map(a => ({
            title: a.title || "Sans titre",
            estimatedPrice: Number(a.estimated_price || 0),
            soldPrice: Number(a.sold_price || 0),
            roi: ((Number(a.sold_price || 0) - Number(a.estimated_price || 0)) / Number(a.estimated_price || 1)) * 100
        }))
        .sort((a, b) => b.roi - a.roi)
        .slice(0, 10) || [];

    // ===== PRÉVISIONS DE VENTE =====
    const averageMonthlyRevenue = monthlyRevenue.reduce((a, b) => a + b, 0) / monthlyRevenue.length;
    const revenueGrowth = monthlyRevenue[currentMonth] > averageMonthlyRevenue ? 5 : -3;
    const forecastedRevenue = Array.from({ length: 3 }, (_, i) => {
        return averageMonthlyRevenue * (1 + (revenueGrowth / 100) * (i + 1));
    });

    // ===== STATISTIQUES =====
    const totalRevenue = myArtworks?.reduce((sum, a) => sum + (a.sold ? Number(a.sold_price || 0) : 0), 0) || 0;
    const averagePricePerArtwork = soldArtworksNumber > 0 ? totalRevenue / soldArtworksNumber : 0;
    const bestROIArtwork = artworksWithROI[0];
    const worstROIArtwork = artworksWithROI[artworksWithROI.length - 1];
    const conversionRate = myArtworks?.length > 0 ? (soldArtworksNumber / myArtworks.length * 100) : 0;

    const soldCount = myArtworks?.filter(a => a.sold)?.length || 0;
    const forSaleCount = myArtworks?.filter(a => a.status == "approved" && a.for_sale)?.length || 0;
    const pendingCount = myArtworks?.filter(a => a.status == "pending")?.length || 0;

    const pieData = {
        labels: ["Vendues", "En vente", "En attente"],
        datasets: [
            {
                data: [soldCount, forSaleCount, pendingCount],
                backgroundColor: [
                    "rgba(34,197,94,0.8)",
                    "rgba(59,130,246,0.8)",
                    "rgba(251,191,36,0.8)",
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
        <div className="space-y-6 pb-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    icon={Palette}
                    label="Mes artistes"
                    value={myArtists?.length || 0}
                    iconColor="text-purple-400"
                    iconBgColor="bg-purple-900/20"
                />

                <KPICard
                    icon={Image}
                    label="Oeuvres totales"
                    value={myArtworks?.length || 0}
                    iconColor="text-blue-400"
                    iconBgColor="bg-blue-900/20"
                />

                <KPICard
                    icon={TrendingUp}
                    label="Ventes mensuels"
                    value={`${monthlySales?.toLocaleString('fr-FR') || 0} CFA`}
                    trend={{ 
                        value: revenueGrowth > 0 ? `+${revenueGrowth}%` : `${revenueGrowth}%`, 
                        direction: revenueGrowth > 0 ? 'up' : 'down' 
                    }}
                    iconColor="text-green-400"
                    iconBgColor="bg-green-900/20"
                />

                <KPICard
                    icon={Truck}
                    label="Livrées / Vendues"
                    value={`${deliveredArtworks}/${soldArtworksNumber}`}
                    subtitle={`${((deliveredArtworks/soldArtworksNumber)*100 || 0).toFixed(0)}% livrées`}
                    iconColor="text-orange-400"
                    iconBgColor="bg-orange-900/20"
                />
            </div>

            {/* Advanced Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl p-4 border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <h6 className="text-gray-400 text-sm">Revenue total</h6>
                        <DollarSign className="w-4 h-4 text-green-400" />
                    </div>
                    <p className="text-xl font-bold text-white">{(totalRevenue / 1000000).toFixed(2)}M CFA</p>
                    <p className="text-xs text-gray-400 mt-2">Toutes les ventes</p>
                </div>

                <div className="bg-card rounded-xl p-4 border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <h6 className="text-gray-400 text-sm">Prix moyen</h6>
                        <Target className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-xl font-bold text-white">{(averagePricePerArtwork / 1000).toFixed(0)}K CFA</p>
                    <p className="text-xs text-gray-400 mt-2">Par oeuvre vendue</p>
                </div>

                <div className="bg-card rounded-xl p-4 border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <h6 className="text-gray-400 text-sm">Taux de conversion</h6>
                        <ArrowUp className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-xl font-bold text-white">{conversionRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-400 mt-2">{soldArtworksNumber} / {myArtworks?.length}</p>
                </div>

                <div className="bg-card rounded-xl p-4 border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <h6 className="text-gray-400 text-sm">Meilleur ROI</h6>
                        <Award className="w-4 h-4 text-yellow-400" />
                    </div>
                    <p className="text-xl font-bold text-green-400">{bestROIArtwork?.roi?.toFixed(1)}%</p>
                    <p className="text-xs text-gray-400 mt-2 truncate">{bestROIArtwork?.title}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg p-4 border border-gray-700">
                <h3 className="flex gap-2 items-center my-2 text-lg font-semibold text-white">
                    <Clock className="w-5 h-5" /> Actions rapides
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <AddArtistAction/>
                    <Link to={"add-artwork"} className="rounded-lg border border-gray-700 p-4 grid place-items-center gap-2 hover:bg-gray-900 cursor-pointer transition">
                        <Image className="w-4 h-4" />
                        <span className="text-sm">Ajouter une oeuvre</span>
                    </Link>
                    <CreateCollection/>
                </div>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Monthly Revenue */}
                <div className="bg-card rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Chiffre d'affaires mensuel
                    </h3>
                    <Bar data={barData} options={barOptions} height={250} />
                </div>

                {/* Status Distribution */}
                <div className="bg-card rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-white">Répartition des oeuvres</h3>
                    <Pie data={pieData} options={pieOptions} height={250} />
                </div>
            </div>

            {/* Trend Line */}
            <div className="bg-card rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Tendance des ventes
                </h3>
                <Line data={lineData} options={lineOptions} height={250} />
            </div>

            {/* Sales by Artist */}
            {artistsData.length > 0 && (
                <div className="bg-card rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        Top artistes par chiffre d'affaires
                    </h3>
                    <Bar data={artistBarData} options={artistBarOptions} height={300} />
                </div>
            )}

            {/* ROI Analysis */}
            {artworksWithROI.length > 0 && (
                <div className="bg-card rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        Analyse ROI par oeuvre (Top 10)
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {artworksWithROI.map((artwork, idx) => (
                            <div key={idx} className="bg-background/50 rounded-lg p-3 flex justify-between items-center">
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium truncate">{idx + 1}. {artwork.title}</p>
                                    <p className="text-xs text-gray-400">Estimé: {(artwork.estimatedPrice / 1000).toFixed(0)}K → Vendu: {(artwork.soldPrice / 1000).toFixed(0)}K CFA</p>
                                </div>
                                <div className={`text-right ${artwork.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    <div className="flex items-center gap-1">
                                        {artwork.roi >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                        <span className="font-bold">{artwork.roi.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Forecast */}
            <div className="bg-card rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    Prévisions de vente (3 mois)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    {["Mois 1", "Mois 2", "Mois 3"].map((month, idx) => (
                        <div key={idx} className="bg-background/50 rounded-lg p-4 text-center">
                            <p className="text-gray-400 text-sm mb-2">{month}</p>
                            <p className="text-2xl font-bold text-indigo-400">
                                {(forecastedRevenue[idx] / 1000000).toFixed(2)}M
                            </p>
                            <p className="text-xs text-gray-500 mt-2">CFA estimé</p>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                    Basé sur une croissance de {revenueGrowth}% / mois
                </p>
            </div>

            {/* Artists and Artworks Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4 border border-gray-700 overflow-auto">
                    <h3 className="text-lg font-semibold mb-4 text-white">Mes artistes</h3>
                    <ArtistTable artists={myArtists} />
                </div>
                <div className="bg-card rounded-lg p-4 border border-gray-700 overflow-auto">
                    <h3 className="text-lg font-semibold mb-4 text-white">Mes oeuvres récentes</h3>
                    <ArtworksList title="" artworks={myArtworks?.slice(0, 5) || []} />
                </div>
            </div>
        </div>
        </>
    )
}
