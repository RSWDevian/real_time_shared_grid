"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Modal from "./Modal";

type User = { id: string; email: string } | null;

export default function Navbar() {
  const [open, setOpen] = useState<"login" | "signup" | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.get("username"),
          email: data.get("email"),
          password: data.get("password"),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Signup failed");
        setLoading(false);
        return;
      }

      setOpen(null);
      window.location.reload();
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Login failed");
        setLoading(false);
        return;
      }

      setOpen(null);
      window.location.reload();
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <>
      <div className="w-full flex justify-center">
        <header className="w-1/2 max-w-6xl bg-transparent sticky top-0 z-10">
          <nav className="flex items-center justify-between p-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              RealTime Grid
            </Link>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm text-slate-400">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-slate-200 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setOpen("login")}
                    className="text-sm text-slate-200 hover:text-white"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setOpen("signup")}
                    className="text-sm text-slate-200 hover:text-white ml-4"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </nav>
        </header>
      </div>

      {open === "login" && (
        <Modal title="Login" onClose={() => { setOpen(null); setError(""); }}>
          <form className="flex flex-col gap-3" onSubmit={handleLogin}>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white disabled:opacity-50"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </Modal>
      )}

      {open === "signup" && (
        <Modal title="Sign Up" onClose={() => { setOpen(null); setError(""); }}>
          <form className="flex flex-col gap-3" onSubmit={handleSignup}>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <input
              name="username"
              type="text"
              placeholder="Username (optional)"
              className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white disabled:opacity-50"
            >
              {loading ? "Loading..." : "Create Account"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}