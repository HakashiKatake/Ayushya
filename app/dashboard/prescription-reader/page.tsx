'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Camera, CheckCircle, ArrowLeft, Heart, Sparkles, Pill, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

export default function PrescriptionReaderPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowResults(false);
      toast.success('Image uploaded successfully! 📷');
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
      toast.success('Prescription processed successfully! ✨');
    }, 2000);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowResults(false);
    toast.info('Reset complete');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative backdrop-blur-sm bg-card/80 rounded-3xl p-8 border border-primary/20 shadow-2xl">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-primary/10 p-4 rounded-2xl"
              >
                <Camera className="h-12 w-12 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Prescription Reader 💊
                </h1>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Upload and extract prescription details instantly
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-card/80 rounded-3xl border border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Upload className="h-6 w-6 text-primary" />
                  Upload Prescription 📄
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!previewUrl ? (
                  <label className="border-2 border-dashed border-primary/30 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-primary/10 p-6 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors"
                    >
                      <Upload className="h-16 w-16 text-primary" />
                    </motion.div>
                    <p className="text-lg font-semibold mb-2">
                      Click to upload prescription
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      PNG, JPG, JPEG up to 10MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative border-2 border-primary/20 rounded-2xl overflow-hidden"
                    >
                      <img
                        src={previewUrl}
                        alt="Prescription preview"
                        className="w-full h-auto max-h-96 object-contain bg-muted/30"
                      />
                    </motion.div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">
                          {selectedFile?.name}
                        </span>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {(selectedFile!.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>

                    <div className="flex gap-3">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          onClick={handleProcess}
                          disabled={isProcessing}
                          className="w-full h-12 rounded-2xl gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Camera className="h-5 w-5" />
                              </motion.div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Camera className="h-5 w-5" />
                              Extract Details ✨
                            </>
                          )}
                        </Button>
                      </motion.div>
                      <Button variant="outline" onClick={handleReset} className="h-12 rounded-2xl">
                        Reset
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-card/80 rounded-3xl border border-primary/20 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <FileText className="h-6 w-6 text-green-500" />
                  Extracted Information
                  {showResults && <CheckCircle className="h-6 w-6 text-green-500 ml-auto" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showResults ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FileText className="h-20 w-20 text-primary/40 mb-4" />
                    </motion.div>
                    <p className="text-muted-foreground">
                      Upload and process a prescription to see extracted details ✨
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 max-h-[600px] overflow-y-auto pr-2"
                  >
                    <div className="bg-linear-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-2xl border border-blue-500/20">
                      <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                        <Heart className="h-5 w-5" fill="currentColor" />
                        Patient Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-semibold">Suresh</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Age/Sex:</span>
                          <span className="font-semibold">19y/M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-semibold">01/08/18</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-linear-to-br from-yellow-500/10 to-yellow-600/10 p-4 rounded-2xl border border-yellow-500/20">
                      <h3 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2">Diagnosis 🔬</h3>
                      <p className="text-sm font-semibold">P. Versicolor (Pityriasis Versicolor)</p>
                    </div>

                    <div className="bg-linear-to-br from-green-500/10 to-green-600/10 p-4 rounded-2xl border border-green-500/20">
                      <h3 className="font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                        <Pill className="h-5 w-5" />
                        Medications Prescribed 💊
                      </h3>
                      <div className="space-y-3">
                        {[
                          { name: 'Cap. Itaspor 200mg', dose: '1 capsule O.D. for 10 days', desc: 'Itraconazole - Antifungal' },
                          { name: 'Epicent Cream', dose: 'Apply B.I.D. for 7 days', desc: 'Topical antifungal' },
                          { name: 'Lamifin Cream', dose: 'Apply at night for 7 days', desc: 'Terbinafine - Antifungal' },
                          { name: 'Nizoclin Soap', dose: 'Daily washing', desc: 'Ketoconazole soap' },
                          { name: 'Tab. Lejet 5mg', dose: '1 tablet O.D. for 15 days', desc: 'Levocetirizine - Antihistamine' }
                        ].map((med, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-card/80 backdrop-blur-sm p-3 rounded-xl border border-primary/10"
                          >
                            <p className="font-semibold text-sm mb-1">{med.name}</p>
                            <p className="text-xs text-muted-foreground mb-1">{med.dose}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">{med.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-linear-to-br from-purple-500/10 to-purple-600/10 p-4 rounded-2xl border border-purple-500/20">
                      <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Follow-up 📅
                      </h3>
                      <p className="text-sm font-semibold">Return After 15 days</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
                        <Button className="w-full rounded-2xl gap-2" variant="outline">
                          <FileText className="h-4 w-4" />
                          Export PDF
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
                        <Button className="w-full rounded-2xl gap-2">
                          Save to Records
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
