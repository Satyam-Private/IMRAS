import { useEffect, useState } from "react";
import {
  Package,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Repeat,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";

export function InventoryManagerDashboard({ user }) {
  const [kpis, setKpis] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [kpiRes, txRes, staffRes] = await Promise.all([
        api.get("/api/dashboard/kpis"),
        api.get("/api/dashboard/recent-transactions"),
        api.get("/api/dashboard/warehouse-staff"),
      ]);

      setKpis(kpiRes.data);
      setTransactions(txRes.data);
      setStaff(staffRes.data);
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-600">
        Loading dashboard…
      </div>
    );
  }

  const stats = [
    {
      label: "Total Stock Value",
      value: `₹${Number(kpis.total_stock_value || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-blue-600",
      change: "+2.4%",
    },
    {
      label: "Items Below Reorder",
      value: kpis.below_reorder_items || 0,
      icon: TrendingDown,
      color: "bg-amber-500",
      change: "+3",
    },
    {
      label: "Pending PR Approvals",
      value: kpis.pending_pr_approvals || 0,
      icon: Clock,
      color: "bg-red-600",
      change: "+1",
    },
    {
      label: "Overstock Items",
      value: kpis.overstock_items || 0,
      icon: TrendingUp,
      color: "bg-green-600",
      change: "-2",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="p-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Inventory Manager Dashboard
              </h1>
              <p className="text-slate-600">
                Warehouse: <span className="font-bold text-blue-600">
                  {user?.warehouse_code || "Assigned Warehouse"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-slate-100 rounded-lg text-sm">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* TRANSACTIONS + STAFF */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* RECENT TRANSACTIONS */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-slate-900">Recent Transactions</h2>
              </div>
              <button className="text-blue-600 text-sm flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {transactions.length === 0 ? (
              <p className="p-6 text-slate-500 text-sm">No recent activity</p>
            ) : (
              transactions.map((tx, idx) => (
                <div
                  key={idx}
                  className="p-5 flex items-center justify-between border-b last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.transaction_type === "IN"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      <Repeat className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-medium">
                        {tx.name} ({tx.sku})
                      </p>
                      <p className="text-slate-500 text-sm">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <p className={`font-bold ${tx.transaction_type === "IN"
                    ? "text-green-600"
                    : "text-red-600"
                    }`}>
                    {tx.transaction_type === "IN" ? "+" : "-"}
                    {tx.quantity}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* WAREHOUSE STAFF */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b bg-slate-50 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-900">Warehouse Staff</h2>
            </div>

            {staff.length === 0 ? (
              <p className="p-6 text-slate-500 text-sm">No staff found</p>
            ) : (
              staff.map((s, idx) => (
                <div
                  key={idx}
                  className="p-5 flex items-center justify-between border-b last:border-0"
                >
                  <div>
                    <p className="text-slate-900 font-medium">{s.name}</p>
                    <p className="text-slate-500 text-sm">{s.role}</p>
                  </div>
                  <StatusBadge
                    status={s.status}
                    variant={s.status === "Active" ? "success" : "warning"}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}