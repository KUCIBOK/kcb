import { Users, TrendingUp, Trophy, Target } from "lucide-react";

export function CrmStats({ stats }) {
  const getStatusCount = (status) => {
    const item = stats.clientsByStatus?.find((s) => s._id === status);
    return item?.count || 0;
  };

  const getSegmentCount = (segment) => {
    const item = stats.clientsBySegment?.find((s) => s._id === segment);
    return item?.count || 0;
  };

  const totalRevenue = stats.totalRevenue?.[0]?.total || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Clients */}
      <div className="bg-kcb-ardoise rounded-[4px] p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-kcb-pierre text-sm font-medium">Total Clients</h3>
          <Users className="w-5 h-5 text-kcb-or" />
        </div>
        <p className="text-3xl font-bold text-white">{stats.totalClients}</p>
        <p className="text-xs text-kcb-pierre mt-2">
          {getStatusCount("vip")} VIP • {getStatusCount("client")} Actifs
        </p>
      </div>

      {/* VIP Clients */}
      <div className="bg-kcb-ardoise rounded-[4px] p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-kcb-pierre text-sm font-medium">VIP</h3>
          <Trophy className="w-5 h-5 text-yellow-400" />
        </div>
        <p className="text-3xl font-bold text-white">{stats.vipClients}</p>
        <p className="text-xs text-kcb-pierre mt-2">
          {((stats.vipClients / stats.totalClients) * 100).toFixed(1)}% du total
        </p>
      </div>

      {/* Revenue Total */}
      <div className="bg-kcb-ardoise rounded-[4px] p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-kcb-pierre text-sm font-medium">Chiffre d'affaires</h3>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        <p className="text-3xl font-bold text-white">
          {(totalRevenue / 1000000).toFixed(1)}M
        </p>
        <p className="text-xs text-kcb-pierre mt-2">CFA</p>
      </div>

      {/* Prospects */}
      <div className="bg-kcb-ardoise rounded-[4px] p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-kcb-pierre text-sm font-medium">Prospects</h3>
          <Target className="w-5 h-5 text-kcb-bronze" />
        </div>
        <p className="text-3xl font-bold text-white">{getStatusCount("prospect")}</p>
        <p className="text-xs text-kcb-pierre mt-2">À convertir</p>
      </div>
    </div>
  );
}

export default CrmStats;
