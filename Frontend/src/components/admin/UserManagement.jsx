import { useEffect, useState } from "react";
import { Users, Plus, Shield, X, Power } from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    warehouse_id: ""
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [usersRes, warehousesRes] = await Promise.all([
      api.get("/api/users"),
      api.get("/api/warehouses")
    ]);

    setUsers(usersRes.data);
    setWarehouses(warehousesRes.data);
  };

  /* ================= CREATE USER ================= */

  const createUser = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.role ||
      !form.password ||
      (form.role !== "ADMIN" && !form.warehouse_id)
    ) {
      alert("All required fields must be filled");
      return;
    }

    try {
      setSaving(true);

      await api.post("/api/users", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        warehouse_id: form.role === "ADMIN" ? null : form.warehouse_id
      });

      setShowModal(false);
      setForm({
        name: "",
        email: "",
        role: "",
        password: "",
        warehouse_id: ""
      });

      fetchAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  /* ================= ACTIVATE / DEACTIVATE ================= */

  const toggleUserStatus = async (user) => {
    await api.put(`/api/users/${user.user_id}/activate`, {
      is_active: !user.is_active
    });
    fetchAll();
  };

  const getRoleColor = (role) => {
    if (role === "ADMIN") return "bg-purple-100 text-purple-700";
    if (role === "INVENTORY_MANAGER")
      return "bg-green-100 text-green-700";
    return "bg-blue-100 text-blue-700";
  };

  const getWarehouseNames = (user) => {
    if (user.warehouses?.length) {
      return user.warehouses.map(w => w.name).join(", ");
    }
    if (user.warehouse_id) {
      const wh = warehouses.find(w => w.warehouse_id === user.warehouse_id);
      return wh?.name || "-";
    }
    return "-";
  };

  const removeUser = async (user) => {
    if (!confirm(`Remove user ${user.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/users/${user.user_id}`);
      fetchAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to remove user");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-slate-700" />
          <div>
            <h1 className="text-slate-900 mb-0">User Management</h1>
            <p className="text-slate-600 text-sm">
              Manage users, roles, and warehouse access
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Role</th>
              <th className="px-4 py-3 text-center">Warehouse</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  {u.name}
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getRoleColor(
                      u.role
                    )}`}
                  >
                    {u.role.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {u.warehouse_name}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge
                    status={u.is_active ? "active" : "inactive"}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleUserStatus(u)}
                    className={`px-3 py-1 rounded text-sm flex items-center gap-1 mx-auto
                      ${u.is_active
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                      }`}
                  >
                    <Power className="w-4 h-4" />
                    {u.is_active ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => removeUser(u)}
                    className="mt-3 px-3 py-1 rounded text-sm flex items-center gap-1 mx-auto bg-blue-500 text-white"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg">Create User</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Name"
                className="w-full border rounded px-3 py-2"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                placeholder="Email"
                className="w-full border rounded px-3 py-2"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded px-3 py-2"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <select
                className="w-full border rounded px-3 py-2"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                <option value="">Select Role</option>
                <option value="ADMIN">Admin</option>
                <option value="INVENTORY_MANAGER">
                  Inventory Manager
                </option>
                <option value="WAREHOUSE_STAFF">
                  Warehouse Staff
                </option>
              </select>

              {form.role !== "ADMIN" && (
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.warehouse_id}
                  onChange={(e) =>
                    setForm({ ...form, warehouse_id: e.target.value })
                  }
                >
                  <option value="">Assign Warehouse</option>
                  {warehouses.map((w) => (
                    <option
                      key={w.warehouse_id}
                      value={w.warehouse_id}
                    >
                      {w.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                onClick={createUser}
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
