'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, DollarSign, TrendingUp, CheckCircle, Info, ArrowRight, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';
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

    const allPlans = insurancePlans as InsurancePlan[];
    const selectedPlans = allPlans.slice(0, 5);

    setRecommendations(selectedPlans);
    setStep('recommendations');
    setCurrentIndex(0);
    toast.success(`Found ${selectedPlans.length} insurance plans for you! 🛡️`);
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
    const minCoverage = profile.salary * 5;
    const maxCoverage = profile.salary * 10;
    return { min: minCoverage, max: maxCoverage };
  };

  const calculateAffordability = (premium: number) => {
    const annualPremium = premium;
    const affordableLimit = profile.salary * 0.05;
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
      <div className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-12"
          >
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-4 -right-4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative backdrop-blur-sm bg-card/80 rounded-3xl p-8 border border-primary/20 shadow-2xl text-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block bg-primary/10 p-4 rounded-2xl mb-4"
              >
                <Shield className="h-12 w-12 text-primary" />
              </motion.div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                Find Your Perfect Insurance 🛡️
              </h1>
              <p className="text-muted-foreground text-lg flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5" />
                Tell us about yourself and we'll recommend the best plans
              </p>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-card/80 rounded-3xl border border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-primary" />
                  Your Profile Information ✨
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" fill="currentColor" />
                      Personal Details
                    </h3>
                    
                    <div>
                      <Label htmlFor="name" className="text-base font-semibold">Full Name *</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                        className="h-12 rounded-2xl border-primary/20 mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age" className="text-base font-semibold">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          value={profile.age || ''}
                          onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                          placeholder="Your age"
                          required
                          min="18"
                          max="100"
                          className="h-12 rounded-2xl border-primary/20 mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="salary" className="text-base font-semibold">Annual Salary (₹) *</Label>
                        <Input
                          id="salary"
                          type="number"
                          value={profile.salary || ''}
                          onChange={(e) => setProfile({ ...profile, salary: parseInt(e.target.value) || 0 })}
                          placeholder="Annual income"
                          required
                          min="0"
                          className="h-12 rounded-2xl border-primary/20 mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Financial Details 💰
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="monthlyExpense" className="text-base font-semibold">Monthly Expense (₹)</Label>
                        <Input
                          id="monthlyExpense"
                          type="number"
                          value={profile.monthlyExpense || ''}
                          onChange={(e) => setProfile({ ...profile, monthlyExpense: parseInt(e.target.value) || 0 })}
                          placeholder="Average monthly expense"
                          min="0"
                          className="h-12 rounded-2xl border-primary/20 mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="insuranceBudget" className="text-base font-semibold">Annual Insurance Budget (₹)</Label>
                        <Input
                          id="insuranceBudget"
                          type="number"
                          value={profile.insuranceBudget || ''}
                          onChange={(e) => setProfile({ ...profile, insuranceBudget: parseInt(e.target.value) || 0 })}
                          placeholder="How much can you spend?"
                          min="0"
                          className="h-12 rounded-2xl border-primary/20 mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Recommended: ₹{((profile.salary * 0.03) || 0).toLocaleString()} - ₹{((profile.salary * 0.05) || 0).toLocaleString()} (3-5% of salary)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dependents */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Family Dependents 👨‍👩‍👧‍👦
                    </h3>
                    
                    <div>
                      <Label htmlFor="dependentCount" className="text-base font-semibold">Number of Dependents</Label>
                      <Input
                        id="dependentCount"
                        type="number"
                        value={dependentCount}
                        onChange={(e) => handleDependentCountChange(parseInt(e.target.value) || 0)}
                        placeholder="Spouse, children, parents"
                        min="0"
                        max="10"
                        className="h-12 rounded-2xl border-primary/20 mt-2"
                      />
                    </div>

                    {profile.dependents.length > 0 && (
                      <div className="space-y-3 mt-4">
                        <p className="text-sm font-semibold">Dependent Ages:</p>
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
                                className="h-10 rounded-xl border-primary/20 mt-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info Box */}
                  {profile.salary > 0 && (
                    <div className="bg-linear-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                        <div className="text-sm text-blue-900 dark:text-blue-100">
                          <p className="font-semibold mb-1">💡 Recommended Coverage</p>
                          <p>
                            Based on your salary, we recommend a sum insured between{' '}
                            <strong>₹{calculateRecommendedCoverage().min.toLocaleString()}</strong> to{' '}
                            <strong>₹{calculateRecommendedCoverage().max.toLocaleString()}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="w-full h-14 text-lg rounded-2xl gap-2" size="lg">
                      Find My Insurance Plans
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
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
    <div className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative backdrop-blur-sm bg-card/80 rounded-3xl p-6 border border-primary/20 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Recommended Plans for {profile.name} 🛡️
                </h1>
                <p className="text-muted-foreground mt-2">
                  {recommendations.length} plans matched based on your profile ✨
                </p>
              </div>
              <Button variant="outline" onClick={() => setStep('profile')} className="rounded-2xl">
                Edit Profile
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="backdrop-blur-sm bg-card/80 rounded-3xl border border-primary/20 shadow-xl">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/30 p-4 rounded-2xl">
                  <p className="text-sm text-muted-foreground mb-1">Age</p>
                  <p className="text-xl font-bold">{profile.age} years</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl">
                  <p className="text-sm text-muted-foreground mb-1">Annual Salary</p>
                  <p className="text-xl font-bold">₹{profile.salary.toLocaleString()}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl">
                  <p className="text-sm text-muted-foreground mb-1">Dependents</p>
                  <p className="text-xl font-bold">{profile.dependents.length}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl">
                  <p className="text-sm text-muted-foreground mb-1">Budget</p>
                  <p className="text-xl font-bold">
                    {profile.insuranceBudget > 0 ? `₹${profile.insuranceBudget.toLocaleString()}` : 'Flexible'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plans Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            Showing {currentIndex + 1}-{Math.min(currentIndex + plansPerView, recommendations.length)} of {recommendations.length} plans
          </div>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentIndex === 0} className="rounded-xl">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="icon" onClick={handleNext} disabled={currentIndex + plansPerView >= recommendations.length} className="rounded-xl">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Plans Grid */}
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
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className={`backdrop-blur-sm bg-card/80 rounded-3xl shadow-xl h-full ${isTopPick ? 'border-2 border-primary' : 'border border-primary/20'}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {isTopPick && (
                            <Badge className="mb-2 bg-primary">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Best Match ✨
                            </Badge>
                          )}
                          <CardTitle className="text-xl">{plan.planName}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{plan.provider}</p>
                        </div>
                        <Badge variant="outline" className="rounded-xl">{plan.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Pricing */}
                      <div className="bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-primary/20">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Annual Premium</p>
                            <p className="text-2xl font-bold text-primary">₹{plan.premium.toLocaleString()}</p>
                            <p className={`text-xs font-medium mt-1 ${affordability.color}`}>{affordability.status}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Sum Insured</p>
                            <p className="text-2xl font-bold">₹{(plan.sumInsured / 100000).toFixed(1)}L</p>
                            <p className="text-xs text-muted-foreground mt-1">Coverage Amount</p>
                          </div>
                        </div>
                      </div>

                      {/* Coverage Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                          <span className="text-muted-foreground">Copay</span>
                          <span className="font-semibold">{plan.copay}%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                          <span className="text-muted-foreground">Room Rent</span>
                          <span className="font-semibold">₹{plan.roomRent.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                          <span className="text-muted-foreground">ICU Rent</span>
                          <span className="font-semibold">₹{plan.icuRent.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                          <span className="text-muted-foreground">Ambulance</span>
                          <span className="font-semibold">₹{plan.ambulanceCover.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Hospitalization Coverage */}
                      <div className="flex items-center justify-between text-sm border-t border-primary/10 pt-3">
                        <div>
                          <p className="text-muted-foreground">Pre-Hosp.</p>
                          <p className="font-semibold">{plan.preHospitalization} days</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Post-Hosp.</p>
                          <p className="font-semibold">{plan.postHospitalization} days</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <p className="text-sm font-semibold mb-2">Key Features:</p>
                        <ul className="space-y-1">
                          {plan.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className={`w-full rounded-2xl ${isTopPick ? '' : 'variant-outline'}`} variant={isTopPick ? 'default' : 'outline'}>
                          Select This Plan 🛡️
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
