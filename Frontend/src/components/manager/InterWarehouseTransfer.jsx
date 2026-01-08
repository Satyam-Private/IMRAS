import { Warehouse, ArrowRight } from "lucide-react";

export function InterWarehouseTransfer({ user }) {
  const transfers = [
    {
      from: "WH-001",
      to: "WH-002",
      sku: "SKU-1234",
      qty: 120,
      reason: "Surplus redistribution",
      status: "in_transit",
    },
    {
      from: "WH-003",
      to: "WH-001",
      sku: "SKU-5678",
      qty: 80,
      reason: "Low stock replenishment",
      status: "pending",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-slate-900 mb-2">Inter-Warehouse Transfer Planning</h1>
      <p className="text-slate-600 mb-6">
        Manage stock transfers between warehouses based on shortage vs surplus
        analysis
      </p>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-slate-900">Active Transfers</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {transfers.map((transfer, idx) => (
            <div key={idx} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Warehouse className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-900">{transfer.from}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-900">{transfer.to}</span>
                </div>

                <span
                  className={`px-2 py-1 rounded text-xs ${transfer.status === "in_transit"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                    }`}
                >
                  {transfer.status.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <p className="text-slate-600 text-sm mt-2">
                {transfer.sku} – {transfer.qty} units – {transfer.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
