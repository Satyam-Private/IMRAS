import { useEffect, useState } from "react";
import {
  Truck,
  PackageCheck,
  AlertTriangle,
  Package,
  ArrowRight,
  Clock,
} from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";

export function WarehouseStaffDashboard({ user }) {
  const [stats, setStats] = useState([]);
  const [todayGRNs, setTodayGRNs] = useState([]);
  const [expiringBatches, setExpiringBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, expiryRes] = await Promise.all([
          api.get("/api/dashboard/warehouse"),
          api.get("/api/batches/expiring?days=30"),
        ]);

        setExpiringBatches(expiryRes.data);

        // Set today's GRNs from the API response
        setTodayGRNs(statsRes.data.grns?.rows || []);

        setStats([
          {
            label: "Today's GRNs",
            value: statsRes.data.todays_grns,
            icon: Truck,
            color: "bg-blue-600",
          },
          {
            label: "Pending Putaway",
            value: statsRes.data.pending_putaway,
            icon: Package,
            color: "bg-amber-500",
          },
          {
            label: "Expiring Batches",
            value: expiryRes.data.length,
            icon: AlertTriangle,
            color: "bg-red-500",
          },
          {
            label: "Low Stock Items",
            value: statsRes.data.low_stock_items,
            icon: PackageCheck,
            color: "bg-green-600",
          },
        ]);
      } catch (err) {
        console.error("Failed to load warehouse dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Warehouse Operations Dashboard
        </h1>
        <p className="text-slate-600 text-lg">
          Warehouse: <span className="font-semibold">{user?.assignedWarehouse || "—"}</span> · {todayLabel}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-4xl font-bold text-slate-900">
                  {stat.value}
                </span>
              </div>
              <p className="text-slate-600 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's GRNs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Today's Goods Receipts</h2>
            </div>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {todayGRNs.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No GRNs received today
              </div>
            )}

            {todayGRNs.map((grn) => (
              <div key={grn.grn_id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 flex-1">
                    <Package className="w-5 h-5 text-slate-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900">GRN #{grn.grn_id}</p>
                        <span className="text-xs text-slate-500">• PO #{grn.po_id}</span>
                      </div>

                      {grn.item_names && (
                        <p className="text-sm text-slate-700 mb-1">
                          {grn.item_names}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <PackageCheck className="w-3 h-3" />
                          {grn.total_items} item{grn.total_items !== "1" ? "s" : ""}
                        </span>
                        <span>•</span>
                        <span>Qty: {grn.total_quantity || "0"}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(grn.received_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={grn.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Batches */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Expiring Batches (Next 30 Days)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Batch</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Item</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Expiry</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Days Left</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expiringBatches.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No batches expiring in the next 30 days
                    </td>
                  </tr>
                ) : (
                  expiringBatches.map((b) => (
                    <tr key={b.batch_code} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{b.batch_code}</td>
                      <td className="px-6 py-4 text-slate-700">{b.item_name}</td>
                      <td className="px-6 py-4 text-slate-600">{b.location || "—"}</td>
                      <td className="px-6 py-4 text-slate-700">{b.expiry_date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${b.days_left <= 14
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {b.days_left} days
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}