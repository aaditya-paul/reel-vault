import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Home, Compass, DownloadCloud, Settings, Link as LinkIcon } from 'lucide-react';
import { Providers } from '@/components/Providers';
import { SidebarProfile } from '@/components/SidebarProfile';

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
        <Providers>
          {/* Sidebar */}
          <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 backdrop-blur-xl flex flex-col">
            <div className="p-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                <Compass className="text-purple-500" />
                ReelVault
              </h1>
            </div>
            
            <nav className="flex-1 px-4 py-8 space-y-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link href="/save" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                <LinkIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Save & Process</span>
              </Link>
              <Link href="/import" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                <DownloadCloud className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Import Instagram</span>
              </Link>
            </nav>
            
            <div className="p-4 border-t border-neutral-800 space-y-4">
              <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium">Settings</span>
              </Link>
              <SidebarProfile />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

