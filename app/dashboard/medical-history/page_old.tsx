'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, FileText, Hospital, Calendar, Pill, TestTube, FileJson,
  Heart, Activity, Stethoscope, Thermometer, Syringe, Sparkles,
  TrendingUp, Shield, AlertTriangle, CheckCircle2, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      // Fetch all cases
      const casesRes = await fetch('/api/cases');
      const casesData = await casesRes.json();
      const cases = casesData.cases || [];

      // Fetch events for all cases
      const allEvents: Event[] = [];
      const allBills: Bill[] = [];
      
      for (const caseItem of cases) {
        // Fetch events
        const eventsRes = await fetch(`/api/events?caseId=${caseItem._id}`);
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          allEvents.push(...(eventsData.events || []));
        }

        // Fetch bills
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
        documents: [], // Mock for now
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

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Complete Medical History', 20, yPos);
    yPos += 10;

    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Patient Information
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

    // Chronic Conditions
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Chronic Conditions', 20, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    history.chronicConditions.forEach((condition) => {
      doc.text(`• ${condition}`, 20, yPos);
      yPos += 7;
    });
    yPos += 5;

    // Allergies
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Known Allergies', 20, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    history.allergies.forEach((allergy) => {
      doc.text(`• ${allergy}`, 20, yPos);
      yPos += 7;
    });
    yPos += 5;

    // Current Medications
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Current Medications', 20, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    history.medications.forEach((med) => {
      doc.text(`• ${med}`, 20, yPos);
      yPos += 7;
    });
    yPos += 10;

    // Hospitalization History
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Hospitalization History', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    history.cases.slice(0, 5).forEach((caseItem, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${caseItem.hospitalName}`, 20, yPos);
      yPos += 6;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`   Location: ${caseItem.location}`, 20, yPos);
      yPos += 6;
      doc.text(`   Admitted: ${new Date(caseItem.admissionDatetime).toLocaleDateString()}`, 20, yPos);
      yPos += 6;
      doc.text(`   Reason: ${caseItem.chiefComplaint}`, 20, yPos);
      yPos += 6;
      doc.text(`   Status: ${caseItem.status}`, 20, yPos);
      yPos += 10;
    });

    // Footer
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Complete Medical History</h1>
              <p className="text-gray-600 mt-2">
                All your medical records across different hospitals
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportToJSON} variant="outline">
                <FileJson className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button onClick={exportToPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Hospitals</p>
                  <p className="text-2xl font-bold">{new Set(history.cases.map(c => c.hospitalName)).size}</p>
                </div>
                <Hospital className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hospitalizations</p>
                  <p className="text-2xl font-bold">{history.cases.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Medical Events</p>
                  <p className="text-2xl font-bold">{history.events.length}</p>
                </div>
                <TestTube className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <p className="text-2xl font-bold">{history.documents.length}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Patient Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Chronic Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {history.chronicConditions.map((condition, idx) => (
                      <Badge key={idx} variant="secondary">{condition}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Known Allergies</h4>
                  <div className="flex flex-wrap gap-2">
                    {history.allergies.map((allergy, idx) => (
                      <Badge key={idx} variant="destructive">{allergy}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Current Medications</h4>
                  <div className="space-y-2">
                    {history.medications.map((med, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-blue-600" />
                        <span>{med}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Medical Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {history.events.slice(0, 10).map((event) => (
                    <div key={event._id} className="flex items-start gap-3 border-b pb-3">
                      <TestTube className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {(event.event_type?.replace(/_/g, ' ') || '').toUpperCase()}
                          </Badge>
                          {event.fraud_flag && (
                            <Badge variant="destructive">Flagged</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hospitals" className="space-y-4">
            {history.cases.map((caseItem) => (
              <Card key={caseItem._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Hospital className="h-5 w-5" />
                        {caseItem.hospitalName}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{caseItem.location}</p>
                    </div>
                    <Badge variant={caseItem.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {caseItem.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Admission Date</p>
                      <p className="font-medium">{new Date(caseItem.admissionDatetime).toLocaleDateString()}</p>
                    </div>
                    {caseItem.dischargeDatetime && (
                      <div>
                        <p className="text-sm text-gray-600">Discharge Date</p>
                        <p className="font-medium">{new Date(caseItem.dischargeDatetime).toLocaleDateString()}</p>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Chief Complaint</p>
                      <p className="font-medium">{caseItem.chiefComplaint}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {history.medications.map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Pill className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">{med}</span>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {history.allergies.map((allergy, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
                      <span className="font-medium text-red-900">{allergy}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="space-y-3">
              {history.events.map((event) => (
                <Card key={event._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {(event.event_type?.replace(/_/g, ' ') || '').toUpperCase()}
                          </Badge>
                          {event.fraud_flag && (
                            <Badge variant="destructive">Fraud Alert</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 mb-1">{event.description}</p>
                        {event.performed_by && (
                          <p className="text-xs text-gray-600">By: {event.performed_by}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {new Date(event.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bills" className="space-y-4">
            {history.bills.map((bill) => (
              <Card key={bill._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Bill #{bill._id.slice(-6)}</CardTitle>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹{bill.totalAmount.toLocaleString()}</p>
                      {bill.fraudScore !== undefined && bill.fraudScore > 0.3 && (
                        <Badge variant="destructive" className="mt-1">
                          Fraud Score: {(bill.fraudScore * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bill.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.description}</span>
                        <span className="font-medium">₹{item.amount?.toLocaleString() || '0'}</span>
                      </div>
                    ))}
                    {bill.items.length > 3 && (
                      <p className="text-sm text-gray-500">+ {bill.items.length - 3} more items</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Date: {new Date(bill.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
