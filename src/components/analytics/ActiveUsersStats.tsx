import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  GraduationCap,
  Activity,
  Loader2,
  Eye,
  Calendar,
  School
} from 'lucide-react';
import { useGetActiveUsersStatsQuery, useGetSchoolActivityDetailsQuery } from '@/features/api/apiSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ActiveUsersStatsProps {
  className?: string;
}

const ActiveUsersStats: React.FC<ActiveUsersStatsProps> = ({ className }) => {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [showSchoolDetails, setShowSchoolDetails] = useState(false);

  const { data: activeUsersData, isLoading, error } = useGetActiveUsersStatsQuery();
  const { data: schoolActivity } = useGetSchoolActivityDetailsQuery(selectedSchoolId!, {
    skip: !selectedSchoolId
  });

  const handleViewSchoolActivity = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
    setShowSchoolDetails(true);
  };

  if (error) {
    return null; // Gracefully hide if API unavailable
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const stats = activeUsersData?.data;
  if (!stats) return null;

  const overviewStats = [
    {
      title: "Total Active Users",
      value: stats.totalActiveUsers,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Users actively engaged with the platform"
    },
    {
      title: "Licensed Users",
      value: stats.totalLicensedUsers,
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Users with active licenses"
    },
    {
      title: "Activity Rate",
      value: `${stats.summary?.activityRate || 0}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Percentage of licensed users who are active"
    },
    {
      title: "Total Schools",
      value: stats.totalSchools,
      icon: School,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Schools under your management"
    }
  ];

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Active Users Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-600 mb-1">{stat.title}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </div>
              );
            })}
          </div>

          {/* Activity Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Quiz Activity</span>
              </div>
              <div className="text-xl font-bold text-blue-700">
                {stats.activityMetrics?.usersWithQuizzes || 0}
              </div>
              <div className="text-xs text-blue-600">Users who have taken quizzes</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Classroom Participation</span>
              </div>
              <div className="text-xl font-bold text-green-700">
                {stats.activityMetrics?.usersInClasses || 0}
              </div>
              <div className="text-xs text-green-600">Users enrolled in classes</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Recent Activity</span>
              </div>
              <div className="text-xl font-bold text-purple-700">
                {stats.activityMetrics?.usersWithRecentActivity || 0}
              </div>
              <div className="text-xs text-purple-600">Users active in last 30 days</div>
            </div>
          </div>

          {/* Schools Breakdown */}
          {stats.schoolsBreakdown && stats.schoolsBreakdown.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Schools Activity Breakdown</h3>
              <div className="space-y-3">
                {stats.schoolsBreakdown.map((school: any) => (
                  <div key={school.schoolId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{school.schoolName}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSchoolActivity(school.schoolId)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500">Total Users</div>
                        <div className="font-medium">{school.totalUsers}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Licensed</div>
                        <div className="font-medium text-blue-600">{school.licensedUsers}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Active</div>
                        <div className="font-medium text-green-600">{school.activeUsers}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">In Classes</div>
                        <div className="font-medium text-purple-600">{school.usersInClasses}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Quiz Takers</div>
                        <div className="font-medium text-orange-600">{school.usersWithQuizzes}</div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Badge variant="secondary">
                        {school.breakdown.students} Students
                      </Badge>
                      <Badge variant="secondary">
                        {school.breakdown.teachers} Teachers
                      </Badge>
                      <Badge variant="secondary">
                        {school.breakdown.parents} Parents
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* School Activity Details Dialog */}
      <Dialog open={showSchoolDetails} onOpenChange={setShowSchoolDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>School Activity Details</DialogTitle>
          </DialogHeader>
          
          {schoolActivity?.data && (
            <div className="space-y-6">
              {/* School Overview */}
              <div>
                <h3 className="font-semibold mb-3">{schoolActivity.data.school.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Total Users</div>
                    <div className="text-xl font-bold">{schoolActivity.data.users.total}</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-600">Licensed Users</div>
                    <div className="text-xl font-bold text-blue-700">{schoolActivity.data.users.licensed}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-600">Classrooms</div>
                    <div className="text-xl font-bold text-green-700">{schoolActivity.data.activity.totalClassrooms}</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm text-purple-600">Recent Quizzes</div>
                    <div className="text-xl font-bold text-purple-700">{schoolActivity.data.activity.recentQuizzes}</div>
                  </div>
                </div>
              </div>

              {/* User Breakdown by Role */}
              <div>
                <h4 className="font-medium mb-2">User Distribution</h4>
                <div className="flex gap-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {schoolActivity.data.users.byRole.students} Students
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    {schoolActivity.data.users.byRole.teachers} Teachers
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800">
                    {schoolActivity.data.users.byRole.parents} Parents
                  </Badge>
                </div>
              </div>

              {/* Classrooms */}
              {schoolActivity.data.classrooms && schoolActivity.data.classrooms.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Active Classrooms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {schoolActivity.data.classrooms.map((classroom: any) => (
                      <div key={classroom.id} className="border rounded-lg p-3">
                        <h5 className="font-medium">{classroom.name}</h5>
                        <div className="text-sm text-gray-600 mt-1">
                          {classroom.studentsCount} students • {classroom.teachersCount} teachers
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Created: {new Date(classroom.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Quiz Activity */}
              {schoolActivity.data.recentQuizResults && schoolActivity.data.recentQuizResults.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Recent Quiz Activity</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {schoolActivity.data.recentQuizResults.map((result: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{result.userId?.fullName}</span>
                          <span className="text-sm text-gray-500 ml-2">({result.userId?.role})</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActiveUsersStats;
