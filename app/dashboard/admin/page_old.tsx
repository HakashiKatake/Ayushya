'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Upload, 
  Play, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  FileText,
  Database,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import eventsData from '@/mock/events.json';

export default function AdminPage() {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [eventType, setEventType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fraudScenarios = [
    {
      id: 'duplicate_tests',
      name: 'Duplicate Lab Tests',
      description: 'Simulates billing for the same test multiple times within a short period'
    },
    {
      id: 'late_night_surge',
      name: 'Late Night Billing (11:59 PM)',
      description: 'Simulates suspicious billing at 11:59 PM to inflate daily charges'
    },
    {
      id: 'price_inflation',
      name: 'Price Inflation',
      description: 'Simulates overpriced items compared to standard rates'
    },
    {
      id: 'phantom_services',
      name: 'Phantom Services',
      description: 'Simulates billing for services that were never provided'
    },
    {
      id: 'upcoding',
      name: 'Upcoding',
      description: 'Simulates billing for more expensive procedures than actually performed'
    }
  ];

  const eventTypes = [
    'admission',
    'vitals',
    'medication',
    'lab_test',
    'consultation',
    'procedure',
    'diagnosis',
    'discharge',
    'imaging',
    'surgery'
  ];

  const handleLoadMockData = () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        success: true,
        message: `Loaded ${eventsData.length} mock events successfully`,
        count: eventsData.length
      });
      setLoading(false);
    }, 1000);
  };

  const handleTriggerScenario = () => {
    if (!selectedScenario) return;

    setLoading(true);
    setTimeout(() => {
      const scenario = fraudScenarios.find(s => s.id === selectedScenario);
      setResult({
        success: true,
        message: `Triggered fraud scenario: ${scenario?.name}`,
        scenario: scenario?.description,
        fraudScore: Math.random() * 0.5 + 0.5 // 0.5 to 1.0
      });
      setLoading(false);
    }, 1500);
  };

  const handleAddEvent = () => {
    if (!eventType || !description) return;

    setLoading(true);
    setTimeout(() => {
      setResult({
        success: true,
        message: 'Event added successfully',
        event: {
          type: eventType,
          description,
          timestamp: new Date().toISOString()
        }
      });
      setLoading(false);
      setEventType('');
      setDescription('');
      setDetails('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Simulator</h1>
              <p className="text-gray-600 mt-1">
                Simulate hospital events and fraud scenarios for testing
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Load Mock Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Load Mock Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Load all mock events from the events.json file. This includes 23 different medical events 
                  spanning various types like admissions, consultations, lab tests, and more.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-2">Includes:</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Admission and discharge events</li>
                    <li>• Vital signs monitoring</li>
                    <li>• Lab tests and imaging</li>
                    <li>• Medications and procedures</li>
                    <li>• Events with fraud flags</li>
                  </ul>
                </div>
                <Button onClick={handleLoadMockData} disabled={loading} className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Load All Mock Events
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trigger Fraud Scenario */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-red-600" />
                  Trigger Fraud Scenario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Scenario</Label>
                  <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a fraud scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      {fraudScenarios.map((scenario) => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          {scenario.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedScenario && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900 mb-1">
                      {fraudScenarios.find(s => s.id === selectedScenario)?.name}
                    </p>
                    <p className="text-xs text-yellow-800">
                      {fraudScenarios.find(s => s.id === selectedScenario)?.description}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleTriggerScenario} 
                  disabled={!selectedScenario || loading}
                  variant="destructive"
                  className="w-full"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Trigger Scenario
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Add Individual Event */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Add Individual Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Event Type</Label>
                    <Select value={eventType} onValueChange={setEventType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace('_', ' ').toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g., Blood pressure measurement"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label>Details (JSON format)</Label>
                  <Textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder='{"temperature": "98.6", "bp": "120/80"}'
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleAddEvent} 
                  disabled={!eventType || !description || loading}
                  className="w-full"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Card className={result.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}>
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                    {result.success ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {result.message}
                    </h3>
                    {result.count && (
                      <p className="text-sm text-gray-700">
                        Total events loaded: {result.count}
                      </p>
                    )}
                    {result.scenario && (
                      <p className="text-sm text-gray-700 mb-2">
                        {result.scenario}
                      </p>
                    )}
                    {result.fraudScore && (
                      <div className="mt-2">
                        <Badge variant="destructive">
                          Fraud Score: {(result.fraudScore * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    )}
                    {result.event && (
                      <div className="mt-2 bg-white p-3 rounded border">
                        <pre className="text-xs font-mono">
                          {JSON.stringify(result.event, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Admin Simulator Guide</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    This admin panel allows you to simulate hospital events and test fraud detection:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li><strong>Load Mock Events:</strong> Import all predefined events from mock data</li>
                    <li><strong>Trigger Fraud Scenarios:</strong> Test specific fraud patterns like duplicate tests or price inflation</li>
                    <li><strong>Add Individual Events:</strong> Create custom events with specific details</li>
                    <li>All simulated events can be viewed in the Medical BlackBox timeline</li>
                    <li>Fraud scenarios will automatically calculate fraud scores</li>
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
