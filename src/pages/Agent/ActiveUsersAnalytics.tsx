import React from 'react';
import { Activity } from 'lucide-react';
import ActiveUsersStats from '@/components/analytics/ActiveUsersStats';

const ActiveUsersAnalytics: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Activity className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Users Analytics</h1>
          <p className="text-gray-600">Monitor student engagement and activity across your schools</p>
        </div>
      </div>

      {/* Active Users Stats */}
      <ActiveUsersStats />
    </div>
  );
};

export default ActiveUsersAnalytics;
