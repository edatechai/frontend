import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, DollarSign, Building2, Loader2 } from 'lucide-react';
import { useGetAgentEarningsSummaryQuery } from '@/features/api/apiSlice';

interface EarningsSummaryProps {
  className?: string;
}

const EarningsSummary: React.FC<EarningsSummaryProps> = ({ className }) => {
  const { data: summary, isLoading, error } = useGetAgentEarningsSummaryQuery();

  // Skip rendering if we don't have the necessary data and there's an error
  if (error && !summary) {
    return null; // Gracefully hide the component if API is unavailable
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-red-500">Failed to load earnings summary</p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      title: "Current Month",
      value: summary?.data?.currentMonth?.amount || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      count: summary?.data?.currentMonth?.count || 0
    },
    {
      title: "Pending Payments",
      value: summary?.data?.pending?.amount || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      count: summary?.data?.pending?.count || 0
    },
    {
      title: "Total Paid",
      value: summary?.data?.paid?.amount || 0,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      count: summary?.data?.paid?.count || 0
    },
    {
      title: "Lifetime Earnings",
      value: summary?.data?.total?.amount || 0,
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      count: summary?.data?.total?.count || 0
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stat.value)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.count} {stat.count === 1 ? 'transaction' : 'transactions'}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EarningsSummary;
