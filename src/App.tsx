import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Auth/Index";
import { TeachersLayout } from "./components/Layouts/Teacher";
import { Layout } from "./components/Layouts/Layout";
import { SuperAdminLayout } from "./components/Layouts/SuperAdmin";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdmin";
import { OrgLayout } from "./components/Layouts/Org";
import OrgDashboard from "./pages/Org/Org";
import StudentDetails from "./pages/Teacher/studentDetails";
import { StudentDash } from "./pages/Student/Student-dashboard";
import { ParentsLayout } from "./components/Layouts/Parent";
import ParentDashboard from "./pages/Parent/Parent";
import { useCurrentUserQuery } from "./features/api/apiSlice";
import CreateOrg from "./pages/SuperAdmin/CreateOrg";
import { Provider, useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "./features/user/userSlice";
import Profile from "./pages/Profile/Index";
import StudentProfile from "./pages/Student/Profile";
import OrgSettings from "./pages/Org/Settings";
import ClassRoom from "./pages/ClassRoom/Index";
import Exams from "./pages/Student/classrooms/exams";
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
import { useEffect, useState } from "react";
import ParentReport from "./pages/Parent/Report";
import ChildResult from "./pages/Parent/Result";
import Strengths from "./pages/Parent/Strengths";
import StudentsReport from "./pages/Teacher/Report";
import ClassReport from "./components/teacher/classReport";
import Classrooms from "./pages/Org/classrooms";
// import store from "./app/store";

const App = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useCurrentUserQuery(undefined, {
    extraOptions: { navigate }, // Pass navigate here
  });

  const dispatch = useDispatch();
  // const [userRole, setUserRole] = useState();
  useEffect(() => {
    if (user) {
      dispatch(setUserInfo(user));
    } else {
      dispatch(setUserInfo(null));
    }
  }, [user]);

  if (user) {
    dispatch(setUserInfo(user));
  } else {
    dispatch(setUserInfo(null));
  }

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      // <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      // <Provider store={store}>
      <div className="overflow-x-hidden">
        <Routes>
          {/* Teachers layout */}
          <Route element={<Layout />}>
            <Route path="/teacher/profile" element={<Profile />} />
            <Route path="/teacher" element={<TeachersClassroom />} />
            <Route path="/teacher/class" element={<TeacherRoom />} />
            <Route path="/teacher/under-development" element={<UnderDev />} />
            <Route
              path="/teacher/class/create-report"
              element={<CreateReport />}
            />
            <Route path="/teacher/report" element={<StudentsReport />} />
            <Route path="/teacher/report/:classId" element={<ClassReport />} />
            <Route path="/teacher/class/:userId" element={<StudentDetails />} />
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
            <Route
              path="/super-admin/under-development"
              element={<UnderDev />}
            />
          </Route>

          {/* Org layout */}
          <Route element={<Layout />}>
            <Route path="/org-admin" element={<OrgDashboard />} />
            <Route path="/org-admin/profile" element={<Profile />} />
            <Route path="/org-admin/org-settings" element={<Classrooms />} />
            <Route path="/org-admin/classrooms" element={<OrgSettings />} />
            <Route path="/org-admin/under-development" element={<UnderDev />} />
            <Route path="/org-admin/class-room" element={<ClassRoom />} />
          </Route>

          {/* Student layout */}
          <Route element={<Layout />}>
            <Route path="/student" element={<StudentDash />} />
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
            <Route
              path="/student/classrooms/exam/:examId"
              // loader={async ({ params }) => {
              //   return fetch(
              //     `https://edat-microservice-v1.onrender.com/exam/get_one_exam_id?exam_id=${params.examId}`
              //   );
              // }}
              element={<Exams />}
            />
            {/* <Route path="/dashboard/class-room" element={<ClassRoom />} /> */}
            <Route path="/student/report" element={<Report />} />
            <Route path="/dashboard/quiz" element={<Quiz />} />
            <Route path="/dashboard/exam" element={<Theory />} />
            <Route path="/student/result" element={<Result />} />
            <Route path="/student/under-development" element={<UnderDev />} />
          </Route>

          {/* Parent layout */}
          <Route element={<ParentsLayout />}>
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/parent/result/:childId" element={<ChildResult />} />
            <Route path="/parent/strengths/:childId" element={<Strengths />} />
            <Route path="/parent/report" element={<ParentReport />} />
            <Route path="/dashboard/under-development" element={<UnderDev />} />
          </Route>

          {/* Default route */}
          {!user?.role ? (
            <Route path="/" element={<Index />} />
          ) : (
            <Route
              path="/"
              element={<Navigate to={`/${user?.role}`} replace />}
            />
          )}
        </Routes>
        <Toaster richColors theme="light" toastOptions={{}} />
      </div>
      // </Provider>
    );
  }
};

export default App;
