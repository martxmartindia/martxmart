'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  Zap, 
  Wifi, 
  Car, 
  Phone, 
  Building2, 
  Shield, 
  Plane, 
  Train, 
  Bus,
  Plus,
  Send,
  History,
  Bell,
  Settings,
  Wallet,
  TrendingUp,
  Gift,
  Star,
  ArrowRight,
  X,
  Check
} from 'lucide-react';

export default function MartXPay() {
  const [balance] = useState(2450.75);
  const [showAllServices, setShowAllServices] = useState(false);
  const [selectedBNPL, setSelectedBNPL] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [activeService, setActiveService] = useState('');

  const bnplOptions = [
    { 
      name: 'Pay in 3', 
      description: 'Split into 3 interest-free payments', 
      icon: <div className="text-white font-bold">3</div>, 
      rate: '0% interest',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      name: 'Pay Later', 
      description: 'Pay next month with no interest', 
      icon: <Gift className="w-5 h-5 text-white" />, 
      rate: 'No fees',
      color: 'from-purple-500 to-violet-600'
    },
    { 
      name: 'EMI', 
      description: 'Convert to easy monthly installments', 
      icon: <TrendingUp className="w-5 h-5 text-white" />, 
      rate: 'From 12%',
      color: 'from-orange-500 to-red-600'
    },
  ];

  const services = [
    { name: 'Mobile Recharge', icon: <Smartphone className="w-6 h-6" />, popular: true, color: 'bg-blue-500' },
    { name: 'Electricity', icon: <Zap className="w-6 h-6" />, popular: true, color: 'bg-yellow-500' },
    { name: 'DTH Recharge', icon: <Wifi className="w-6 h-6" />, popular: true, color: 'bg-purple-500' },
    { name: 'Gas Cylinder', icon: <Car className="w-6 h-6" />, popular: false, color: 'bg-red-500' },
    { name: 'Credit Card', icon: <CreditCard className="w-6 h-6" />, popular: false, color: 'bg-indigo-500' },
    { name: 'Postpaid', icon: <Phone className="w-6 h-6" />, popular: false, color: 'bg-green-500' },
    { name: 'Loan EMI', icon: <Building2 className="w-6 h-6" />, popular: false, color: 'bg-gray-600' },
    { name: 'Insurance', icon: <Shield className="w-6 h-6" />, popular: false, color: 'bg-teal-500' },
  ];

  const travelOptions = [
    { name: 'Flights', icon: <Plane className="w-8 h-8" />, offer: 'Up to 25% off', color: 'from-sky-500 to-blue-600' },
    { name: 'Trains', icon: <Train className="w-8 h-8" />, offer: 'Book now', color: 'from-green-500 to-emerald-600' },
    { name: 'Buses', icon: <Bus className="w-8 h-8" />, offer: 'Safe travel', color: 'from-orange-500 to-red-600' }
  ];

  const handleServiceClick = (service: string) => {
    setActiveService(service);
    setTimeout(() => setActiveService(''), 200);
  };

  const handleBNPLSelect = (option: string) => {
    setSelectedBNPL(selectedBNPL === option ? '' : option);
  };

  const handleAddMoney = () => {
    if (addAmount) {
      console.log(`Adding ₹${addAmount} to wallet`);
      setShowAddMoney(false);
      setAddAmount('');
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MartX Pay
                </h1>
                <p className="text-xs text-gray-500">Digital Wallet</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  3
                </span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Enhanced Balance Card */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="xl:col-span-3 relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 rounded-3xl text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-blue-100 mb-2 font-medium">Available Balance</p>
                  <p className="text-5xl font-bold mb-2">₹{balance.toLocaleString()}</p>
                  <p className="text-blue-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    +12.5% this month
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                    <Wallet className="w-8 h-8" />
                  </div>
                  <div className="text-sm text-blue-100">
                    <p>Rewards</p>
                    <p className="font-bold">₹125</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddMoney(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-colors font-semibold shadow-lg">
                  <Plus className="w-4 h-4" />
                  Add Money
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 border border-white/30 rounded-2xl hover:bg-white/30 transition-colors font-semibold">
                  <Send className="w-4 h-4" />
                  Send
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 border border-white/30 rounded-2xl hover:bg-white/30 transition-colors font-semibold">
                  <History className="w-4 h-4" />
                  History
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Quick Loans</p>
                    <p className="text-sm text-gray-500">Instant approval</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">My Cards</p>
                    <p className="text-sm text-gray-500">3 cards saved</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced BNPL Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Buy Now, Pay Later</h2>
              <p className="text-gray-600">Flexible payment solutions for your needs</p>
            </div>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
              Learn More <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bnplOptions.map((option, index) => (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 ${
                  selectedBNPL === option.name 
                    ? 'border-blue-500 bg-blue-50 shadow-xl' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                }`}
                onClick={() => handleBNPLSelect(option.name)}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{option.name}</h3>
                    <p className="text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full inline-block">
                      {option.rate}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">{option.description}</p>
                <AnimatePresence>
                  {selectedBNPL === option.name && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-blue-200 pt-4">
                      <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        Get Started
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Enhanced Services Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recharge & Bill Payment</h2>
              <p className="text-gray-600">Quick payments for all your needs</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowAllServices(!showAllServices)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors font-semibold">
              {showAllServices ? 'Show Less' : 'Show More'}
              <motion.div
                animate={{ rotate: showAllServices ? 180 : 0 }}
                transition={{ duration: 0.2 }}>
                <ArrowRight className="w-4 h-4 rotate-90" />
              </motion.div>
            </motion.button>
          </div>
          
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
            layout>
            <AnimatePresence>
              {services
                .filter((_, index) => showAllServices || index < 6)
                .map((service, index) => (
                <motion.div 
                  key={service.name}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative cursor-pointer group ${activeService === service.name ? 'z-10' : ''}`}
                  onClick={() => handleServiceClick(service.name)}>
                  {service.popular && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full z-20 font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Hot
                    </div>
                  )}
                  <div className={`bg-white p-6 rounded-3xl shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200 ${
                    activeService === service.name ? 'ring-2 ring-blue-500 shadow-2xl' : ''
                  }`}>
                    <div className={`w-12 h-12 ${service.color} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto shadow-lg`}>
                      {service.icon}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-center mt-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.section>

        {/* Enhanced Travel Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Travel & Booking</h2>
              <p className="text-gray-600">Plan your perfect journey</p>
            </div>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
              Explore All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {travelOptions.map((option, index) => (
              <motion.div 
                key={option.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -6 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 group"
                onClick={() => handleServiceClick(option.name)}>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-3xl flex items-center justify-center text-white shadow-xl`}>
                    {option.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-bold bg-green-100 px-3 py-2 rounded-full">
                      {option.offer}
                    </p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{option.name}</h3>
                <p className="text-gray-600 mb-4">Quick & secure booking</p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
                  Book Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Enhanced Add Money Modal */}
      <AnimatePresence>
        {showAddMoney && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddMoney(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add Money</h3>
                <button 
                  onClick={() => setShowAddMoney(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Enter Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                    <input 
                      type="number" 
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      placeholder="0" 
                      className="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold" 
                    />
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Quick Select</p>
                  <div className="grid grid-cols-2 gap-3">
                    {quickAmounts.map(amount => (
                      <motion.button 
                        key={amount}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setAddAmount(amount.toString())}
                        className={`py-3 px-4 border-2 rounded-2xl font-semibold transition-all ${
                          addAmount === amount.toString() 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}>
                        ₹{amount.toLocaleString()}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowAddMoney(false)}
                    className="flex-1 py-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 font-semibold text-gray-700 transition-colors">
                    Cancel
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddMoney}
                    disabled={!addAmount}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Money
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};