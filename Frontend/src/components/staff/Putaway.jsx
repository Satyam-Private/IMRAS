import { useEffect, useState } from "react";
import { Archive, MapPin, CheckCircle } from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";

export function Putaway() {
  const [putawayTasks, setPutawayTasks] = useState([]);
  const [completedPutaways, setCompletedPutaways] = useState([]);
  const [bins, setBins] = useState([]);
  const [binSelection, setBinSelection] = useState({});

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchPutawayTasks(),
      fetchCompletedPutaways(),
      fetchBins(),
    ]);
  };

  const fetchPutawayTasks = async () => {
    const res = await api.get("/api/putaway/pending");
    setPutawayTasks(res.data.data);
  };

  const fetchCompletedPutaways = async () => {
    const res = await api.get("/api/putaway/completed?today=true");
    setCompletedPutaways(res.data.data);
  };

  const fetchBins = async () => {
    const res = await api.get("/api/bins/available");
    setBins(res.data.data);
  };

  /* ================= COMPLETE PUTAWAY ================= */

  const completePutaway = async (putawayId) => {
    const locationId = binSelection[putawayId];

    if (!locationId) {
      alert("Please select destination bin");
      return;
    }

    await api.post(`/api/putaway/${putawayId}/complete`, {
      location_id: locationId,
    });

    setBinSelection((prev) => {
      const updated = { ...prev };
      delete updated[putawayId];
      return updated;
    });

    loadData();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-slate-900 mb-2">Putaway Management</h1>
        <p className="text-slate-600">
          Move received stock from receiving dock to storage bins
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= PENDING TASKS ================= */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-slate-900">Pending Putaway Tasks</h2>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded">
                {putawayTasks.length} tasks
              </span>
            </div>
          </div>

          {putawayTasks.map((task) => (
            <div
              key={task.putaway_id}
              className="bg-white rounded-lg border-2 border-slate-200"
            >
              <div className="p-4 border-b">
                <div className="flex justify-between mb-3">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Archive className="w-6 h-6 text-blue-600" />
                    </div>

                    <div>
                      <p className="text-slate-900">
                        PUT-{task.putaway_id}
                      </p>
                      <p className="text-slate-600 text-sm">
                        GRN-{task.grn_id}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <StatusBadge status={task.status} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-500">Item</p>
                    <p className="text-slate-900">{task.item_id}</p>
                    <p className="text-slate-600 text-sm">
                      Batch: {task.batch_code}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Quantity</p>
                    <p className="text-slate-900">{task.quantity} units</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <p className="text-sm text-slate-700">
                        Current Location
                      </p>
                    </div>
                    <p className="text-slate-900">Receiving Dock</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-slate-700">
                        Suggested Bin
                      </p>
                    </div>
                    <p className="text-green-700">
                      {task.suggested_bin_code ?? "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {task.suggested_reason ?? "No suggestion"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= ACTION ================= */}
              <div className="p-4">
                <label className="block text-sm mb-1 text-slate-700">
                  Destination Bin
                </label>
                <select
                  className="w-full px-3 py-2 border rounded mb-3"
                  value={binSelection[task.putaway_id] || ""}
                  onChange={(e) =>
                    setBinSelection({
                      ...binSelection,
                      [task.putaway_id]: Number(e.target.value),
                    })
                  }
                >
                  <option value="">Select Bin</option>
                  {bins.map((bin) => (
                    <option
                      key={bin.location_id}
                      value={bin.location_id}
                    >
                      {bin.bin_code}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => completePutaway(task.putaway_id)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg flex justify-center items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Putaway
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ================= COMPLETED ================= */}
        <div>
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="text-slate-900">Completed Today</h3>
            </div>
            <div className="divide-y">
              {completedPutaways.map((p) => (
                <div key={p.putaway_id} className="p-3">
                  <div className="flex justify-between">
                    <p className="text-sm">
                      PUT-{p.putaway_id}
                    </p>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-sm text-slate-600">
                    {p.sku} · {p.quantity} units
                  </p>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Bin: {p.bin_code}</span>
                    <span>{p.completed_at}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
