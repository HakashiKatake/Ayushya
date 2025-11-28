'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Plus, TrendingUp, AlertTriangle, DollarSign, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import policyRulesData from '@/mock/policy_rules.json';

interface InsurancePolicy {
  _id: string;
  policyNumber: string;
  provider: string;
  policyType: string;
  coverageAmount: number;
  copayPercentage: number;
  roomRentLimit?: number;
  icuRentLimit?: number;
  exclusions: string[];
  createdAt: string;
}

export default function InsurancePage() {
  const router = useRouter();
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    policyNumber: '',
    provider: '',
    policyType: 'Basic',
    coverageAmount: 500000,
    copayPercentage: 0,
    roomRentLimit: 5000,
    icuRentLimit: 10000
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch('/api/insurance');
      if (response.ok) {
        const data = await response.json();
        setPolicies(data.policies);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const policyRules: any = policyRulesData;
    const selectedPolicy = policyRules[formData.policyType] || policyRules.Basic;

    try {
      const response = await fetch('/api/insurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          exclusions: selectedPolicy.exclusions || []
        })
      });

      if (response.ok) {
        await fetchPolicies();
        setDialogOpen(false);
        setFormData({
          policyNumber: '',
          provider: '',
          policyType: 'Basic',
          coverageAmount: 500000,
          copayPercentage: 0,
          roomRentLimit: 5000,
          icuRentLimit: 10000
        });
      }
    } catch (error) {
      console.error('Error creating policy:', error);
    }
  };

  const getPolicyTypeColor = (type: string) => {
    switch (type) {
      case 'Premium':
        return 'bg-purple-100 text-purple-800';
      case 'Standard':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading insurance policies...</p>
        </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Insurance Optimizer</h1>
              <p className="text-gray-600 mt-2">
                Manage your insurance policies and analyze coverage
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Policy
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Insurance Policy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Policy Number</Label>
                    <Input
                      value={formData.policyNumber}
                      onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                      placeholder="POL123456"
                    />
                  </div>

                  <div>
                    <Label>Provider</Label>
                    <Input
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      placeholder="e.g., Star Health Insurance"
                    />
                  </div>

                  <div>
                    <Label>Policy Type</Label>
                    <Select 
                      value={formData.policyType} 
                      onValueChange={(value) => setFormData({ ...formData, policyType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Coverage Amount (₹)</Label>
                    <Input
                      type="number"
                      value={formData.coverageAmount}
                      onChange={(e) => setFormData({ ...formData, coverageAmount: Number(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label>Co-pay Percentage (%)</Label>
                    <Input
                      type="number"
                      value={formData.copayPercentage}
                      onChange={(e) => setFormData({ ...formData, copayPercentage: Number(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label>Room Rent Limit (₹/day)</Label>
                    <Input
                      type="number"
                      value={formData.roomRentLimit}
                      onChange={(e) => setFormData({ ...formData, roomRentLimit: Number(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label>ICU Rent Limit (₹/day)</Label>
                    <Input
                      type="number"
                      value={formData.icuRentLimit}
                      onChange={(e) => setFormData({ ...formData, icuRentLimit: Number(e.target.value) })}
                    />
                  </div>

                  <Button onClick={handleSubmit} className="w-full">
                    Add Policy
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {policies.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Insurance Policies</h3>
                <p className="text-gray-600 mb-4">Add your insurance policy to analyze coverage</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {policies.map((policy, index) => (
              <motion.div
                key={policy._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-blue-600" />
                          <CardTitle>{policy.provider}</CardTitle>
                        </div>
                        <p className="text-sm text-gray-600">Policy #{policy.policyNumber}</p>
                      </div>
                      <Badge className={getPolicyTypeColor(policy.policyType)}>
                        {policy.policyType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-600">Coverage Amount</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{policy.coverageAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Co-pay</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {policy.copayPercentage}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Room Rent Limit</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{policy.roomRentLimit?.toLocaleString()}/day
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">ICU Rent Limit</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{policy.icuRentLimit?.toLocaleString()}/day
                        </p>
                      </div>
                    </div>

                    {policy.exclusions && policy.exclusions.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                          Exclusions:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {policy.exclusions.map((exclusion, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {exclusion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500">
                        Added on {new Date(policy.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How Insurance Analysis Works</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    When you upload a bill in a case, you can analyze it against your insurance policy to see:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Amount covered by insurance</li>
                    <li>Your out-of-pocket expenses</li>
                    <li>Items that exceed room rent limits</li>
                    <li>Excluded items not covered</li>
                    <li>Co-pay calculations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
