import React, { useMemo, useState } from 'react';
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { School, Loader, Eye, Calendar, MapPin, Mail, Phone, Globe, Building, Clock, CheckCircle, XCircle, Crown, Star, Zap, Plus, Activity } from "lucide-react";
import countryList from "react-select-country-list";
import { toast } from "sonner";
import { useCreateSchoolByAgentMutation, useGetSchoolsByAgentQuery } from "@/features/api/apiSlice";

const SchoolsManagement: React.FC = () => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const options = useMemo(() => countryList().getData(), []);
  
  // School creation state
  const [showCreateSchoolForm, setShowCreateSchoolForm] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [contactFullName, setContactFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("organization");
  const [category, setCategory] = useState("");
  const [numberOfLicense, setNumberOfLicense] = useState("");
  const [licenseStatus, setLicenseStatus] = useState("active");
  const [country, setCountry] = useState<(typeof options)[0] | null>(null);

  // School details state
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [showSchoolDetails, setShowSchoolDetails] = useState(false);

  const [createSchoolByAgent, { isLoading }] = useCreateSchoolByAgentMutation();
  const { data: schools, isLoading: schoolsLoading, error: schoolsError } = useGetSchoolsByAgentQuery(undefined);

  const handleSubmit = async () => {
    const payload = {
      accountName,
      contactFullName,
      email,
      role,
      category,
      numberOfLicense: parseInt(numberOfLicense),
      licenseStatus,
      country: country?.label || "",
    };

    try {
      const response = await createSchoolByAgent(payload);
      
      if ('data' in response && response.data?.success) {
        toast.success("School created successfully! It will be reviewed by super admin.");
        
        // Reset form
        setAccountName("");
        setContactFullName("");
        setEmail("");
        setRole("organization");
        setCategory("");
        setNumberOfLicense("");
        setLicenseStatus("active");
        setCountry(null);
        setShowCreateSchoolForm(false);
      } else {
        const errorMessage = 'data' in response.error ? (response.error as any).data?.message : 'An error occurred';
        toast.error(errorMessage || "Failed to create school");
      }
    } catch (error) {
      console.error("Error creating school:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleViewSchoolDetails = (school: any) => {
    setSelectedSchool(school);
    setShowSchoolDetails(true);
  };

  const getApprovalStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { color: 'text-green-700 bg-green-100', icon: CheckCircle },
      rejected: { color: 'text-red-700 bg-red-100', icon: XCircle },
      pending: { color: 'text-yellow-700 bg-yellow-100', icon: Clock }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      basic: { color: 'text-gray-700 bg-gray-100', icon: Building, label: 'Basic' },
      standard: { color: 'text-blue-700 bg-blue-100', icon: Star, label: 'Standard' },
      premium: { color: 'text-purple-700 bg-purple-100', icon: Crown, label: 'Premium' },
      enterprise: { color: 'text-yellow-700 bg-yellow-100', icon: Zap, label: 'Enterprise' }
    };

    const config = tierConfig[tier as keyof typeof tierConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <School className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schools Management</h1>
            <p className="text-gray-600">Create and manage your school organizations</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowCreateSchoolForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create School
        </Button>
      </div>

      {/* Schools Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Schools</p>
                <p className="text-2xl font-bold">{schools?.count || 0}</p>
              </div>
              <School className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {schools?.data?.filter((school: any) => school.approvalStatus === 'approved').length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {schools?.data?.filter((school: any) => school.approvalStatus === 'pending').length || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-blue-600">
                  {schools?.data?.filter((school: any) => school.isActive).length || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schools List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Schools</CardTitle>
        </CardHeader>
        <CardContent>
          {schoolsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          ) : schoolsError ? (
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load schools</p>
            </div>
          ) : !schools?.data || schools.data.length === 0 ? (
            <div className="text-center py-12">
              <School className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No schools yet</h3>
              <p className="text-gray-500 mb-6">Create your first school to get started</p>
              <Button onClick={() => setShowCreateSchoolForm(true)}>
                Create School
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {schools.data.map((school: any) => (
                <div key={school._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{school.accountName}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {school.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {school.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(school.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {getApprovalStatusBadge(school.approvalStatus)}
                        {getTierBadge(school.tier)}
                        <span className="text-sm text-gray-600">
                          {school.numberOfLicense} licenses
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleViewSchoolDetails(school)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create School Form */}
      <Sheet open={showCreateSchoolForm} onOpenChange={setShowCreateSchoolForm}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create New School</SheetTitle>
            <SheetDescription>
              Create a new school organization. It will be reviewed by a super admin before activation.
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">School Name</Label>
              <Input
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter school name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactFullName">Contact Person</Label>
              <Input
                id="contactFullName"
                value={contactFullName}
                onChange={(e) => setContactFullName(e.target.value)}
                placeholder="Enter contact person name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Primary School, Secondary School"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfLicense">Number of Licenses</Label>
              <Input
                id="numberOfLicense"
                type="number"
                value={numberOfLicense}
                onChange={(e) => setNumberOfLicense(e.target.value)}
                placeholder="Enter number of licenses needed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={country?.label || ""}
                onChange={(e) => {
                  const selected = options.find(option => option.label === e.target.value) || null;
                  setCountry(selected);
                }}
              >
                <option value="">Select a country</option>
                {options.map((option) => (
                  <option key={option.value} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !accountName || !contactFullName || !email}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create School"
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* School Details Dialog */}
      <Dialog open={showSchoolDetails} onOpenChange={setShowSchoolDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>School Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedSchool?.accountName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSchool && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Organization Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedSchool.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{selectedSchool.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country:</span>
                      <span className="font-medium">{selectedSchool.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{new Date(selectedSchool.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact Person:</span>
                      <span className="font-medium">{selectedSchool.contactFullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedSchool.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Status & Approval</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approval Status:</span>
                    {getApprovalStatusBadge(selectedSchool.approvalStatus)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tier:</span>
                    {getTierBadge(selectedSchool.tier)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active:</span>
                    <span className={`font-medium ${selectedSchool.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedSchool.isActive ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Licenses:</span>
                    <span className="font-medium">{selectedSchool.numberOfLicense}</span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {selectedSchool.approvedAt && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Approval Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approved Date:</span>
                      <span className="font-medium">{new Date(selectedSchool.approvedAt).toLocaleDateString()}</span>
                    </div>
                    {selectedSchool.approvedByName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved By:</span>
                        <span className="font-medium">{selectedSchool.approvedByName}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolsManagement;
