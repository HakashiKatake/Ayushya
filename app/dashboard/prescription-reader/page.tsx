'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Camera, CheckCircle, ArrowLeft } from 'lucide-react';
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
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
      toast.success('Prescription processed successfully!');
    }, 2000);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Camera className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Prescription Reader</h1>
              <p className="text-gray-600">Upload and extract prescription details instantly</p>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Upload Prescription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area */}
                {!previewUrl ? (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Upload className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      Click to upload prescription
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
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
                    {/* Image Preview */}
                    <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Prescription preview"
                        className="w-full h-auto max-h-96 object-contain bg-gray-50"
                      />
                    </div>

                    {/* File Info */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {selectedFile?.name}
                        </span>
                      </div>
                      <Badge variant="secondary">
                        {(selectedFile!.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={handleProcess}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Camera className="mr-2 h-4 w-4" />
                            Extract Details
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={handleReset}>
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
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Extracted Information
                  {showResults && <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showResults ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <FileText className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      Upload and process a prescription to see extracted details
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 max-h-[600px] overflow-y-auto pr-2"
                  >
                    {/* Patient Info */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-bold text-blue-900 mb-3">Patient Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-semibold">Suresh</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age/Sex:</span>
                          <span className="font-semibold">19y/M (19 years / Male)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-semibold">01/08/18</span>
                        </div>
                      </div>
                    </div>

                    {/* Diagnosis */}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h3 className="font-bold text-yellow-900 mb-2">Diagnosis (Tentative)</h3>
                      <p className="text-sm font-semibold">ΔP. Versicolor (Likely Pityriasis Versicolor)</p>
                      <p className="text-xs text-gray-600 mt-2">Other Notes: OPC, No change</p>
                    </div>

                    {/* Medications */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        💊 Medications Prescribed
                      </h3>
                      <div className="space-y-4">
                        {/* Medication 1 */}
                        <div className="bg-white p-3 rounded-lg">
                          <p className="font-semibold text-sm mb-1">
                            Cap. Itaspor 200mg
                          </p>
                          <p className="text-xs text-gray-600 mb-1">
                            1 capsule once daily (O.D.) for 10 days
                          </p>
                          <p className="text-xs text-blue-600">
                            <strong>Interpretation:</strong> Itraconazole 200mg capsule, an oral antifungal medication.
                          </p>
                        </div>

                        {/* Medication 2 */}
                        <div className="bg-white p-3 rounded-lg">
                          <p className="font-semibold text-sm mb-1">
                            Epicent Cream
                          </p>
                          <p className="text-xs text-gray-600 mb-1">
                            To be applied twice daily (B.I.D.) for 7 days
                          </p>
                          <p className="text-xs text-blue-600">
                            <strong>Interpretation:</strong> Epicent Cream (commonly a combination steroid/antifungal/antibacterial cream).
                          </p>
                        </div>

                        {/* Medication 3 */}
                        <div className="bg-white p-3 rounded-lg">
                          <p className="font-semibold text-sm mb-1">
                            Lamifin Cream
                          </p>
                          <p className="text-xs text-gray-600 mb-1">
                            To be applied once daily at night (Noctem or N) for 7 days
                          </p>
                          <p className="text-xs text-blue-600">
                            <strong>Interpretation:</strong> Lamisil Cream (likely Terbinafine cream), an antifungal medication.
                          </p>
                        </div>

                        {/* Medication 4 */}
                        <div className="bg-white p-3 rounded-lg">
                          <p className="font-semibold text-sm mb-1">
                            Nizoclin Soap
                          </p>
                          <p className="text-xs text-gray-600 mb-1">
                            Likely for daily washing/bathing
                          </p>
                          <p className="text-xs text-blue-600">
                            <strong>Interpretation:</strong> Nizoral/Nizoclin Soap (containing Ketoconazole), an antifungal soap.
                          </p>
                        </div>

                        {/* Medication 5 */}
                        <div className="bg-white p-3 rounded-lg">
                          <p className="font-semibold text-sm mb-1">
                            Tab. Lejet Inspece 5mg
                          </p>
                          <p className="text-xs text-gray-600 mb-1">
                            1 tablet once daily (O.D.) for 15 days
                          </p>
                          <p className="text-xs text-blue-600">
                            <strong>Interpretation:</strong> Tab. Levocetirizine 5mg (brand name like Lejet/Lezyncet/etc.), an antihistamine.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up */}
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                        📅 Follow-up
                      </h3>
                      <p className="text-sm font-semibold">R/A 15 days (Return After 15 days)</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Export as PDF
                      </Button>
                      <Button className="flex-1" variant="outline">
                        Save to Records
                      </Button>
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
