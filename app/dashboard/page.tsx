'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
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
  TrendingUp,
  Users,
  Pill,
  Stethoscope,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useCaseStore, type Case } from '@/store/caseStore';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { cases, setCases, setLoading } = useCaseStore();
  const [activeCases, setActiveCases] = useState<Case[]>([]);
  const [pastCases, setPastCases] = useState<Case[]>([]);

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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="mx-auto mb-6"
          >
            <Heart className="h-16 w-16 text-primary" fill="currentColor" />
          </motion.div>
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-lg font-medium text-muted-foreground"
          >
            Loading your dashboard... 🏥
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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Welcome Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="lg:col-span-2"
          >
            <Card className="backdrop-blur-sm bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl border border-primary/20 shadow-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4"
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">Welcome Back!</span>
                    </motion.div>
                    <h1 className="text-4xl font-bold mb-2">
                      Hello, {user.firstName || 'User'}! 👋
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      Here's what's happening with your health today
                    </p>
                  </div>
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="hidden md:block"
                  >
                    <div className="bg-primary/10 p-4 rounded-3xl">
                      <Heart className="h-16 w-16 text-primary" fill="currentColor" />
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-card/80 rounded-3xl border border-primary/20 shadow-xl h-full">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500/10 p-2 rounded-xl">
                        <Activity className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active Cases</p>
                        <p className="text-2xl font-bold">{activeCases.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500/10 p-2 rounded-xl">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Cases</p>
                        <p className="text-2xl font-bold">{cases.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-500/10 p-2 rounded-xl">
                        <TrendingDown className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Savings</p>
                        <p className="text-2xl font-bold">₹12.4K</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions - Redesigned */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Quick Actions
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { href: '/dashboard/cases/new', icon: Plus, label: 'New Case', gradient: 'from-blue-500 to-blue-600' },
            { href: '/dashboard/medical-history', icon: FileText, label: 'History', gradient: 'from-purple-500 to-purple-600' },
            { href: '/dashboard/prescription-reader', icon: Camera, label: 'Scan Rx', gradient: 'from-orange-500 to-orange-600' },
            { href: '/dashboard/insurance', icon: Shield, label: 'Insurance', gradient: 'from-green-500 to-green-600' },
            { href: '/dashboard/admin', icon: Activity, label: 'Analytics', gradient: 'from-pink-500 to-pink-600' },
            { href: '/dashboard', icon: Pill, label: 'Medicine', gradient: 'from-indigo-500 to-indigo-600' },
          ].map((action, idx) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={action.href}>
                <Card className={`relative overflow-hidden cursor-pointer bg-gradient-to-br ${action.gradient} text-white shadow-xl border-0 h-32`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                  <CardContent className="p-4 h-full flex flex-col items-center justify-center relative">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="bg-white/20 p-3 rounded-2xl mb-2"
                    >
                      <action.icon className="h-6 w-6" />
                    </motion.div>
                    <div className="text-center">
                      <div className="font-semibold text-sm">{action.label}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Health Metrics & Spending Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Metrics */}
          <Card className="backdrop-blur-sm bg-card/80 rounded-3xl border border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Health Vitals 💓
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-red-500/10 to-red-600/10 p-4 rounded-2xl border border-red-500/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-red-600" fill="currentColor" />
                    <span className="text-sm text-muted-foreground">Heart Rate</span>
                  </div>
                  <p className="text-3xl font-bold text-red-600">{healthMetrics.heartRate}</p>
                  <p className="text-xs text-muted-foreground">bpm</p>
                  <div className="mt-2 h-1 bg-red-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="h-full bg-red-600"
                    />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-2xl border border-blue-500/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-muted-foreground">Blood Pressure</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{healthMetrics.bloodPressure}</p>
                  <p className="text-xs text-muted-foreground">mmHg</p>
                  <div className="mt-2 h-1 bg-blue-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ delay: 0.6, duration: 1 }}
                      className="h-full bg-blue-600"
                    />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-4 rounded-2xl border border-green-500/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-muted-foreground">Steps Today</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{healthMetrics.steps.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">steps</p>
                  <div className="mt-2 h-1 bg-green-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ delay: 0.7, duration: 1 }}
                      className="h-full bg-green-600"
                    />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4 rounded-2xl border border-purple-500/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-muted-foreground">Sleep</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{healthMetrics.sleep}h</p>
                  <p className="text-xs text-muted-foreground">hours</p>
                  <div className="mt-2 h-1 bg-purple-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '94%' }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="h-full bg-purple-600"
                    />
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Spending Chart */}
          <Card className="backdrop-blur-sm bg-card/80 rounded-3xl border border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Healthcare Spending 💰
                </span>
                <Badge variant="outline" className="rounded-xl">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -12%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {spendingData.map((data, idx) => (
                  <motion.div
                    key={data.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-sm font-medium w-10 text-muted-foreground">{data.month}</span>
                    <div className="flex-1 bg-muted/30 rounded-full h-8 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.amount / maxSpending) * 100}%` }}
                        transition={{ delay: 0.5 + (0.1 * idx), duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-end px-3"
                      >
                        <span className="text-xs font-semibold text-white">₹{data.amount.toLocaleString()}</span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl border border-green-500/20">
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingDown className="h-5 w-5" />
                  <span className="font-semibold">You saved ₹2,340 this month!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Active Cases */}
      {activeCases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Active Cases 🏥
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCases.map((caseItem, idx) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Link href={`/dashboard/cases/${caseItem.id}`}>
                  <Card className="backdrop-blur-sm bg-card/80 rounded-3xl border border-primary/20 shadow-xl cursor-pointer overflow-hidden group">
                    <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                          <Hospital className="h-6 w-6 text-primary" />
                        </div>
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                          <Activity className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg mb-2">{caseItem.hospitalName}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          <span>{caseItem.diagnosis || 'General Checkup'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(caseItem.admissionDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{caseItem.location}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Case #{caseItem.id.slice(0, 8)}</span>
                        <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Alerts/Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-3xl border border-blue-500/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-3 rounded-2xl">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-blue-900 dark:text-blue-100">Health Tip 💡</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Your health metrics are looking great! Keep up the good work with regular exercise and proper sleep.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-3xl border border-orange-500/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/20 p-3 rounded-2xl">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-orange-900 dark:text-orange-100">Reminder 🔔</h3>
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    Don't forget your annual health checkup! Schedule an appointment with your doctor soon.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
