import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  RefreshCw,
  Calendar,
  BarChart3,
  Users,
  Building2,
  Bell,
  LogOut,
  Truck,
  PackageCheck,
  Archive,
  Menu
} from "lucide-react";

import { NotificationPanel } from "./shared/NotificationPanel";

export function Layout({ user, onLogout }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile); // auto-hide on mobile
    };

    handleResize(); // initial run
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const ROLES = {
    ADMIN: "ADMIN",
    INVENTORY_MANAGER: "INVENTORY_MANAGER",
    WAREHOUSE_STAFF: "WAREHOUSE_STAFF",
  };

  const navigationItems = [
    { id: "", label: "Dashboard", icon: LayoutDashboard, roles: Object.values(ROLES) },

    { id: "goods-receipt", label: "Goods Receipt", icon: Truck, roles: [ROLES.WAREHOUSE_STAFF] },
    { id: "putaway", label: "Putaway", icon: Archive, roles: [ROLES.WAREHOUSE_STAFF] },
    { id: "picking", label: "Picking", icon: PackageCheck, roles: [ROLES.WAREHOUSE_STAFF] },
    { id: "auto-reorder", label: "Auto Reorder", icon: ShoppingCart, roles: [ROLES.WAREHOUSE_STAFF] },

    { id: "items", label: "Items Catalog", icon: Package, roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER] },
    { id: "reorder-rules", label: "Reorder Rules", icon: RefreshCw, roles: [ROLES.ADMIN] },
    // { id: "inter-warehouse", label: "Inter-Warehouse", icon: Warehouse, roles: [ROLES.INVENTORY_MANAGER] },
    { id: "abc-analysis", label: "Warehouse Management", icon: Warehouse, roles: [ROLES.INVENTORY_MANAGER] },
    { id: "stock-aging", label: "Stock Aging", icon: Calendar, roles: [ROLES.INVENTORY_MANAGER] },
    { id: "pr-approval", label: "PR Approval", icon: ShoppingCart, roles: [ROLES.INVENTORY_MANAGER] },

    { id: "warehouses", label: "Warehouses", icon: Building2, roles: [ROLES.ADMIN] },
    { id: "users", label: "User Management", icon: Users, roles: [ROLES.ADMIN] },
    { id: "suppliers", label: "Suppliers", icon: Package, roles: [ROLES.ADMIN] },
    { id: "po-approval", label: "PO Approval", icon: ShoppingCart, roles: [ROLES.ADMIN] },

    { id: "batches", label: "Batch & Expiry", icon: PackageCheck, roles: [ROLES.INVENTORY_MANAGER] },
    { id: "reports", label: "Reports", icon: BarChart3, roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER] },
  ];

  const visibleNavItems = navigationItems.filter((i) =>
    i.roles.includes(user.role)
  );
  const getInitial = (name = "") => name.charAt(0).toUpperCase();

  const formatDateTime = () => {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return currentDateTime.toLocaleDateString('en-US', options);
  };


  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
    bg-gray-200
 border-r flex flex-col
    transition-transform duration-300
    z-50

    ${isMobile
            ? `fixed top-0 left-0 h-full w-64
         ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            : `relative h-screen w-64
         ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`
          }
  `}
      >

        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="mt-4 ml-4 mb-4 w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Package className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">
            IMRAS
          </span>
        </Link>

        <nav className="flex-1 p-3 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const path = item.id ? `/app/${item.id}` : "/app";
            const isActive = location.pathname === path;

            return (
              <button
                key={item.label}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-slate-100"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <div className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {getInitial(user?.name)}
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {user?.name}
              </span>
              <span className="text-xs text-gray-500">
                {user?.role?.replace("_", " ")}
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-4">
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg font-semibold text-slate-800">
                {formatDateTime()}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Inventory Management System
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-slate-600" />
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {showNotifications && (
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        )}
      </div>
    </div>
  );
}