'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Upload, Play, AlertTriangle, CheckCircle, Activity, FileText, Database, Zap, Heart, Sparkles, TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import eventsData from '@/mock/events.json';
import { toast } from 'sonner';

export default function AdminPage() {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [eventType, setEventType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fraudScenarios = [
    { id: 'duplicate_tests', name: 'Duplicate Lab Tests', description: 'Simulates billing for the same test multiple times within a short period' },
    { id: 'late_night_surge', name: 'Late Night Billing (11:59 PM)', description: 'Simulates suspicious billing at 11:59 PM to inflate daily charges' },
    { id: 'price_inflation', name: 'Price Inflation', description: 'Simulates overpriced items compared to standard rates' },
    { id: 'phantom_services', name: 'Phantom Services', description: 'Simulates billing for services that were never provided' },
    { id: 'upcoding', name: 'Upcoding', description: 'Simulates billing for more expensive procedures than actually performed' }
  ];

  const eventTypes = ['admission', 'vitals', 'medication', 'lab_test', 'consultation', 'procedure', 'diagnosis', 'discharge', 'imaging', 'surgery'];

  const handleLoadMockData = () => {
    setLoading(true);
    setTimeout(() => {
      setResult({ success: true, message: `Loaded ${eventsData.length} mock events successfully! 🎉`, count: eventsData.length });
      setLoading(false);
      toast.success('Mock data loaded successfully!');
    }, 1000);
  };

  const handleTriggerScenario = () => {
    if (!selectedScenario) return;
    setLoading(true);
    setTimeout(() => {
      const scenario = fraudScenarios.find(s => s.id === selectedScenario);
      setResult({
        success: true,
        message: `Triggered fraud scenario: ${scenario?.name} ⚠️`,
        scenario: scenario?.description,
        fraudScore: Math.random() * 0.5 + 0.5
      });
      setLoading(false);
      toast.success('Fraud scenario triggered!');
    }, 1500);
  };

  const handleAddEvent = () => {
    if (!eventType || !description) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        success: true,
        message: 'Event added successfully! ✅',
        event: { type: eventType, description, timestamp: new Date().toISOString() }
      });
      setLoading(false);
      setEventType('');
      setDescription('');
      setDetails('');
      toast.success('Event added successfully!');
    }, 1000);
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
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative backdrop-blur-sm bg-card/80 rounded-3xl p-8 border border-primary/20 shadow-2xl">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-primary/10 p-4 rounded-2xl"
              >
                <Settings className="h-12 w-12 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Admin Simulator ⚡
                </h1>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Simulate hospital events and fraud scenarios for testing
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Load Mock Data */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="backdrop-blur-sm bg-card/80 rounded-3xl border border-primary/20 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Database className="h-6 w-6 text-blue-500" />
                  Load Mock Events 📊
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Load all mock events from the events.json file. This includes 23 different medical events spanning various types.
                </p>
                <div className="bg-linear-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-2xl border border-blue-500/20">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Includes:</p>
                  <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Admission and discharge events 🏥</li>
                    <li>• Vital signs monitoring 💓</li>
                    <li>• Lab tests and imaging 🔬</li>
                    <li>• Medications and procedures 💊</li>
                    <li>• Events with fraud flags ⚠️</li>
                  </ul>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleLoadMockData} disabled={loading} className="w-full h-12 rounded-2xl gap-2">
                    <Upload className="h-5 w-5" />
                    Load All Mock Events
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trigger Fraud Scenario */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="backdrop-blur-sm bg-card/80 rounded-3xl border border-red-500/20 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="h-6 w-6 text-red-500" />
                  Trigger Fraud Scenario 🚨
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-base font-semibold mb-2 block">Select Scenario</Label>
                  <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                    <SelectTrigger className="h-12 rounded-2xl">
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
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-linear-to-br from-yellow-500/10 to-yellow-600/10 p-4 rounded-2xl border border-yellow-500/20">
                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                      {fraudScenarios.find(s => s.id === selectedScenario)?.name}
                    </p>
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      {fraudScenarios.find(s => s.id === selectedScenario)?.description}
                    </p>
                  </motion.div>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleTriggerScenario} disabled={!selectedScenario || loading} variant="destructive"
                    className="w-full h-12 rounded-2xl gap-2">
                    <Play className="h-5 w-5" />
                    Trigger Scenario
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Add Individual Event */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <Card className="backdrop-blur-sm bg-card/80 rounded-3xl border border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Activity className="h-6 w-6 text-green-500" />
                  Add Individual Event ✨
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-base font-semibold mb-2 block">Event Type</Label>
                    <Select value={eventType} onValueChange={setEventType}>
                      <SelectTrigger className="h-12 rounded-2xl">
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
                    <Label className="text-base font-semibold mb-2 block">Description</Label>
                    <Input value={description} onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g., Blood pressure measurement" className="h-12 rounded-2xl" />
                  </div>
                </div>
                <div className="mb-4">
                  <Label className="text-base font-semibold mb-2 block">Details (JSON format)</Label>
                  <Textarea value={details} onChange={(e) => setDetails(e.target.value)}
                    placeholder='{"temperature": "98.6", "bp": "120/80"}' rows={3} className="rounded-2xl" />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleAddEvent} disabled={!eventType || !description || loading}
                    className="w-full h-12 rounded-2xl gap-2">
                    <Play className="h-5 w-5" />
                    Add Event
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Result Display */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <Card className={`backdrop-blur-sm rounded-3xl shadow-xl ${result.success ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <motion.div whileHover={{ scale: 1.1 }} className={`p-4 rounded-2xl ${result.success ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {result.success ? <CheckCircle className="h-8 w-8 text-green-600" /> : <AlertTriangle className="h-8 w-8 text-red-600" />}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2">{result.message}</h3>
                    {result.count && <p className="text-sm text-muted-foreground">Total events loaded: {result.count}</p>}
                    {result.scenario && <p className="text-sm text-muted-foreground mb-2">{result.scenario}</p>}
                    {result.fraudScore && (
                      <Badge variant="destructive" className="text-sm">
                        ⚠️ Fraud Score: {(result.fraudScore * 100).toFixed(0)}%
                      </Badge>
                    )}
                    {result.event && (
                      <div className="mt-3 bg-muted/30 p-4 rounded-2xl border border-primary/10">
                        <pre className="text-xs font-mono">{JSON.stringify(result.event, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
          <Card className="backdrop-blur-sm bg-linear-to-br from-purple-500/10 to-purple-600/10 rounded-3xl border border-purple-500/20 shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-500/10 p-4 rounded-2xl">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                    Admin Simulator Guide 📖
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    This admin panel allows you to simulate hospital events and test fraud detection:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                    <li><strong>Load Mock Events:</strong> Import all predefined events from mock data 📊</li>
                    <li><strong>Trigger Fraud Scenarios:</strong> Test specific fraud patterns ��</li>
                    <li><strong>Add Individual Events:</strong> Create custom events with specific details ✨</li>
                    <li>All simulated events can be viewed in the Medical BlackBox timeline 🔬</li>
                    <li>Fraud scenarios will automatically calculate fraud scores ⚡</li>
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
