'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Activity,
  FileText,
  CreditCard,
  AlertTriangle,
  Download,
  Plus,
  Users,
  Sparkles,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MedicalBlackBox from '@/components/MedicalBlackBox';
import BillsTab from '@/components/BillsTab';
import DocumentsTab from '@/components/DocumentsTab';
import SecondOpinionTab from '@/components/SecondOpinionTab';
import ConnectSpecialist from '@/components/ConnectSpecialist';

interface CaseData {
  _id: string;
  hospitalName: string;
  location: string;
  admissionDatetime: string;
  chiefComplaint: string;
  status: string;
  dischargeDate?: string;
  createdAt: string;
}

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSpecialistDialogOpen, setIsSpecialistDialogOpen] = useState(false);

  useEffect(() => {
    fetchCase();
  }, [params.id]);

  const fetchCase = async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCaseData(data.case);
      }
    } catch (error) {
      console.error('Error fetching case:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-blue-500/20 rounded-full" />
            <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-blue-500 mx-auto"></div>
          </div>
          <p className="mt-6 text-lg text-slate-300">Loading case details...</p>
        </motion.div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Case Not Found</h2>
          <p className="text-slate-400 mb-6">The case you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/dashboard')} className="bg-blue-600 hover:bg-blue-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-6 text-slate-300 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 p-8 mb-6">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />

            <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 mb-4">
                  <Sparkles className="h-3 w-3 text-blue-300" />
                  <span className="text-xs font-medium text-blue-200">Active Case</span>
                </div>

                <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200">
                  {caseData.hospitalName}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span>{caseData.location}</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-600" />
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <span>{formatDate(caseData.admissionDatetime)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={`px-4 py-2 ${caseData.status === 'ACTIVE'
                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                    : 'bg-slate-600/20 text-slate-300 border-slate-500/30'
                  } border`}>
                  {caseData.status}
                </Badge>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/cases/${caseData._id}/summary`)}
                  className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Summary
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div whileHover={{ y: -4 }}>
            <Card className="bg-slate-900/50 border border-blue-500/30 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Chief Complaint
                  </CardTitle>
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-white">
                  {caseData.chiefComplaint}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4 }}>
            <Card className="bg-slate-900/50 border border-purple-500/30 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Duration
                  </CardTitle>
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-white">
                  {caseData.dischargeDate
                    ? `${Math.ceil((new Date(caseData.dischargeDate).getTime() - new Date(caseData.admissionDatetime).getTime()) / (1000 * 60 * 60 * 24))} days`
                    : 'Ongoing'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4 }}>
            <Card className="bg-slate-900/50 border border-pink-500/30 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Case ID
                  </CardTitle>
                  <FileText className="h-5 w-5 text-pink-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-white font-mono">
                  {caseData._id.slice(-8).toUpperCase()}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="blackbox" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-slate-900/50 border border-white/10 p-1 rounded-2xl">
              <TabsTrigger
                value="blackbox"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl"
              >
                <Activity className="h-4 w-4 mr-2" />
                Medical BlackBox
              </TabsTrigger>
              <TabsTrigger
                value="bills"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Bills & Fraud
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-amber-600 data-[state=active]:text-white rounded-xl"
              >
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="second-opinion"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-xl"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Second Opinion
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blackbox">
              <MedicalBlackBox caseId={caseData._id} />
            </TabsContent>

            <TabsContent value="bills">
              <BillsTab caseId={caseData._id} />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsTab caseId={caseData._id} />
            </TabsContent>

            <TabsContent value="second-opinion">
              <SecondOpinionTab
                caseId={caseData._id}
                onConnectSpecialist={() => setIsSpecialistDialogOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Connect Specialist Dialog */}
      <ConnectSpecialist
        chiefComplaint={caseData.chiefComplaint}
        isOpen={isSpecialistDialogOpen}
        onClose={() => setIsSpecialistDialogOpen(false)}
      />
    </div>
  );
}
