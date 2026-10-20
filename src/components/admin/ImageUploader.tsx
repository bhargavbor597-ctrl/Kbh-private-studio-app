import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle, Link as LinkIcon, RefreshCw, Eye } from 'lucide-react';
import { api } from '../../services/api.ts';

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  hint?: string;
  aspectRatioHint?: string;
  allowDelete?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  hint,
  aspectRatioHint,
  allowDelete = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [previewModal, setPreviewModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File exceeds maximum size of 5MB.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const res = await api.adminUploadImage(base64, file.name);
          if (res.success && res.url) {
            onChange(res.url);
          } else {
            setError('Failed to upload image to server');
          }
        } catch (err: any) {
          setError(err.message || 'Upload failed');
        } finally {
          setUploading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read selected image file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Error processing file');
      setUploading(false);
    }
  };

  const handleApplyUrl = () => {
    if (!customUrl.trim()) return;
    onChange(customUrl.trim());
    setCustomUrl('');
    setShowUrlInput(false);
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {aspectRatioHint && (
          <span className="text-[11px] text-slate-400 font-medium">
            {aspectRatioHint}
          </span>
        )}
      </div>

      {hint && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}

      {error && (
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {value ? (
        <div className="relative group border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {value.startsWith('data:') ? 'Inline Data Image (Local/Cloudinary Fallback)' : value}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>Image active & saved to database</span>
            </p>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 inline-flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${uploading ? 'animate-spin' : ''}`} />
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewModal(true)}
                className="px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 inline-flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>Preview</span>
              </button>

              {allowDelete && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 inline-flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {!showUrlInput ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors bg-white dark:bg-slate-900/40 ${
                uploading ? 'opacity-60 pointer-events-none' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2">
                {uploading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {uploading ? 'Uploading to Cloudinary / Storage...' : 'Click or Drag to Upload Image'}
              </p>
              <p className="text-[11px] text-slate-400">
                Supports PNG, JPG, WebP, SVG up to 5MB
              </p>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUrlInput(true);
                  }}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Or enter external URL</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/60 space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Image Web URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/images/banner.png"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview Modal */}
      {previewModal && value && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setPreviewModal(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-4 shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {label} Preview
              </span>
              <button
                type="button"
                onClick={() => setPreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] flex items-center justify-center bg-slate-100 dark:bg-slate-950 rounded-xl p-2 overflow-hidden">
              <img
                src={value}
                alt={label}
                className="max-h-[60vh] max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
