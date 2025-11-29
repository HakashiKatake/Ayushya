'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Shield,
  Camera,
  Settings,
  Heart,

  Menu
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/medical-history', label: 'History', icon: FileText },
  { href: '/dashboard/insurance', label: 'Insurance', icon: Shield },
  { href: '/dashboard/prescription-reader', label: 'Scan Rx', icon: Camera },

  { href: '/dashboard/admin', label: 'Admin', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 font-sans">
      {/* Top Bar (Mobile/Tablet) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 p-4">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-blue-500/20 p-2 rounded-xl">
              <Heart className="h-5 w-5 text-blue-400" fill="currentColor" />
            </div>
            <span className="font-bold text-lg text-white">AYUSHYA</span>
          </Link>
          <div className="flex items-center gap-3">
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 rounded-xl"
                }
              }}
            />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10"
            >
              <Menu className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-24 lg:pb-8 pt-24 lg:pt-8 px-4 lg:px-8 max-w-7xl mx-auto min-h-screen">
        {children}
      </main>

      {/* Floating Dock Navbar (Desktop) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden lg:block">
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center gap-2 px-4 py-3 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl shadow-black/50"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.label} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group flex flex-col items-center"
                >
                  <div className={`
                    p-3 rounded-full transition-all duration-300
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }
                  `}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-slate-900 border border-white/10 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none">
                    {item.label}
                  </div>

                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />
                  )}
                </motion.div>
              </Link>
            );
          })}

          <div className="w-px h-8 bg-white/10 mx-2" />

          <div className="relative group">
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10 rounded-full border-2 border-white/10 hover:border-blue-500/50 transition-colors"
                }
              }}
            />
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-x-4 bottom-4 top-24 z-40 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:hidden flex flex-col gap-4 overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.label} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`
                    flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all
                    ${isActive
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                      : 'bg-white/5 border-white/5 text-slate-400'
                    }
                  `}>
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
