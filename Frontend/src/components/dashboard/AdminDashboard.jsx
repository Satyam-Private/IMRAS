import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Activity,
} from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";

export function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [pendingPOs, setPendingPOs] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [whRes, userRes, poRes] = await Promise.all([
        api.get("/api/warehouses"),
        api.get("/api/users"),
        api.get("/api/po"),
      ]);

      const activeWarehouses = whRes.data.filter(w => w.is_active).length;
      const pendingPOs = poRes.data.filter(p => p.status === "DRAFT");

      setWarehouses(whRes.data);
      setUsersCount(userRes.data.length);
      setPendingPOs(pendingPOs);

      setStats([
        {
          label: "Active Warehouses",
          value: activeWarehouses,
          icon: Building2,
          color: "bg-blue-600",
        },
        {
          label: "Total Users",
          value: userRes.data.length,
          icon: Users,
          color: "bg-emerald-600",
        },
        {
          label: "Pending PO Approvals",
          value: pendingPOs.length,
          icon: ShoppingCart,
          color: "bg-amber-500",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header with enhanced styling */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                System Administration Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Governance, user management, and system oversight
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-slate-900">
                      {stat.value}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Enhanced Pending POs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Pending PO Approvals
                  </h2>
                  <p className="text-sm text-slate-500">
                    {pendingPOs.length} items awaiting review
                  </p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium hover:gap-3 transition-all group">
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {pendingPOs.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No pending approvals</p>
                  <p className="text-sm text-slate-400 mt-1">All caught up!</p>
                </div>
              ) : (
                pendingPOs.map((po) => (
                  <div
                    key={po.po_id}
                    className="p-5 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          PO-{po.po_id}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          {po.supplier_name}
                        </p>
                      </div>
                      <StatusBadge status="pending" />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-600 flex items-center gap-1">
                        <ShoppingCart className="w-4 h-4" />
                        {po.items_count} items
                      </span>
                      <span className="font-semibold text-slate-900">
                        ₹{Number(po.total_value).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Enhanced Warehouses */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Warehouses Overview
              </h2>
              <p className="text-sm text-slate-500">
                {warehouses.filter(w => w.is_active).length} active locations
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Warehouse
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {warehouses.map((w) => (
                    <tr
                      key={w.warehouse_id}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${w.is_active ? 'bg-blue-100' : 'bg-slate-100'}`}>
                            <Building2 className={`w-5 h-5 ${w.is_active ? 'text-blue-600' : 'text-slate-400'}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              WH-{w.warehouse_id} — {w.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {w.location}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={w.is_active ? "active" : "inactive"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}