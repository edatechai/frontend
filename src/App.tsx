import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Auth/Index";
import { TeachersLayout } from "./components/Layouts/Teacher";
import { StudentLayout } from "./components/Layouts/Student";
import { SuperAdminLayout } from "./components/Layouts/SuperAdmin";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdmin";
import { OrgLayout } from "./components/Layouts/Org";
import OrgDashboard from "./pages/Org/Org";
import StudentDashboard from "./pages/Student/Student";
import { StudentDash } from "./pages/Student/Student-dashboard";
import { ParentsLayout } from "./components/Layouts/Parent";
import ParentDashboard from "./pages/Parent/Parent";
import {
  useCurrentUserQuery,
  useFindAllQuizByIdQuery,
} from "./features/api/apiSlice";
import CreateOrg from "./pages/SuperAdmin/CreateOrg";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "./features/user/userSlice";
import Profile from "./pages/Profile/Index";
import StudentProfile from "./pages/Student/Profile";
import OrgSettings from "./pages/Org/Settings";
import ClassRoom from "./pages/ClassRoom/Index";
import SuperAdminSettings from "./pages/SuperAdmin/Settings";
import Quiz from "./pages/Student/Quiz";
import UnderDev from "./components/Error/UnderDev";
import Recommendation from "./pages/Student/Recommendation";
import Theory from "./components/Quiz/Exam";
import { ThemeProvider } from "./components/Layouts/theme-provider";
import { Result } from "./pages/Student/result";
import { StudentClassrooms } from "./pages/Student/Classrooms";
import StudentQiuzzes from "./pages/Student/classrooms/quizzes";
import Report from "./pages/Student/report";
import TeacherRoom from "./components/classroom/TeacherRoom";
import CreateReport from "./components/classroom/CreateReport";
import TeachersClassroom from "./components/classroom/JoinClassByTeacher";

const App = () => {
  const { data: user, error, isLoading } = useCurrentUserQuery();
  const dispatch = useDispatch();
  if (user) {
    dispatch(setUserInfo(user));
  } else {
    dispatch(setUserInfo(null));
  }

  console.log("here", error);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
  }

  if (error) {
    // return <div>Error loading user data: {error.message}</div>;
  }

  const userRole = user?.role;

  return (
    // <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <div className="overflow-x-hidden">
      <Routes>
        {/* Teachers layout */}
        <Route element={<TeachersLayout />}>
          <Route path="/teacher/profile" element={<Profile />} />
          <Route path="/teacher" element={<TeachersClassroom />} />
          <Route path="/teacher/class" element={<TeacherRoom />} />
          <Route path="/teacher/under-development" element={<UnderDev />} />
          <Route
            path="/teacher/class/create-report"
            element={<CreateReport />}
          />
          {/* <Route path="/dashboard/class-room" element={<ClassRoom />} /> */}
        </Route>

        {/* Super Admin layout */}
        <Route element={<SuperAdminLayout />}>
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route
            path="/super-admin/create-organization"
            element={<CreateOrg />}
          />
          <Route path="/super-admin/profile" element={<Profile />} />
          <Route
            path="/super-admin/settings"
            element={<SuperAdminSettings />}
          />
          <Route path="/super-admin/under-development" element={<UnderDev />} />
        </Route>

        {/* Org layout */}
        <Route element={<OrgLayout />}>
          <Route path="/org-admin" element={<OrgDashboard />} />
          <Route path="/org-admin/profile" element={<Profile />} />
          <Route path="/org-admin/org-settings" element={<OrgSettings />} />
          <Route path="/org-admin/under-development" element={<UnderDev />} />
          <Route path="/org-admin/class-room" element={<ClassRoom />} />
        </Route>

        {/* Student layout */}
        <Route element={<StudentLayout />}>
          <Route path="/student" element={<StudentDash />} />
          <Route path="/dash-test" element={<StudentDashboard />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/student/classrooms" element={<StudentClassrooms />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route
            path="/student/classrooms/:classId"
            // loader={async ({ params }) => {
            //   return useFindAllQuizByIdQuery(params.classId);
            // }}
            element={<StudentQiuzzes />}
          />
          {/* <Route path="/dashboard/class-room" element={<ClassRoom />} /> */}
          <Route path="/student/report" element={<Report />} />
          <Route path="/dashboard/quiz" element={<Quiz />} />
          <Route path="/dashboard/exam" element={<Theory lo={""} />} />
          <Route path="/student/result" element={<Result />} />
          <Route path="/student/under-development" element={<UnderDev />} />
        </Route>

        {/* Parent layout */}
        <Route element={<ParentsLayout />}>
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard/under-development" element={<UnderDev />} />
        </Route>

        {/* Default route */}
        {!userRole ? (
          <Route path="/" element={<Index />} />
        ) : (
          <Route path="/" element={<Navigate to={`/${userRole}`} replace />} />
        )}
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
