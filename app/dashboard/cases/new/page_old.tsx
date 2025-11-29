'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCaseStore } from '@/store/caseStore';

export default function NewCasePage() {
  const router = useRouter();
  const { addCase } = useCaseStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hospitalName: '',
    location: '',
    admissionDatetime: '',
    chiefComplaint: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        addCase(data.case);
        router.push(`/dashboard/cases/${data.case._id}`);
      } else {
        alert('Failed to create case');
      }
    } catch (error) {
      console.error('Error creating case:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">AYUSHYA</span>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Create New Hospital Case</h1>
          <p className="text-gray-600 mb-8">
            Track your hospital journey from admission to discharge
          </p>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="hospitalName">Hospital Name *</Label>
                <Input
                  id="hospitalName"
                  placeholder="e.g., Apollo Hospitals"
                  value={formData.hospitalName}
                  onChange={(e) =>
                    setFormData({ ...formData, hospitalName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., New Delhi"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="admissionDatetime">Admission Date & Time *</Label>
                <Input
                  id="admissionDatetime"
                  type="datetime-local"
                  value={formData.admissionDatetime}
                  onChange={(e) =>
                    setFormData({ ...formData, admissionDatetime: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
                <Input
                  id="chiefComplaint"
                  placeholder="e.g., High fever and body ache"
                  value={formData.chiefComplaint}
                  onChange={(e) =>
                    setFormData({ ...formData, chiefComplaint: e.target.value })
                  }
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Main reason for hospital visit
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating...' : 'Create Case'}
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Upload medical bills for fraud detection</li>
              <li>• View Medical BlackBox timeline</li>
              <li>• Get second opinion on treatment</li>
              <li>• Generate patient summary PDF</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
