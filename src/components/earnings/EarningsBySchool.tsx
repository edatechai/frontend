import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  School, 
  Eye, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useGetAgentEarningsBySchoolQuery } from '@/features/api/apiSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EarningsBySchoolProps {
  className?: string;
}

const EarningsBySchool: React.FC<EarningsBySchoolProps> = ({ className }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEarning, setSelectedEarning] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { data: earningsData, isLoading, error } = useGetAgentEarningsBySchoolQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
    limit: 20
  });

  // Handle the case where earningsData might be undefined or have different structure
  const earnings = earningsData?.data || [];
  const pagination = earningsData?.pagination;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      processing: { color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
      cancelled: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getServiceTypeBadge = (serviceType: string) => {
    const colors = {
      introduction: 'bg-purple-100 text-purple-800',
      conversion: 'bg-orange-100 text-orange-800',
      full_service: 'bg-blue-100 text-blue-800'
    };

    const labels = {
      introduction: 'Introduction',
      conversion: 'Conversion',
      full_service: 'Full Service'
    };

    return (
      <Badge className={colors[serviceType as keyof typeof colors]}>
        {labels[serviceType as keyof typeof labels]}
      </Badge>
    );
  };

  const getTierBadge = (tier: string) => {
    const tierColors = {
      basic: 'bg-gray-100 text-gray-800',
      standard: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={tierColors[tier as keyof typeof tierColors]}>
        Tier {tier === 'basic' ? '1' : tier === 'standard' ? '2' : '3'}
      </Badge>
    );
  };

  const handleViewDetails = (earning: any) => {
    setSelectedEarning(earning);
    setShowDetails(true);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return null; // Gracefully hide the component if API is unavailable
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              Earnings by School
            </CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {!earnings || earnings.length === 0 ? (
            <div className="text-center py-8">
              <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No earnings data found</p>
              <p className="text-sm text-gray-400 mt-1">
                Schools will appear here once they have been assigned and student counts are set
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {earnings.map((earning: any) => (
                <div
                  key={earning._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {earning.schoolId?.accountName || 'Unknown School'}
                        </h3>
                        {getTierBadge(earning.schoolId?.tier)}
                        {getServiceTypeBadge(earning.serviceType)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {earning.studentCount} students
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {formatCurrency(earning.earnedAmount)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(earning.calculatedAt)}
                        </div>
                        <div>
                          {getStatusBadge(earning.status)}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Category: {earning.schoolId?.category || 'N/A'} • 
                        Country: {earning.schoolId?.country || 'N/A'}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(earning)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
              
              {pagination && pagination.pages > 1 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Showing page {pagination.current} of {pagination.pages}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Earnings Details</DialogTitle>
          </DialogHeader>
          
          {selectedEarning && (
            <div className="space-y-6">
              {/* School Info */}
              <div>
                <h3 className="font-semibold mb-2">School Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-medium">{selectedEarning.schoolId?.accountName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <p className="font-medium">{selectedEarning.schoolId?.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tier:</span>
                    <p className="font-medium">{getTierBadge(selectedEarning.schoolId?.tier)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Country:</span>
                    <p className="font-medium">{selectedEarning.schoolId?.country}</p>
                  </div>
                </div>
              </div>

              {/* Earnings Calculation */}
              <div>
                <h3 className="font-semibold mb-2">Earnings Calculation</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Service Type:</span>
                    <span>{getServiceTypeBadge(selectedEarning.serviceType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Student Count:</span>
                    <span className="font-medium">{selectedEarning.studentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tier Price per Student:</span>
                    <span className="font-medium">{formatCurrency(selectedEarning.tierPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Revenue:</span>
                    <span className="font-medium">{formatCurrency(selectedEarning.baseAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission Rate:</span>
                    <span className="font-medium">
                      {selectedEarning.serviceType === 'introduction' 
                        ? 'Flat Fee' 
                        : `${(selectedEarning.commissionRate * 100)}%`
                      }
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Your Earnings:</span>
                    <span className="text-green-600">{formatCurrency(selectedEarning.earnedAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <h3 className="font-semibold mb-2">Payment Status</h3>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusBadge(selectedEarning.status)}
                </div>
                <div className="text-sm text-gray-600">
                  <p>Calculated: {formatDate(selectedEarning.calculatedAt)}</p>
                  {selectedEarning.paidAt && (
                    <p>Paid: {formatDate(selectedEarning.paidAt)}</p>
                  )}
                  {selectedEarning.paymentReference && (
                    <p>Reference: {selectedEarning.paymentReference}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EarningsBySchool;
