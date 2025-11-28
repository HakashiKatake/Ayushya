'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Star, Calendar, Award, Languages, DollarSign, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import specialistsData from '@/mock/specialists.json';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  hospital: string;
  location: string;
  rating: number;
  consultationFee: number;
  languages: string[];
  availability: string;
  phone: string;
  email: string;
  expertise: string[];
  keywords: string[];
}

interface ConnectSpecialistProps {
  chiefComplaint: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectSpecialist({ chiefComplaint, isOpen, onClose }: ConnectSpecialistProps) {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);

  useEffect(() => {
    if (isOpen && chiefComplaint) {
      findRelevantSpecialists();
    }
  }, [isOpen, chiefComplaint]);

  const findRelevantSpecialists = () => {
    const allSpecialists = specialistsData as Specialist[];
    const complaintLower = chiefComplaint.toLowerCase();

    // Find specialists whose keywords match the chief complaint
    const matched = allSpecialists.filter((specialist) =>
      specialist.keywords.some((keyword) => complaintLower.includes(keyword))
    );

    // Sort by rating (highest first)
    const sorted = matched.sort((a, b) => b.rating - a.rating);

    setSpecialists(sorted.length > 0 ? sorted : allSpecialists.slice(0, 3)); // Show top 3 if no match
  };

  const handleBookConsultation = (specialist: Specialist) => {
    toast.success(`Consultation request sent to ${specialist.name}`);
    setSelectedSpecialist(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            Connect with Specialists
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Based on your condition: <span className="font-semibold">{chiefComplaint}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {specialists.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No specialists found for your condition</p>
            </div>
          ) : (
            specialists.map((specialist, index) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Doctor Avatar */}
                      <div className="shrink-0">
                        <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="h-12 w-12 text-white" />
                        </div>
                      </div>

                      {/* Doctor Details */}
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{specialist.name}</h3>
                              <p className="text-blue-600 font-semibold">{specialist.specialty}</p>
                              <p className="text-sm text-gray-600">{specialist.qualification}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-semibold text-gray-900">{specialist.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Award className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{specialist.experience} years experience</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{specialist.hospital}, {specialist.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{specialist.availability}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700 font-semibold">₹{specialist.consultationFee}</span>
                            <span className="text-gray-500">consultation</span>
                          </div>
                        </div>

                        {/* Languages */}
                        <div className="flex items-center gap-2">
                          <Languages className="h-4 w-4 text-gray-400" />
                          <div className="flex gap-1">
                            {specialist.languages.map((lang) => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Expertise */}
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">Areas of Expertise:</p>
                          <div className="flex flex-wrap gap-2">
                            {specialist.expertise.map((area) => (
                              <Badge key={area} variant="secondary" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={() => setSelectedSpecialist(specialist)}
                            className="flex-1"
                          >
                            View Full Profile
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleBookConsultation(specialist)}
                            className="flex-1"
                          >
                            Book Consultation
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Detailed Profile Modal */}
        {selectedSpecialist && (
          <Dialog open={!!selectedSpecialist} onOpenChange={() => setSelectedSpecialist(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedSpecialist.name}</DialogTitle>
                <p className="text-blue-600 font-semibold">{selectedSpecialist.specialty}</p>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Qualifications */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    Qualifications
                  </h4>
                  <p className="text-gray-700">{selectedSpecialist.qualification}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedSpecialist.experience} years of professional experience
                  </p>
                </div>

                {/* Hospital */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Practice Location
                  </h4>
                  <p className="text-gray-700">{selectedSpecialist.hospital}</p>
                  <p className="text-sm text-gray-600">{selectedSpecialist.location}</p>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${selectedSpecialist.phone}`} className="text-blue-600 hover:underline">
                        {selectedSpecialist.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${selectedSpecialist.email}`} className="text-blue-600 hover:underline">
                        {selectedSpecialist.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Availability
                  </h4>
                  <p className="text-gray-700">{selectedSpecialist.availability}</p>
                </div>

                {/* Expertise */}
                <div>
                  <h4 className="font-semibold mb-2">Areas of Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecialist.expertise.map((area) => (
                      <Badge key={area} variant="secondary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Consultation Fee */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Consultation Fee</p>
                      <p className="text-2xl font-bold text-blue-600">₹{selectedSpecialist.consultationFee}</p>
                    </div>
                    <Button onClick={() => handleBookConsultation(selectedSpecialist)}>
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
