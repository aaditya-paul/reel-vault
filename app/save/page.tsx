'use client';

import { useState } from 'react';
import { Link as LinkIcon, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function SavePage() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setStatus('loading');
    
    try {
      // In production, configure API base URL dynamically
      const res = await fetch('http://localhost:8000/api/ingestion/save-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || "Failed to save URL");
      
      setStatus('success');
      setMessage(data.message || "URL successfully saved and processing started!");
      setUrl('');
      
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 max-w-3xl mx-auto w-full mt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Save New Content</h1>
        <p className="text-neutral-400">Paste a link to any public Reel, TikTok, or YouTube Short to embed it into your private vault.</p>
      </div>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-neutral-400 mb-2">Media URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="url"
                id="url"
                required
                className="block w-full pl-10 pr-3 py-3 border border-neutral-700 rounded-xl leading-5 bg-neutral-950 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 sm:text-sm transition-all"
                placeholder="https://www.instagram.com/reel/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={status === 'loading' || !url}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Save to Vault'}
          </button>
        </form>
        
        {status === 'success' && (
          <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
            <CheckCircle2 className="text-green-400 mt-0.5" size={20} />
            <div className="text-green-300 text-sm">{message}</div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="text-red-400 mt-0.5" size={20} />
            <div className="text-red-300 text-sm">{message}</div>
          </div>
        )}
      </div>
    </div>
  );
}
