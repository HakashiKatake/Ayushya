'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  FileSearch,
  TrendingDown,
  Stethoscope,
  FileText,
  AlertTriangle,
  Clock,
  Activity,
  Heart,
  Shield,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-xl">
              <Heart className="h-6 w-6 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              AYUSHYA
            </span>
          </div>
          <div className="flex gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Trusted by 10,000+ Patients</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Hospital Transparency,
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                Powered by AI
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Detect billing fraud, optimize insurance coverage, and get second opinions on your medical treatment—all in one place.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            {[
              { label: 'Avg. Overcharge Detected', value: '₹15,000', icon: TrendingDown, color: 'text-emerald-400' },
              { label: 'Bills Analyzed', value: '10,000+', icon: FileText, color: 'text-blue-400' },
              { label: 'Fraud Detection Rate', value: '94%', icon: Shield, color: 'text-purple-400' },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                </div>
                <div className="text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-400">Everything you need for hospital transparency</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-8 h-full rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-slate-400">Get started in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Create Your Case',
                description: 'Add your hospital visit details and admission information',
              },
              {
                step: '02',
                title: 'Upload Documents',
                description: 'Upload your bills, reports, and medical documents',
              },
              {
                step: '03',
                title: 'Get Insights',
                description: 'Our AI analyzes everything and shows you fraud patterns',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="text-6xl font-bold text-slate-800/50 mb-4 absolute -top-8 left-1/2 -translate-x-1/2 -z-10 select-none">
                  {item.step}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/20">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-20 text-center"
          >
            <div className="absolute inset-0 bg-[url('/dashboard-bg.png')] bg-cover bg-center opacity-20 mix-blend-overlay" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Take Control?
              </h2>
              <p className="text-xl text-blue-100 mb-10">
                Join thousands of patients who are saving money and getting transparency in their healthcare journey.
              </p>
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-10 py-7 rounded-full bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-xl">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-blue-500" fill="currentColor" />
            <span className="text-xl font-bold text-white">AYUSHYA</span>
          </div>
          <p className="text-slate-500 mb-6">Hospital Transparency Platform</p>
          <p className="text-sm text-slate-600">
            © 2025 AYUSHYA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <FileSearch className="h-6 w-6 text-blue-400" />,
    title: 'Medical BlackBox',
    description: 'Complete timeline of your hospital journey with every test, medication, and procedure tracked.',
  },
  {
    icon: <AlertTriangle className="h-6 w-6 text-rose-400" />,
    title: 'Fraud Detection',
    description: 'AI-powered analysis detects overcharging, duplicate tests, and dark billing patterns.',
  },
  {
    icon: <TrendingDown className="h-6 w-6 text-emerald-400" />,
    title: 'Insurance Optimizer',
    description: 'Maximize your coverage and minimize out-of-pocket expenses with smart analysis.',
  },
  {
    icon: <Stethoscope className="h-6 w-6 text-cyan-400" />,
    title: 'Second Opinion',
    description: 'Get AI-powered insights on treatment necessity and test appropriateness.',
  },
  {
    icon: <FileText className="h-6 w-6 text-violet-400" />,
    title: 'Patient Summary',
    description: 'Doctor-friendly PDF summaries of your complete medical history.',
  },
  {
    icon: <Clock className="h-6 w-6 text-amber-400" />,
    title: '11:59 PM Detection',
    description: 'Automatically flags suspicious midnight charges and billing dark patterns.',
  },
];
