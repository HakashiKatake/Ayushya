'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Filter,
  Clock,
  TrendingUp
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

const eventGradients: Record<string, string> = {
  admission: 'from-blue-500 to-cyan-500',
  vitals: 'from-emerald-500 to-teal-500',
  medication: 'from-purple-500 to-pink-500',
  lab_test: 'from-yellow-500 to-orange-500',
  consultation: 'from-indigo-500 to-purple-500',
  procedure: 'from-rose-500 to-red-500',
  diagnosis: 'from-pink-500 to-fuchsia-500',
  discharge: 'from-slate-600 to-slate-700',
  imaging: 'from-cyan-500 to-blue-500',
  surgery: 'from-orange-500 to-amber-500',
};

export default function MedicalBlackBox({ caseId }: MedicalBlackBoxProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
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
      const mockEvents: Event[] = eventsData as any;
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
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

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const eventTypes = ['all', ...Array.from(new Set(events.map(e => e.event_type).filter(Boolean)))];
  const fraudEventCount = events.filter(e => e.fraud_flag).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading timeline...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 opacity-10" />
          <Card className="bg-slate-900/50 border border-blue-500/30 backdrop-blur-sm relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-8 w-8 text-blue-400" />
                <TrendingUp className="h-5 w-5 text-blue-400/50" />
              </div>
              <p className="text-sm text-slate-400 mb-1">Total Events</p>
              <p className="text-4xl font-bold text-blue-400">{events.length}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-10" />
          <Card className="bg-slate-900/50 border border-purple-500/30 backdrop-blur-sm relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-8 w-8 text-purple-400" />
                <TrendingUp className="h-5 w-5 text-purple-400/50" />
              </div>
              <p className="text-sm text-slate-400 mb-1">Event Types</p>
              <p className="text-4xl font-bold text-purple-400">
                {new Set(events.map(e => e.event_type)).size}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600 to-red-600 opacity-10" />
          <Card className="bg-slate-900/50 border border-rose-500/30 backdrop-blur-sm relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-8 w-8 text-rose-400" />
                <TrendingUp className="h-5 w-5 text-rose-400/50" />
              </div>
              <p className="text-sm text-slate-400 mb-1">Fraud Flags</p>
              <p className="text-4xl font-bold text-rose-400">{fraudEventCount}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Horizontal Timeline */}
      <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl mb-2">Medical Journey Timeline</CardTitle>
              <p className="text-sm text-slate-400">Complete chronological record of medical events</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[200px] bg-slate-800 border-white/10">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
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
        <CardContent className="p-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No events found</p>
            </div>
          ) : (
            <div className="relative">
              {/* Horizontal Timeline Container */}
              <div className="relative pb-8">
                {/* Animated Progress Line */}
                <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20" />

                {/* Animated Pulse Moving Along Timeline */}
                <motion.div
                  className="absolute top-12 h-1 w-16 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                  animate={{
                    left: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* Horizontal Scrollable Timeline */}
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-8 min-w-max px-4">
                    {filteredEvents.map((event, index) => {
                      const Icon = eventIcons[event.event_type] || Activity;
                      const gradient = eventGradients[event.event_type] || 'from-gray-500 to-gray-600';
                      const isSelected = selectedEvent === event.id;
                      const isFirst = index === 0;
                      const isLast = index === filteredEvents.length - 1;

                      return (
                        <motion.div
                          key={event._id || event.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex flex-col items-center relative"
                          style={{ minWidth: '280px' }}
                        >
                          {/* Event Icon with Pulse Animation */}
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            onClick={() => setSelectedEvent(isSelected ? null : event.id)}
                            className="relative cursor-pointer mb-6"
                          >
                            {/* Pulse Ring */}
                            <motion.div
                              className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient} opacity-30`}
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0, 0.3],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.2,
                              }}
                            />
                            {/* Icon Circle */}
                            <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg border-4 border-slate-900 z-10`}>
                              <Icon className="h-10 w-10 text-white" />
                            </div>
                            {event.fraud_flag && (
                              <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg z-20">
                                <AlertTriangle className="h-4 w-4 text-white" />
                              </div>
                            )}
                            {/* Connecting line to progress bar */}
                            <div className={`absolute top-full left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-b ${gradient}`} />
                          </motion.div>

                          {/* Event Info Card */}
                          <div className={`w-full bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-4 ${event.fraud_flag ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'
                            }`}>
                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <Badge className={`bg-gradient-to-r ${gradient} text-white border-0 text-xs px-2 py-1`}>
                                {(event.event_type?.replace(/_/g, ' ') || '').toUpperCase()}
                              </Badge>
                              {event.fraud_flag && (
                                <Badge variant="destructive" className="text-xs px-2 py-1">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Fraud
                                </Badge>
                              )}
                              {isFirst && (
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs px-2 py-1">
                                  Start
                                </Badge>
                              )}
                              {isLast && (
                                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs px-2 py-1">
                                  Latest
                                </Badge>
                              )}
                            </div>

                            {/* Event Title */}
                            <h3 className="text-base font-bold text-white mb-2 line-clamp-2">
                              {event.description}
                            </h3>

                            {/* Date/Time */}
                            <div className="space-y-1 text-xs text-slate-400 mb-3">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatDateShort(event.timestamp)}</span>
                              </div>
                              <div className="font-mono">{formatTime(event.timestamp)}</div>
                            </div>

                            {/* Expand Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedEvent(isSelected ? null : event.id)}
                              className="w-full text-xs text-slate-400 hover:text-white h-8"
                            >
                              {isSelected ? (
                                <>
                                  <ChevronUp className="h-3 w-3 mr-1" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3 mr-1" />
                                  Details
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Expandable Details Below */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="w-full bg-slate-800/90 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-2xl"
                              >
                                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Detailed Information
                                </h4>
                                <div className="space-y-2">
                                  <div className="text-xs text-slate-400">
                                    Full Timestamp: {formatDate(event.timestamp)}
                                  </div>
                                  {event.details && typeof event.details === 'object' && (
                                    <div className="grid grid-cols-1 gap-2 mt-3">
                                      {Object.entries(event.details).map(([key, value]) => (
                                        <div key={key} className="bg-slate-900/50 rounded-lg p-2">
                                          <p className="text-xs text-slate-500 uppercase tracking-wide">
                                            {key.replace(/_/g, ' ')}
                                          </p>
                                          <p className="text-sm text-slate-200 mt-1">
                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {event.fraud_flag && (
                                    <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded-lg">
                                      <p className="text-xs text-red-300 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        Flagged for billing irregularities
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
