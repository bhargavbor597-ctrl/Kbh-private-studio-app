import React, { useEffect, useState } from 'react';
import { ContactMessage } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Modal } from '../../components/ui/Modal.tsx';
import { MessageSquare, Mail, Trash2, CheckCircle2, Clock, Eye, Search } from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetMessages({
        status: selectedStatus === 'all' ? undefined : selectedStatus,
      });
      if (res.success) setMessages(res.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [selectedStatus]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.adminUpdateMessageStatus(id, status);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: status as any } : m))
      );
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage({ ...activeMessage, status: status as any });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.adminDeleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage(null);
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
            Contact Messages & Inquiries
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Public website inquiries submitted through the contact form.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['all', 'new', 'read', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                selectedStatus === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {messages.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        msg.status === 'new'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                          : msg.status === 'read'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}
                    >
                      {msg.status}
                    </span>
                    <strong className="text-xs text-slate-900 dark:text-white truncate">
                      {msg.name}
                    </strong>
                    <span className="text-xs text-slate-400">&lt;{msg.email}&gt;</span>
                    <span className="text-[11px] text-slate-400 ml-auto sm:ml-2">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {msg.subject}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setActiveMessage(msg);
                      if (msg.status === 'new') handleUpdateStatus(msg.id, 'read');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 text-xs">
            No contact messages found.
          </div>
        )}
      </div>

      {/* Message Modal Viewer */}
      <Modal
        isOpen={!!activeMessage}
        onClose={() => setActiveMessage(null)}
        title={activeMessage?.subject || 'Contact Inquiry'}
        maxWidth="max-w-xl"
      >
        {activeMessage && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {activeMessage.name}
                </p>
                <a
                  href={`mailto:${activeMessage.email}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {activeMessage.email}
                </a>
              </div>
              <span className="text-slate-400">
                {new Date(activeMessage.createdAt).toLocaleString()}
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Message:
              </label>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                {activeMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">Status:</span>
                <select
                  value={activeMessage.status}
                  onChange={(e) => handleUpdateStatus(activeMessage.id, e.target.value)}
                  className="px-2.5 py-1 rounded-lg border text-xs"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                  activeMessage.subject
                )}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
