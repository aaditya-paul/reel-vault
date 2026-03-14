'use client';

import { useState, useEffect } from 'react';
import { Compass, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { useSession } from "next-auth/react";

interface SavedItem {
  id: number;
  url: string;
  platform: string;
  media_type: string;
  creator: string;
  caption: string;
  description: string;
  tags: string;
  category: string;
  timestamp: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchItems = async (searchQuery = '') => {
    setLoading(true);
    try {
      const endpoint = searchQuery 
        ? 'http://localhost:8000/api/search' 
        : 'http://localhost:8000/api/vault/items';
        
      const options: RequestInit = searchQuery ? {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.email || ''}`
        },
        body: JSON.stringify({ query: searchQuery, limit: 20 })
      } : { 
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.user?.email || ''}`
        }
      };

      const res = await fetch(endpoint, options);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to fetch vault items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems(query);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950 p-6 md:p-10 relative">
      
      {/* Header & Search */}
      <header className="mb-10 max-w-4xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Your Vault</h1>
            <p className="text-neutral-400 mt-1">Found {items.length} items securely indexed.</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Sparkles className="h-5 w-5 text-purple-500 group-focus-within:text-pink-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-24 py-4 border border-neutral-800 rounded-2xl leading-5 bg-neutral-900/50 backdrop-blur-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 sm:text-lg transition-all shadow-xl"
            placeholder="Search by vibe, description, or transcript... e.g. 'gym motivation'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <button
              type="submit"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium border border-white/10 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </header>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto w-full max-w-6xl mx-auto pb-20">
        {loading ? (
          <div className="w-full flex justify-center py-20">
            <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
          </div>
        ) : items.length === 0 ? (
          <div className="w-full py-20 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/5">
                <Compass className="text-neutral-500 w-8 h-8" />
             </div>
             <h3 className="text-xl font-medium text-white mb-2">No items found</h3>
             <p className="text-neutral-400">Save new content or alter your search query.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {items.map(item => (
              <div key={item.id} className="break-inside-avoid bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group flex flex-col shadow-lg">
                {/* Fallback geometric poster if no thumbnail */}
                <div className="w-full h-48 bg-gradient-to-br from-neutral-800 to-black relative flex items-center justify-center overflow-hidden border-b border-neutral-800">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent"></div>
                  <Compass className="text-neutral-700 w-12 h-12 relative z-10" />
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  {item.category && (
                    <span className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-purple-300 mb-3 w-fit tracking-wide">
                      {item.category.toUpperCase()}
                    </span>
                  )}
                  <p className="text-white font-medium text-sm mb-3 line-clamp-3 leading-relaxed">
                    {item.description || item.caption || "A saved piece of content with missing descriptions."}
                  </p>
                  
                  {item.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                      {item.tags.split(',').slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs text-neutral-400 bg-neutral-950 px-2 py-1 rounded-md">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-800/50">
                    <span className="text-xs text-neutral-500 font-medium">@{item.creator || 'unknown'}</span>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}
