import { useEffect, useState } from "react";
import {
  Warehouse,
  MapPin,
  Plus,
  Trash2,
  Package,
  AlertCircle,
} from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";

export function WarehouseManagement() {
  const [warehouse, setWarehouse] = useState(null);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newBin, setNewBin] = useState({
    bin_code: "",
    max_capacity: "",
    bin_type: "NORMAL",
  });

  /* ================= FETCH DATA ================= */

  useEffect(() => {

    loadData();

  }, []);

  const fetchWarehouse = async () => {
    const res = await api.get("/api/warehouses/my");
    setWarehouse(res.data);
    return res.data;
  };
  const fetchBins = async (warehouseId) => {
    const id = warehouseId || warehouse?.warehouse_id;
    if (!id) return;
    const res = await api.get(`/api/warehouses/${id}/bins`);
    setBins(res.data);
  };


  const loadData = async () => {
    try {
      setLoading(true);

      const warehouseRes = await fetchWarehouse();
      await fetchBins(warehouseRes.warehouse_id);

    } finally {
      setLoading(false);
    }
  };




  /* ================= BIN ACTIONS ================= */

  const addBin = async () => {
    if (!newBin.bin_code || !newBin.max_capacity) {
      alert("Bin code and capacity required");
      return;
    }

    await api.post(`/api/warehouses/${warehouse.warehouse_id}/bins`, newBin);

    setNewBin({ bin_code: "", max_capacity: "", bin_type: "NORMAL" });
    await fetchBins();
  };



  const deleteBin = async (binId) => {
    if (!confirm("Remove this bin?")) return;
    await api.delete(`/api/warehouses/bins/${binId}`);

    await fetchBins();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading warehouse...</p>
        </div>
      </div>
    );
  }

  const totalCapacity = bins.reduce(
    (sum, bin) => sum + (bin.max_units || 0),
    0
  );
  const usedCapacity = bins.reduce(
    (sum, bin) => sum + (bin.used_capacity || 0),
    0
  );
  const utilizationRate =
    totalCapacity > 0
      ? ((usedCapacity / totalCapacity) * 100).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
              <Warehouse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                Warehouse Management
              </h1>
              <p className="text-slate-600">
                Manage bins and configuration for your warehouse
              </p>
            </div>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Bins" value={bins.length} icon={Package} />
          <StatCard title="Total Capacity" value={totalCapacity} icon={Warehouse} />
          <StatCard title="Used Capacity" value={usedCapacity} icon={Package} />
          <StatCard title="Utilization" value={`${utilizationRate}%`} icon={AlertCircle} />
        </div>

        {/* ================= WAREHOUSE INFO ================= */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Warehouse Details
          </h3>

          <p><b>ID:</b> {warehouse?.warehouse_id ?? "—"}</p>
          <p><b>Name:</b> {warehouse?.name ?? "—"}</p>
          <p><b>Location:</b> {warehouse?.location ?? "—"}</p>
        </div>

        {/* ================= ADD BIN ================= */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Add New Bin</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Bin Code"
              value={newBin.bin_code}
              onChange={(e) =>
                setNewBin({ ...newBin, bin_code: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Capacity"
              value={newBin.max_capacity}
              onChange={(e) =>
                setNewBin({ ...newBin, max_capacity: e.target.value })
              }
              className="border p-2 rounded"
            />
            <select
              value={newBin.bin_type}
              onChange={(e) =>
                setNewBin({ ...newBin, bin_type: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="NORMAL">NORMAL</option>
              <option value="QC">QC</option>
              <option value="DAMAGED">DAMAGED</option>
            </select>
          </div>

          <button
            onClick={addBin}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
          >
            Add Bin
          </button>
        </div>

        {/* ================= BIN LIST ================= */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          {bins.map((bin) => (
            <div
              key={bin.location_id}
              className="p-4 border-b flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{bin.bin_code}</p>
                <p className="text-sm">{bin.used_capacity}/{bin.max_capacity}</p>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={bin.status} />


                <button onClick={() => deleteBin(bin.location_id)}>
                  <Trash2 className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white p-5 rounded-xl border">
      <div className="flex justify-between mb-2">
        <p className="text-sm text-slate-600">{title}</p>
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
