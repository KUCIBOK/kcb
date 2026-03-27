import { useState, useEffect } from "react"
import { getAllSubscriptions } from "../../api/useSubscriptions"
import { useArtworks } from "../../store/ArtworkContext"
import { useUsersContext } from "../../store/UsersStore"
import { AlertTriangle, BarChart4, Clock, CreditCard, Download, Image, UserCheck, Users } from "lucide-react"
import { useArtist } from "../../store/ArtistContext"
import { getAllVisitors } from "../../api/useVisitor"
import { exportExcelData } from "../../api/useUsers"
import { KPICard, Button } from "../ui";

export function Synthesis({setTab, setToggle}){
    const {users, artists : artistUsers, professionals, collectors} = useUsersContext()
    const {artworks, pending} = useArtworks()
    const [state, setState] = useState({
        subscriptions: [],
        visitors: [],
        visitorsThisMonth: [],
        AverageVisitTime : 0,
        AverageVisitTimeThisMonth : 0,
    });
    const {artists} = useArtist()
    useEffect(() => {
        const getSusbscriptions = async function(){
            try {
                const subscriptions = await getAllSubscriptions()
                if(subscriptions?.length > 0){
                    setState(prev => ({...prev, subscriptions: subscriptions.filter(item => item?.status == "active")}))
                }
            } catch (error) {
                setState(prev => ({...prev, subscriptions: { ...prev.subscriptions, loading : false }}))
            }
        }
        getSusbscriptions()

        const fetchVisitors = async () => {
            const visitors = await getAllVisitors();
            if (visitors?.length > 0) {
                setState(prev => ({
                    ...prev,
                    visitors: visitors,
                    visitorsThisMonth: visitors.filter(visitor => new Date(visitor.createdAt).getMonth() === new Date().getMonth()),
                    AverageVisitTime: visitors?.filter(visitor => visitor?.visitTime != 0).reduce((acc, visitor) => acc + visitor.visitTime, 0) / visitors?.filter(visitor => visitor?.visitTime != 0)?.length || 0,
                    AverageVisitTimeThisMonth: visitors?.filter(visitor => new Date(visitor.createdAt).getMonth() === new Date().getMonth() && visitor?.visitTime != 0).reduce((acc, visitor) => acc + visitor.visitTime, 0) / visitors?.filter(visitor => new Date(visitor.createdAt).getMonth() === new Date().getMonth() && visitor?.visitTime != 0)?.length || 0,
                    loading : false
                }));
            }
        };
        fetchVisitors();
    }, [])
    const downloadUsersData = async () => {
        try {
            const blob = await exportExcelData()
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Utilisateurs.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            
        }
    }
    return (
        <>
        <div className="flex items-center justify-end px-2 my-2">
            <Button variant="secondary" icon={Download} onClick={downloadUsersData}>
                Télécharger les utilisateurs
                <span className="w-4 h-4 ml-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16">
                        <rect x="2" y="6" width="28" height="20" rx="3" fill="#217346"/>
                        <rect x="8" y="10" width="16" height="12" rx="1.5" fill="#fff"/>
                        <text x="16" y="20" textAnchor="middle" fontSize="10" fill="#217346" fontFamily="DM Sans, sans-serif" fontWeight="bold">X</text>
                    </svg>
                </span>
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full lg:px-2">
            <KPICard
                icon={Users}
                label="Visiteurs totaux"
                value={state?.visitors?.length}
                subtitle={`${Number(state?.AverageVisitTime).toFixed(0)} min en moyenne`}
                iconColor="text-kcb-or"
                iconBgColor="bg-kcb-or/10"
            />
            
            <KPICard
                icon={Users}
                label="Visiteurs ce mois"
                value={state?.visitorsThisMonth?.length}
                subtitle={`${Number(state?.AverageVisitTimeThisMonth).toFixed(0)} min en moyenne`}
                iconColor="text-green-400"
                iconBgColor="bg-green-900/20"
            />
            
            <KPICard
                icon={UserCheck}
                label="Utilisateurs totaux"
                value={users?.length}
                iconColor="text-kcb-bronze"
                iconBgColor="bg-kcb-bronze/10"
            />
            
            <KPICard
                icon={Image}
                label="Oeuvres totales"
                value={artworks?.length}
                subtitle={`${pending?.length} en attente`}
                iconColor="text-kcb-or"
                iconBgColor="bg-kcb-or/10"
            />
            
            <KPICard
                icon={CreditCard}
                label="Abonnements actifs"
                value={state?.subscriptions?.length}
                iconColor="text-kcb-or"
                iconBgColor="bg-kcb-or/10"
            />
        </div>
        
        <div className="rounded-[4px] border border-white/[0.06] p-4 my-4">
            <h3 className="flex gap-2 items-center my-2"> <Clock className="w-6 h-6" /> Actions rapides</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div onClick={() => {setTab(1); setToggle(false)}} className="rounded-[4px] border border-white/[0.06] p-4 grid place-items-center gap-2 hover:bg-kcb-noir-deep cursor-pointer">
                    <AlertTriangle className="w-4 h-4" />
                    Réviser les oeuvres
                    <span className="rounded-full text-center text-xs font-medium px-2 text-white bg-red-900">
                        {pending?.length}
                    </span>
                </div>
                <div onClick={() => {setTab(4); setToggle(false)}} className="rounded-[4px] border border-white/[0.06] p-4 grid place-items-center gap-2 hover:bg-kcb-noir-deep cursor-pointer">
                    <Users className="w-4 h-4" />
                    Gérer les utilisateurs
                    <span className="rounded-full text-center text-xs font-medium px-2 text-white bg-kcb-ardoise/80">
                        {users?.length}
                    </span>
                </div>
                <div onClick={() => {setTab(13); setToggle(false)}} className="rounded-[4px] border border-white/[0.06] p-4 grid place-items-center gap-2 hover:bg-kcb-noir-deep cursor-pointer">
                    <CreditCard className="w-4 h-4" />
                    Abonnements
                    <span className="rounded-full text-center text-xs font-medium px-2 text-white bg-kcb-or/80">
                        {state?.subscriptions?.length}
                    </span>
                </div>
                <div onClick={() => {setTab(0); setToggle(false)}} className="rounded-[4px] border border-white/[0.06] p-4 grid place-items-center gap-2 hover:bg-kcb-noir-deep cursor-pointer">
                    <BarChart4 className="w-4 h-4" />
                    Voir les rapports
                    <span className="rounded-full text-center text-xs font-medium px-2 text-white border border-white/[0.06] px-1">
                        Analytics
                    </span>
                </div>
            </div>
        </div>
        
        <div className="flex flex-col-reverse lg:flex-row-reverse gap-6 py-4">
            <div className="rounded-[4px] border p-4 shadow-sm overflow-auto lg:w-1/2">
                <h3 className="text-2xl font-semibold mb-2">Top Artistes</h3>
                <ul>
                    {artists
                        ?.map(artist => {
                            const sales = artworks?.filter(
                                artwork => artwork.artist_id === artist.id && artwork.sold
                            ) || [];
                            const totalSales = sales.reduce((sum, a) => sum + Number(a.sold_price || 0), 0);
                            return { ...artist, salesCount: sales.length, totalSales };
                        })
                        .sort((a, b) => b.totalSales - a.totalSales)
                        .slice(0, 4)
                        .map((artist, idx) => (
                            <li key={artist.id} className="flex justify-between items-start">
                                <div className="flex items-center">
                                    <p>
                                        <span className="flex-1 text-white text-sm font-medium">{artist.name}</span> <br />
                                        <span className="text-kcb-pierre text-xs mr-4">{artist.salesCount} ventes</span>
                                    </p>
                                </div>
                                <span className="text-white font-medium text-sm">{artist.totalSales.toLocaleString()} CFA</span>
                            </li>
                        ))}
                    {(!artists || artists.length === 0) && (
                        <li className="py-2 text-center text-sm text-kcb-pierre">Aucun artiste trouvé.</li>
                    )}
                </ul>
            </div>
            <div className="rounded-[4px] border p-4 shadow-sm overflow-auto lg:w-1/2">
                <h3 className="text-2xl font-semibold mb-2 flex items-center"> <UserCheck className="w-5 h-5 mx-2 text-white" /> Répartition des utilisateurs</h3>
                <div className="flex flex-col gap-6 my-4">
                    <p className="flex justify-between items-start text-white">
                        <span className="flex items-center gap-2 text-sm"><Image className="text-kcb-or w-4 h-4" /> Artistes</span>
                        <span className="text-md text-white font-medium"> {artistUsers?.length} <span className="text-kcb-pierre text-xs"> ({(users?.length ? ((artistUsers?.length * 100)/users?.length).toFixed(1) : 0)}%) </span> </span>
                    </p>
                    <p className="flex justify-between items-start text-white">
                        <span className="flex items-center gap-2 text-sm"><Users className="text-green-600 w-4 h-4" /> Collectionneurs</span>
                        <span className="text-md text-white font-medium"> {collectors?.length} <span className="text-kcb-pierre text-xs"> ({(users?.length ? ((collectors?.length * 100)/users?.length).toFixed(1) : 0)}%) </span> </span>
                    </p>
                    <p className="flex justify-between items-start text-white">
                        <span className="flex items-center gap-2 text-sm"><CreditCard className="text-kcb-bronze w-4 h-4" /> Professionnels</span>
                        <span className="text-md text-white font-medium"> {professionals?.length} <span className="text-kcb-pierre text-xs"> ({(users?.length ? ((professionals?.length * 100)/users?.length).toFixed(1) : 0)}%) </span> </span>
                    </p>
                </div>
            </div>
        </div>
        </>
    )
}