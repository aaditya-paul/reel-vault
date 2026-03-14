'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut, LogIn } from "lucide-react";

export function SidebarProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-14 animate-pulse bg-neutral-800/50 rounded-xl" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="w-full flex items-center gap-3 px-4 py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all group font-medium"
      >
        <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800">
      <div className="flex items-center gap-3 overflow-hidden">
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full shadow-sm"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-neutral-800" />
        )}
        <div className="flex flex-col truncate">
          <span className="text-sm font-medium text-white truncate">
            {session.user?.name || "User"}
          </span>
          <span className="text-xs text-neutral-500 truncate">
            {session.user?.email}
          </span>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        title="Sign Out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
