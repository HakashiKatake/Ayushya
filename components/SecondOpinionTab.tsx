'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, AlertTriangle, CheckCircle, HelpCircle, Send, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SecondOpinionTabProps {
  caseId: string;
  onConnectSpecialist?: () => void;
}

interface SecondOpinionRequest {
  _id: string;
  questionType: string;
  context: string;
  response: string;
  appropriatenessScore: number;
  recommendations: string[];
  questionsForDoctor: string[];
  createdAt: string;
}

const questionTypes = [
  { value: 'treatment_necessary', label: 'Is this treatment necessary?' },
  { value: 'tests_excessive', label: 'Are these tests excessive?' },
  { value: 'explain_simple', label: 'Explain in simple terms' },
];

export default function SecondOpinionTab({ caseId, onConnectSpecialist }: SecondOpinionTabProps) {
  const [requests, setRequests] = useState<SecondOpinionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('');
  const [context, setContext] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [caseId]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/second-opinion?caseId=${caseId}`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching second opinion requests:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedQuestionType) return;

    setLoading(true);
    try {
      const response = await fetch('/api/second-opinion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          questionType: selectedQuestionType,
          context
        })
      });

      if (response.ok) {
        await fetchRequests();
        setSelectedQuestionType('');
        setContext('');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating second opinion request:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAppropriateness = (score: number) => {
    if (score >= 80) return { label: 'Highly Appropriate', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { label: 'Appropriate', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 40) return { label: 'Questionable', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Not Appropriate', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">AI Second Opinion</h2>
        {!showForm && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onConnectSpecialist}>
              <Users className="mr-2 h-4 w-4" />
              Connect with Professional
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Ask Question
            </Button>
          </div>
        )}
      </div>

      {/* Question Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Ask AI for Second Opinion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Question Type</Label>
                <Select value={selectedQuestionType} onValueChange={setSelectedQuestionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Additional Context (Optional)</Label>
                <Textarea
                  placeholder="Add any specific details about your concern..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={!selectedQuestionType || loading}>
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? 'Getting Opinion...' : 'Get AI Opinion'}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Requests List */}
      {requests.length === 0 && !showForm ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Yet</h3>
              <p className="text-gray-600 mb-4">Ask AI for a second opinion on treatments and tests</p>
              <Button onClick={() => setShowForm(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask First Question
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {requests.map((request, index) => {
            const appropriateness = getAppropriateness(request.appropriatenessScore);
            const questionTypeLabel = questionTypes.find(qt => qt.value === request.questionType)?.label || request.questionType;

            return (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{questionTypeLabel}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${appropriateness.bg} ${appropriateness.color}`}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {request.appropriatenessScore}% {appropriateness.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* AI Response */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        AI Analysis:
                      </h4>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {request.response}
                      </p>
                    </div>

                    {/* Recommendations */}
                    {request.recommendations && request.recommendations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Recommendations:
                        </h4>
                        <ul className="space-y-2">
                          {request.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-green-600 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Questions for Doctor */}
                    {request.questionsForDoctor && request.questionsForDoctor.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <HelpCircle className="h-4 w-4 mr-2 text-blue-600" />
                          Questions to Ask Your Doctor:
                        </h4>
                        <ul className="space-y-2">
                          {request.questionsForDoctor.map((question, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-blue-600 mt-1">?</span>
                              <span>{question}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
