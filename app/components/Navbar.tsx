"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full flex justify-center">
        <header className="w-1/2 max-w-6xl bg-transparent sticky top-0 z-10">
            <nav className="flex items-center justify-between p-4">
                <Link href="/" className="text-lg font-semibold tracking-tight">
                  RealTime Grid
                </Link>

                <div className="flex items-center gap-3">
                    <Link href="/login" className="text-sm text-slate-200 hover:text-white">
                        Login
                    </Link>
                    <Link href="/signup" className="text-sm text-slate-200 hover:text-white ml-4">
                        Sign Up
                    </Link>
                </div>
            </nav>
        </header>
    </div>
  );
}