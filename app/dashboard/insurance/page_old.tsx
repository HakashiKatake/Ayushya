'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, DollarSign, TrendingUp, CheckCircle, Info, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import insurancePlans from '@/mock/insurance_plans.json';

interface Dependent {
  age: number;
}

interface UserProfile {
  name: string;
  age: number;
  salary: number;
  monthlyExpense: number;
  insuranceBudget: number;
  dependents: Dependent[];
}

interface InsurancePlan {
  id: string;
  planName: string;
  provider: string;
  type: string;
  sumInsured: number;
  premium: number;
  copay: number;
  roomRent: number;
  icuRent: number;
  preHospitalization: number;
  postHospitalization: number;
  ambulanceCover: number;
  features: string[];
  ageRange: { min: number; max: number };
  minSalary: number;
  idealForDependents: number;
}

export default function InsuranceRecommendationPage() {
  const [step, setStep] = useState<'profile' | 'recommendations'>('profile');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 0,
    salary: 0,
    monthlyExpense: 0,
    insuranceBudget: 0,
    dependents: []
  });
  const [dependentCount, setDependentCount] = useState(0);
  const [recommendations, setRecommendations] = useState<InsurancePlan[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const plansPerView = 3;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.name || !profile.age || !profile.salary) {
      toast.error('Please fill all required fields');
      return;
    }

    // Always show at least 5 plans from the mock data
    const allPlans = insurancePlans as InsurancePlan[];
    const selectedPlans = allPlans.slice(0, 5);

    setRecommendations(selectedPlans);
    setStep('recommendations');
    setCurrentIndex(0);
    toast.success(`Found ${selectedPlans.length} insurance plans for you`);
  };

  const handleDependentCountChange = (count: number) => {
    setDependentCount(count);
    const deps: Dependent[] = [];
    for (let i = 0; i < count; i++) {
      deps.push({ age: 0 });
    }
    setProfile({ ...profile, dependents: deps });
  };

  const updateDependentAge = (index: number, age: number) => {
    const newDeps = [...profile.dependents];
    newDeps[index] = { age };
    setProfile({ ...profile, dependents: newDeps });
  };

  const calculateRecommendedCoverage = () => {
    // Recommended coverage = 5-10x annual salary
    const minCoverage = profile.salary * 5;
    const maxCoverage = profile.salary * 10;
    return { min: minCoverage, max: maxCoverage };
  };

  const calculateAffordability = (premium: number) => {
    const annualPremium = premium;
    const affordableLimit = profile.salary * 0.05; // 5% of annual salary
    const percentage = (annualPremium / affordableLimit) * 100;

    if (percentage <= 100) return { status: 'Highly Affordable', color: 'text-green-600' };
    if (percentage <= 150) return { status: 'Affordable', color: 'text-blue-600' };
    return { status: 'Premium', color: 'text-orange-600' };
  };

  const handleNext = () => {
    if (currentIndex + plansPerView < recommendations.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visiblePlans = recommendations.slice(currentIndex, currentIndex + plansPerView);

  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-12 w-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Find Your Perfect Insurance</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Tell us about yourself and we'll recommend the best plans
            </p>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Personal Details</h3>
                    
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          value={profile.age || ''}
                          onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                          placeholder="Your age"
                          required
                          min="18"
                          max="100"
                        />
                      </div>

                      <div>
                        <Label htmlFor="salary">Annual Salary (₹) *</Label>
                        <Input
                          id="salary"
                          type="number"
                          value={profile.salary || ''}
                          onChange={(e) => setProfile({ ...profile, salary: parseInt(e.target.value) || 0 })}
                          placeholder="Annual income"
                          required
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Financial Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="monthlyExpense">Monthly Expense (₹)</Label>
                        <Input
                          id="monthlyExpense"
                          type="number"
                          value={profile.monthlyExpense || ''}
                          onChange={(e) => setProfile({ ...profile, monthlyExpense: parseInt(e.target.value) || 0 })}
                          placeholder="Average monthly expense"
                          min="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor="insuranceBudget">Annual Insurance Budget (₹)</Label>
                        <Input
                          id="insuranceBudget"
                          type="number"
                          value={profile.insuranceBudget || ''}
                          onChange={(e) => setProfile({ ...profile, insuranceBudget: parseInt(e.target.value) || 0 })}
                          placeholder="How much can you spend?"
                          min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: ₹{((profile.salary * 0.03) || 0).toLocaleString()} - ₹
                          {((profile.salary * 0.05) || 0).toLocaleString()} (3-5% of salary)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dependents */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Family Dependents</h3>
                    
                    <div>
                      <Label htmlFor="dependentCount">Number of Dependents</Label>
                      <Input
                        id="dependentCount"
                        type="number"
                        value={dependentCount}
                        onChange={(e) => handleDependentCountChange(parseInt(e.target.value) || 0)}
                        placeholder="Spouse, children, parents"
                        min="0"
                        max="10"
                      />
                    </div>

                    {profile.dependents.length > 0 && (
                      <div className="space-y-3 mt-4">
                        <p className="text-sm font-medium text-gray-700">Dependent Ages:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {profile.dependents.map((dep, index) => (
                            <div key={index}>
                              <Label htmlFor={`dep-${index}`} className="text-xs">
                                Dependent {index + 1}
                              </Label>
                              <Input
                                id={`dep-${index}`}
                                type="number"
                                value={dep.age || ''}
                                onChange={(e) => updateDependentAge(index, parseInt(e.target.value) || 0)}
                                placeholder="Age"
                                min="0"
                                max="100"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info Box */}
                  {profile.salary > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                        <div className="text-sm text-blue-900">
                          <p className="font-semibold mb-1">Recommended Coverage</p>
                          <p>
                            Based on your salary, we recommend a sum insured between{' '}
                            <strong>₹{calculateRecommendedCoverage().min.toLocaleString()}</strong> to{' '}
                            <strong>₹{calculateRecommendedCoverage().max.toLocaleString()}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg">
                    Find My Insurance Plans
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Recommendations View
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Recommended Plans for {profile.name}
              </h1>
              <p className="text-gray-600 mt-2">
                {recommendations.length} plans matched based on your profile
              </p>
            </div>
            <Button variant="outline" onClick={() => setStep('profile')}>
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="text-lg font-semibold">{profile.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Annual Salary</p>
                  <p className="text-lg font-semibold">₹{profile.salary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dependents</p>
                  <p className="text-lg font-semibold">{profile.dependents.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="text-lg font-semibold">
                    {profile.insuranceBudget > 0 
                      ? `₹${profile.insuranceBudget.toLocaleString()}`
                      : 'Flexible'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        {recommendations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No matching plans found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your budget or profile details
              </p>
              <Button onClick={() => setStep('profile')}>Update Profile</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Showing {currentIndex + 1}-{Math.min(currentIndex + plansPerView, recommendations.length)} of {recommendations.length} plans
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentIndex + plansPerView >= recommendations.length}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Scrollable Plans Container */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  {visiblePlans.map((plan, index) => {
                    const affordability = calculateAffordability(plan.premium);
                    const isTopPick = currentIndex + index === 0;

                    return (
                      <Card key={plan.id} className={isTopPick ? 'border-2 border-blue-500 shadow-lg' : ''}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {isTopPick && (
                                <Badge className="mb-2 bg-blue-600">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Best Match
                                </Badge>
                              )}
                              <CardTitle className="text-xl">{plan.planName}</CardTitle>
                              <p className="text-sm text-gray-600 mt-1">{plan.provider}</p>
                            </div>
                            <Badge variant="outline">{plan.type}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                      {/* Pricing */}
                      <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Annual Premium</p>
                            <p className="text-2xl font-bold text-blue-600">
                              ₹{plan.premium.toLocaleString()}
                            </p>
                            <p className={`text-xs font-medium mt-1 ${affordability.color}`}>
                              {affordability.status}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Sum Insured</p>
                            <p className="text-2xl font-bold text-gray-900">
                              ₹{(plan.sumInsured / 100000).toFixed(1)}L
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Coverage Amount</p>
                          </div>
                        </div>
                      </div>

                      {/* Coverage Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-600">Copay</span>
                          <span className="font-semibold">{plan.copay}%</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-600">Room Rent</span>
                          <span className="font-semibold">₹{plan.roomRent.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-600">ICU Rent</span>
                          <span className="font-semibold">₹{plan.icuRent.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-600">Ambulance</span>
                          <span className="font-semibold">₹{plan.ambulanceCover.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Hospitalization Coverage */}
                      <div className="flex items-center justify-between text-sm border-t pt-3">
                        <div>
                          <p className="text-gray-600">Pre-Hospitalization</p>
                          <p className="font-semibold">{plan.preHospitalization} days</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Post-Hospitalization</p>
                          <p className="font-semibold">{plan.postHospitalization} days</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <p className="text-sm font-semibold mb-2">Key Features:</p>
                        <ul className="space-y-1">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <Button className="w-full" variant={isTopPick ? 'default' : 'outline'}>
                        Select This Plan
                      </Button>
                    </CardContent>
                  </Card>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
