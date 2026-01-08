import { useEffect, useState } from "react";
import { Plus, Edit } from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";

export function ReorderRules() {
  const [rules, setRules] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    item_id: "",
    min_qty: "",
    max_qty: "",
    reorder_qty: ""
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [rulesRes, itemsRes] = await Promise.all([
        api.get("/api/reorder-rules"),
        api.get("/api/items")
      ]);

      setRules(rulesRes.data);
      setItems(itemsRes.data);
    } catch (err) {
      console.error("Failed to load reorder rules", err);
    } finally {
      setLoading(false);
    }
  };

  const getItemName = (itemId) => {
    const item = items.find((i) => i.item_id === itemId);
    return item ? item.name : "-";
  };

  const openCreateModal = () => {
    setEditingRule(null);
    setForm({
      item_id: "",
      min_qty: "",
      max_qty: "",
      reorder_qty: ""
    });
    setShowModal(true);
  };

  const openEditModal = (rule) => {
    setEditingRule(rule);
    setForm({
      item_id: rule.item_id,
      min_qty: rule.min_qty,
      max_qty: rule.max_qty,
      reorder_qty: rule.reorder_qty
    });
    setShowModal(true);
  };

  const saveRule = async () => {
    if (!form.item_id || !form.min_qty || !form.max_qty || !form.reorder_qty) {
      alert("All fields are required");
      return;
    }

    try {
      setSaving(true);

      if (editingRule) {
        await api.put(`/api/reorder-rules/${editingRule.reorder_rule_id}`, {
          min_qty: Number(form.min_qty),
          max_qty: Number(form.max_qty),
          reorder_qty: Number(form.reorder_qty)
        });
      } else {
        await api.post("/api/reorder-rules", {
          item_id: form.item_id,
          min_qty: Number(form.min_qty),
          max_qty: Number(form.max_qty),
          reorder_qty: Number(form.reorder_qty)
        });
      }

      setShowModal(false);
      fetchInitialData();
    } catch {
      alert("Failed to save reorder rule");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading reorder rules...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-slate-900 mb-1">Reorder Rules</h1>
          <p className="text-slate-600 text-sm">
            Define min, max and reorder quantities per item
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Rule
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-center">Min Qty</th>
              <th className="px-4 py-3 text-center">Max Qty</th>
              <th className="px-4 py-3 text-center">Reorder Qty</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rules.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-slate-500">
                  No reorder rules configured
                </td>
              </tr>
            ) : (
              rules.map((rule) => (
                <tr key={rule.reorder_rule_id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900">
                    {getItemName(rule.item_id)}
                  </td>
                  <td className="px-4 py-3 text-center">{rule.min_qty}</td>
                  <td className="px-4 py-3 text-center">{rule.max_qty}</td>
                  <td className="px-4 py-3 text-center">{rule.reorder_qty}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={rule.is_active ? "active" : "inactive"} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openEditModal(rule)}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg mb-4">
              {editingRule ? "Edit Reorder Rule" : "Create Reorder Rule"}
            </h3>

            <div className="space-y-4">
              <select
                value={form.item_id}
                onChange={(e) =>
                  setForm({ ...form, item_id: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                disabled={!!editingRule}
              >
                <option value="">Select Item</option>
                {items.map((item) => (
                  <option key={item.item_id} value={item.item_id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min Quantity"
                value={form.min_qty}
                onChange={(e) =>
                  setForm({ ...form, min_qty: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="number"
                placeholder="Max Quantity"
                value={form.max_qty}
                onChange={(e) =>
                  setForm({ ...form, max_qty: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="number"
                placeholder="Reorder Quantity"
                value={form.reorder_qty}
                onChange={(e) =>
                  setForm({ ...form, reorder_qty: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={saveRule}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
