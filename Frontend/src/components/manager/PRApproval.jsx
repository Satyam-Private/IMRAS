import { useEffect, useState } from "react";
import { ShoppingCart, CheckCircle, Package, User, Calendar, Clock } from "lucide-react";
import api from "../../api/api";
import { StatusBadge } from "../shared/StatusBadge";

export function PRApproval() {
    const [prs, setPrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPRDrafts();
    }, []);

    const fetchPRDrafts = async () => {
        try {
            const res = await api.get("/api/pr?status=DRAFT");
            setPrs(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load PR drafts");
        } finally {
            setLoading(false);
        }
    };

    const approvePR = async (prId) => {
        try {
            await api.post(`/api/pr/${prId}/approve`);
            fetchPRDrafts();
        } catch (err) {
            alert("Failed to approve PR");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading PR drafts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-slate-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl border-2 border-red-200 p-8 shadow-lg max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <p className="text-red-600 font-semibold text-center text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                            <ShoppingCart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                Purchase Requisition Approval
                            </h1>
                            <p className="text-slate-600 mt-1">
                                Review and approve PRs created by Inventory Managers
                            </p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    {prs.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="text-sm text-slate-700">
                                    <span className="font-bold text-green-600">{prs.length}</span>{" "}
                                    {prs.length === 1 ? "PR" : "PRs"} pending your approval
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* PR List */}
                {prs.length === 0 ? (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="w-10 h-10 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-lg font-medium">No PR drafts pending approval</p>
                        <p className="text-slate-400 text-sm mt-2">All caught up! Check back later for new requests.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {prs.map((pr) => (
                            <div
                                key={pr.pr_id}
                                className="group bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-xl hover:shadow-green-100 hover:border-green-200 transition-all duration-300 overflow-hidden"
                            >
                                {/* Header */}
                                <div className="p-6 bg-gradient-to-r from-slate-50 to-green-50 border-b-2 border-slate-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                                <ShoppingCart className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">
                                                    PR-{pr.pr_id}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                        <span>
                                                            Requested by <span className="font-semibold text-slate-800">{pr.requested_by}</span>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        <span>{new Date(pr.created_at).toLocaleDateString()}</span>
                                                        <Clock className="w-4 h-4 text-slate-400 ml-2" />
                                                        <span>{new Date(pr.created_at).toLocaleTimeString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <StatusBadge status={pr.status.toLowerCase()} />
                                    </div>
                                </div>

                                {/* Items Section */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Package className="w-5 h-5 text-slate-600" />
                                        <h4 className="font-semibold text-slate-900">
                                            Requested Items ({pr.items.length})
                                        </h4>
                                    </div>

                                    {pr.items.length === 0 ? (
                                        <div className="bg-slate-50 rounded-lg p-6 text-center border-2 border-dashed border-slate-200">
                                            <p className="text-slate-500 text-sm">
                                                No items in this PR
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 mb-6">
                                            {pr.items.map((item, index) => (
                                                <div
                                                    key={item.item_id}
                                                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-green-50 rounded-xl border border-slate-200 hover:border-green-200 transition-all duration-200"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 font-bold text-sm text-slate-600">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">
                                                                {item.sku}
                                                            </p>
                                                            <p className="text-sm text-slate-600">
                                                                {item.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
                                                        <span className="text-xs font-semibold text-slate-500 uppercase">Qty:</span>
                                                        <span className="text-lg font-bold text-green-600">
                                                            {item.quantity_required}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex justify-end pt-4 border-t-2 border-slate-100">
                                        <button
                                            onClick={() => approvePR(pr.pr_id)}
                                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl flex items-center gap-2 hover:from-green-700 hover:to-green-800 font-semibold shadow-md hover:shadow-lg transition-all duration-200 group/btn"
                                        >
                                            <CheckCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                            Approve PR
                                        </button>
                                    </div>
                                </div>

                                {/* Bottom Accent */}
                                <div className="h-1 bg-gradient-to-r from-green-500 via-green-600 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}