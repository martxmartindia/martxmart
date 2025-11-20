import React from 'react';
import { Check, Star, Crown } from 'lucide-react';

const Membership = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      features: [
        'Up to 5 active listings',
        'Basic analytics',
        'Standard support',
        'Community access'
      ]
    },
    {
      name: 'Professional',
      price: '₹3,999/month',
      features: [
        'Up to 50 active listings',
        'Advanced analytics',
        'Priority support',
        'Featured listings',
        'Custom branding',
        'Verified seller badge'
      ]
    },
    {
      name: 'Enterprise',
      price: '₹15,999/month',
      features: [
        'Unlimited active listings',
        'Real-time analytics',
        'Dedicated account manager',
        'Premium placement',
        'API access',
        'Tailor-made solutions'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Premium Seller Plans for India</h1>
        <p className="text-xl text-gray-600">Find the perfect plan to grow your business</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, index) => (
          <div key={index} className={`bg-white p-8 rounded-lg shadow-lg ${index === 1 ? 'border-2 border-blue-500' : ''}`}>
            <div className="text-center mb-6">
              {index === 0 && <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />}
              {index === 1 && <Crown className="h-12 w-12 text-blue-600 mx-auto mb-4" />}
              {index === 2 && <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-blue-600">{plan.price}</p>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-lg ${
              index === 1 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}>
              Select Plan
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
        <p className="mb-6">Connect with our sales experts for a plan crafted just for you</p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
          Contact Sales
        </button>
      </div>
    </div>
  );
};

export default Membership;
