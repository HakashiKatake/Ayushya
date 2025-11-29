'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, ArrowLeft, Hospital, MapPin, Calendar, Stethoscope, Heart, Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCaseStore } from '@/store/caseStore';
import { toast } from 'sonner';

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
        toast.success('Hospital case created successfully! 🏥');
        router.push(`/dashboard/cases/${data.case._id}`);
      } else {
        toast.error('Failed to create case');
      }
    } catch (error) {
      console.error('Error creating case:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="relative">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative backdrop-blur-sm bg-card/80 rounded-3xl p-8 border border-primary/20 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-primary/10 p-4 rounded-2xl"
                >
                  <Hospital className="h-10 w-10 text-primary" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Create New Case 🏥
                  </h1>
                  <p className="text-muted-foreground mt-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Track your hospital journey from admission to discharge
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="backdrop-blur-sm bg-card/80 rounded-3xl p-8 border border-primary/20 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="hospitalName" className="flex items-center gap-2 text-base font-semibold mb-2">
                  <Hospital className="h-5 w-5 text-primary" />
                  Hospital Name *
                </Label>
                <Input
                  id="hospitalName"
                  placeholder="e.g., Apollo Hospitals, Max Healthcare"
                  value={formData.hospitalName}
                  onChange={(e) =>
                    setFormData({ ...formData, hospitalName: e.target.value })
                  }
                  required
                  className="h-12 rounded-2xl border-primary/20"
                />
              </div>

              <div>
                <Label htmlFor="location" className="flex items-center gap-2 text-base font-semibold mb-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location *
                </Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  className="h-12 rounded-2xl border-primary/20"
                />
              </div>

              <div>
                <Label htmlFor="admissionDatetime" className="flex items-center gap-2 text-base font-semibold mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Admission Date & Time *
                </Label>
                <Input
                  id="admissionDatetime"
                  type="datetime-local"
                  value={formData.admissionDatetime}
                  onChange={(e) =>
                    setFormData({ ...formData, admissionDatetime: e.target.value })
                  }
                  required
                  className="h-12 rounded-2xl border-primary/20"
                />
              </div>

              <div>
                <Label htmlFor="chiefComplaint" className="flex items-center gap-2 text-base font-semibold mb-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Chief Complaint *
                </Label>
                <Input
                  id="chiefComplaint"
                  placeholder="Primary reason for admission"
                  value={formData.chiefComplaint}
                  onChange={(e) =>
                    setFormData({ ...formData, chiefComplaint: e.target.value })
                  }
                  required
                  className="h-12 rounded-2xl border-primary/20"
                />
              </div>

              <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4">
                <p className="text-sm text-blue-900 flex items-start gap-2">
                  <Heart className="h-4 w-4 mt-0.5 shrink-0" fill="currentColor" />
                  <span>
                    <strong>Tip:</strong> Be as detailed as possible. This information helps us track your entire medical journey and ensures transparency in your treatment 💙
                  </span>
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-12 text-base rounded-2xl gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Activity className="h-5 w-5" />
                      </motion.div>
                      Creating Case...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Create Hospital Case 🏥
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
