import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Home, Compass, DownloadCloud, Settings, Link as LinkIcon } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ReelVault | Your Private AI Memory',
  description: 'AI-powered vault to store, organize, and search saved short-form content.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neutral-950 text-neutral-50 flex h-screen overflow-hidden`}>
        {/* Sidebar */}
        <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 backdrop-blur-xl flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
              <Compass className="text-purple-500" />
              ReelVault
            </h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors">
              <Home size={18} /> Dashboard
            </Link>
            <Link href="/save" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors">
              <LinkIcon size={18} /> Save & Process
            </Link>
            <Link href="/import" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors">
              <DownloadCloud size={18} /> Import Instagram
            </Link>
          </nav>
          
          <div className="p-4 border-t border-neutral-800 mt-auto">
            <button className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-neutral-500 hover:text-white transition-colors">
              <Settings size={18} /> Settings
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black">
          {children}
        </main>
      </body>
    </html>
  );
}
