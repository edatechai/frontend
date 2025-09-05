import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  School, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Crown,
  Star,
  Building,
  Zap,
  Eye,
  Settings,
  UserCheck,
  UserX,
  ArrowUpDown,
  Filter,
  Search,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  useGetPendingSchoolsQuery,
  useApproveSchoolMutation,
  useRejectSchoolMutation,
  useTransferSchoolMutation,
  useUpdateSchoolTierMutation,
  useGetTierOptionsQuery,
  useGetAllAccountsQuery
} from '@/features/api/apiSlice';
import { toast } from 'sonner';

const SchoolManagement: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [showSchoolDetails, setShowSchoolDetails] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showTierDialog, setShowTierDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [transferAgentId, setTransferAgentId] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // API hooks
  const { data: pendingSchools, isLoading: pendingLoading } = useGetPendingSchoolsQuery();
  const { data: allSchools, isLoading: allSchoolsLoading } = useGetAllAccountsQuery();
  const { data: tierOptions } = useGetTierOptionsQuery();
  const [approveSchool, { isLoading: approving }] = useApproveSchoolMutation();
  const [rejectSchool, { isLoading: rejecting }] = useRejectSchoolMutation();
  const [transferSchool, { isLoading: transferring }] = useTransferSchoolMutation();
  const [updateTier, { isLoading: updatingTier }] = useUpdateSchoolTierMutation();

  const handleApprove = async (withTier = false) => {
    if (!selectedSchool) return;

    try {
      const payload: any = { schoolId: selectedSchool._id };
      if (withTier && selectedTier) {
        payload.tier = selectedTier;
      }

      const response = await approveSchool(payload);
      
      if ('data' in response && response.data?.success) {
        toast.success(`School approved successfully${withTier ? ' with tier assignment' : ''}!`);
        setShowApprovalDialog(false);
        setSelectedSchool(null);
        setSelectedTier('');
      } else {
        toast.error('Failed to approve school');
      }
    } catch (error) {
      toast.error('Error approving school');
    }
  };

  const handleReject = async () => {
    if (!selectedSchool || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      const response = await rejectSchool({
        schoolId: selectedSchool._id,
        reason: rejectionReason
      });
      
      if ('data' in response && response.data?.success) {
        toast.success('School rejected successfully');
        setShowApprovalDialog(false);
        setSelectedSchool(null);
        setRejectionReason('');
      } else {
        toast.error('Failed to reject school');
      }
    } catch (error) {
      toast.error('Error rejecting school');
    }
  };

  const handleUpdateTier = async () => {
    if (!selectedSchool || !selectedTier) {
      toast.error('Please select a tier');
      return;
    }

    try {
      const response = await updateTier({
        schoolId: selectedSchool._id,
        tier: selectedTier
      });
      
      if ('data' in response && response.data?.success) {
        toast.success('School tier updated successfully!');
        setShowTierDialog(false);
        setSelectedSchool(null);
        setSelectedTier('');
      } else {
        toast.error('Failed to update tier');
      }
    } catch (error) {
      toast.error('Error updating tier');
    }
  };

  const handleTransfer = async () => {
    if (!selectedSchool || !transferAgentId) {
      toast.error('Please select an agent');
      return;
    }

    try {
      const response = await transferSchool({
        schoolId: selectedSchool._id,
        newAgentId: transferAgentId
      });
      
      if ('data' in response && response.data?.success) {
        toast.success('School transferred successfully!');
        setShowTransferDialog(false);
        setSelectedSchool(null);
        setTransferAgentId('');
      } else {
        toast.error('Failed to transfer school');
      }
    } catch (error) {
      toast.error('Error transferring school');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
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

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      basic: { color: 'bg-gray-100 text-gray-800', icon: Building, label: 'Basic' },
      standard: { color: 'bg-blue-100 text-blue-800', icon: Star, label: 'Standard' },
      premium: { color: 'bg-purple-100 text-purple-800', icon: Crown, label: 'Premium' },
      enterprise: { color: 'bg-yellow-100 text-yellow-800', icon: Zap, label: 'Enterprise' }
    };

    const config = tierConfig[tier as keyof typeof tierConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Filter schools based on status and search term
  const filteredSchools = allSchools?.data?.filter((school: any) => {
    const matchesStatus = filterStatus === 'all' || school.approvalStatus === filterStatus;
    const matchesSearch = !searchTerm || 
      school.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.createdByAgentName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  const pendingCount = pendingSchools?.data?.length || 0;
  const approvedCount = filteredSchools.filter((s: any) => s.approvalStatus === 'approved').length;
  const rejectedCount = filteredSchools.filter((s: any) => s.approvalStatus === 'rejected').length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <School className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">School Management</h1>
            <p className="text-gray-600">Manage school approvals, tiers, and transfers</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Schools</p>
                <p className="text-2xl font-bold text-blue-600">{filteredSchools.length}</p>
              </div>
              <School className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search schools or agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schools List */}
      <Card>
        <CardHeader>
          <CardTitle>Schools</CardTitle>
        </CardHeader>
        <CardContent>
          {allSchoolsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="text-center py-12">
              <School className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
              <p className="text-gray-500">No schools match your current filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSchools.map((school: any) => (
                <div key={school._id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{school.accountName}</h3>
                        {getStatusBadge(school.approvalStatus)}
                        {getTierBadge(school.tier)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Agent:</span> {school.createdByAgentName || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {school.category}
                        </div>
                        <div>
                          <span className="font-medium">Country:</span> {school.country}
                        </div>
                        <div>
                          <span className="font-medium">Licenses:</span> {school.numberOfLicense}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSchool(school);
                          setShowSchoolDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {school.approvalStatus === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedSchool(school);
                            setShowApprovalDialog(true);
                          }}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSchool(school);
                          setShowTierDialog(true);
                        }}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Tier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSchool(school);
                          setShowTransferDialog(true);
                        }}
                      >
                        <ArrowUpDown className="h-4 w-4 mr-1" />
                        Transfer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* School Details Dialog */}
      <Dialog open={showSchoolDetails} onOpenChange={setShowSchoolDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>School Details</DialogTitle>
          </DialogHeader>
          {selectedSchool && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">School Name</Label>
                  <p className="text-sm">{selectedSchool.accountName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedSchool.approvalStatus)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tier</Label>
                  <div className="mt-1">{getTierBadge(selectedSchool.tier)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Agent</Label>
                  <p className="text-sm">{selectedSchool.createdByAgentName || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm">{selectedSchool.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Country</Label>
                  <p className="text-sm">{selectedSchool.country}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Licenses</Label>
                  <p className="text-sm">{selectedSchool.numberOfLicense}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm">{new Date(selectedSchool.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedSchool.rejectionReason && (
                <div>
                  <Label className="text-sm font-medium">Rejection Reason</Label>
                  <p className="text-sm text-red-600">{selectedSchool.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review School Application</DialogTitle>
            <DialogDescription>
              Review and approve or reject the school application for {selectedSchool?.accountName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Assign Tier (Optional)</Label>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rejection Reason (if rejecting)</Label>
              <Textarea
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleApprove(!!selectedTier)}
                disabled={approving}
                className="flex-1"
              >
                {approving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={rejecting || !rejectionReason.trim()}
                className="flex-1"
              >
                {rejecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tier Update Dialog */}
      <Dialog open={showTierDialog} onOpenChange={setShowTierDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update School Tier</DialogTitle>
            <DialogDescription>
              Update the tier for {selectedSchool?.accountName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select New Tier</Label>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleUpdateTier}
              disabled={updatingTier || !selectedTier}
              className="w-full"
            >
              {updatingTier ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
              Update Tier
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer School</DialogTitle>
            <DialogDescription>
              Transfer {selectedSchool?.accountName} to a different agent
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select New Agent</Label>
              <Input
                placeholder="Enter agent ID"
                value={transferAgentId}
                onChange={(e) => setTransferAgentId(e.target.value)}
              />
            </div>
            <Button
              onClick={handleTransfer}
              disabled={transferring || !transferAgentId}
              className="w-full"
            >
              {transferring ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowUpDown className="h-4 w-4 mr-2" />}
              Transfer School
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolManagement;
