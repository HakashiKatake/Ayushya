'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
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
  Camera
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
    // Fetch cases from API
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin">
          <Activity className="h-8 w-8 text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">AYUSHYA</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.firstName || 'User'}!</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Link href="/dashboard/cases/new">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-linear-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center gap-3">
                  <Plus className="h-8 w-8" />
                  <div>
                    <div className="font-semibold">New Case</div>
                    <div className="text-sm opacity-90">Start hospital case</div>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/medical-history">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-linear-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8" />
                  <div>
                    <div className="font-semibold">Medical History</div>
                    <div className="text-sm opacity-90">Complete records</div>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/prescription-reader">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-linear-to-br from-orange-500 to-orange-600 text-white">
                <div className="flex items-center gap-3">
                  <Camera className="h-8 w-8" />
                  <div>
                    <div className="font-semibold">Prescription Reader</div>
                    <div className="text-sm opacity-90">Extract details</div>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/insurance">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="font-semibold">Insurance</div>
                    <div className="text-sm text-gray-600">Manage policies</div>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/admin">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-8 w-8 text-purple-500" />
                  <div>
                    <div className="font-semibold">Admin Simulator</div>
                    <div className="text-sm text-gray-600">Test scenarios</div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </motion.div>

        {/* Active Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Active Cases</h2>
            <Link href="/dashboard/cases/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Case
              </Button>
            </Link>
          </div>

          {activeCases.length === 0 ? (
            <Card className="p-12 text-center">
              <Hospital className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Cases</h3>
              <p className="text-gray-600 mb-4">
                Start by creating a new hospital case to track your medical journey
              </p>
              <Link href="/dashboard/cases/new">
                <Button>Create Your First Case</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCases.map((caseItem) => (
                <Link key={caseItem._id} href={`/dashboard/cases/${caseItem._id}`}>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{caseItem.hospitalName}</h3>
                        <p className="text-sm text-gray-600">{caseItem.location}</p>
                      </div>
                      <Badge variant="default" className="bg-green-500">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{caseItem.chiefComplaint}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(caseItem.admissionDatetime).toLocaleDateString()}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Past Cases */}
        {pastCases.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4">Past Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastCases.map((caseItem) => (
                <Link key={caseItem._id} href={`/dashboard/cases/${caseItem._id}`}>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer opacity-75">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{caseItem.hospitalName}</h3>
                        <p className="text-sm text-gray-600">{caseItem.location}</p>
                      </div>
                      <Badge variant="secondary">Discharged</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{caseItem.chiefComplaint}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(caseItem.admissionDatetime).toLocaleDateString()} - {' '}
                      {caseItem.dischargeDatetime && new Date(caseItem.dischargeDatetime).toLocaleDateString()}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
