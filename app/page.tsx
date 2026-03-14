import Link from 'next/link';
import { Sparkles, DownloadCloud, Link as LinkIcon, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 max-w-4xl mx-auto text-center">
      <div className="inline-flex items-center justify-center p-2 bg-purple-500/10 rounded-2xl mb-8 ring-1 ring-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-pulse">
        <Sparkles className="text-purple-400 w-8 h-8" />
      </div>
      
      <h1 className="text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
        Welcome to your <br/>Personal Memory Vault
      </h1>
      
      <p className="text-lg text-neutral-400 max-w-xl mb-12">
        ReelVault is your private, AI-powered library for short-form content. 
        Save natively or import, and search everything using natural language.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6 w-full">
        {/* Mode A */}
        <Link href="/save" className="group relative p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 hover:bg-neutral-800/80 transition-all duration-300 overflow-hidden flex flex-col items-start text-left">
          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
            <ArrowRight className="text-purple-400" />
          </div>
          <div className="p-3 bg-neutral-800/50 rounded-xl mb-6 shadow-inner ring-1 ring-white/5 group-hover:bg-purple-500/20 group-hover:ring-purple-500/30 transition-all">
            <LinkIcon className="text-neutral-300 group-hover:text-purple-400" size={24} />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-white">Start Fresh</h2>
          <p className="text-neutral-400">
            Paste links to Reels, TikToks, and YouTube Shorts one by one to build your collection going forward.
          </p>
        </Link>
        
        {/* Mode B */}
        <Link href="/import" className="group relative p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-pink-500/50 hover:bg-neutral-800/80 transition-all duration-300 overflow-hidden flex flex-col items-start text-left">
          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
            <ArrowRight className="text-pink-400" />
          </div>
          <div className="p-3 bg-neutral-800/50 rounded-xl mb-6 shadow-inner ring-1 ring-white/5 group-hover:bg-pink-500/20 group-hover:ring-pink-500/30 transition-all">
            <DownloadCloud className="text-neutral-300 group-hover:text-pink-400" size={24} />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-white">Import Instagram</h2>
          <p className="text-neutral-400">
            Upload your Instagram Data Download (ZIP) to instantly extract and process your entire historical save collection.
          </p>
        </Link>
      </div>
    </div>
  );
}
