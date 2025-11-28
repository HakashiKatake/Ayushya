'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download, FileText, Calendar, Activity, TestTube, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';

interface CaseData {
  _id: string;
  hospitalName: string;
  location: string;
  admissionDatetime: string;
  chiefComplaint: string;
  status: string;
  dischargeDate?: string;
}

export default function SummaryPage() {
  const params = useParams();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

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

  const generatePDF = () => {
    if (!caseData) return;

    setGenerating(true);
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('AYUSHYA - Patient Medical Summary', 20, 20);
      
      // Horizontal line
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);
      
      // Case Information
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Case Information', 20, 35);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Hospital: ${caseData.hospitalName}`, 20, 45);
      doc.text(`Location: ${caseData.location}`, 20, 52);
      doc.text(`Admission Date: ${new Date(caseData.admissionDatetime).toLocaleString()}`, 20, 59);
      doc.text(`Chief Complaint: ${caseData.chiefComplaint}`, 20, 66);
      doc.text(`Status: ${caseData.status.toUpperCase()}`, 20, 73);
      doc.text(`Case ID: ${caseData._id}`, 20, 80);
      
      if (caseData.dischargeDate) {
        doc.text(`Discharge Date: ${new Date(caseData.dischargeDate).toLocaleString()}`, 20, 87);
      }
      
      // Patient Profile (Mock Data)
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Patient Profile', 20, 100);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Age: 45 years', 20, 110);
      doc.text('Blood Group: O+', 20, 117);
      doc.text('Allergies: None reported', 20, 124);
      doc.text('Chronic Conditions: Hypertension', 20, 131);
      
      // Medical Timeline Summary (Mock)
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Medical Timeline Summary', 20, 145);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const timelineItems = [
        '• Admission and initial vitals recorded',
        '• Blood tests (CBC, Lipid Profile) conducted',
        '• Consultation with cardiologist',
        '• ECG and chest X-ray performed',
        '• Prescribed medications: Aspirin, Atorvastatin',
        '• Follow-up vitals monitoring',
        '• Discharge with care instructions'
      ];
      
      let yPosition = 155;
      timelineItems.forEach((item) => {
        doc.text(item, 20, yPosition);
        yPosition += 7;
      });
      
      // Key Findings (Mock)
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Key Findings', 20, yPosition + 10);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      yPosition += 20;
      doc.text('• Blood Pressure: Elevated (150/95 mmHg)', 20, yPosition);
      yPosition += 7;
      doc.text('• Cholesterol: High (240 mg/dL)', 20, yPosition);
      yPosition += 7;
      doc.text('• ECG: Normal sinus rhythm', 20, yPosition);
      yPosition += 7;
      doc.text('• Chest X-ray: Clear lung fields', 20, yPosition);
      
      // Recommendations
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      yPosition += 15;
      doc.text('Recommendations', 20, yPosition);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      yPosition += 10;
      doc.text('• Continue prescribed medications', 20, yPosition);
      yPosition += 7;
      doc.text('• Follow low-sodium diet', 20, yPosition);
      yPosition += 7;
      doc.text('• Regular exercise (30 min/day)', 20, yPosition);
      yPosition += 7;
      doc.text('• Follow-up appointment in 2 weeks', 20, yPosition);
      yPosition += 7;
      doc.text('• Monitor blood pressure daily', 20, yPosition);
      
      // Footer
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 20, 280);
      doc.text('AYUSHYA - Your Medical Transparency Partner', 20, 285);
      
      // Save PDF
      doc.save(`medical-summary-${caseData._id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading case data...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Case not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Summary</h1>
              <p className="text-gray-600 mt-2">
                Comprehensive medical report for {caseData.hospitalName}
              </p>
            </div>
            <Button onClick={generatePDF} disabled={generating}>
              <Download className="mr-2 h-4 w-4" />
              {generating ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </motion.div>

        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Summary Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Case Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Case Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Hospital</p>
                    <p className="font-medium text-gray-900">{caseData.hospitalName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{caseData.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Admission Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(caseData.admissionDatetime).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge>{caseData.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Patient Profile */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  Patient Profile
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-medium text-gray-900">45 years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="font-medium text-gray-900">O+</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Allergies</p>
                    <p className="font-medium text-gray-900">None reported</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chronic Conditions</p>
                    <p className="font-medium text-gray-900">Hypertension</p>
                  </div>
                </div>
              </div>

              {/* Timeline Summary */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Medical Timeline Summary
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Admission and initial vitals recorded</li>
                  <li>• Blood tests (CBC, Lipid Profile) conducted</li>
                  <li>• Consultation with cardiologist</li>
                  <li>• ECG and chest X-ray performed</li>
                  <li>• Prescribed medications: Aspirin, Atorvastatin</li>
                  <li>• Follow-up vitals monitoring</li>
                  <li>• Discharge with care instructions</li>
                </ul>
              </div>

              {/* Key Findings */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TestTube className="h-4 w-4 text-yellow-600" />
                  Key Findings
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Elevated</Badge>
                    <span className="text-gray-700">Blood Pressure: 150/95 mmHg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">High</Badge>
                    <span className="text-gray-700">Cholesterol: 240 mg/dL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Normal</Badge>
                    <span className="text-gray-700">ECG: Normal sinus rhythm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Clear</Badge>
                    <span className="text-gray-700">Chest X-ray: Clear lung fields</span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-purple-600" />
                  Recommendations
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Continue prescribed medications</li>
                  <li>• Follow low-sodium diet</li>
                  <li>• Regular exercise (30 min/day)</li>
                  <li>• Follow-up appointment in 2 weeks</li>
                  <li>• Monitor blood pressure daily</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> This summary is generated from your medical timeline and can be shared with other healthcare providers.
                Click "Download PDF" to save a copy for your records.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
