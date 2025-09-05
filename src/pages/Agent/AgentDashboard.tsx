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
import { Users, MessageSquare, Settings, TrendingUp, School, Loader, Eye, Calendar, MapPin, Mail, Phone, Globe, Building, Clock, CheckCircle, XCircle, Crown, Star, Zap, Calculator } from "lucide-react";
import { useMemo, useState } from "react";
import countryList from "react-select-country-list";
import { toast } from "sonner";
import { useCreateSchoolByAgentMutation, useGetSchoolsByAgentQuery, useGetActiveUsersStatsQuery } from "@/features/api/apiSlice";
import EarningsSummary from "@/components/earnings/EarningsSummary";
import EarningsCalculator from "@/components/earnings/EarningsCalculator";
import EarningsBySchool from "@/components/earnings/EarningsBySchool";
import ActiveUsersStats from "@/components/analytics/ActiveUsersStats";

const AgentDashboard = () => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const options = useMemo(() => countryList().getData(), []);
  
  // School creation state
  const [showCreateSchoolForm, setShowCreateSchoolForm] = useState(false);
  // School details state
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [showSchoolDetails, setShowSchoolDetails] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [contactFullName, setContactFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [category, setCategory] = useState("");
  const [numberOfLicense, setNumberOfLicense] = useState("");
  const [licenseStatus, setLicenseStatus] = useState("active");
  const [country, setCountry] = useState<(typeof options)[0] | null>(null);

  const [createSchoolByAgent, { isLoading }] = useCreateSchoolByAgentMutation();
  const { data: schools, isLoading: schoolsLoading, error: schoolsError } = useGetSchoolsByAgentQuery(undefined);
  const { data: activeUsersData } = useGetActiveUsersStatsQuery(undefined);

  const handleSubmit = async () => {
    const payload = {
      accountName,
      contactFullName,
      email,
      role,
      category,
      numberOfLicense,
      licenseStatus,
      country: country?.label || "",
      countryCode: country?.value || "",
    };

    try {
      const response = await createSchoolByAgent(payload);
      console.log("res", response);

      if (response.error) {
        const errorMessage = 'data' in response.error ? 
          (response.error as any).data?.message : 
          'An error occurred';
        toast.error("School creation failed", {
          description: errorMessage,
        });
      } else {
        toast.success("School created successfully");
        setShowCreateSchoolForm(false);
        // Reset form
        setAccountName("");
        setContactFullName("");
        setEmail("");
        setRole("Admin");
        setCategory("");
        setNumberOfLicense("");
        setLicenseStatus("active");
        setCountry(null);
      }
    } catch (error) {
      console.error("Error creating school", error);
      toast.error("School creation failed");
    }
  };

  const handleViewSchoolDetails = (school: any) => {
    setSelectedSchool(school);
    setShowSchoolDetails(true);
  };

  const stats = [
    {
      title: "Schools Created",
      value: schools?.count?.toString() || "0",
      description: "Schools you've created",
      icon: School,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Users",
      value: activeUsersData?.data?.totalActiveUsers?.toString() || "0",
      description: "Students actively using the platform",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Support Tickets",
      value: "0", 
      description: "Pending support requests",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "System Health",
      value: "100%",
      description: "All systems operational",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ];

  const quickActions = [
    {
      title: "Create School",
      description: "Create a new school organization",
      icon: School,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: () => setShowCreateSchoolForm(true)
    },
    {
      title: "Earnings Calculator",
      description: "Calculate potential earnings",
      icon: Calculator,
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: () => {
        // Scroll to calculator section
        const calculatorElement = document.querySelector('[data-earnings-calculator]');
        if (calculatorElement) {
          calculatorElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: () => alert("User Management - Coming Soon!")
    },
    {
      title: "Support Center",
      description: "Handle support tickets and queries",
      icon: MessageSquare,
      color: "text-purple-600", 
      bgColor: "bg-purple-50",
      action: () => alert("Support Center - Coming Soon!")
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      action: () => alert("Settings - Coming Soon!")
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-1 flex-col gap-4 md:gap-8">
      {/* Header Section */}
      <div className="bg-primary text-primary-foreground flex justify-between">
        <span className="grid md:ml-10 mt-4 md:mt-8 mx-4 mb-4 md:mr-0">
          <h4 className="text-lg md:text-3xl font-bold">
            Welcome back,{" "}
            <span className="capitalize">{userInfo?.fullName}</span>
          </h4>
          <p className="md:text-xl">
            Your agent dashboard for managing platform operations.
            <br /> Empowering Education, Supporting Excellence.
          </p>
        </span>
        <img
          alt="agent dashboard illustration"
          src="/teacher-and-student.png"
          className="h-full hidden md:block"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Earnings Summary Section */}
      <EarningsSummary className="mb-8" />

      {/* Quick Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="p-4 rounded-lg border border-border hover:shadow-md transition-all hover:scale-105 text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${action.bgColor} group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <h3 className="font-semibold">{action.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <button className="text-sm text-primary hover:underline">
            View All
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Welcome to your Agent Dashboard!</span>
              </div>
              <span className="text-xs text-muted-foreground">Just now</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Agent account created successfully</span>
              </div>
              <span className="text-xs text-muted-foreground">Today</span>
            </div>
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>More activity will appear here as you use the platform</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Calculator Section */}
      <div data-earnings-calculator>
        <EarningsCalculator className="mb-8" />
      </div>

      {/* Earnings by School Section */}
      <EarningsBySchool className="mb-8" />

      {/* Active Users Analytics Section */}
      <ActiveUsersStats className="mb-8" />

      {/* Schools Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">My Schools</CardTitle>
          <Button 
            onClick={() => setShowCreateSchoolForm(true)}
            className="text-sm"
          >
            Create New School
          </Button>
        </CardHeader>
        <CardContent>
          {schoolsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading schools...</span>
            </div>
          ) : schoolsError ? (
            <div className="text-center py-8 text-muted-foreground">
              <School className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Error loading schools. Please try again.</p>
            </div>
          ) : schools?.data && schools.data.length > 0 ? (
            <div className="space-y-4">
              {schools.data.map((school: any, index: number) => (
                <div key={school._id || index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-50">
                      <School className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{school.accountName}</h4>
                        {school.tier && (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            school.tier === 'enterprise' ? 'bg-yellow-100 text-yellow-800' :
                            school.tier === 'premium' ? 'bg-purple-100 text-purple-800' :
                            school.tier === 'standard' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {school.tier === 'enterprise' && <Crown className="h-3 w-3" />}
                            {school.tier === 'premium' && <Star className="h-3 w-3" />}
                            {school.tier === 'standard' && <Zap className="h-3 w-3" />}
                            {school.tier === 'basic' && <School className="h-3 w-3" />}
                            {school.tier.charAt(0).toUpperCase() + school.tier.slice(1)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {school.category} • {school.numberOfLicense} licenses
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(school.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-sm font-medium flex items-center gap-1 ${
                        school.approvalStatus === 'approved' ? 'text-green-600' :
                        school.approvalStatus === 'rejected' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {school.approvalStatus === 'approved' && <CheckCircle className="h-3 w-3" />}
                        {school.approvalStatus === 'rejected' && <XCircle className="h-3 w-3" />}
                        {school.approvalStatus === 'pending' && <Clock className="h-3 w-3" />}
                        {school.approvalStatus === 'approved' ? 'Approved' :
                         school.approvalStatus === 'rejected' ? 'Rejected' :
                         'Pending Approval'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {school.country}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSchoolDetails(school)}
                      className="ml-2"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <School className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="mb-3">No schools created yet</p>
              <Button 
                onClick={() => setShowCreateSchoolForm(true)}
                variant="outline"
              >
                Create Your First School
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Documentation</h4>
            <p className="text-sm text-blue-700 mb-3">
              Learn how to use the platform effectively
            </p>
            <button className="text-sm text-blue-600 hover:underline">
              View Docs →
            </button>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Support</h4>
            <p className="text-sm text-green-700 mb-3">
              Get help from our support team
            </p>
            <button className="text-sm text-green-600 hover:underline">
              Contact Support →
            </button>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Training</h4>
            <p className="text-sm text-purple-700 mb-3">
              Access training materials and guides
            </p>
            <button className="text-sm text-purple-600 hover:underline">
              Start Training →
            </button>
          </div>
        </CardContent>
      </Card>

      {/* School Details Dialog */}
      <Dialog open={showSchoolDetails} onOpenChange={setShowSchoolDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              {selectedSchool?.accountName}
            </DialogTitle>
            <DialogDescription>
              Detailed information about this school organization
            </DialogDescription>
          </DialogHeader>
          
          {selectedSchool && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Organization Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{selectedSchool.accountName}</p>
                        <p className="text-sm text-muted-foreground">Organization Name</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{selectedSchool.category}</p>
                        <p className="text-sm text-muted-foreground">Category</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{selectedSchool.country}</p>
                        <p className="text-sm text-muted-foreground">Country</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {new Date(selectedSchool.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">Created Date</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{selectedSchool.contactFullName || 'Not provided'}</p>
                        <p className="text-sm text-muted-foreground">Contact Person</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{selectedSchool.email}</p>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{selectedSchool.phoneNumber || 'Not provided'}</p>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tier Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {selectedSchool.tier === 'enterprise' && <Crown className="h-4 w-4 text-yellow-600" />}
                    {selectedSchool.tier === 'premium' && <Star className="h-4 w-4 text-purple-600" />}
                    {selectedSchool.tier === 'standard' && <Zap className="h-4 w-4 text-green-600" />}
                    {(!selectedSchool.tier || selectedSchool.tier === 'basic') && <School className="h-4 w-4 text-blue-600" />}
                    School Tier & Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Tier Badge */}
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                        selectedSchool.tier === 'enterprise' ? 'bg-yellow-100 text-yellow-800' :
                        selectedSchool.tier === 'premium' ? 'bg-purple-100 text-purple-800' :
                        selectedSchool.tier === 'standard' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedSchool.tier === 'enterprise' && <Crown className="h-4 w-4" />}
                        {selectedSchool.tier === 'premium' && <Star className="h-4 w-4" />}
                        {selectedSchool.tier === 'standard' && <Zap className="h-4 w-4" />}
                        {(!selectedSchool.tier || selectedSchool.tier === 'basic') && <School className="h-4 w-4" />}
                        {selectedSchool.tier ? selectedSchool.tier.charAt(0).toUpperCase() + selectedSchool.tier.slice(1) : 'Basic'} Tier
                      </span>
                      {selectedSchool.tierUpdatedAt && (
                        <span className="text-xs text-muted-foreground">
                          Updated {new Date(selectedSchool.tierUpdatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Tier Features */}
                    {selectedSchool.tierFeatures && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold">
                            {selectedSchool.tierFeatures.maxUsers === -1 ? '∞' : selectedSchool.tierFeatures.maxUsers}
                          </div>
                          <div className="text-xs text-muted-foreground">Max Users</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold">
                            {selectedSchool.tierFeatures.maxClassrooms === -1 ? '∞' : selectedSchool.tierFeatures.maxClassrooms}
                          </div>
                          <div className="text-xs text-muted-foreground">Max Classrooms</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold">
                            {selectedSchool.tierFeatures.maxQuizzes === -1 ? '∞' : selectedSchool.tierFeatures.maxQuizzes}
                          </div>
                          <div className="text-xs text-muted-foreground">Max Quizzes</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold">
                            {selectedSchool.tierFeatures.aiRequestsPerMonth}
                          </div>
                          <div className="text-xs text-muted-foreground">AI Requests/Month</div>
                        </div>
                      </div>
                    )}

                    {selectedSchool.tierSetByName && (
                      <div className="text-xs text-muted-foreground">
                        Tier set by: {selectedSchool.tierSetByName}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* License Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    License Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedSchool.numberOfLicense}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Licenses</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedSchool.license?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Licenses</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedSchool.licenseStatus === 'active' ? 'Active' : 'Inactive'}
                      </div>
                      <div className="text-sm text-muted-foreground">Status</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* License Details */}
              {selectedSchool.license && selectedSchool.license.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">License Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {selectedSchool.license.slice(0, 10).map((license: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-mono text-sm">{license.licenseCode}</p>
                              <p className="text-xs text-muted-foreground">
                                Limit: {license.licenseLimit || 0}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {license.fullName || 'Unassigned'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {license.role || 'No role'}
                              </p>
                            </div>
                          </div>
                        ))}
                        {selectedSchool.license.length > 10 && (
                          <div className="text-center py-2 text-muted-foreground">
                            ... and {selectedSchool.license.length - 10} more licenses
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Approval Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {selectedSchool.approvalStatus === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {selectedSchool.approvalStatus === 'rejected' && <XCircle className="h-4 w-4 text-red-600" />}
                    {selectedSchool.approvalStatus === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                    Approval Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-4 rounded-lg ${
                    selectedSchool.approvalStatus === 'approved' ? 'bg-green-50' :
                    selectedSchool.approvalStatus === 'rejected' ? 'bg-red-50' :
                    'bg-yellow-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        selectedSchool.approvalStatus === 'approved' ? 'bg-green-100' :
                        selectedSchool.approvalStatus === 'rejected' ? 'bg-red-100' :
                        'bg-yellow-100'
                      }`}>
                        {selectedSchool.approvalStatus === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {selectedSchool.approvalStatus === 'rejected' && <XCircle className="h-4 w-4 text-red-600" />}
                        {selectedSchool.approvalStatus === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <div>
                        <p className={`font-medium ${
                          selectedSchool.approvalStatus === 'approved' ? 'text-green-900' :
                          selectedSchool.approvalStatus === 'rejected' ? 'text-red-900' :
                          'text-yellow-900'
                        }`}>
                          {selectedSchool.approvalStatus === 'approved' ? 'Approved' :
                           selectedSchool.approvalStatus === 'rejected' ? 'Rejected' :
                           'Pending Approval'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedSchool.approvalStatus === 'approved' && selectedSchool.approvedAt && 
                            `Approved on ${new Date(selectedSchool.approvedAt).toLocaleDateString()}`}
                          {selectedSchool.approvalStatus === 'rejected' && selectedSchool.approvedAt && 
                            `Rejected on ${new Date(selectedSchool.approvedAt).toLocaleDateString()}`}
                          {selectedSchool.approvalStatus === 'pending' && 
                            'Waiting for super admin approval'}
                        </p>
                        {selectedSchool.approvalStatus === 'approved' && selectedSchool.approvedByName && (
                          <p className="text-xs text-muted-foreground">
                            Approved by: {selectedSchool.approvedByName}
                          </p>
                        )}
                        {selectedSchool.approvalStatus === 'rejected' && selectedSchool.rejectionReason && (
                          <p className="text-xs text-red-700 mt-2">
                            Reason: {selectedSchool.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Request Limit</p>
                      <p className="font-medium">{selectedSchool.monthlyRequestLimit || 3}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Status</p>
                      <p className="font-medium">
                        {selectedSchool.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email Verified</p>
                      <p className="font-medium">
                        {selectedSchool.isEmailVerified ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Profile Complete</p>
                      <p className="font-medium">
                        {selectedSchool.isProfileComplete ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Created By Agent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedSchool.createdByAgentName || userInfo?.fullName}</p>
                      <p className="text-sm text-muted-foreground">{selectedSchool.createdByAgentEmail || userInfo?.email}</p>
                      <p className="text-xs text-muted-foreground">Agent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* School Creation Form */}
      <Sheet open={showCreateSchoolForm} onOpenChange={setShowCreateSchoolForm}>
        <SheetContent className="sm:w-[540px] overflow-auto">
          <SheetHeader>
            <SheetTitle>Create School Organization</SheetTitle>
            <SheetDescription>
              Create a new school organization with licenses and admin account.
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-auto">
            <div className="">
              <div className="mt-4">
                <Label htmlFor="accountName">Organization name</Label>
                <Input
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  type="text"
                  placeholder="Organization name"
                  className="mt-2"
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="contactFullName">Organization Contact Full Name</Label>
                <Input
                  id="contactFullName"
                  value={contactFullName}
                  onChange={(e) => setContactFullName(e.target.value)}
                  type="text"
                  placeholder="Organization contact full Name"
                  className="mt-2"
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="email">Organization Contact Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Organization contact email"
                  className="mt-2"
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="category">Organization Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-2 p-2 border border-input rounded-md bg-background"
                >
                  <option value="" disabled>
                    Select Organization Category
                  </option>
                  <option value="College">College</option>
                  <option value="High School">High School</option>
                  <option value="Primary School">Primary School</option>
                  <option value="University">University</option>
                </select>
              </div>

              <div className="mt-4">
                <Label htmlFor="numberOfLicense">Number of License</Label>
                <Input
                  id="numberOfLicense"
                  value={numberOfLicense}
                  onChange={(e) => setNumberOfLicense(e.target.value)}
                  type="number"
                  placeholder="Number of license"
                  className="mt-2"
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  value={country?.value || ""}
                  onChange={(e) =>
                    setCountry(
                      options.find((country) => country.value === e.target.value) || null
                    )
                  }
                  className="w-full mt-2 p-2 border border-input rounded-md bg-background"
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  {options.map((val) => (
                    <option value={val.value} key={val.value}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button
                disabled={isLoading}
                className="w-full mt-6"
                onClick={handleSubmit}
              >
                {isLoading && (
                  <span className="mr-2 animate-spin">
                    <Loader className="h-4 w-4" />
                  </span>
                )}
                Create School Organization
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AgentDashboard;
