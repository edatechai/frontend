import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import EarningsSummary from '@/components/earnings/EarningsSummary';
import EarningsCalculator from '@/components/earnings/EarningsCalculator';
import EarningsBySchool from '@/components/earnings/EarningsBySchool';

const EarningsOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings Overview</h1>
          <p className="text-gray-600">Track your earnings, calculate potential income, and manage school payments</p>
        </div>
      </div>

      {/* Earnings Summary */}
      <EarningsSummary />

      {/* Earnings Calculator */}
      <div data-earnings-calculator>
        <EarningsCalculator />
      </div>

      {/* Earnings by School */}
      <EarningsBySchool />
    </div>
  );
};

export default EarningsOverview;
