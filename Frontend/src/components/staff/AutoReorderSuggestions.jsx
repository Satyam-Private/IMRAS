import { useEffect, useState } from "react";
import {
  ShoppingCart,
  TrendingDown,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";

export function AutoReorderSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [prDrafts, setPrDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------- Auto Reorder Edit ---------- */
  const [editingId, setEditingId] = useState(null);
  const [editedQty, setEditedQty] = useState(0);

  /* ---------- Manual PR State ---------- */
  const [manualItems, setManualItems] = useState([
    { item_id: "", quantity: "" },
  ]);
  const [creatingPR, setCreatingPR] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [suggestionRes, prRes] = await Promise.all([
        api.get("/api/reorder/suggestions"),
        api.get("/api/pr?status=DRAFT"),
      ]);

      setSuggestions(suggestionRes.data);
      setPrDrafts(prRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load reorder data");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- AUTO PR ---------- */

  const handleCreatePR = async (s) => {
    try {
      await api.post("/api/reorder/create-pr", {
        items: [
          {
            item_id: s.item_id,
            quantity:
              editingId === s.item_id ? editedQty : s.suggestedQty,
          },
        ],
      });

      setSuggestions((prev) =>
        prev.filter((item) => item.item_id !== s.item_id)
      );

      setEditingId(null);
      fetchAll();
      alert("PR created Successfully");
    } catch {
      alert("Failed to create PR");
    }
  };

  const startEdit = (s) => {
    setEditingId(s.item_id);
    setEditedQty(s.suggestedQty);
  };

  /* ---------- MANUAL PR ---------- */

  const addManualRow = () => {
    setManualItems([...manualItems, { item_id: "", quantity: "" }]);
  };

  const removeManualRow = (index) => {
    setManualItems(manualItems.filter((_, i) => i !== index));
  };

  const updateManualItem = (index, field, value) => {
    const updated = [...manualItems];
    updated[index][field] = value;
    setManualItems(updated);
  };

  const submitManualPR = async () => {
    try {
      setCreatingPR(true);

      const items = manualItems
        .filter((i) => i.item_id && i.quantity)
        .map((i) => ({
          item_id: Number(i.item_id),
          quantity: Number(i.quantity),
        }));

      if (!items.length) {
        alert("Add at least one item");
        return;
      }

      await api.post("/api/pr", { items });
      setManualItems([{ item_id: "", quantity: "" }]);
      fetchAll();
    } catch {
      alert("Failed to create PR");
    } finally {
      setCreatingPR(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ===================== */}
      {/* AUTO REORDER */}
      {/* ===================== */}
      <h1 className="text-slate-900 mb-2">Auto Reorder Suggestions</h1>
      <p className="text-slate-600 mb-6">
        System-generated purchase requisition suggestions
      </p>

      <div className="space-y-4">
        {suggestions.map((s) => (
          <div key={s.item_id} className="bg-white rounded-lg border-2 border-slate-200">
            <div className="p-4 border-b flex justify-between">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-900">ITEM-{s.item_id}</p>
                  <p className="text-sm text-slate-600">{s.sku} - {s.name}</p>
                </div>
              </div>
              <StatusBadge status={s.priority} type="priority" />
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <Info label="Current Stock" value={s.currentStock} danger />
                <Info label="Min Qty" value={s.minQty} />
                <div>
                  <p className="text-slate-500 text-sm mb-1">Suggested Qty</p>
                  {editingId === s.item_id ? (
                    <input
                      type="number"
                      value={editedQty}
                      onChange={(e) => setEditedQty(+e.target.value)}
                      className="w-24 border rounded px-2 py-1"
                    />
                  ) : (
                    <p className="text-green-700">{s.suggestedQty}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  Stock below minimum threshold
                </div>

                <div className="flex gap-2">
                  {editingId === s.item_id ? (
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-slate-100 rounded text-sm">
                      Cancel
                    </button>
                  ) : (
                    <button onClick={() => startEdit(s)} className="px-4 py-2 bg-slate-100 rounded text-sm">
                      Modify
                    </button>
                  )}
                  <button onClick={() => handleCreatePR(s)} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">
                    Create PR Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== */}
      {/* MANUAL PR CREATION */}
      {/* ===================== */}
      <div className="mt-12">
        <h2 className="text-slate-900 mb-4">Create Purchase Requisition (Manual)</h2>

        <div className="bg-white border rounded-lg p-4 space-y-3">
          {manualItems.map((row, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div>
                <label className="text-sm text-slate-600">Item ID</label>
                <input
                  type="number"
                  value={row.item_id}
                  onChange={(e) => updateManualItem(index, "item_id", e.target.value)}
                  className="border rounded px-2 py-1 w-28"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Quantity</label>
                <input
                  type="number"
                  value={row.quantity}
                  onChange={(e) => updateManualItem(index, "quantity", e.target.value)}
                  className="border rounded px-2 py-1 w-28"
                />
              </div>

              {manualItems.length > 1 && (
                <button
                  onClick={() => removeManualRow(index)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-3 mt-4">
            <button onClick={addManualRow} className="flex items-center gap-1 text-blue-600 text-sm">
              <Plus className="w-4 h-4" /> Add Item
            </button>

            <button
              onClick={submitManualPR}
              disabled={creatingPR}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              Create PR Draft
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ---------- Helpers ---------- */
function Info({ label, value, danger }) {
  return (
    <div>
      <p className="text-slate-500 text-sm mb-1">{label}</p>
      <p className={danger ? "text-red-700" : "text-slate-700"}>{value}</p>
    </div>
  );
}
