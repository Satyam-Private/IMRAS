import { Settings, Save } from "lucide-react";

export function SystemSettings({ user }) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-slate-900 mb-2">System Settings</h1>
      <p className="text-slate-600 mb-6">
        Configure valuation methods, alerts, and scheduled reports
      </p>

      <div className="space-y-6">
        {/* Valuation Method */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-slate-900 mb-4">Inventory Valuation Method</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <input
                type="radio"
                name="valuation"
                value="fifo"
                defaultChecked
                className="w-4 h-4 mt-1"
              />
              <div>
                <p className="text-slate-900">FIFO (First In, First Out)</p>
                <p className="text-slate-600 text-sm">
                  Items purchased first are sold first
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <input type="radio" name="valuation" value="lifo" className="w-4 h-4 mt-1" />
              <div>
                <p className="text-slate-900">LIFO (Last In, First Out)</p>
                <p className="text-slate-600 text-sm">
                  Items purchased last are sold first
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <input type="radio" name="valuation" value="weighted" className="w-4 h-4 mt-1" />
              <div>
                <p className="text-slate-900">Weighted Average</p>
                <p className="text-slate-600 text-sm">Average cost of all inventory items</p>
              </div>
            </label>
          </div>
        </div>

        {/* Alert Settings */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-slate-900 mb-4">Alert Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-2">Low Stock Alert Threshold (%)</label>
              <input
                type="number"
                defaultValue={20}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Expiry Warning (Days Before)</label>
              <input
                type="number"
                defaultValue={30}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-slate-700">Enable email notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-slate-700">Enable auto-reorder suggestions</span>
              </label>
            </div>
          </div>
        </div>

        {/* Report Scheduling */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-slate-900 mb-4">Scheduled Reports</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-2">Stock Valuation Report</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-2">ABC Analysis Report</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
          </div>
        </div>

        <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
