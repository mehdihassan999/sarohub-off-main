import React, { useState, useRef } from 'react';
import { Upload, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { api } from '../api';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  id?: string;
  multiple?: boolean;
}

export default function ImageUploadField({ label, value, onChange, placeholder, id, multiple = false }: ImageUploadFieldProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalidType = files.find(file => !file.type.startsWith('image/'));
    if (invalidType) {
      setError('Please select image files (PNG, JPG, WEBP, etc.)');
      return;
    }

    const oversized = files.find(file => file.size > 10 * 1024 * 1024);
    if (oversized) {
      setError('Image is too large. Max size is 10MB per image.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      for (const file of files) {
        try {
          const res = await api.uploadImage(file);
          if (!res.url) throw new Error('Upload returned no URL');
          onChange(res.url);
        } catch (err: any) {
          console.warn('Backend upload failed, converting to local data URI:', err);
          await new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) onChange(String(event.target.result));
              resolve();
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Unable to upload image');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2" id={id}>
      <label className="block text-xs font-mono text-slate-400">{label}</label>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "https://example.com/image.jpg"}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
            <ImageIcon className="h-4 w-4" />
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={triggerFileSelect}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-50 cursor-pointer shrink-0"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          {loading ? 'Uploading...' : 'Upload File'}
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple={multiple}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {value && (
        <div className="mt-2 relative inline-block rounded-lg border border-slate-800/80 p-1.5 bg-slate-950/40">
          <img
            src={value}
            alt="Asset preview"
            referrerPolicy="no-referrer"
            className="max-h-24 max-w-full rounded object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}
