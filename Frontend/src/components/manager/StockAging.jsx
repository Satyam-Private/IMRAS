import { useEffect, useState } from "react";
import { Calendar, Package, Clock, TrendingUp, AlertCircle } from "lucide-react";
import api from "../../api/api";

export function StockAging({ user }) {
  const [agingData, setAgingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStockAging();
  }, []);

  const fetchStockAging = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/stock-aging");
      setAgingData(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load stock aging data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary stats
  const totalItems = agingData.length;
  const criticalItems = agingData.filter(item => item.age > 180).length;
  const warningItems = agingData.filter(item => item.age > 90 && item.age <= 180).length;
  const totalValue = agingData.reduce((sum, item) => sum + Number(item.value), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Stock Aging Analysis</h1>
              <p className="text-slate-600 mt-1">
                Identify slow-moving and obsolete inventory
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {!loading && !error && agingData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{totalItems}</div>
              <div className="text-sm text-slate-600">Total Items</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-600">{warningItems}</div>
              <div className="text-sm text-slate-600">Aging (90-180 days)</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
              <div className="text-sm text-slate-600">Critical (180+ days)</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                ₹{totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">Total Value</div>
            </div>
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
              <p className="text-slate-600">Loading stock aging data...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : agingData.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No stock aging data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold text-sm">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold text-sm">
                      Item
                    </th>
                    <th className="px-6 py-4 text-center text-slate-700 font-semibold text-sm">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-center text-slate-700 font-semibold text-sm">
                      Age (Days)
                    </th>
                    <th className="px-6 py-4 text-center text-slate-700 font-semibold text-sm">
                      Warehouse
                    </th>
                    <th className="px-6 py-4 text-right text-slate-700 font-semibold text-sm">
                      Value
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {agingData.map((item, index) => (
                    <tr
                      key={item.sku}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-medium text-slate-900">
                          {item.sku}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-slate-700 font-medium">{item.name}</span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-slate-100 rounded-lg text-slate-900 font-semibold text-sm">
                          {item.qty}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm ${item.age > 180
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                            : item.age > 90
                              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white"
                              : "bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700"
                            }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {item.age}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                          {item.warehouse}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="text-slate-900 font-bold">
                          ₹{Number(item.value).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {!loading && !error && agingData.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-slate-600 bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-slate-200 to-slate-300"></div>
                <span>Fresh (0-90 days)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500"></div>
                <span>Aging (90-180 days)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
                <span>Critical (180+ days)</span>
              </div>
            </div>
            <div className="text-slate-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}