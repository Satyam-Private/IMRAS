import { X, AlertCircle, CheckCircle, Clock, TrendingDown } from "lucide-react";

export function NotificationPanel({ onClose, userRole }) {
  // FIXED: Your original object was completely invalid.
  // Here is a clean, working JS version with sample notifications.
  const notifications = {
    warehouse_staff: [
      {
        id: 1,
        type: "error",
        title: "Inventory Mismatch",
        message: "Stock count does not match system records.",
        time: "5 min ago",
      },
      {
        id: 2,
        type: "warning",
        title: "Low Stock Alert",
        message: "Product SKU-202 is running low.",
        time: "20 min ago",
      },
      {
        id: 3,
        type: "info",
        title: "Task Assigned",
        message: "New picking task assigned to you.",
        time: "1 hr ago",
      },
    ],

    inventory_manager: [
      {
        id: 1,
        type: "success",
        title: "Restock Completed",
        message: "Vendor restock has been processed.",
        time: "10 min ago",
      },
      {
        id: 2,
        type: "warning",
        title: "Dispatch Delay",
        message: "Shipment to Hub 3 is delayed.",
        time: "25 min ago",
      },
      {
        id: 3,
        type: "info",
        title: "Daily Summary",
        message: "Inventory movement summary is ready.",
        time: "1 hr ago",
      },
      {
        id: 4,
        type: "error",
        title: "Expired Items",
        message: "3 items have crossed expiry date.",
        time: "2 hr ago",
      },
    ],

    admin: [
      {
        id: 1,
        type: "info",
        title: "New User Request",
        message: "A new account approval is pending.",
        time: "15 min ago",
      },
      {
        id: 2,
        type: "success",
        title: "Backup Completed",
        message: "System backup finished successfully.",
        time: "30 min ago",
      },
      {
        id: 3,
        type: "warning",
        title: "High System Load",
        message: "Server CPU usage is high.",
        time: "45 min ago",
      },
    ],
  };

  const userNotifications = notifications[userRole] || [];

  // FIXED: You wrote `warning, success, info` which was invalid.
  const iconMap = {
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    info: <Clock className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />

      <div className="relative w-96 bg-white rounded-lg shadow-xl border border-slate-200 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-slate-900">Notifications</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {userNotifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {iconMap[notification.type]}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm mb-1">
                    {notification.title}
                  </p>
                  <p className="text-slate-600 text-sm mb-2">
                    {notification.message}
                  </p>
                  <p className="text-slate-400 text-xs">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-200">
          <button className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors text-sm">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
