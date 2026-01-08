import { useEffect, useState } from "react";
import { ShoppingCart, CheckCircle } from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";

export function POApproval() {
  const [approvedPRs, setApprovedPRs] = useState([]);
  const [pendingPOs, setPendingPOs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [prRes, poRes, supplierRes] = await Promise.all([
        api.get("/api/admin/prs/approved"),
        api.get("/api/po"),
        api.get("/api/suppliers"),
      ]);

      setApprovedPRs(prRes.data);
      setPendingPOs(poRes.data);
      setSuppliers(supplierRes.data);
    } catch (err) {
      console.error("Failed to load procurement data", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PR → PO ================= */

  const convertPRToPO = async (prId) => {
    const supplierId = selectedSuppliers[prId];

    if (!supplierId) {
      alert("Please select a supplier");
      return;
    }

    try {
      await api.post(`/api/pr/${prId}/create-po`, {
        supplier_id: supplierId
      });
      fetchAll();
    } catch {
      alert("Failed to create Draft PO");
    }
  };

  /* ================= APPROVE PO ================= */

  const approvePO = async (poId) => {
    try {
      await api.post(`/api/po/${poId}/approve`);
      fetchAll();
    } catch {
      alert("Failed to approve PO");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-slate-900 mb-6">Purchase Order Management</h1>

      {/* ===================== */}
      {/* APPROVED PRs */}
      {/* ===================== */}
      <h2 className="text-slate-900 mb-4">Approved Purchase Requisitions</h2>

      {approvedPRs.length === 0 ? (
        <p className="text-slate-500 mb-6">No approved PRs pending conversion</p>
      ) : (
        <div className="space-y-4 mb-10">
          {approvedPRs.map((pr) => (
            <div
              key={pr.pr_id}
              className="bg-white rounded-lg border-2 border-slate-200"
            >
              {/* Header */}
              <div className="p-4 border-b flex justify-between">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-slate-900">PR-{pr.pr_id}</p>
                    <p className="text-sm text-slate-600">
                      Requested by {pr.requested_by}
                    </p>
                    <p className="text-sm text-slate-600">
                      Warehouse Name : {pr.warehouse_name}
                    </p>
                  </div>
                </div>
                <StatusBadge status="approved" />
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  {pr.items.map((item) => (
                    <div
                      key={item.item_id}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <Info label="Item" value={`${item.sku} - ${item.name}`} />
                      <Info label="Quantity" value={item.quantity_required} />
                      <Info
                        label="Created At"
                        value={new Date(pr.created_at).toLocaleString()}
                      />
                    </div>
                  ))}
                </div>

                {/* Supplier Selection */}
                <div className="mb-4">
                  <label className="block text-sm text-slate-600 mb-1">
                    Select Supplier
                  </label>
                  <select
                    value={selectedSuppliers[pr.pr_id] || ""}
                    onChange={(e) =>
                      setSelectedSuppliers((prev) => ({
                        ...prev,
                        [pr.pr_id]: e.target.value,
                      }))
                    }
                    className="border rounded px-3 py-2 w-full md:w-1/3"
                  >
                    <option value="">-- Select Supplier --</option>
                    {suppliers.map((s) => (
                      <option key={s.supplier_id} value={s.supplier_id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    onClick={() => convertPRToPO(pr.pr_id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Create Draft PO
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== */}
      {/* DRAFT POs */}
      {/* ===================== */}
      <h2 className="text-slate-900 mb-4">Draft Purchase Orders</h2>

      {pendingPOs.length === 0 ? (
        <p className="text-slate-500">No draft POs awaiting approval</p>
      ) : (
        <div className="space-y-4">
          {pendingPOs.map((po) => (
            <div
              key={po.po_id}
              className="bg-white rounded-lg border-2 border-slate-200"
            >
              {/* Header */}
              <div className="p-4 border-b flex justify-between">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-slate-900">PO-{po.po_id}</p>
                    <p className="text-sm text-slate-600">
                      Supplier: {po.supplier_name}
                    </p>
                  </div>
                </div>
                <StatusBadge status="pending" />
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <Info label="Items" value={po.items_count} />
                  <Info
                    label="Total Value"
                    value={`₹ ${Number(po.total_value).toLocaleString()}`}
                  />
                  <Info
                    label="Requested warehouse"
                    value={`${po.warehouse_name}`}
                  />
                  <Info
                    label="Created At"
                    value={new Date(po.created_at).toLocaleString()}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    onClick={() => approvePO(po.po_id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve PO
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Helpers ---------- */

function Info({ label, value }) {
  return (
    <div>
      <p className="text-slate-500 text-sm mb-1">{label}</p>
      <p className="text-slate-700">{value}</p>
    </div>
  );
}
