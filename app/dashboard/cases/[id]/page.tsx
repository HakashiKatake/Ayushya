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
  Users
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Case Not Found</h2>
          <p className="text-gray-600 mb-4">The case you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/dashboard')}>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {caseData.hospitalName}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {caseData.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(caseData.admissionDatetime)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={caseData.status === 'active' ? 'default' : 'secondary'}
                className="text-sm"
              >
                {caseData.status}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/cases/${caseData._id}/summary`)}
              >
                <Download className="mr-2 h-4 w-4" />
                Summary
              </Button>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Chief Complaint
              </CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-gray-900">
                {caseData.chiefComplaint}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Duration
              </CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-gray-900">
                {caseData.dischargeDate
                  ? `${Math.ceil((new Date(caseData.dischargeDate).getTime() - new Date(caseData.admissionDatetime).getTime()) / (1000 * 60 * 60 * 24))} days`
                  : 'Ongoing'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Case ID
              </CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-gray-900 truncate">
                {caseData._id.slice(-8).toUpperCase()}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="blackbox" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="blackbox">
                <Activity className="h-4 w-4 mr-2" />
                Medical BlackBox
              </TabsTrigger>
              <TabsTrigger value="bills">
                <CreditCard className="h-4 w-4 mr-2" />
                Bills & Fraud
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="second-opinion">
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
