'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, AlertTriangle, TrendingUp, DollarSign, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Bill {
  _id: string;
  totalAmount: number;
  fraudScore: number;
  estimatedOvercharge: number;
  fraudFlags: string[];
  billDate: string;
  items?: BillItem[];
}

interface BillItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  timestamp: string;
}

interface BillsTabProps {
  caseId: string;
}

export default function BillsTab({ caseId }: BillsTabProps) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  useEffect(() => {
    fetchBills();
  }, [caseId]);

  const fetchBills = async () => {
    try {
      const response = await fetch(`/api/bills?caseId=${caseId}`);
      if (response.ok) {
        const data = await response.json();
        setBills(data.bills);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadMockBill = async () => {
    // Mock bill items with some fraud patterns
    const mockItems = [
      {
        description: 'Room Rent (Deluxe)',
        quantity: 3,
        unitPrice: 8000,
        totalPrice: 24000,
        category: 'Room',
        timestamp: new Date('2024-01-15T10:00:00').toISOString()
      },
      {
        description: 'Complete Blood Count (CBC)',
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500,
        category: 'Lab Tests',
        timestamp: new Date('2024-01-15T11:00:00').toISOString()
      },
      {
        description: 'Complete Blood Count (CBC)',
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500,
        category: 'Lab Tests',
        timestamp: new Date('2024-01-15T11:30:00').toISOString()
      },
      {
        description: 'CT Scan',
        quantity: 1,
        unitPrice: 15000,
        totalPrice: 15000,
        category: 'Imaging',
        timestamp: new Date('2024-01-15T23:59:00').toISOString()
      },
      {
        description: 'Consultation Fee',
        quantity: 1,
        unitPrice: 2000,
        totalPrice: 2000,
        category: 'Consultation',
        timestamp: new Date('2024-01-16T09:00:00').toISOString()
      }
    ];

    try {
      toast.loading('Analyzing bill for fraud...');
      const response = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          items: mockItems,
          billDate: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        await fetchBills();
        setUploadDialogOpen(false);
        toast.dismiss();
        
        if (data.fraudAnalysis && data.fraudAnalysis.fraudScore > 0.4) {
          toast.error(`Fraud detected! Score: ${(data.fraudAnalysis.fraudScore * 100).toFixed(0)}%`);
        } else {
          toast.success('Bill uploaded and analyzed successfully');
        }
      } else {
        toast.dismiss();
        toast.error('Failed to upload bill');
      }
    } catch (error) {
      console.error('Error uploading bill:', error);
      toast.dismiss();
      toast.error('Error uploading bill');
    }
  };

  const getFraudScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-red-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getFraudScoreBadge = (score: number) => {
    if (score >= 0.7) return 'High Risk';
    if (score >= 0.4) return 'Medium Risk';
    return 'Low Risk';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bills...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Bills & Fraud Detection</h2>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Bill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Medical Bill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="text-sm text-gray-600">
                In a production environment, you would upload a bill PDF here. For this demo, we'll generate a mock bill with fraud patterns.
              </div>
              <Button onClick={handleUploadMockBill} className="w-full">
                Generate Mock Bill (Demo)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {bills.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bills Yet</h3>
              <p className="text-gray-600 mb-4">Upload a bill to analyze for fraud</p>
              <Button onClick={() => setUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload First Bill
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Bills List */}
          {bills.map((bill, index) => (
            <motion.div
              key={bill._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={bill.fraudScore >= 0.4 ? 'border-red-300' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Bill #{bill._id.slice(-8).toUpperCase()}
                        {bill.fraudScore >= 0.4 && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {getFraudScoreBadge(bill.fraudScore)}
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(bill.billDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{bill.totalAmount.toLocaleString()}
                      </p>
                      {bill.estimatedOvercharge > 0 && (
                        <p className="text-sm text-red-600 font-semibold">
                          ~₹{bill.estimatedOvercharge.toLocaleString()} overcharged
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Fraud Score */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Fraud Score</span>
                      <span className={`text-sm font-bold ${getFraudScoreColor(bill.fraudScore)}`}>
                        {(bill.fraudScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          bill.fraudScore >= 0.7 ? 'bg-red-600' :
                          bill.fraudScore >= 0.4 ? 'bg-yellow-600' : 'bg-green-600'
                        }`}
                        style={{ width: `${bill.fraudScore * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Fraud Flags */}
                  {bill.fraudFlags && bill.fraudFlags.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Fraud Flags:</h4>
                      <div className="space-y-2">
                        {bill.fraudFlags.map((flag, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                            <span className="text-gray-700">{flag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bill Items */}
                  {bill.items && bill.items.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Bill Items:</h4>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Description</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead className="text-right">Qty</TableHead>
                              <TableHead className="text-right">Unit Price</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bill.items.map((item, i) => (
                              <TableRow key={i}>
                                <TableCell className="font-medium">{item.description}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{item.category}</Badge>
                                </TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell className="text-right">₹{item.unitPrice.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-semibold">
                                  ₹{item.totalPrice.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <Button variant="outline" onClick={() => setSelectedBill(bill)}>
                      View Detailed Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
