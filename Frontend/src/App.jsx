import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Public
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";

// Layout
import { Layout } from "./components/Layout";

// Dashboards
import { WarehouseStaffDashboard } from "./components/dashboard/WarehouseStaffDashboard";
import { InventoryManagerDashboard } from "./components/dashboard/InventoryManagerDashboard";
import { AdminDashboard } from "./components/dashboard/AdminDashboard";

// Staff
import { GoodsReceipt } from "./components/staff/GoodsReceipt";
import { Putaway } from "./components/staff/Putaway";
import { Picking } from "./components/staff/Picking";
import { AutoReorderSuggestions } from "./components/staff/AutoReorderSuggestions";

// Manager
import { ItemsCatalog } from "./components/manager/ItemsCatalog";
import { ReorderRules } from "./components/manager/ReorderRules";
import { InterWarehouseTransfer } from "./components/manager/InterWarehouseTransfer";
import { WarehouseManagement as ManagerWarehouseManagement } from "./components/manager/WarehouseManagement";
import { StockAging } from "./components/manager/StockAging";
import { PRApproval } from "./components/manager/PRApproval";

// Admin
import { WarehouseManagement } from "./components/admin/WarehouseManagement";
import { UserManagement } from "./components/admin/UserManagement";
import { SupplierManagement } from "./components/admin/SupplierManagement";
import { POApproval } from "./components/admin/POApproval";

// Shared
import { BatchExpiry } from "./components/shared/BatchExpiry";
import { Reports } from "./components/shared/Reports";

/**
 * Route Guard
 */
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const [user, setUser] = useState(null);

  /**
   * Restore session
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Public */}
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />

        {/* Protected App */}
        <Route
          path="/app"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          {/* Dashboard (role-based) */}
          <Route
            index
            element={
              user?.role === "ADMIN" ? (
                <AdminDashboard />
              ) : user?.role === "INVENTORY_MANAGER" ? (
                <InventoryManagerDashboard />
              ) : (
                <WarehouseStaffDashboard />
              )
            }
          />

          {/* Warehouse Staff */}
          <Route path="goods-receipt" element={<GoodsReceipt />} />
          <Route path="putaway" element={<Putaway />} />
          <Route path="picking" element={<Picking />} />
          <Route path="auto-reorder" element={<AutoReorderSuggestions />} />

          {/* Inventory Manager */}
          <Route path="items" element={<ItemsCatalog />} />
          <Route path="inter-warehouse" element={<InterWarehouseTransfer />} />
          <Route path="abc-analysis" element={<ManagerWarehouseManagement />} />
          <Route path="stock-aging" element={<StockAging />} />
          <Route path="pr-approval" element={<PRApproval />} />

          {/* Admin */}
          <Route path="warehouses" element={<WarehouseManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="reorder-rules" element={<ReorderRules />} />
          <Route path="suppliers" element={<SupplierManagement />} />
          <Route path="po-approval" element={<POApproval />} />

          {/* Shared */}
          <Route path="batches" element={<BatchExpiry />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
