import { useState } from "react";
import { MoveHorizontal, MapPin, Search, AlertCircle } from "lucide-react";

export function BinTransfer({ user }) {
  const [showTransferModal, setShowTransferModal] = useState(false);

  const recentTransfers = [
    {
      id: "TRF-001",
      sku: "SKU-1234",
      qty: 45,
      from: "A-12",
      to: "A-13",
      reason: "Bin Consolidation",
      time: "2025-12-01 08:20",
      status: "completed",
    },
    {
      id: "TRF-002",
      sku: "SKU-2345",
      qty: 20,
      from: "B-05",
      to: "A-15",
      reason: "Space Optimization",
      time: "2025-12-01 09:10",
      status: "in_transit",
    },
    {
      id: "TRF-003",
      sku: "SKU-3456",
      qty: 10,
      from: "A-15",
      to: "B-08",
      reason: "Reorganization",
      time: "2025-11-30 16:05",
      status: "pending",
    },
  ];

  const binContents = [
    {
      bin: "A-12",
      sku: "SKU-1234",
      name: "Premium Widget A",
      qty: 45,
      batch: "B-20241101",
      capacity: 100,
      utilization: 45,
    },
    {
      bin: "A-15",
      sku: "SKU-2345",
      name: "Filter Cartridge",
      qty: 30,
      batch: "B-20241015",
      capacity: 100,
      utilization: 30,
    },
    {
      bin: "B-05",
      sku: "SKU-3456",
      name: "Lubricant 1L",
      qty: 12,
      batch: "B-20240920",
      capacity: 50,
      utilization: 24,
    },
    {
      bin: "B-08",
      sku: "SKU-4567",
      name: "Sensor Module",
      qty: 8,
      batch: "B-20241110",
      capacity: 50,
      utilization: 16,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-slate-900 mb-2">Bin Transfers</h1>
        <p className="text-slate-600">Move inventory between bins within the warehouse</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Transfer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-slate-900">Create New Transfer</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Source Section */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="text-slate-900">From (Source)</h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-700 text-sm mb-1">Source Aisle</label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="">Select Aisle</option>
                        <option>Aisle A</option>
                        <option>Aisle B</option>
                        <option>Aisle C</option>
                        <option>Aisle D</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 text-sm mb-1">Source Bin</label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="">Select Bin</option>
                        <option>A-12</option>
                        <option>A-15</option>
                        <option>A-18</option>
                      </select>
                    </div>

                    <div className="p-3 bg-blue-100 rounded">
                      <p className="text-blue-900 text-sm mb-1">Current Content</p>
                      <p className="text-blue-700 text-sm">SKU-1234 - Premium Widget A</p>
                      <p className="text-blue-700 text-sm">Qty: 45 units</p>
                      <p className="text-blue-600 text-xs mt-1">Batch: B-20241101</p>
                    </div>
                  </div>
                </div>

                {/* Destination Section */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <h3 className="text-slate-900">To (Destination)</h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-700 text-sm mb-1">Destination Aisle</label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                        <option value="">Select Aisle</option>
                        <option>Aisle A</option>
                        <option>Aisle B</option>
                        <option>Aisle C</option>
                        <option>Aisle D</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 text-sm mb-1">Destination Bin</label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                        <option value="">Select Bin</option>
                        <option>A-13</option>
                        <option>A-14</option>
                        <option>A-16</option>
                      </select>
                    </div>

                    <div className="p-3 bg-green-100 rounded">
                      <p className="text-green-900 text-sm mb-1">Available Capacity</p>
                      <p className="text-green-700 text-sm">55 units</p>
                      <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "45%" }} />
                      </div>
                      <p className="text-green-600 text-xs mt-1">45% utilized</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 text-sm mb-1">Transfer Quantity *</label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-sm mb-1">Reason for Transfer *</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Reason</option>
                    <option>Bin Consolidation</option>
                    <option>Space Optimization</option>
                    <option>Damaged Bin</option>
                    <option>Reorganization</option>
                    <option>Quality Hold</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-slate-700 text-sm mb-1">Notes (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Add any additional notes..."
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-900 text-sm mb-1">Transfer Guidelines</p>
                  <ul className="text-amber-700 text-sm space-y-1 list-inside">
                    <li>• Ensure destination bin has sufficient capacity</li>
                    <li>• Maintain batch integrity during transfers</li>
                    <li>• Update system immediately after physical transfer</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                  Reset
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <MoveHorizontal className="w-4 h-4" />
                  Execute Transfer
                </button>
              </div>
            </div>
          </div>

          {/* Bin Contents Table */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-900">Current Bin Contents</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search bin..."
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-slate-700 text-sm">Bin</th>
                    <th className="px-4 py-3 text-left text-slate-700 text-sm">SKU</th>
                    <th className="px-4 py-3 text-left text-slate-700 text-sm">Item</th>
                    <th className="px-4 py-3 text-center text-slate-700 text-sm">Quantity</th>
                    <th className="px-4 py-3 text-center text-slate-700 text-sm">Batch</th>
                    <th className="px-4 py-3 text-center text-slate-700 text-sm">Utilization</th>
                    <th className="px-4 py-3 text-center text-slate-700 text-sm">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {binContents.map((content, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900">{content.bin}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-900">{content.sku}</td>
                      <td className="px-4 py-3 text-slate-700">{content.name}</td>
                      <td className="px-4 py-3 text-center text-slate-700">
                        {content.qty} / {content.capacity}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">{content.batch}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${content.utilization > 80 ? "bg-red-500" :
                                  content.utilization > 60 ? "bg-amber-500" :
                                    "bg-green-500"
                                }`}
                              style={{ width: `${content.utilization}%` }}
                            />
                          </div>
                          <span className="text-slate-700 text-sm">{content.utilization}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">Transfer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Transfers */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-slate-900">Recent Transfers</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTransfers.map((transfer) => (
              <div key={transfer.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-900 text-sm">{transfer.id}</p>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{transfer.status.replace("_", " ")}</span>
                </div>

                <p className="text-slate-700 text-sm mb-2">{transfer.sku}</p>

                <div className="flex items-center gap-2 mb-2 text-sm">
                  <div className="flex items-center gap-1 text-blue-600">
                    <MapPin className="w-3 h-3" />
                    <span>{transfer.from}</span>
                  </div>

                  <MoveHorizontal className="w-3 h-3 text-slate-400" />

                  <div className="flex items-center gap-1 text-green-600">
                    <MapPin className="w-3 h-3" />
                    <span>{transfer.to}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-xs mb-1">Qty: {transfer.qty} units</p>
                <p className="text-slate-500 text-xs">{transfer.reason}</p>
                <p className="text-slate-400 text-xs mt-2">{transfer.time}</p>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-200">
            <button className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors text-sm">View All Transfers</button>
          </div>
        </div>
      </div>
    </div>
  );
}
