import { useState, useEffect } from "react";
import { PackageCheck, MapPin, AlertCircle } from "lucide-react";
import api from "../../api/api";

export function Picking() {
  const [formData, setFormData] = useState({
    sku: "",
    quantity: "",
    notes: ""
  });

  const [pickHistory, setPickHistory] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [issuedFrom, setIssuedFrom] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecentPicks();
  }, []);

  const fetchRecentPicks = async () => {
    try {
      const res = await api.get("/api/picking/recent");
      if (res.data.success) {
        setPickHistory(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching recent picks:", error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.sku || !formData.quantity || formData.quantity <= 0) {
      setErrorMessage("SKU and valid quantity are required");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/picking/fifo", {
        sku: formData.sku,
        quantity: parseInt(formData.quantity),
        notes: formData.notes || undefined
      });

      if (res.data.success) {
        setIssuedFrom(res.data.issued_from);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        setFormData({
          sku: "",
          quantity: "",
          notes: ""
        });

        fetchRecentPicks();
      }
    } catch (error) {
      console.error("Error completing pick:", error);
      setErrorMessage(error.response?.data?.message || "Error completing pick. Please try again.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClear = () => {
    setFormData({
      sku: "",
      quantity: "",
      notes: ""
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Picking Task</h1>
          <p className="text-slate-600">Enter item details to complete pick</p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg flex items-center gap-3">
            <PackageCheck className="w-5 h-5 text-green-700" />
            <div>
              <span className="text-green-700 font-medium">Item picked successfully!</span>
              {issuedFrom.length > 0 && (
                <div className="text-sm text-green-600 mt-1">
                  Issued from: {issuedFrom.map(item => `${item.bin_code} (${item.quantity} units)`).join(", ")}
                </div>
              )}
            </div>
          </div>
        )}

        {showError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-700" />
            <span className="text-red-700 font-medium">{errorMessage}</span>
          </div>
        )}

        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Pick Item</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Item SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g., SKU-1234"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  min="1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Complete Pick"}
              </button>
              <button
                onClick={handleClear}
                disabled={loading}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {pickHistory.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Recent Picks</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {pickHistory.map((pick) => (
                <div key={pick.pick_id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-slate-900 font-medium">{pick.sku}</p>
                      {pick.item_name && (
                        <p className="text-slate-600 text-sm">{pick.item_name}</p>
                      )}
                    </div>
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                      {pick.quantity} units
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    {pick.bin_code && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{pick.bin_code}</span>
                      </div>
                    )}
                    {pick.batch_number && (
                      <span>Batch: {pick.batch_number}</span>
                    )}
                    <span className="ml-auto text-slate-500">
                      {pick.picked_at ? new Date(pick.picked_at).toLocaleTimeString() : ""}
                    </span>
                  </div>

                  {pick.notes && (
                    <p className="mt-2 text-sm text-slate-600 italic">{pick.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}