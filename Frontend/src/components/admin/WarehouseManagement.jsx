import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  MapPin,
  X,
  Power,
  Users
} from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";

export function WarehouseManagement() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Create Warehouse ---------- */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  /* ---------- View Details ---------- */
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeWarehouse, setActiveWarehouse] = useState(null);
  const [warehouseUsers, setWarehouseUsers] = useState([]);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await api.get("/api/warehouses");
      setWarehouses(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Create Warehouse ---------- */
  const createWarehouse = async () => {
    if (!name || !location) return alert("Name & location required");

    try {
      setSaving(true);
      await api.post("/api/warehouses", { name, location });
      setShowCreateModal(false);
      setName("");
      setLocation("");
      fetchWarehouses();
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Toggle ---------- */
  const toggleWarehouse = async (id) => {
    await api.put(`/api/warehouses/${id}/toggle`);
    fetchWarehouses();
  };

  /* ---------- View Details ---------- */
  const openDetails = async (warehouse) => {
    setActiveWarehouse(warehouse);
    setShowDetailsModal(true);

    const res = await api.get(`/api/users/${warehouse.warehouse_id}`);
    setWarehouseUsers(res.data);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-6 flex justify-between">
        <div className="flex gap-3 items-center">
          <Building2 className="w-6 h-6 text-slate-700" />
          <div>
            <h1 className="text-slate-900">Warehouse Management</h1>
            <p className="text-sm text-slate-600">
              Warehouses and operational overview
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Warehouse
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {warehouses.map((w) => (
          <div key={w.warehouse_id} className="bg-white border rounded-lg">
            <div className="p-6 border-b">
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-slate-900">
                      WH-{w.warehouse_id} — {w.name}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <MapPin className="w-3 h-3" />
                      {w.location}
                    </div>
                  </div>
                </div>
                <StatusBadge status={w.is_active ? "active" : "inactive"} />
              </div>
            </div>

            <div className="p-4 flex gap-2">
              <button
                onClick={() => toggleWarehouse(w.warehouse_id)}
                className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2
                  ${w.is_active
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white"}`}
              >
                <Power className="w-4 h-4" />
                {w.is_active ? "Deactivate" : "Activate"}
              </button>

              <button
                onClick={() => openDetails(w)}
                className="flex-1 px-4 py-2 border rounded-lg flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= VIEW DETAILS MODAL ================= */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg">
                Users in {activeWarehouse?.name}
              </h3>
              <button onClick={() => setShowDetailsModal(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {warehouseUsers.length === 0 ? (
              <p className="text-sm text-slate-500">
                No users assigned to this warehouse
              </p>
            ) : (
              <div className="space-y-2">
                {warehouseUsers.map((u) => (
                  <div
                    key={u.user_id}
                    className="border rounded px-3 py-2 flex justify-between"
                  >
                    <div>
                      <p className="text-slate-900 text-sm">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                    <span className="text-xs text-slate-600">
                      {u.role.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= CREATE MODAL ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h3>Create Warehouse</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button
                onClick={createWarehouse}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {saving ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
