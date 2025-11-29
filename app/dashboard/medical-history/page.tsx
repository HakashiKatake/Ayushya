'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, FileText, Hospital, Calendar, Pill, TestTube, FileJson,
  Heart, Activity, Stethoscope, Syringe, Sparkles,
  TrendingUp, Shield, AlertTriangle, CheckCircle2, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface Case {
  _id: string;
  hospitalName: string;
  location: string;
  admissionDatetime: string;
  dischargeDatetime?: string;
  chiefComplaint: string;
  status: string;
}

interface Event {
  _id: string;
  caseId: string;
  event_type: string;
  timestamp: string;
  description: string;
  performed_by?: string;
  fraud_flag?: boolean;
}

interface Bill {
  _id: string;
  caseId: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  totalAmount: number;
  fraudScore?: number;
  createdAt: string;
}

interface Document {
  _id: string;
  caseId: string;
  name: string;
  type: string;
  category: string;
  uploadDate: string;
}

interface MedicalHistory {
  cases: Case[];
  events: Event[];
  bills: Bill[];
  documents: Document[];
  medications: string[];
  allergies: string[];
  chronicConditions: string[];
}

export default function MedicalHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<MedicalHistory>({
    cases: [],
    events: [],
    bills: [],
    documents: [],
    medications: ['Aspirin 75mg', 'Atorvastatin 10mg', 'Metformin 500mg'],
    allergies: ['Penicillin', 'Sulfa drugs'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
  });

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      const casesRes = await fetch('/api/cases');
      const casesData = await casesRes.json();
      const cases = casesData.cases || [];

      const allEvents: Event[] = [];
      const allBills: Bill[] = [];
      
      for (const caseItem of cases) {
        const eventsRes = await fetch(`/api/events?caseId=${caseItem._id}`);
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          allEvents.push(...(eventsData.events || []));
        }

        const billsRes = await fetch(`/api/bills?caseId=${caseItem._id}`);
        if (billsRes.ok) {
          const billsData = await billsRes.json();
          allBills.push(...(billsData.bills || []));
        }
      }

      setHistory({
        ...history,
        cases,
        events: allEvents,
        bills: allBills,
        documents: [],
      });
    } catch (error) {
      console.error('Error fetching medical history:', error);
      toast.error('Failed to load medical history');
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = () => {
    const jsonData = JSON.stringify(history, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medical-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Medical history exported to JSON');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Complete Medical History', 20, yPos);
    yPos += 10;

    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information', 20, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPos);
    yPos += 7;
    doc.text(`Total Hospitalizations: ${history.cases.length}`, 20, yPos);
    yPos += 7;
    doc.text(`Total Medical Events: ${history.events.length}`, 20, yPos);
    yPos += 15;

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(`AYUSHYA Medical History - Page ${i} of ${pageCount}`, 20, 285);
    }

    doc.save(`complete-medical-history-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('Medical history exported to PDF');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-primary/5 to-background">
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
            Loading your medical journey... 🏥
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12"
        >
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative backdrop-blur-sm bg-card/80 rounded-3xl p-8 border border-primary/20 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-primary/10 p-4 rounded-2xl"
                >
                  <Heart className="h-10 w-10 text-primary" fill="currentColor" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Your Health Journey ✨
                  </h1>
                  <p className="text-muted-foreground mt-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Complete medical records across all hospitals
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={exportToJSON} variant="outline" className="gap-2">
                    <FileJson className="h-4 w-4" />
                    Export JSON
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={exportToPDF} className="gap-2 bg-primary">
                    <Download className="h-4 w-4" />
                    Export PDF
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-500/90 to-blue-600/90 p-6 shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Hospital className="h-12 w-12 text-white/90" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-6 w-6 text-white/60" />
                  </motion.div>
                </div>
                <p className="text-white/80 text-sm font-medium">Total Hospitals 🏥</p>
                <p className="text-4xl font-bold text-white mt-2">
                  {new Set(history.cases.map(c => c.hospitalName)).size}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-green-500/90 to-green-600/90 p-6 shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Calendar className="h-12 w-12 text-white/90" />
                  <CheckCircle2 className="h-6 w-6 text-white/60" />
                </div>
                <p className="text-white/80 text-sm font-medium">Visits 📅</p>
                <p className="text-4xl font-bold text-white mt-2">{history.cases.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-purple-500/90 to-purple-600/90 p-6 shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Activity className="h-12 w-12 text-white/90" />
                  <TrendingUp className="h-6 w-6 text-white/60" />
                </div>
                <p className="text-white/80 text-sm font-medium">Medical Events 🔬</p>
                <p className="text-4xl font-bold text-white mt-2">{history.events.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-orange-500/90 to-orange-600/90 p-6 shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <FileText className="h-12 w-12 text-white/90" />
                  <Shield className="h-6 w-6 text-white/60" />
                </div>
                <p className="text-white/80 text-sm font-medium">Documents 📄</p>
                <p className="text-4xl font-bold text-white mt-2">{history.documents.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 p-1 bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/10">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              ✨ Overview
            </TabsTrigger>
            <TabsTrigger value="hospitals" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              🏥 Hospitals
            </TabsTrigger>
            <TabsTrigger value="medications" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              💊 Medications
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              🔬 Events
            </TabsTrigger>
            <TabsTrigger value="bills" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              💰 Bills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="backdrop-blur-sm bg-card/80 rounded-3xl p-6 border border-primary/20 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-500/10 p-3 rounded-2xl">
                      <Stethoscope className="h-6 w-6 text-red-500" />
                    </div>
                    <h4 className="font-bold text-lg">Chronic Conditions</h4>
                  </div>
                  <div className="space-y-3">
                    {history.chronicConditions.map((condition, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-red-500/5 rounded-xl border border-red-500/20"
                      >
                        <Heart className="h-4 w-4 text-red-500" fill="currentColor" />
                        <span className="font-medium">{condition}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="backdrop-blur-sm bg-card/80 rounded-3xl p-6 border border-primary/20 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-500/10 p-3 rounded-2xl">
                      <AlertTriangle className="h-6 w-6 text-orange-500" />
                    </div>
                    <h4 className="font-bold text-lg">Known Allergies ⚠️</h4>
                  </div>
                  <div className="space-y-3">
                    {history.allergies.map((allergy, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-3 bg-orange-500/10 rounded-xl border-2 border-orange-500/30"
                      >
                        <span className="font-semibold text-orange-900 dark:text-orange-100">⚠️ {allergy}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="backdrop-blur-sm bg-card/80 rounded-3xl p-6 border border-primary/20 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500/10 p-3 rounded-2xl">
                      <Pill className="h-6 w-6 text-blue-500" />
                    </div>
                    <h4 className="font-bold text-lg">Current Medications 💊</h4>
                  </div>
                  <div className="space-y-3">
                    {history.medications.map((med, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-blue-500/5 rounded-xl border border-blue-500/20"
                      >
                        <Pill className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{med}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="backdrop-blur-sm bg-card/80 rounded-3xl p-6 border border-primary/20 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-500/10 p-3 rounded-2xl">
                    <Clock className="h-6 w-6 text-purple-500" />
                  </div>
                  <h4 className="font-bold text-xl">Recent Medical Activity 📊</h4>
                </div>
                <div className="space-y-4">
                  <AnimatePresence>
                    {history.events.slice(0, 10).map((event, idx) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ x: 10, scale: 1.02 }}
                      >
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-primary/10 hover:border-primary/30 transition-all">
                          <div className="bg-purple-500/10 p-3 rounded-xl">
                            <TestTube className="h-5 w-5 text-purple-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <Badge className="bg-primary/20 text-primary border-primary/30">
                                {(event.event_type?.replace(/_/g, ' ') || '').toUpperCase()}
                              </Badge>
                              {event.fraud_flag && (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Flagged
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium mb-1">{event.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(event.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="hospitals" className="space-y-6 mt-8">
            {history.cases.map((caseItem, idx) => (
              <motion.div
                key={caseItem._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.01 }}
              >
                <div className="relative overflow-hidden backdrop-blur-sm bg-card/80 rounded-3xl p-6 border border-primary/20 shadow-xl">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-4 rounded-2xl">
                          <Hospital className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold flex items-center gap-2">
                            {caseItem.hospitalName}
                            <span className="text-xl">🏥</span>
                          </h3>
                          <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            📍 {caseItem.location}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={caseItem.status === 'ACTIVE' ? 'default' : 'secondary'}
                        className="text-sm px-4 py-1"
                      >
                        {caseItem.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-muted/30 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Calendar className="h-4 w-4" />
                          <p className="text-sm font-medium">Admission</p>
                        </div>
                        <p className="font-bold text-lg">
                          {new Date(caseItem.admissionDatetime).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {caseItem.dischargeDatetime && (
                        <div className="bg-muted/30 p-4 rounded-2xl">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <CheckCircle2 className="h-4 w-4" />
                            <p className="text-sm font-medium">Discharge</p>
                          </div>
                          <p className="font-bold text-lg">
                            {new Date(caseItem.dischargeDatetime).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      <div className="bg-muted/30 p-4 rounded-2xl md:col-span-2">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Stethoscope className="h-4 w-4" />
                          <p className="text-sm font-medium">Chief Complaint</p>
                        </div>
                        <p className="font-bold">{caseItem.chiefComplaint}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="medications" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="backdrop-blur-sm bg-card/80 rounded-3xl p-6 border border-primary/20 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-500/10 p-4 rounded-2xl">
                      <Pill className="h-8 w-8 text-blue-500" />
                    </div>
                    <h4 className="font-bold text-2xl">Active Medications 💊</h4>
                  </div>
                  <div className="space-y-3">
                    {history.medications.map((med, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ x: 5, scale: 1.02 }}
                        className="flex items-center justify-between p-4 bg-blue-500/5 rounded-2xl border border-blue-500/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-500/10 p-2 rounded-xl">
                            <Syringe className="h-5 w-5 text-blue-500" />
                          </div>
                          <span className="font-semibold">{med}</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                          ✓ Active
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="backdrop-blur-sm bg-card/80 rounded-3xl p-6 border border-orange-500/30 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-orange-500/10 p-4 rounded-2xl"
                    >
                      <AlertTriangle className="h-8 w-8 text-orange-500" />
                    </motion.div>
                    <h4 className="font-bold text-2xl text-orange-600 dark:text-orange-400">
                      Critical Allergies ⚠️
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {history.allergies.map((allergy, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="p-4 bg-orange-500/10 rounded-2xl border-2 border-orange-500/40"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-500/20 p-2 rounded-xl">
                            <Shield className="h-5 w-5 text-orange-600" />
                          </div>
                          <span className="font-bold text-orange-900 dark:text-orange-100">
                            ⚠️ {allergy}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4 mt-8">
            {history.events.map((event, idx) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ x: 10, scale: 1.01 }}
              >
                <div className="backdrop-blur-sm bg-card/80 rounded-3xl p-6 border border-primary/20 shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-purple-500/10 p-3 rounded-2xl">
                        <Activity className="h-6 w-6 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-sm">
                            {(event.event_type?.replace(/_/g, ' ') || '').toUpperCase()}
                          </Badge>
                          {event.fraud_flag && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Fraud Alert 🚨
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium text-lg mb-2">{event.description}</p>
                        {event.performed_by && (
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            By: {event.performed_by}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right bg-muted/30 p-3 rounded-2xl">
                      <p className="text-sm font-semibold flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="bills" className="space-y-6 mt-8">
            {history.bills.map((bill, idx) => (
              <motion.div
                key={bill._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.01 }}
              >
                <div className="relative overflow-hidden backdrop-blur-sm bg-card/80 rounded-3xl p-6 border border-primary/20 shadow-xl">
                  <div className="absolute top-0 right-0 w-60 h-60 bg-primary/5 rounded-full -mr-30 -mt-30" />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500/10 p-4 rounded-2xl">
                          <FileText className="h-8 w-8 text-green-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-muted-foreground">
                            Bill #{bill._id.slice(-6)} 📄
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(bill.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">₹{bill.totalAmount.toLocaleString()}</p>
                        {bill.fraudScore !== undefined && bill.fraudScore > 0.3 && (
                          <Badge variant="destructive" className="gap-1 mt-2">
                            <AlertTriangle className="h-3 w-3" />
                            Fraud Score: {(bill.fraudScore * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 rounded-2xl p-4 space-y-3">
                      {bill.items.slice(0, 3).map((item, itemIdx) => (
                        <div key={itemIdx} className="flex justify-between items-center">
                          <span className="font-medium">{item.description}</span>
                          <span className="font-bold text-primary">₹{item.amount?.toLocaleString() || '0'}</span>
                        </div>
                      ))}
                      {bill.items.length > 3 && (
                        <p className="text-sm text-muted-foreground text-center pt-2 border-t border-primary/10">
                          + {bill.items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
