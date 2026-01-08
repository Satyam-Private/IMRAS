import { useEffect, useState } from "react";
import { Users, Plus, X, Power } from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";


export function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Modal ---------- */
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ---------- Form ---------- */
  const [form, setForm] = useState({
    name: "",
    contact_details: "",
    lead_time_days: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  /* ================= API ================= */

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/api/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error("Failed to load suppliers", err);
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async () => {
    if (!form.name || !form.contact_details) {
      alert("Name and contact details are required");
      return;
    }

    try {
      setSaving(true);

      await api.post("/api/suppliers", {
        name: form.name,
        contact_details: form.contact_details,
        lead_time_days: Number(form.lead_time_days) || 0,
      });

      setShowModal(false);
      resetForm();
      fetchSuppliers();
    } catch {
      alert("Failed to create supplier");
    } finally {
      setSaving(false);
    }
  };

  const toggleSupplier = async (supplierId) => {
    if (!confirm("Change the status this supplier?")) return;

    try {
      await api.put(`/api/suppliers/${supplierId}/toggle`);
      fetchSuppliers();
    } catch {
      alert("Failed to change the stutus of the supplier");
    }
  };

  /* ================= Helpers ================= */

  const resetForm = () => {
    setForm({
      name: "",
      contact_details: "",
      lead_time_days: "",
    });
  };

  if (loading) return <div className="p-6">Loading suppliers...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-slate-700" />
          <div>
            <h1 className="text-slate-900 mb-0">Supplier Management</h1>
            <p className="text-slate-600 text-sm">
              Manage suppliers and lead times
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-center">Lead Time</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {suppliers.map((s) => (
                <tr key={s.supplier_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">SUP-{s.supplier_id}</td>
                  <td className="px-4 py-3 text-slate-900">{s.name}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {s.contact_details}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.lead_time_days} days
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={s.is_active ? "active" : "inactive"} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.is_active ? (
                      <button
                        onClick={() => toggleSupplier(s.supplier_id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Deactivate"
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleSupplier(s.supplier_id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Reactivate"
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-slate-900">Add Supplier</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600">Supplier Name</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Contact Details
                </label>
                <input
                  value={form.contact_details}
                  onChange={(e) =>
                    setForm({ ...form, contact_details: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Lead Time (days)
                </label>
                <input
                  type="number"
                  value={form.lead_time_days}
                  onChange={(e) =>
                    setForm({ ...form, lead_time_days: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={createSupplier}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {saving ? "Saving..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
