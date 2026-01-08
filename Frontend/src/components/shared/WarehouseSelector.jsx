import { Building2, ChevronDown } from "lucide-react";
import { useState } from "react";

const warehouses = [
  { id: "all", name: "All Warehouses", location: "Global" },
  { id: "WH-001", name: "Central Warehouse", location: "Mumbai" },
  { id: "WH-002", name: "East Hub", location: "Kolkata" },
  { id: "WH-003", name: "South Hub", location: "Bengaluru" },
  { id: "WH-004", name: "North Hub", location: "Delhi" },
];

export function WarehouseSelector({ selectedWarehouse, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const selected =
    warehouses.find((w) => w.id === selectedWarehouse) || warehouses[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
      >
        <Building2 className="w-4 h-4 text-slate-600" />
        <span className="text-sm text-slate-700">{selected.name}</span>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
            {warehouses.map((warehouse, index) => (
              <button
                key={warehouse.id}
                onClick={() => {
                  onChange(warehouse.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${warehouse.id === selectedWarehouse ? "bg-blue-50" : ""
                  } ${index === 0 ? "border-b border-slate-200" : ""}`}
              >
                <div className="text-sm text-slate-900">{warehouse.name}</div>

                {warehouse.location && (
                  <div className="text-xs text-slate-500">
                    {warehouse.location}
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
