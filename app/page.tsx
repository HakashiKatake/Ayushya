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
  Activity
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">AYUSHYA</span>
          </div>
          <div className="flex gap-3">
            <Link href="/sign-in">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Hospital Transparency,
            <br />
            Powered by AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Detect billing fraud, optimize insurance coverage, and get second opinions on your medical treatment—all in one place.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
        >
          {[
            { label: 'Avg. Overcharge Detected', value: '₹15,000' },
            { label: 'Bills Analyzed', value: '10,000+' },
            { label: 'Fraud Detection Rate', value: '94%' },
          ].map((stat, i) => (
            <Card key={i} className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need for hospital transparency</p>
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
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Create Your Case',
                description: 'Add your hospital visit details and admission information',
              },
              {
                step: '2',
                title: 'Upload Documents',
                description: 'Upload your bills, reports, and medical documents',
              },
              {
                step: '3',
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
                className="text-center"
              >
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Take Control of Your Healthcare Costs?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who are saving money and getting transparency
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-6 w-6" />
            <span className="text-xl font-bold">AYUSHYA</span>
          </div>
          <p className="text-slate-400 mb-4">Hospital Transparency Platform</p>
          <p className="text-sm text-slate-500">
            © 2025 AYUSHYA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <FileSearch className="h-6 w-6 text-blue-600" />,
    title: 'Medical BlackBox',
    description: 'Complete timeline of your hospital journey with every test, medication, and procedure tracked.',
  },
  {
    icon: <AlertTriangle className="h-6 w-6 text-blue-600" />,
    title: 'Fraud Detection',
    description: 'AI-powered analysis detects overcharging, duplicate tests, and dark billing patterns.',
  },
  {
    icon: <TrendingDown className="h-6 w-6 text-blue-600" />,
    title: 'Insurance Optimizer',
    description: 'Maximize your coverage and minimize out-of-pocket expenses with smart analysis.',
  },
  {
    icon: <Stethoscope className="h-6 w-6 text-blue-600" />,
    title: 'Second Opinion',
    description: 'Get AI-powered insights on treatment necessity and test appropriateness.',
  },
  {
    icon: <FileText className="h-6 w-6 text-blue-600" />,
    title: 'Patient Summary',
    description: 'Doctor-friendly PDF summaries of your complete medical history.',
  },
  {
    icon: <Clock className="h-6 w-6 text-blue-600" />,
    title: '11:59 PM Detection',
    description: 'Automatically flags suspicious midnight charges and billing dark patterns.',
  },
];

