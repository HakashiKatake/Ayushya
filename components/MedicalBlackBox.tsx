'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Pill,
  TestTube,
  UserCheck,
  Syringe,
  Stethoscope,
  FileText,
  Bed,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import eventsData from '@/mock/events.json';

interface Event {
  id: string;
  _id?: string;
  event_type: string;
  timestamp: string;
  description: string;
  details: any;
  fraud_flag?: boolean;
}

interface MedicalBlackBoxProps {
  caseId: string;
}

const eventIcons: Record<string, any> = {
  admission: Bed,
  vitals: Activity,
  medication: Pill,
  lab_test: TestTube,
  consultation: UserCheck,
  procedure: Syringe,
  diagnosis: Stethoscope,
  discharge: FileText,
  imaging: TestTube,
  surgery: Syringe,
};

const eventColors: Record<string, string> = {
  admission: 'bg-blue-100 text-blue-800',
  vitals: 'bg-green-100 text-green-800',
  medication: 'bg-purple-100 text-purple-800',
  lab_test: 'bg-yellow-100 text-yellow-800',
  consultation: 'bg-indigo-100 text-indigo-800',
  procedure: 'bg-red-100 text-red-800',
  diagnosis: 'bg-pink-100 text-pink-800',
  discharge: 'bg-gray-100 text-gray-800',
  imaging: 'bg-cyan-100 text-cyan-800',
  surgery: 'bg-orange-100 text-orange-800',
};

export default function MedicalBlackBox({ caseId }: MedicalBlackBoxProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(e => e.event_type === selectedType));
    }
  }, [selectedType, events]);

  const loadEvents = async () => {
    try {
      // Load mock events
      const mockEvents: Event[] = eventsData as any;
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const eventTypes = ['all', ...Array.from(new Set(events.map(e => e.event_type).filter(Boolean)))];
  const fraudEventCount = events.filter(e => e.fraud_flag).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading timeline...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{events.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Event Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(events.map(e => e.event_type)).size}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Fraud Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{fraudEventCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Medical Timeline</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type, index) => (
                    <SelectItem key={`${type}-${index}`} value={type}>
                      {type === 'all' ? 'All Events' : (type?.replace(/_/g, ' ') || '').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No events found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event, index) => {
                const Icon = eventIcons[event.event_type] || Activity;
                const isExpanded = expandedEvents.has(event.id);

                return (
                  <motion.div
                    key={event._id || event.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border rounded-lg p-4 ${
                      event.fraud_flag ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${eventColors[event.event_type] || 'bg-gray-100'}`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {(event.event_type?.replace(/_/g, ' ') || '').toUpperCase()}
                              </Badge>
                              {event.fraud_flag && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Fraud Flag
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-semibold text-gray-900">
                              {event.description}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {formatDate(event.timestamp)}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(event.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <h5 className="font-semibold text-sm text-gray-700 mb-2">
                              Details:
                            </h5>
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                              {JSON.stringify(event.details, null, 2)}
                            </pre>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
