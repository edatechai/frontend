import React from 'react';
import { Calculator } from 'lucide-react';
import EarningsCalculator from '@/components/earnings/EarningsCalculator';

const EarningsCalculatorPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Calculator className="h-8 w-8 text-orange-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings Calculator</h1>
          <p className="text-gray-600">Calculate your potential earnings based on school tiers and student counts</p>
        </div>
      </div>

      {/* Calculator */}
      <EarningsCalculator />

      {/* Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">How Earnings Are Calculated</h3>
        <div className="space-y-2 text-blue-800">
          <p><strong>Introduction Service:</strong> Flat ₦2,000 fee per school</p>
          <p><strong>Conversion Service:</strong> 20% of first month revenue</p>
          <p><strong>Full Service:</strong> 50% of first month revenue</p>
        </div>
        <div className="mt-4 space-y-1 text-sm text-blue-700">
          <p><strong>Tier Pricing:</strong></p>
          <p>• Tier 1 (Basic): ₦1,000 per student per month</p>
          <p>• Tier 2 (Standard): ₦1,500 per student per month</p>
          <p>• Tier 3 (Premium/Enterprise): ₦2,000 per student per month</p>
        </div>
      </div>
    </div>
  );
};

export default EarningsCalculatorPage;
