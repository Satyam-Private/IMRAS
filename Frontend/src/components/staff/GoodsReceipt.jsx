import { useEffect, useState } from "react";
import { Search, Truck, Package, Calendar, Hash, CheckCircle2, X } from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";

export function GoodsReceipt() {
  const [pendingGRNs, setPendingGRNs] = useState([]);
  const [selectedGRN, setSelectedGRN] = useState(null);
  const [grnItems, setGrnItems] = useState([]);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PENDING GRNs ================= */

  useEffect(() => {
    fetchPendingGRNs();
  }, []);

  const fetchPendingGRNs = async () => {
    try {
      const res = await api.get("/api/grns/pending");
      setPendingGRNs(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* ================= OPEN RECEIVE MODAL ================= */

  const openReceiveGRN = async (grn) => {
    try {
      setSelectedGRN(grn);
      const res = await api.get(`/grns/${grn.grn_id}/items`);

      setGrnItems(
        res.data.map((item) => ({
          ...item,
          expected_qty: item.received_qty,
          received_qty: "",
          batch_code: "",
          expiry_date: "",
        }))
      );

      setShowReceiveModal(true);
    } catch (err) {
      console.error('Failed to load GRN items', err);
      alert('Failed to load GRN items');
    }
  };

  /* ================= UPDATE ITEM STATE ================= */

  const updateItem = (index, key, value) => {
    const copy = [...grnItems];
    copy[index][key] = value;
    setGrnItems(copy);
  };

  /* ================= COMPLETE GRN ================= */

  const completeGRN = async () => {
    // Basic validation
    for (const item of grnItems) {
      if (!item.received_qty || Number(item.received_qty) <= 0) {
        alert("Received quantity must be greater than 0");
        return;
      }

      if (item.batch_required && !item.batch_code) {
        alert("Batch code is required for batch-tracked items");
        return;
      }
    }

    try {
      await api.post(`/api/grns/${selectedGRN.grn_id}/receive`, {
        items: grnItems.map((i) => ({
          item_id: i.item_id,
          received_qty: Number(i.received_qty),
          batch_code: i.batch_code || null,
          expiry_date: i.expiry_date || null,
        })),
      });

      setShowReceiveModal(false);
      setSelectedGRN(null);
      setGrnItems([]);
      fetchPendingGRNs();
    } catch (err) {
      alert("Failed to receive GRN");
    }
  };

  /* ================= FILTER ================= */

  const filteredGRNs = pendingGRNs.filter((g) => {
    if (!searchQuery) return true;
    return (
      g.grn_id.toString().includes(searchQuery) ||
      g.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading GRNs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Goods Receipt</h1>
              <p className="text-slate-600 mt-1">
                Receive and process approved purchase orders
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Pending GRNs</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{pendingGRNs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Search Section */}
          <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by GRN ID or supplier name..."
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>

          {/* GRN List */}
          <div className="divide-y divide-slate-100">
            {filteredGRNs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No pending GRNs found</p>
                <p className="text-sm text-slate-500 mt-1">All goods receipts have been processed</p>
              </div>
            ) : (
              filteredGRNs.map((grn) => (
                <div
                  key={grn.grn_id}
                  className="p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent cursor-pointer transition-all duration-200 group"
                  onClick={() => openReceiveGRN(grn)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Truck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">GRN-{grn.grn_id}</p>
                        <p className="text-sm text-slate-600 font-medium">
                          {grn.warehouse_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <StatusBadge status="pending" />
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(grn.received_at).toLocaleString()}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                          Process →
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ================= RECEIVE MODAL ================= */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <CheckCircle2 className="w-7 h-7" />
                    Receive GRN-{selectedGRN.grn_id}
                  </h2>
                  <p className="text-blue-100 mt-1">
                    {selectedGRN.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowReceiveModal(false)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6 bg-slate-50">
              <div className="space-y-4">
                {grnItems.map((item, i) => (
                  <div
                    key={i}
                    className="border-2 border-slate-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Item Header */}
                    <div className="flex items-start gap-3 mb-4 pb-4 border-b border-slate-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold text-slate-900">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Hash className="w-3 h-3 text-slate-400" />
                          <p className="text-xs text-slate-500 font-medium">SKU: {item.sku}</p>
                        </div>
                      </div>
                    </div>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">
                          Ordered Qty
                        </label>
                        <input
                          disabled
                          value={item.expected_qty}
                          className="w-full border-2 border-slate-200 px-4 py-3 rounded-lg bg-slate-50 text-sm font-medium text-slate-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 block">
                          Received Qty *
                        </label>
                        <input
                          type="number"
                          value={item.received_qty}
                          onChange={(e) =>
                            updateItem(i, "received_qty", e.target.value)
                          }
                          className="w-full border-2 border-slate-200 px-4 py-3 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter quantity"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">
                          Batch Code
                        </label>
                        <input
                          value={item.batch_code}
                          onChange={(e) =>
                            updateItem(i, "batch_code", e.target.value)
                          }
                          className="w-full border-2 border-slate-200 px-4 py-3 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Optional"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          value={item.expiry_date}
                          onChange={(e) =>
                            updateItem(i, "expiry_date", e.target.value)
                          }
                          className="w-full border-2 border-slate-200 px-4 py-3 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-700 font-medium">
                        ℹ️ Expiry date is optional and stored per batch
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-white border-t-2 border-slate-100 flex gap-4">
              <button
                onClick={() => setShowReceiveModal(false)}
                className="flex-1 border-2 border-slate-300 rounded-xl py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={completeGRN}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl py-3 text-sm font-semibold hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                ✓ Complete GRN
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}