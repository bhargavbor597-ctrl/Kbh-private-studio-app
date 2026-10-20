import React, { useEffect, useState } from 'react';
import { SupportRequest, AppItem } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Modal } from '../../components/ui/Modal.tsx';
import { LifeBuoy, Mail, Trash2, Eye, Wrench, Lightbulb, MessageSquare } from 'lucide-react';

export const AdminSupportPage: React.FC = () => {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState('all');
  const [activeRequest, setActiveRequest] = useState<SupportRequest | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [supRes, appsRes] = await Promise.all([
        api.adminGetSupport({
          status: selectedStatus === 'all' ? undefined : selectedStatus,
          app: selectedApp === 'all' ? undefined : selectedApp,
        }),
        api.adminGetApps(),
      ]);
      if (supRes.success) setRequests(supRes.requests);
      if (appsRes.success) setApps(appsRes.apps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedStatus, selectedApp]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.adminUpdateSupportStatus(id, status);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: status as any } : r))
      );
      if (activeRequest && activeRequest.id === id) {
        setActiveRequest({ ...activeRequest, status: status as any });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this support ticket?')) return;
    try {
      await api.adminDeleteSupport(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (activeRequest && activeRequest.id === id) {
        setActiveRequest(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Customer Support Tickets
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Bug reports, feature suggestions, and app assistance requests from Google Play users.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={selectedApp}
            onChange={(e) => setSelectedApp(e.target.value)}
            className="px-3 py-1.5 rounded-xl border text-xs bg-white dark:bg-slate-900"
          >
            <option value="all">All Applications</option>
            {apps.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border text-xs bg-white dark:bg-slate-900"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In-Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {requests.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                      {req.ticketId}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.status === 'open'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                          : req.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}
                    >
                      {req.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      App: {req.app}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-auto sm:ml-2">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {req.subject}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    From: {req.name} ({req.email}) — {req.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => setActiveRequest(req)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Ticket</span>
                  </button>

                  <button
                    onClick={() => handleDelete(req.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 text-xs">
            No support requests found.
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      <Modal
        isOpen={!!activeRequest}
        onClose={() => setActiveRequest(null)}
        title={`Support Ticket #${activeRequest?.ticketId}`}
        maxWidth="max-w-xl"
      >
        {activeRequest && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Sender:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {activeRequest.name} &lt;{activeRequest.email}&gt;
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Related Application:</span>
                <strong className="text-indigo-600">{activeRequest.app}</strong>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Ticket Type:</span>
                <span className="uppercase font-mono">{activeRequest.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Submitted:</span>
                <span>{new Date(activeRequest.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Subject:
              </label>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {activeRequest.subject}
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Message & Reproduction Details:
              </label>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                {activeRequest.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">Update Status:</span>
                <select
                  value={activeRequest.status}
                  onChange={(e) => handleUpdateStatus(activeRequest.id, e.target.value)}
                  className="px-2.5 py-1 rounded-lg border text-xs"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <a
                href={`mailto:${activeRequest.email}?subject=Re: [Ticket ${activeRequest.ticketId}] ${encodeURIComponent(
                  activeRequest.subject
                )}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply to Customer</span>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
