"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils/cn";
import { NotificationBell } from "./NotificationBell";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

function NavLinks({
  navItems,
  pathname,
  onNavigate,
}: {
  navItems: NavItem[];
  pathname: string | null;
  onNavigate: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
              active
                ? "bg-gradient-to-r from-primary to-primary-dark text-on-primary shadow-glow-primary"
                : "text-foreground-secondary hover:bg-surface-2 hover:text-foreground"
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({
  roleLabel,
  navItems,
  children,
}: {
  roleLabel: string;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  function closeDrawer(returnFocus = true) {
    setDrawerOpen(false);
    if (returnFocus) menuButtonRef.current?.focus();
  }

  // Close automatically whenever the route changes.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setDrawerOpen(false);
  }

  // Prevent background scrolling while the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [drawerOpen]);

  // Move focus into the drawer when it opens.
  useEffect(() => {
    if (drawerOpen) closeButtonRef.current?.focus();
  }, [drawerOpen]);

  function handleDrawerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      closeDrawer();
      return;
    }
    if (e.key !== "Tab") return;
    const container = drawerRef.current;
    if (!container) return;
    const focusables = container.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r border-border-strong bg-surface px-4 py-6 md:flex">
        <Link href="/" className="mb-8 font-heading text-xl text-primary">
          JPureva
        </Link>
        <div className="mb-6 text-xs font-semibold uppercase tracking-wide text-foreground-tertiary">{roleLabel}</div>
        <NavLinks navItems={navItems} pathname={pathname} onNavigate={() => {}} />
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-foreground-secondary transition-colors duration-150 hover:bg-surface-2 hover:text-foreground"
        >
          <LogOut size={18} />
          Log out
        </button>
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={() => closeDrawer(false)}
      />
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${roleLabel} navigation`}
        inert={!drawerOpen}
        onKeyDown={handleDrawerKeyDown}
        className={cn(
          "glass-panel fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80%] flex-col px-4 py-6 shadow-lifted transition-transform duration-300 ease-in-out md:hidden",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="font-heading text-xl text-primary" onClick={() => closeDrawer(false)}>
            JPureva
          </Link>
          <button
            ref={closeButtonRef}
            onClick={() => closeDrawer()}
            className="rounded-full p-2 text-foreground-secondary hover:bg-surface-2 hover:text-foreground"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-6 text-xs font-semibold uppercase tracking-wide text-foreground-tertiary">{roleLabel}</div>
        <NavLinks navItems={navItems} pathname={pathname} onNavigate={() => closeDrawer(false)} />
        <button
          onClick={() => {
            closeDrawer(false);
            handleLogout();
          }}
          className="mt-6 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-foreground-secondary transition-colors duration-150 hover:bg-surface-2 hover:text-foreground"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="glass-panel sticky top-0 z-30 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 md:hidden">
            <button
              ref={menuButtonRef}
              onClick={() => setDrawerOpen(true)}
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              aria-label="Open navigation menu"
              className="rounded-full p-2 text-foreground-secondary hover:bg-surface-2 hover:text-foreground"
            >
              <Menu size={20} />
            </button>
            <span className="font-heading text-lg text-primary">JPureva</span>
          </div>
          <div className="hidden text-sm text-foreground-secondary md:block">Signed in as {user?.email}</div>
          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
