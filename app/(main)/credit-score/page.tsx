'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, TrendingUp, Star, Check, Download, RefreshCw, Bell, CreditCard, 
  Lock, Zap, Crown, Gift, AlertTriangle, Phone, Mail, FileText, Eye, EyeOff,
  User, Calendar, Smartphone, IdCard, ArrowRight, X, Settings, Trash2,
  BarChart3, PieChart, Activity, DollarSign, Clock, AlertCircle, ChevronRight,
  Target, Award, Briefcase, Home, Car, GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';

export default function CreditScore() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showScore, setShowScore] = useState(false);
  const [consent, setConsent] = useState(false);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [userForm, setUserForm] = useState({
    name: '',
    pan: '',
    mobile: '',
    dob: ''
  });
  const [creditReport, setCreditReport] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('creditScoreData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setCurrentScore(data.score);
      setUserForm(data.userInfo);
      if (data.subscription) {
        setSubscription(data.subscription);
        setCurrentStep(4);
      } else if (data.score) {
        setCurrentStep(3);
      }
    }
  }, []);

  const saveToLocalStorage = (data: any) => {
    const existingData = JSON.parse(localStorage.getItem('creditScoreData') || '{}');
    const updatedData = { ...existingData, ...data };
    localStorage.setItem('creditScoreData', JSON.stringify(updatedData));
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      tagline: 'One-Time Use',
      price: 99,
      originalPrice: 149,
      duration: 'Single Report',
      color: 'from-gray-500 to-gray-600',
      features: ['One-time credit score access', 'Basic credit report', 'Email support'],
      popular: false,
      savings: 34
    },
    {
      id: 'basic',
      name: 'Basic',
      tagline: 'Monthly Plan',
      price: 129,
      originalPrice: 199,
      duration: '1 Month',
      color: 'from-blue-500 to-blue-600',
      features: ['Monthly refresh', 'Credit tips', 'Email alerts', 'Score tracking'],
      popular: false,
      savings: 35
    },
    {
      id: 'standard',
      name: 'Standard',
      tagline: 'Trending Now',
      price: 299,
      originalPrice: 499,
      duration: '3 Months',
      color: 'from-purple-500 to-purple-600',
      features: ['Score refresh every 30 days', 'Real-time alerts', 'Credit improvement tips', 'Fraud monitoring'],
      popular: true,
      badge: 'Most Popular',
      savings: 40
    },
    {
      id: 'premium',
      name: 'Premium',
      tagline: 'Best Value',
      price: 499,
      originalPrice: 899,
      duration: '6 Months',
      color: 'from-orange-500 to-red-600',
      features: ['Monthly reports', 'Fraud alerts', 'Pre-approved offers', 'Credit advisor chat', 'Loan recommendations'],
      popular: true,
      badge: 'Best Value',
      savings: 44
    },
    {
      id: 'elite',
      name: 'Elite',
      tagline: 'Premium Experience',
      price: 800,
      originalPrice: 1499,
      duration: '12 Months',
      color: 'from-yellow-500 to-orange-600',
      features: ['Unlimited refreshes', 'Dedicated advisor', 'Fraud protection', 'Exclusive insights', 'Priority support', 'Investment advice'],
      popular: true,
      badge: 'Premium',
      savings: 47
    }
  ];

  const handleCheckScore = async () => {
    if (!userForm.name || !userForm.pan || !userForm.mobile || !consent) {
      toast.error('Please fill all fields and provide consent');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/credit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_score',
          ...userForm,
          consent
        })
      });

      const data = await response.json();
      
      if (data.otpRequired) {
        setSessionId(data.sessionId);
        setShowOTPModal(true);
        toast.info('OTP sent to your mobile number');
      } else if (data.success) {
        setCurrentScore(data.creditScore);
        setShowScore(true);
        setCurrentStep(3);
        saveToLocalStorage({ score: data.creditScore, userInfo: userForm });
        toast.success('Credit score fetched successfully');
      }
    } catch (error) {
      toast.error('Failed to fetch credit score');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    try {
      const response = await fetch('/api/credit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_otp',
          sessionId,
          otp
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowOTPModal(false);
        const scoreResponse = await fetch('/api/credit-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'check_score',
            ...userForm,
            consent,
            otpVerified: true
          })
        });

        const scoreData = await scoreResponse.json();
        if (scoreData.success) {
          setCurrentScore(scoreData.creditScore);
          setShowScore(true);
          setCurrentStep(3);
          saveToLocalStorage({ score: scoreData.creditScore, userInfo: userForm });
          toast.success('Credit score fetched successfully');
        }
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      toast.error('OTP verification failed');
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      const paymentId = `pay_${Date.now()}`;
      
      const response = await fetch('/api/credit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'subscribe',
          userId: `user_${userForm.pan}`,
          planId: selectedPlan,
          paymentId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const subscriptionData = { ...data, planId: selectedPlan };
        setSubscription(subscriptionData);
        setCurrentStep(4);
        saveToLocalStorage({ subscription: subscriptionData });
        toast.success('Subscription activated successfully');
      }
    } catch (error) {
      toast.error('Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await fetch('/api/credit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_report',
          userId: `user_${userForm.pan}`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setCreditReport(data.report);
        toast.success('Credit report generated successfully');
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                MartX Credit Score
              </h1>
              <p className="text-gray-600 mt-1">Powered by Experian • CRIF • CIBIL</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">RBI Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { step: 1, title: 'Dashboard', icon: BarChart3 },
              { step: 2, title: 'Check Score', icon: Shield },
              { step: 3, title: 'Choose Plan', icon: Star },
              { step: 4, title: 'Download Report', icon: Download }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= item.step 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= item.step ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {item.title}
                </span>
                {index < 3 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Dashboard */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8">
            
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Know Your Credit Score
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Get your free credit score and detailed report. Monitor your credit health and improve your financial future.
              </p>
              <button
                onClick={() => setCurrentStep(2)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto">
                <Shield className="w-5 h-5" />
                Check Your Credit Score
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { icon: Shield, title: 'Secure & Safe', desc: 'Bank-grade security for your data', color: 'bg-blue-100 text-blue-600' },
                { icon: Zap, title: 'Instant Access', desc: 'Get your score in seconds', color: 'bg-yellow-100 text-yellow-600' },
                { icon: TrendingUp, title: 'Track Progress', desc: 'Monitor score improvements', color: 'bg-green-100 text-green-600' },
                { icon: Bell, title: 'Smart Alerts', desc: 'Get notified of changes', color: 'bg-purple-100 text-purple-600' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Credit Score Ranges */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Credit Score Ranges</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { range: '300-549', status: 'Poor', color: 'bg-red-100 text-red-600 border-red-200', desc: 'Needs immediate attention' },
                  { range: '550-649', status: 'Fair', color: 'bg-yellow-100 text-yellow-600 border-yellow-200', desc: 'Room for improvement' },
                  { range: '650-749', status: 'Good', color: 'bg-blue-100 text-blue-600 border-blue-200', desc: 'Above average score' },
                  { range: '750-850', status: 'Excellent', color: 'bg-green-100 text-green-600 border-green-200', desc: 'Outstanding credit' }
                ].map((item, index) => (
                  <div key={index} className={`p-4 rounded-2xl border-2 ${item.color} text-center`}>
                    <div className="text-2xl font-bold mb-2">{item.range}</div>
                    <div className="font-semibold mb-1">{item.status}</div>
                    <div className="text-sm opacity-80">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Home, title: 'Home Loans', desc: 'Better rates with good credit', benefits: ['Lower interest rates', 'Higher loan amounts', 'Faster approvals'] },
                { icon: Car, title: 'Auto Loans', desc: 'Drive your dream car', benefits: ['Competitive rates', 'Flexible terms', 'Quick processing'] },
                { icon: CreditCard, title: 'Credit Cards', desc: 'Premium cards & rewards', benefits: ['Higher credit limits', 'Reward programs', 'Premium benefits'] }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {item.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Check Score Form */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Check Your Credit Score</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={userForm.dob}
                        onChange={(e) => setUserForm({...userForm, dob: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={userForm.mobile}
                        onChange={(e) => setUserForm({...userForm, mobile: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter 10-digit mobile number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card</label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={userForm.pan}
                        onChange={(e) => setUserForm({...userForm, pan: e.target.value.toUpperCase()})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ABCDE1234F"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Secure & Compliant</div>
                    <div className="text-sm text-gray-600">Your data is protected with bank-grade security and RBI compliance</div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I authorize MartXPay to fetch my credit score from bureau and agree to the{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                  <button
                    onClick={handleCheckScore}
                    disabled={loading || !consent}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Shield className="w-5 h-5" />
                    )}
                    {loading ? 'Checking Score...' : 'Check Credit Score'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Score Display & Plan Selection */}
        {currentStep === 3 && currentScore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8">
            
            {/* Score Display */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Credit Score</h2>
                <div className="relative inline-block">
                  <div className="w-48 h-48 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="url(#gradient)" 
                        strokeWidth="8"
                        strokeDasharray={`${(currentScore / 850) * 283} 283`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(currentScore)}`}>
                          {showScore ? currentScore : '***'}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">out of 850</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowScore(!showScore)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                    {showScore ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className={`text-xl font-semibold ${getScoreColor(currentScore)} mt-4`}>
                  {getScoreStatus(currentScore)}
                </div>
                <div className="text-sm text-gray-500">Last updated: Today</div>
              </div>
            </div>

            {/* Pricing Plans */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Unlock detailed reports and monitoring features with our subscription plans
                </p>
                <div className="text-sm text-gray-500 mt-2">*All prices exclusive of 18% GST</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className={`relative bg-white rounded-3xl shadow-lg border-2 transition-all duration-300 ${
                      selectedPlan === plan.id ? 'border-blue-500 shadow-xl' : 'border-gray-200 hover:border-gray-300'
                    } ${plan.popular ? 'ring-2 ring-blue-500 ring-opacity-20' : ''}`}>
                    
                    {plan.badge && (
                      <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r ${plan.color} text-white text-xs font-bold rounded-full flex items-center gap-1`}>
                        {plan.badge === 'Best Value' && <Crown className="w-3 h-3" />}
                        {plan.badge === 'Most Popular' && <Star className="w-3 h-3" />}
                        {plan.badge === 'Premium' && <Award className="w-3 h-3" />}
                        {plan.badge}
                      </div>
                    )}

                    {plan.savings && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        Save {plan.savings}%
                      </div>
                    )}

                    <div className="p-6">
                      <div className="text-center mb-6">
                        <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center`}>
                          {plan.id === 'starter' && <Shield className="w-8 h-8 text-white" />}
                          {plan.id === 'basic' && <RefreshCw className="w-8 h-8 text-white" />}
                          {plan.id === 'standard' && <TrendingUp className="w-8 h-8 text-white" />}
                          {plan.id === 'premium' && <Star className="w-8 h-8 text-white" />}
                          {plan.id === 'elite' && <Crown className="w-8 h-8 text-white" />}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{plan.tagline}</p>
                        <div className="mb-2">
                          <div className="text-3xl font-bold text-gray-900">₹{plan.price}</div>
                          {plan.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">₹{plan.originalPrice}</div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{plan.duration}</div>
                      </div>

                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`w-full py-3 rounded-2xl font-semibold transition-all duration-200 ${
                          selectedPlan === plan.id
                            ? `bg-gradient-to-r ${plan.color} text-white shadow-lg`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>
                        {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {selectedPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <div className="max-w-2xl mx-auto text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Purchase</h3>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedPlan('')}
                        className="flex-1 py-3 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                        Change Plan
                      </button>
                      <button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                        {loading ? 'Processing...' : 'Subscribe Now'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 4: Download Report */}
        {currentStep === 4 && subscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8">
            
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription Activated!</h2>
              <p className="text-gray-600 mb-6">Your {plans.find(p => p.id === subscription.planId)?.name} plan is now active</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <div className="text-2xl font-bold text-blue-600">{currentScore}</div>
                  <div className="text-sm text-gray-600">Your Credit Score</div>
                </div>
                <div className="p-4 bg-green-50 rounded-2xl">
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <div className="text-sm text-gray-600">Subscription Status</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl">
                  <div className="text-2xl font-bold text-purple-600">{plans.find(p => p.id === subscription.planId)?.duration}</div>
                  <div className="text-sm text-gray-600">Plan Duration</div>
                </div>
              </div>

              <button
                onClick={handleDownloadReport}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto">
                <Download className="w-5 h-5" />
                Download Detailed Report
              </button>
            </div>

            {creditReport && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Credit Report Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{creditReport.personalInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">PAN:</span>
                        <span className="font-medium">{creditReport.personalInfo.pan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mobile:</span>
                        <span className="font-medium">{creditReport.personalInfo.mobile}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Credit Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Accounts:</span>
                        <span className="font-medium">{creditReport.creditHistory.totalAccounts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Accounts:</span>
                        <span className="font-medium">{creditReport.creditHistory.activeAccounts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Credit Utilization:</span>
                        <span className="font-medium">{creditReport.creditUtilization}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* OTP Modal */}
        <AnimatePresence>
          {showOTPModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h3>
                  <p className="text-gray-600">Enter the 6-digit code sent to your mobile</p>
                  <p className="text-sm text-blue-600 mt-2">Use: 123456 for demo</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full p-4 text-center text-2xl font-bold border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={6}
                  />
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowOTPModal(false)}
                      className="flex-1 py-3 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button
                      onClick={handleOTPVerification}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors">
                      Verify
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}