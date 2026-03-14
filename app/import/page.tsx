'use client';

import { useState } from 'react';
import { DownloadCloud, FileArchive, Loader2, AlertCircle } from 'lucide-react';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'error' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setProgress(10);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://localhost:8000/api/ingestion/import-instagram', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to start import");
      }
      
      setStatus('processing');
      setProgress(50);
      
      // In MVP, we simply mock the rest of the progress completion after API response 
      // since we aren't polling the DB task table for realtime updates.
      setTimeout(() => {
        setProgress(100);
        setStatus('success');
      }, 3000);
      
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Error uploading file');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 max-w-3xl mx-auto w-full mt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Import Instagram Saves</h1>
        <p className="text-neutral-400">Upload the ZIP exported from Instagram Data Download to index all your past saved posts.</p>
      </div>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl text-center flex flex-col items-center">
        
        {status === 'idle' || status === 'error' ? (
          <>
            <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-pink-500/20">
              <DownloadCloud className="text-pink-400" size={32} />
            </div>
            
            <label htmlFor="file-upload" className="cursor-pointer group">
              <div className="px-6 py-4 border-2 border-dashed border-neutral-700 rounded-xl group-hover:border-pink-500/50 group-hover:bg-pink-500/5 transition-all">
                <span className="text-pink-400 font-medium">Click to select a ZIP file</span>
                <span className="text-neutral-500 block mt-1 text-sm">or drag and drop here</span>
              </div>
              <input id="file-upload" type="file" accept=".zip" className="hidden" onChange={handleFileChange} />
            </label>
            
            {file && (
              <div className="mt-6 flex items-center gap-3 bg-neutral-950 px-4 py-3 rounded-lg border border-neutral-800 w-full">
                <FileArchive className="text-neutral-500" />
                <span className="text-neutral-300 truncate font-medium text-sm flex-1 text-left">{file.name}</span>
                <span className="text-neutral-500 text-sm">{(file.size / (1024*1024)).toFixed(2)} MB</span>
              </div>
            )}
            
            <button
              onClick={handleUpload}
              disabled={!file}
              className="mt-6 w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50 transition-colors"
            >
              Start Import Process
            </button>
            
            {status === 'error' && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 w-full text-left">
                <AlertCircle className="text-red-400 mt-0.5 shrink-0" size={20} />
                <div className="text-red-300 text-sm">{errorMsg}</div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex justify-center items-center flex-col py-12">
            
            {status === 'processing' || status === 'uploading' ? (
              <Loader2 className="animate-spin text-pink-500 w-16 h-16 mb-6" />
            ) : (
             <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <FileArchive className="text-green-400" size={32} />
             </div>
            )}
            
            <h3 className="text-xl font-medium text-white mb-2">
              {status === 'uploading' ? 'Uploading Archive...' : 
               status === 'processing' ? 'Extracting & Deduplicating URLs...' : 
               'Import Successful!'}
            </h3>
            
            <div className="w-full bg-neutral-800 rounded-full h-2.5 mt-8 mb-4 max-w-sm overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
            
            {status === 'success' && (
              <p className="text-green-400 text-sm">Your posts are now indexing in the background.</p>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
