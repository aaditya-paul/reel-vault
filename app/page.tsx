import Link from 'next/link';
import { Compass, DownloadCloud, Sparkles, Wand2, ShieldCheck, ChevronRight } from 'lucide-react';
import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleStartFresh = () => {
    if (session) {
      router.push('/save');
    } else {
      signIn('google', { callbackUrl: '/save' });
    }
  };

  const handleImport = () => {
    if (session) {
      router.push('/import');
    } else {
      signIn('google', { callbackUrl: '/import' });
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 max-w-4xl mx-auto text-center">
      <div className="inline-flex items-center justify-center p-2 bg-purple-500/10 rounded-2xl mb-8 ring-1 ring-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-pulse">
        <Sparkles className="text-purple-400 w-6 h-6 mr-2" />
        <span className="text-purple-300 font-medium tracking-wide">Powered by Google Gemini</span>
      </div>
      
      <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-500 to-red-500 pb-2">
        Your Second Brain <br /> for Short Content.
      </h1>
      
      <p className="text-xl text-neutral-400 mb-16 max-w-2xl leading-relaxed">
        ReelVault is your private, AI-powered library for short-form content. 
        Save natively or import, and search everything using natural language.
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
          
          {/* Option A: Start Fresh */}
          <button onClick={handleStartFresh} className="group relative break-inside-avoid bg-neutral-900 border border-neutral-800 rounded-3xl p-8 hover:border-purple-500/50 transition-all text-left overflow-hidden flex flex-col items-start justify-start shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-purple-500/30 group-hover:scale-110 transition-transform">
              <Compass className="text-purple-400 w-7 h-7" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">Start Fresh</h2>
            <p className="text-neutral-400 leading-relaxed mb-8">
              Paste links from Instagram, TikTok, or YouTube Shorts one by one. Build your curated vault from scratch.
            </p>
            
            <div className="mt-auto flex items-center text-purple-400 font-medium group-hover:translate-x-2 transition-transform">
              Begin saving <ChevronRight className="w-5 h-5 ml-1" />
            </div>
          </button>

          {/* Option B: Import Archive */}
          <button onClick={handleImport} className="group relative break-inside-avoid bg-neutral-900 border border-neutral-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all text-left overflow-hidden flex flex-col items-start justify-start shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-blue-500/30 group-hover:scale-110 transition-transform">
              <DownloadCloud className="text-blue-400 w-7 h-7" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">Import Archive</h2>
            <p className="text-neutral-400 leading-relaxed mb-8">
              Upload your official Instagram Data Export ZIP. We'll automatically secure and index all your historical saved reels.
            </p>
            
            <div className="mt-auto flex items-center text-blue-400 font-medium group-hover:translate-x-2 transition-transform">
              Upload ZIP <ChevronRight className="w-5 h-5 ml-1" />
            </div>
          </button>

        </div>
    </div>
  );
}
