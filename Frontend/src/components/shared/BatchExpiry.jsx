import { useState, useEffect } from "react";
import { Calendar, AlertTriangle, MapPin, Package } from "lucide-react";
import api from "../../api/api";

export function BatchExpiry({ user }) {
  const [expiringBatches, setExpiringBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpiringBatches = async () => {
      try {
        const expiryRes = await api.get("/api/batches/expiring?days=30");
        setExpiringBatches(expiryRes.data);
      } catch (err) {
        console.error("Failed to load expiring batches", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringBatches();
  }, []);

  // Calculate summary stats
  const totalBatches = expiringBatches.length;
  const expiringIn7Days = expiringBatches.filter((b) => b.days_left > 0 && b.days_left <= 7).length;
  const expiringIn30Days = expiringBatches.filter((b) => b.days_left > 7 && b.days_left <= 30).length;
  const expired = expiringBatches.filter((b) => b.days_left <= 0).length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Loading batch expiry data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Batch & Expiry Management
        </h1>
        <p className="text-slate-600">
          Track batch quantities, locations, and expiry alerts
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-slate-600" />
            <p className="text-slate-600 text-sm font-medium">Total Batches</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalBatches}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-slate-600 text-sm font-medium">Expiring in 7 Days</p>
          </div>
          <p className="text-3xl font-bold text-red-700">{expiringIn7Days}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <p className="text-slate-600 text-sm font-medium">Expiring in 30 Days</p>
          </div>
          <p className="text-3xl font-bold text-amber-700">{expiringIn30Days}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-slate-400" />
            <p className="text-slate-600 text-sm font-medium">Expired</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{expired}</p>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Expiring Batches (Next 30 Days)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Batch Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Item
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Location
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Expiry Date
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Days Left
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {expiringBatches.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No batches expiring in the next 30 days
                  </td>
                </tr>
              ) : (
                expiringBatches.map((batch) => (
                  <tr key={batch.batch_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">
                          {batch.batch_code}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-slate-900 font-medium">{batch.item_name}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-700">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">
                          {batch.location || (
                            <span className="text-slate-400 italic">Not assigned</span>
                          )}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center text-slate-700 font-medium">
                      {formatDate(batch.expiry_date)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {batch.days_left <= 0 ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                              Expired {Math.abs(batch.days_left)} day{Math.abs(batch.days_left) !== 1 ? 's' : ''} ago
                            </span>
                          </>
                        ) : (
                          <>
                            {batch.days_left <= 14 && (
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                            )}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${batch.days_left <= 7
                                ? "bg-red-100 text-red-700"
                                : batch.days_left <= 14
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-green-100 text-green-700"
                                }`}
                            >
                              {batch.days_left} day{batch.days_left !== 1 ? 's' : ''}
                            </span>
                          </>
                        )}
                      </div>
                    </td>


                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}