import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  FileSpreadsheet
} from "lucide-react";
import api from "../../api/api";

export function Reports({ user }) {
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);

  // NEW: Date filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const reports = [
    {
      name: "Stock Valuation Report",
      description: "Current stock valuation by SKU",
      api: "/api/reports/stock-valuation",
      csv: "/reports/stock-valuation/export/csv",
      frequency: "Daily",
      format: "CSV",
    },
    {
      name: "Stock Aging Report",
      description: "Aging buckets for slow-moving stock",
      api: "/api/reports/stock-ageing",
      csv: "/reports/stock-ageing/export/csv",
      frequency: "Daily",
      format: "CSV",
    },
    {
      name: "Fast / Slow Moving Report",
      description: "Item movement in selected date range",
      api: "/api/reports/movement-analysis",
      csv: "/reports/movement-analysis/export/csv",
      frequency: "Weekly",
      format: "CSV",
    },
  ];

  // 🔹 Generate report (JSON preview)
  const generateReport = async (apiUrl) => {
    try {
      setLoading(true);
      const res = await api.get(apiUrl, {
        params: {
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        },
      });
      setPreviewData(res.data);
    } catch (err) {
      alert("Failed to generate report");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Download CSV with filters
  const downloadCSV = async (url, filename) => {
    try {
      const response = await api.get(`/api${url}`, {
        responseType: "blob",
        params: {
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        },
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert("Failed to download CSV");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="p-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
              <p className="text-slate-600 mt-1">
                Generate and export inventory and valuation reports
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 DATE RANGE FILTERS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Date Range Filter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setPreviewData([]);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* REPORT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reports.map((report, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {report.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {report.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg flex-1">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">
                      {report.frequency}
                    </span>
                  </div>
                  <span className="px-3 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
                    {report.format}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => generateReport(report.api)}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium"
                  >
                    {loading ? "Generating..." : "Generate"}
                  </button>

                  <button
                    onClick={() =>
                      downloadCSV(report.csv, `${report.name}.csv`)
                    }
                    className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50"
                  >
                    <Download className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PREVIEW TABLE */}
        {previewData.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">
                Report Preview ({previewData.length} rows)
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-700"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="border-t hover:bg-blue-50">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="px-6 py-3 text-sm text-slate-700">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}