import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Package,
  X,
  Edit,
  Trash2,
  PackageOpen,
  Filter
} from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";

export function ItemsCatalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Filters ---------- */
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------- Modal ---------- */
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ---------- Form ---------- */
  const [form, setForm] = useState({
    sku: "",
    name: "",
    unit_of_measure: "PCS",
    tracking_batch: false,
    tracking_serial: false,
    unit_price: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  /* ================= API ================= */

  const fetchItems = async () => {
    try {
      const res = await api.get("/api/items");
      setItems(res.data);
    } catch {
      alert("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const createItem = async () => {
    if (!form.sku || !form.name) {
      alert("SKU and Name are required");
      return;
    }

    let tracking_type = "NONE";
    if (form.tracking_batch) tracking_type = "BATCH";
    else if (form.tracking_serial) tracking_type = "SERIAL";

    try {
      setSaving(true);
      await api.post("/api/items", {
        sku: form.sku,
        name: form.name,
        unit_of_measure: form.unit_of_measure,
        tracking_type,
        unit_price: parseFloat(form.unit_price) || 0,
      });

      setShowAddModal(false);
      resetForm();
      fetchItems();
    } catch {
      alert("Failed to create item");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(`/api/items/${itemId}`);
      fetchItems();
    } catch {
      alert("Failed to delete item");
    }
  };

  const toggleItem = async (itemId) => {
    if (!confirm("Change item status?")) return;

    try {
      await api.put(`/api/items/${itemId}/toggle`);
      fetchItems();
    } catch {
      alert("Failed to update item");
    }
  };

  const resetForm = () => {
    setForm({
      sku: "",
      name: "",
      unit_of_measure: "PCS",
      tracking_batch: false,
      tracking_serial: false,
      unit_price: "",
    });
  };

  /* ---------- Edit ---------- */
  const [editingItemId, setEditingItemId] = useState(null);

  const openEditModal = (item) => {
    setEditingItemId(item.item_id);
    setForm({
      sku: item.sku || "",
      name: item.name || "",
      unit_of_measure: item.unit_of_measure || "PCS",
      tracking_batch: item.tracking_type === "BATCH",
      tracking_serial: item.tracking_type === "SERIAL",
      unit_price: item.unit_price != null ? String(item.unit_price) : "",
    });
    setShowEditModal(true);
  };

  const updateItem = async () => {
    if (!form.sku || !form.name) {
      alert("SKU and Name are required");
      return;
    }

    let tracking_type = "NONE";
    if (form.tracking_batch) tracking_type = "BATCH";
    else if (form.tracking_serial) tracking_type = "SERIAL";

    try {
      setSaving(true);
      await api.put(`/api/items/${editingItemId}`, {
        sku: form.sku,
        name: form.name,
        unit_of_measure: form.unit_of_measure,
        tracking_type,
        unit_price: parseFloat(form.unit_price) || 0,
      });

      setShowEditModal(false);
      setEditingItemId(null);
      resetForm();
      fetchItems();
    } catch {
      alert("Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter((it) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      it.sku.toLowerCase().includes(q) ||
      it.name.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <PackageOpen className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600 font-medium">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Items & Catalog
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                  Manage SKUs and tracking configuration
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </div>
        </div>

        {/* SEARCH & STATS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by SKU or item name..."
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Items</p>
                <p className="text-3xl font-bold">{items.length}</p>
              </div>
              <Package className="w-10 h-10 text-blue-200" />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    UOM
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Tracking
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.item_id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.sku}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{item.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                        {item.unit_of_measure}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge
                        status={item.tracking_type !== "NONE" ? "enabled" : "disabled"}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-slate-900">
                        ₹{(Number(item.unit_price) || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-all"
                          title="Edit item"
                        >
                          <Edit className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => deleteItem(item.item_id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                          title="Delete item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <PackageOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No items found</p>
                <p className="text-slate-400 text-sm mt-1">
                  {searchQuery ? "Try adjusting your search" : "Add your first item to get started"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ADD ITEM MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Add New Item</h3>
                  <p className="text-sm text-slate-500 mt-1">Create a new catalog item</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter SKU code"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter item name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit of Measure
                  </label>
                  <input
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="e.g., PCS, KG, LTR"
                    value={form.unit_of_measure}
                    onChange={(e) => setForm({ ...form, unit_of_measure: e.target.value })}
                  />
                </div>

                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-slate-700 mb-3">Tracking Options</p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.tracking_batch}
                      onChange={(e) => setForm({ ...form, tracking_batch: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Batch Tracking</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.tracking_serial}
                      onChange={(e) => setForm({ ...form, tracking_serial: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Serial Tracking</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="0.00"
                    value={form.unit_price}
                    onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-5 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-slate-700 hover:bg-slate-200 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={createItem}
                  disabled={saving}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT ITEM MODAL */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Edit Item</h3>
                  <p className="text-sm text-slate-500 mt-1">Update item details</p>
                </div>
                <button
                  onClick={() => { setShowEditModal(false); setEditingItemId(null); resetForm(); }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit of Measure
                  </label>
                  <input
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                    value={form.unit_of_measure}
                    onChange={(e) => setForm({ ...form, unit_of_measure: e.target.value })}
                  />
                </div>

                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-slate-700 mb-3">Tracking Options</p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.tracking_batch}
                      onChange={(e) => setForm({ ...form, tracking_batch: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Batch Tracking</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.tracking_serial}
                      onChange={(e) => setForm({ ...form, tracking_serial: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Serial Tracking</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                    value={form.unit_price}
                    onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-5 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                <button
                  onClick={() => { setShowEditModal(false); setEditingItemId(null); resetForm(); }}
                  className="px-5 py-2.5 text-slate-700 hover:bg-slate-200 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={updateItem}
                  disabled={saving}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}