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
  Heart
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/medical-history', label: 'Medical History', icon: FileText },
  { href: '/dashboard/insurance', label: 'Insurance', icon: Shield },
  { href: '/dashboard/prescription-reader', label: 'Prescription', icon: Camera },
  { href: '/dashboard/admin', label: 'Admin', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background">
      {/* Horizontal Navbar */}
      <div className="sticky top-4 z-50 px-4 mb-8">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto backdrop-blur-xl bg-card/90 rounded-3xl shadow-2xl border border-primary/20 p-3"
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 px-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-primary/10 p-2 rounded-xl"
              >
                <Heart className="h-6 w-6 text-primary" fill="currentColor" />
              </motion.div>
              <span className="font-bold text-xl bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent hidden md:block">
                AYUSHYA
              </span>
            </Link>

            {/* Nav Items */}
            <div className="flex items-center gap-1 flex-1 justify-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative px-4 py-2.5 rounded-2xl transition-all duration-300
                        ${isActive 
                          ? 'bg-primary text-primary-foreground shadow-lg' 
                          : 'hover:bg-muted/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium hidden lg:block">
                          {item.label}
                        </span>
                      </div>
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary rounded-2xl -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* User Button */}
            <div className="flex items-center gap-3 px-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold">{user?.firstName || 'User'}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
              <UserButton 
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10 rounded-xl"
                  }
                }}
              />
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Main Content */}
      <main className="px-4 pb-8">
        {children}
      </main>
    </div>
  );
}
