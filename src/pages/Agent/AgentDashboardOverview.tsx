import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Settings, TrendingUp, School, Calculator, Activity, BarChart3 } from "lucide-react";
import { useGetSchoolsByAgentQuery, useGetActiveUsersStatsQuery } from "@/features/api/apiSlice";
import { useNavigate } from "react-router-dom";

const AgentDashboardOverview = () => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const navigate = useNavigate();

  // API calls
  const { data: schools } = useGetSchoolsByAgentQuery(undefined);
  const { data: activeUsersData } = useGetActiveUsersStatsQuery(undefined);

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
      title: "Activity Rate",
      value: `${activeUsersData?.data?.summary?.activityRate || 0}%`,
      description: "User engagement percentage",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Monthly Earnings",
      value: "₦0",
      description: "This month's earnings",
      icon: BarChart3,
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
      action: () => navigate('/agent/schools')
    },
    {
      title: "View Earnings",
      description: "Track your income and payments",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: () => navigate('/agent/earnings')
    },
    {
      title: "User Analytics",
      description: "Monitor student engagement",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      action: () => navigate('/agent/analytics')
    },
    {
      title: "Earnings Calculator",
      description: "Calculate potential earnings",
      icon: Calculator,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      action: () => navigate('/agent/earnings')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userInfo?.fullName}!</h1>
        <p className="text-blue-100">Here's an overview of your agent activities and performance.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
                <div className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`h-6 w-6 ${action.color}`} />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Schools Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">Recent Schools</CardTitle>
          <Button 
            variant="outline" 
            onClick={() => navigate('/agent/schools')}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {schools?.data && schools.data.length > 0 ? (
            <div className="space-y-3">
              {schools.data.slice(0, 3).map((school: any, index: number) => (
                <div key={school._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-50">
                      <School className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{school.accountName}</h4>
                      <p className="text-sm text-gray-600">{school.category} • {school.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      school.approvalStatus === 'approved' 
                        ? 'text-green-700 bg-green-100' 
                        : school.approvalStatus === 'pending'
                        ? 'text-yellow-700 bg-yellow-100'
                        : 'text-red-700 bg-red-100'
                    }`}>
                      {school.approvalStatus}
                    </span>
                  </div>
                </div>
              ))}
              {schools.data.length > 3 && (
                <div className="text-center pt-2">
                  <Button variant="ghost" onClick={() => navigate('/agent/schools')}>
                    View {schools.data.length - 3} more schools
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No schools yet</h3>
              <p className="text-gray-500 mb-4">Create your first school to get started</p>
              <Button onClick={() => navigate('/agent/schools')}>
                Create School
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Month's Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Schools Created</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Users</span>
                <span className="font-medium">{activeUsersData?.data?.totalActiveUsers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Earnings</span>
                <span className="font-medium text-green-600">₦0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Activity Rate</span>
                <span className="font-medium">{activeUsersData?.data?.summary?.activityRate || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/agent/earnings')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Detailed Earnings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/agent/analytics')}
              >
                <Activity className="h-4 w-4 mr-2" />
                User Analytics Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/agent/schools')}
              >
                <School className="h-4 w-4 mr-2" />
                Manage All Schools
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentDashboardOverview;
