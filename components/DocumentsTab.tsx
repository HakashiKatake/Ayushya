'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DocumentsTabProps {
  caseId: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

export default function DocumentsTab({ caseId }: DocumentsTabProps) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Admission Form.pdf',
      type: 'Form',
      uploadDate: '2024-01-15',
      size: '245 KB'
    },
    {
      id: '2',
      name: 'Lab Results - CBC.pdf',
      type: 'Lab Report',
      uploadDate: '2024-01-16',
      size: '128 KB'
    },
    {
      id: '3',
      name: 'Prescription.pdf',
      type: 'Prescription',
      uploadDate: '2024-01-17',
      size: '89 KB'
    }
  ]);

  const handleUpload = () => {
    // Mock upload - in production, would use file input
    const newDoc: Document = {
      id: String(documents.length + 1),
      name: 'New Document.pdf',
      type: 'Other',
      uploadDate: new Date().toISOString().split('T')[0],
      size: '156 KB'
    };
    setDocuments([...documents, newDoc]);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Medical Documents</h2>
        <Button onClick={handleUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Documents Yet</h3>
              <p className="text-gray-600 mb-4">Upload medical documents to keep them organized</p>
              <Button onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload First Document
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{doc.type}</Badge>
                          <span className="text-sm text-gray-600">
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </span>
                          <span className="text-sm text-gray-600">• {doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
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
