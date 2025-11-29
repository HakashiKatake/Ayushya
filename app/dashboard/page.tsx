'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Activity,
  FileText,
  Shield,
  TrendingDown,
  Clock,
  Hospital,
  Camera,
  Heart,
  Sparkles,
  ArrowRight,
  Calendar,
  MapPin,
  DollarSign,
  Users,

  Stethoscope,
  AlertCircle,
  CheckCircle2,
  Zap,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { useCaseStore, type Case } from '@/store/caseStore';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { cases, setCases, setLoading } = useCaseStore();
  const [activeCases, setActiveCases] = useState<Case[]>([]);
  const [pastCases, setPastCases] = useState<Case[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    const active = cases.filter((c) => c.status === 'ACTIVE');
    const past = cases.filter((c) => c.status === 'DISCHARGED');
    setActiveCases(active);
    setPastCases(past);
  }, [cases]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cases');
      if (response.ok) {
        const data = await response.json();
        setCases(data.cases || []);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative"
        >
          <div className="absolute inset-0 blur-3xl bg-blue-500/20 rounded-full" />
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="relative mx-auto mb-6 bg-slate-900/50 p-6 rounded-full border border-white/10 backdrop-blur-md"
          >
            <Heart className="h-12 w-12 text-blue-400" fill="currentColor" />
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-lg font-medium text-blue-200"
          >
            Initializing Health Matrix...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Mock health data for charts
  const healthMetrics = {
    heartRate: 72,
    bloodPressure: '120/80',
    steps: 8450,
    sleep: 7.5,
  };

  const spendingData = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 1800 },
    { month: 'Mar', amount: 900 },
    { month: 'Apr', amount: 2400 },
    { month: 'May', amount: 1500 },
    { month: 'Jun', amount: 2100 },
  ];

  const maxSpending = Math.max(...spendingData.map(d => d.amount));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/dashboard-bg.png')] bg-cover bg-center opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/80 to-slate-950" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/0 to-slate-950/0" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-xl font-bold text-white">A</span>
                </div>
                <span className="text-sm font-medium text-blue-300 tracking-wider uppercase">Health Dashboard</span>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
                Good Morning, {user.firstName}
              </h1>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-200" />
              <div className="relative flex items-center bg-slate-900 rounded-full p-1 pr-4 border border-white/10">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                  <Search className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search records..."
                  className="bg-transparent border-none outline-none text-sm ml-3 text-white placeholder:text-slate-500 w-48"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column - Stats & Vitals */}
            <div className="lg:col-span-8 space-y-6">
              {/* Hero Card */}
              <motion.div variants={itemVariants}>
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 group">
                  <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors duration-500" />

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                        <Sparkles className="h-3 w-3 text-blue-400" />
                        <span className="text-xs font-medium text-blue-300">AI Insights Ready</span>
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-white">Your Health Overview</h2>
                      <p className="text-slate-400 mb-6">
                        Your vitals are stable. We've detected a 12% decrease in your healthcare spending this month compared to last month.
                      </p>
                      <div className="flex gap-4">
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 border-0">
                          View Full Report
                        </Button>
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl bg-transparent">
                          Share with Doctor
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="relative h-32 w-32">
                        <svg className="h-full w-full transform -rotate-90">
                          <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                          <motion.circle
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 0.85 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            cx="64" cy="64" r="60"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeLinecap="round"
                            className="text-blue-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-white">85</span>
                          <span className="text-xs text-slate-400 uppercase tracking-wider">Score</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Vitals Grid */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Heart Rate', value: healthMetrics.heartRate, unit: 'bpm', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
                  { label: 'Blood Pressure', value: healthMetrics.bloodPressure, unit: 'mmHg', icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
                  { label: 'Steps', value: healthMetrics.steps.toLocaleString(), unit: 'today', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                  { label: 'Sleep', value: healthMetrics.sleep, unit: 'hours', icon: Clock, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -5 }}
                    className={`p-4 rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-sm relative overflow-hidden`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      <div className={`h-2 w-2 rounded-full ${stat.color.replace('text', 'bg')}`} />
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                      <p className="text-xs text-slate-400 mt-1">{stat.unit}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Active Cases List */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Hospital className="h-5 w-5 text-blue-400" />
                    Active Cases
                  </h3>
                  <Link href="/dashboard/cases" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {activeCases.length > 0 ? (
                    activeCases.map((caseItem, idx) => (
                      <motion.div
                        key={caseItem._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Link href={`/dashboard/cases/${caseItem._id}`}>
                          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all duration-300">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                                  <Hospital className="h-6 w-6 text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">{caseItem.hospitalName}</h4>
                                  <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Stethoscope className="h-3 w-3" />
                                      {caseItem.chiefComplaint || 'Checkup'}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(caseItem.admissionDatetime).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/20 hover:bg-green-500/30">
                                  Active
                                </Badge>
                                <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 rounded-2xl border border-white/5 bg-white/5 border-dashed">
                      <Hospital className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No active cases at the moment</p>
                      <Button variant="link" className="text-blue-400">Start a new case</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Quick Actions & Spending */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Actions Grid */}
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { href: '/dashboard/cases/new', icon: Plus, label: 'New Case', color: 'from-blue-600 to-blue-400' },
                    { href: '/dashboard/medical-history', icon: FileText, label: 'History', color: 'from-purple-600 to-purple-400' },
                    { href: '/dashboard/prescription-reader', icon: Camera, label: 'Scan Rx', color: 'from-orange-600 to-orange-400' },
                    { href: '/dashboard/insurance', icon: Shield, label: 'Insurance', color: 'from-emerald-600 to-emerald-400' },
                    { href: '/dashboard/admin', icon: Activity, label: 'Analytics', color: 'from-pink-600 to-pink-400' },

                  ].map((action, idx) => (
                    <Link key={action.href} href={action.href}>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative overflow-hidden rounded-2xl bg-slate-800/50 border border-white/5 p-4 group hover:border-white/20 transition-colors h-full"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                          {action.label}
                        </span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Spending Card */}
              <motion.div variants={itemVariants}>
                <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-slate-400">Total Spending</p>
                      <h3 className="text-2xl font-bold text-white">₹12,450</h3>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <TrendingDown className="h-5 w-5 text-green-400" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {spendingData.slice(-4).map((data, idx) => (
                      <div key={data.month} className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>{data.month}</span>
                          <span>₹{data.amount}</span>
                        </div>
                        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(data.amount / maxSpending) * 100}%` }}
                            transition={{ delay: 0.5 + (0.1 * idx), duration: 1 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <Zap className="h-5 w-5 text-blue-400" />
                      <p className="text-xs text-blue-200">
                        <span className="font-semibold">Pro Tip:</span> Upload your bills before 11 PM to get faster processing.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
