import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const getToken = () => {
  const token = localStorage.getItem("Token");
  if (!token) {
    console.log({ token });
  }
  return token;
};


//http://localhost:5000
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5000/",
    
    //http://51.21.244.112:5000/
    //https://ai.edatech.ai/app
    baseUrl: "https://ai.edatech.ai/app",
    prepareHeaders: async (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    },
  }),
  
  tagTypes: [
    "CurrentUser",
    "CreateAccount",
    "AllAccounts",
    "Account",
    "AgentSchools",
    "TierOptions",
    "ClassRoom",
    "Objectives",
    "Question",
    "Quiz",
    "AddChild",
    "User",
    "Notification",
    "Chat",
    "YearGroup",
    "Arm",
    "Subject",
    "AgentEarnings",
    "CommissionSettings",
    "AllEarnings",
    "ActiveUsers",
    "SchoolActivity",
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (user) => ({
        url: "/api/users/login",
        method: "POST",
        body: user,
      }),
    }),

    currentUser: builder.query({
      query: () => "/api/users/getCurrentUser",
      providesTags: (result) =>
        result
          ? [{ type: "CurrentUser", id: result._id }]
          : ["CurrentUser", "CreateAccount"],
    }),

    createUser: builder.mutation({
      query: (payload) => ({
        url: "/api/users/createUser",
        method: "POST",
        body: payload,
      }),
      //invalidatesTags: ["CreateAccount", "AllAccounts"],
    }),

    getUsersByAccountId: builder.query({
      query: (accountId) => `/api/users/getUsersByAccountId/${accountId}`,
      providesTags: ["User"],
    }),

    validateEmailAndRegisterUser: builder.mutation({
      query: (payload) => ({
        url: "/api/users/validateEmailAndRegisterUser",
        method: "POST",
        body: payload,
      }),
    }),

    updatePassword: builder.mutation({
      query: (payload) => ({
        url: "/api/users/updatePassword",
        method: "POST",
        body: payload,
      }),
    }),

    // Agent management endpoints
    createAgent: builder.mutation({
      query: (payload) => ({
        url: "/api/users/createAgent",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),

    completeAgentSignup: builder.mutation({
      query: (payload) => ({
        url: "/api/users/completeAgentSignup",
        method: "POST",
        body: payload,
      }),
    }),

    getAllAgents: builder.query({
      query: () => "/api/users/getAllAgents",
      providesTags: ["User"],
    }),

    updateAgentStatus: builder.mutation({
      query: ({ agentId, isActive }) => ({
        url: `/api/users/updateAgentStatus/${agentId}`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: ["User"],
    }),

    resendAgentInvitation: builder.mutation({
      query: (agentId) => ({
        url: `/api/users/resendAgentInvitation/${agentId}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    deleteAgent: builder.mutation({
      query: (agentId) => ({
        url: `/api/users/deleteAgent/${agentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Agent school creation
    createSchoolByAgent: builder.mutation({
      query: (payload) => ({
        url: "/api/users/agent/createSchool",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CreateAccount", "AllAccounts", "AgentSchools"],
    }),

    // Get schools created by agent
    getSchoolsByAgent: builder.query({
      query: () => "/api/users/agent/schools",
      providesTags: ["AgentSchools"],
    }),

    // Super admin school management
    getPendingSchools: builder.query({
      query: () => "/api/users/superadmin/schools/pending",
      providesTags: ["AgentSchools"],
    }),

    approveSchool: builder.mutation({
      query: ({ schoolId, tier }) => ({
        url: `/api/users/superadmin/schools/${schoolId}/approve`,
        method: "PUT",
        body: tier ? { tier } : {},
      }),
      invalidatesTags: ["AgentSchools", "AllAccounts"],
    }),

    rejectSchool: builder.mutation({
      query: ({ schoolId, reason }) => ({
        url: `/api/users/superadmin/schools/${schoolId}/reject`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: ["AgentSchools", "AllAccounts"],
    }),

    transferSchool: builder.mutation({
      query: ({ schoolId, newAgentId }) => ({
        url: `/api/users/superadmin/schools/${schoolId}/transfer`,
        method: "PUT",
        body: { newAgentId },
      }),
      invalidatesTags: ["AgentSchools", "AllAccounts"],
    }),

    // Tier management
    updateSchoolTier: builder.mutation({
      query: ({ schoolId, tier }) => ({
        url: `/api/users/superadmin/schools/${schoolId}/tier`,
        method: "PUT",
        body: { tier },
      }),
      invalidatesTags: ["AgentSchools", "AllAccounts"],
    }),

    getTierOptions: builder.query({
      query: () => "/api/users/superadmin/tiers",
      providesTags: ["TierOptions"],
    }),

    // Agent Earnings Endpoints
    getAgentEarningsSummary: builder.query({
      query: () => "/api/earnings/agent/summary",
      providesTags: ["AgentEarnings"],
    }),
    getAgentEarningsBySchool: builder.query({
      query: (params) => ({
        url: "/api/earnings/agent/schools",
        params,
      }),
      providesTags: ["AgentEarnings"],
    }),
    getAgentEarningsHistory: builder.query({
      query: (params) => ({
        url: "/api/earnings/agent/history",
        params,
      }),
      providesTags: ["AgentEarnings"],
    }),
    calculateEarningsPreview: builder.mutation({
      query: (payload) => ({
        url: "/api/earnings/agent/calculate-preview",
        method: "POST",
        body: payload,
      }),
    }),
    getCommissionSettings: builder.query({
      query: () => "/api/earnings/agent/commission-settings",
      providesTags: ["CommissionSettings"],
    }),
    getActiveUsersStats: builder.query({
      query: () => "/api/earnings/agent/active-users",
      providesTags: ["ActiveUsers"],
    }),
    getSchoolActivityDetails: builder.query({
      query: (schoolId) => `/api/earnings/agent/schools/${schoolId}/activity`,
      providesTags: ["SchoolActivity"],
    }),

    // Super Admin Earnings Management
    getAllEarningsOverview: builder.query({
      query: () => "/api/earnings/superadmin/overview",
      providesTags: ["AllEarnings"],
    }),
    updateCommissionSettings: builder.mutation({
      query: (payload) => ({
        url: "/api/earnings/superadmin/commission-settings",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CommissionSettings", "AgentEarnings"],
    }),
    assignSchoolService: builder.mutation({
      query: ({ schoolId, ...payload }) => ({
        url: `/api/earnings/superadmin/schools/${schoolId}/service`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AgentEarnings", "AllEarnings"],
    }),
    updateStudentCount: builder.mutation({
      query: ({ schoolId, ...payload }) => ({
        url: `/api/earnings/superadmin/schools/${schoolId}/student-count`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AgentEarnings", "AllEarnings"],
    }),
    markEarningsAsPaid: builder.mutation({
      query: ({ earningsId, ...payload }) => ({
        url: `/api/earnings/superadmin/earnings/${earningsId}/mark-paid`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AgentEarnings", "AllEarnings"],
    }),

    createAccount: builder.mutation({
      query: (payload) => ({
        url: "/api/account/createAccount",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CreateAccount", "AllAccounts"],
    }),

    // its a delete request
    deleteLicense: builder.mutation({
      query: (payload) => ({
        url: `/api/account/deleteLicense/${payload.id}/${payload.licenseCode}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["AllAccounts"],
    }),

    deleteAccountAndUsers: builder.mutation({
      query: (id) => ({
        url: `/api/account/deleteAccountAndUsers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AllAccounts"],
    }),

    addMoreLicenses: builder.mutation({
      query: (payload) => ({
        url: `/api/account/addMoreLicenses/${payload.id}/${payload.numberOfLicense}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AllAccounts"],
    }),

    updateMonthlyRequestLimit: builder.mutation({
      query: (payload) => ({
        url: `/api/account/updateMonthlyRequestLimit/${payload.id}/${payload.monthlyRequestLimit}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AllAccounts"],
    }),

    forgotPassword: builder.mutation({
      query: (payload) => ({
        url: "/api/users/forgot-password",
        method: "POST",
        body: payload,
      }),
    }),

    resetPassword: builder.mutation({
      query: (payload) => ({
        url: "/api/users/reset-password",
        method: "POST",
        body: payload,
      }),
    }),

    sendPasswordResetToParent: builder.mutation({
      query: (payload) => ({
        url: "/api/users/sendPasswordResetToParent",
        method: "POST",
        body: payload,
      }),
    }),

    updatePasswordAfterReset: builder.mutation({
      query: (payload) => ({
        url: "/api/users/updatePasswordAfterReset",
        method: "POST",
        body: payload,
      }),
    }),

    getAllAccounts: builder.query({
      query: () => "/api/account/getAllAccounts",
      providesTags: ["AllAccounts"],
    }),

    getAccountById: builder.query({
      query: (id) => `/api/account/getAccountById/${id}`,
      providesTags: (id) => [{ type: "Account", id }],
    }),

    //classRoom endpoint
    createClassRoom: builder.mutation({
      query: (payload) => ({
        url: "/api/classroom/createClassRoom",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ClassRoom"],
    }),

    getAllClassRooms: builder.query({
      query: () => "/api/classroom/getAllClassRooms",
      providesTags: ["ClassRoom"],
    }),

    deleteClassRoom: builder.mutation({
      query: (id) => ({
        url: `/api/classroom/deleteClassRoom/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClassRoom"],
    }),

    getAllClassRoomByAccountId: builder.query({
      query: (id) => `/api/classroom/getClassRoomByAccountId/${id}`,
      providesTags: ["ClassRoom"],
    }),

    joinClass: builder.mutation({
      query: (payload) => ({
        url: "/api/classroom/joinClass",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ClassRoom"],
    }),

    findMyClasses: builder.query({
      query: (arg: string | { id: string; page?: number; limit?: number }) => {
        if (typeof arg === "string") {
          return `/api/classroom/findMyClasses/${arg}`;
        }
        const { id, page = 1, limit = 8 } = arg || ({} as any);
        return {
          url: `/api/classroom/findMyClasses/${id}`,
          params: { page, limit },
        };
      },
      providesTags: ["ClassRoom"],
    }),

    findMyClassesTeacher: builder.query({
      query: (arg: string | { id: string; page?: number; limit?: number }) => {
        if (typeof arg === "string") {
          return `/api/classroom/findMyClassesTeacher/${arg}`;
        }
        const { id, page = 1, limit = 8 } = arg || ({} as any);
        return {
          url: `/api/classroom/findMyClassesTeacher/${id}`,
          params: { page, limit },
        };
      },
      transformResponse: (response: any) => {
        if (response && response.classes) {
          return { data: response.classes, pagination: response.pagination };
        }
        if (Array.isArray(response)) {
          return { data: response };
        }
        return response;
      },
      providesTags: ["ClassRoom"],
    }),

    studentDetails: builder.query({
      query: (id) => `/api/quiz/getQuizResultByUserId/${id}`,
      // providesTags: ["ClassRoom"],
    }),

    resultsByClassId: builder.query({
      query: (arg: string | { id: string; page?: number; limit?: number }) => {
        if (typeof arg === "string") {
          return `/api/quiz/getQuizResultByClassId/${arg}`;
        }
        const { id, page = 1, limit = 20 } = arg || ({} as any);
        return {
          url: `/api/quiz/getQuizResultByClassId/${id}`,
          params: { page, limit },
        };
      },
      transformResponse: (response: any) => {
        if (response && response.data) {
          return response;
        }
        if (Array.isArray(response)) {
          return { data: response };
        }
        return response;
      },
    }),

    //objectives
    createObjective: builder.mutation({
      query: (payload) => ({
        url: "/api/objective/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Objectives"],
    }),

    UploadObjective: builder.mutation({
      query: (payload) => {
        const formData = new FormData();
        formData.append("file", payload.file);

        return {
          url: "/api/objective/uploadCsv", // Make sure this matches your backend endpoint
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Objectives"],
    }),

    findAllObjectives: builder.query({
      query: ({ subject, country }) =>
        `/api/objective/findAllObjectives?subject=${subject}&country=${country}`,
      providesTags: ["Objectives"],
    }),

    deleteObjective: builder.mutation({
      query: (id) => ({
        url: `/api/objective/deleteObjective/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Objectives"],
    }),

    //Questions
    createQuestion: builder.mutation({
      query: (payload) => ({
        url: "/api/question/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Question"],
    }),

    findAllQuestions: builder.query({
      query: () => "/api/question/findAllQuestions",
      providesTags: ["Question"],
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/api/question/deleteQuestion/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Question"],
    }),

    UploadQuestion: builder.mutation({
      query: (payload) => {
        const formData = new FormData();
        formData.append("file", payload.file);

        return {
          url: "/api/question/uploadCsv", // Make sure this matches your backend endpoint
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Question"],
    }),

    //Create Quiz

    createQuiz: builder.mutation({
      query: (payload) => ({
        url: "/api/quiz/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Quiz"],
    }),

    findAllQuiz: builder.query({
      query: () => "/api/quiz/findAllQuiz",
      providesTags: ["Quiz"],
    }),

    findAllQuizById: builder.query({
      query: (arg: string | { id?: string; _id?: string; classId?: string; page?: number; limit?: number }) => {
        if (typeof arg === "string") {
          return `/api/quiz/findQuizByClassId/${arg}`;
        }
        const id = (arg?.id || arg?._id || arg?.classId) as string;
        const page = (arg as any)?.page ?? 1;
        const limit = (arg as any)?.limit ?? 10;
        return {
          url: `/api/quiz/findQuizByClassId/${id}`,
          params: { page, limit },
        };
      },
      transformResponse: (response: any) => {
        if (response && typeof response === 'object' && 'data' in response && 'pagination' in response) {
          return { data: response.data, pagination: response.pagination };
        }
        if (Array.isArray(response)) return { data: response, pagination: null };
        return response;
      },
      providesTags: ["Quiz"],
    }),

    findAllQuizByIdForChild: builder.query({
      query: (arg: { id?: string; _id?: string; classId?: string; childId: string; page?: number; limit?: number }) => {
        const id = (arg?.id || arg?._id || arg?.classId) as string;
        const { childId, page = 1, limit = 10 } = arg || ({} as any);
        return {
          url: `/api/quiz/findQuizByClassIdForChild/${id}/${childId}`,
          params: { page, limit },
        };
      },
      transformResponse: (response: any) => {
        if (response && typeof response === 'object' && 'data' in response && 'pagination' in response) {
          return { data: response.data, pagination: response.pagination };
        }
        if (Array.isArray(response)) return { data: response, pagination: null };
        return response;
      },
      providesTags: ["Quiz"],
    }),

    getAllQuizByObjCode: builder.query({
      query: ({ lo, country, objCode, page = 1, limit = 50 }) =>
        `/api/quiz/getAllQuizByObjCode?country=${country}&lo=${lo}&objCode=${objCode}&page=${page}&limit=${limit}`,
      providesTags: ["Quiz"],
    }),

    updateQuiz: builder.mutation({
      query: (payload) => ({
        url: `/api/quiz/updateOne`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Quiz"],
    }),

    QuizRandomSelect: builder.mutation({
      query: (payload) => ({
        url: "/api/quiz/QuizRandomSelect",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Quiz"],
    }),

    getAllQuizzesByTeacherId: builder.query({
      query: (arg: string | { id: string; page?: number; limit?: number }) => {
        if (typeof arg === "string") {
          return `/api/quiz/getAllQuizByTeacherId/${arg}`;
        }
        const { id, page = 1, limit = 10 } = arg || ({} as any);
        return {
          url: `/api/quiz/getAllQuizByTeacherId/${id}`,
          params: { page, limit },
        };
      },
      providesTags: ["Quiz"],
    }),

    // Analyze Result
    AnalyzeResult: builder.mutation({
      query: (payload) => ({
        url: "/api/quiz/AnalyzeMistake",
        method: "POST",
        body: payload,
      }),
      // invalidatesTags: ["Quiz"],
    }),

    // Analyze Result
    createQuizResult: builder.mutation({
      query: (payload) => ({
        url: "/api/quiz/createQuizResult",
        method: "POST",
        body: payload,
      }),
      // invalidatesTags: ["Quiz"],
    }),

    getPreviousQuestion: builder.mutation({
      query: (payload) => ({
        url: "/api/quiz/previousQuestion",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Quiz"],
    }),
    // Analyze Result
    updateQuizResult: builder.mutation({
      query: (payload) => ({
        url: "/api/quiz/updateQuizResult",
        method: "POST",
        body: payload,
      }),
      // invalidatesTags: ["Quiz"],
    }),
    getQuizResultByUserId: builder.query({
      query: ({ id, page = 1, limit = 5 }: { id: string; page?: number; limit?: number }) => ({
        url: `/api/quiz/getQuizResultByUserId/${id}`,
        params: { page, limit },
      }),
      providesTags: ["Quiz"],
    }),

    getTest: builder.query({
      query: () => "/api/quiz/test",
    }),

    getStrengthsAndweaknesses: builder.mutation({
      query: (payload) => ({
        url: "/api/quiz/getMean",
        method: "POST",
        body: payload,
      }),
      // invalidatesTags: ["Quiz"],
    }),

    generateStudentReport: builder.mutation({
      query: (payload) => ({
        url: "/api/report/generateStudentReport",
        method: "POST",
        body: payload,
      }),
      // invalidatesTags: ["Quiz"],
    }),

    getAllQuiz: builder.mutation({
      query: (payload) => ({
        url: "/api/quiz/getMean",
        method: "POST",
        body: payload,
      }),
      // invalidatesTags: ["Quiz"],
    }),

    getAllChildren: builder.query({
      query: (ids) => `/api/users/getAllChildren?ids=${ids.join(",")}`,
      providesTags: (result) => 
        // Add more specific tags for better cache control
        result 
          ? [
              ...result.map(({ id }: { id: string }) => ({ type: 'AddChild' as const, id })),
              { type: 'AddChild' as const, id: 'LIST' }
            ]
          : [{ type: 'AddChild', id: 'LIST' }],
    }),

    addChild: builder.mutation({
      query: (payload) => ({
        url: "/api/users/addChildLicense",
        method: "POST",
        body: payload,
      }),
      // Invalidate both the specific child and the full list
      invalidatesTags: (result, error, { childId }) => [
        { type: 'AddChild', id: childId },
        { type: 'AddChild', id: 'LIST' }
      ],
    }),

    removeChild: builder.mutation({
      query: (payload) => ({
        url: "/api/users/removeChildLicense",
        method: "POST",
        body: payload,
      }),
      // Invalidate both the specific child and the full list
      invalidatesTags: (result, error, { childId }) => [
        { type: 'AddChild', id: childId },
        { type: 'AddChild', id: 'LIST' }
      ],
    }),

    updatePassScore: builder.mutation({
      query: ({ id, passScore }) => ({
        url: `/api/users/updateScore/${id}`,
        method: "PUT",
        body: { passScore },
      }),
      invalidatesTags: ["AddChild"],
    }),

    updateBio: builder.mutation({
      query: ({ id, bio, newPassword, oldPassword }) => ({
        url: `/api/users/updateBio/${id}`,
        method: "POST",
        body: { bio, newPassword, oldPassword },
      }),
     // invalidatesTags: ["CurrentUser"],
    }),

    updateProfile: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/api/users/updateOne/${id}`,
        method: "PUT",
        body: { payload },
      }),
      invalidatesTags: ["CurrentUser", "User"],
    }),

    // Notifications
    getAllNotificationsByUserId: builder.query({
      query: (id) => `/api/users/getAllNotificationsByUserId/${id}`,
      providesTags: ["Notification"],
    }),

    getChildResult: builder.query({
      query: (arg: string | { childId: string; page?: number; limit?: number }) => {
        if (typeof arg === 'string') {
          return `/api/users/getChildReport/${arg}`;
        }
        const { childId, page = 1, limit = 10 } = arg || ({} as any);
        return {
          url: `/api/users/getChildReport/${childId}`,
          params: { page, limit },
        };
      },
      transformResponse: (response: any) => {
        // Normalize to { data, pagination }
        if (response && response.data) {
          return {
            data: response.data,
            pagination: response.data.pagination || null,
          };
        }
        return response;
      }
    }),

    getChildSandW: builder.mutation({
      query: ({ classId, userId, subject }) => ({
        url: `/api/quiz/childSW`,
        method: "POST",
        body: {
          classId,
          userId,
          subject,
        },
      }),
    }),

    markNotificationAsRead: builder.mutation({
      query: ({ userId, notificationId }) => ({
        url: `/api/users/markNotificationAsRead/${userId}/${notificationId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),

    updateNumberOfLearningObjective: builder.mutation({
      query: ({ id, numberOfLearningObjectives }) => ({
        url: `/api/users/updateNumberOfLearningObjective/${id}`,
        method: "PUT",
        body: { numberOfLearningObjectives },
      }),
      invalidatesTags: ["AddChild"],
    }),

    //classRoom endpoint
    addSubjectPriority: builder.mutation({
      query: (payload) => ({
        url: "/api/users/addSubjectPriority",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AddChild"],
    }),

    //recommendObjectives
    recommendObjectives: builder.query({
      query: () => `/api/users/recommendObjectives`,
      // invalidatesTags: ["User"],
      providesTags: ["User"],
    }),

    /// get student recommendation
    studentRecommendation: builder.mutation({
      query: (payload) => ({
        url: "/api/users/studentRecommendation",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    chat: builder.mutation({
      query: (payload) => ({
        url: "/api/chat/chat",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Chat"],
    }),

    // org admin
    createYearGroup: builder.mutation({
      query: (payload) => ({
        url: "/api/classroom/createNewYearGroup",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["YearGroup"],
    }),
    createArm: builder.mutation({
      query: (payload) => ({
        url: "/api/classroom/createAim",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Arm"],
    }),
    createSubject: builder.mutation({
      query: (payload) => ({
        url: "/api/classroom/createSubject",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Subject"],
    }),
    updateYearGroupByID: builder.mutation({
      query: ({ payload, id }) => ({
        url: `/api/classroom/updateYearGroupByID/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["YearGroup"],
    }),
    updateSubjectByID: builder.mutation({
      query: ({ payload, id }) => ({
        url: `/api/classroom/updateSubjectByID/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Subject"],
    }),
    updateArmByID: builder.mutation({
      query: ({ payload, id }) => ({
        url: `/api/classroom/updateAimByID/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Arm"],
    }),
    deleteYearGroupByID: builder.mutation({
      query: (id) => ({
        url: `/api/classroom/deleteYearGroupByID/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["YearGroup"],
    }),
    deleteSubjectByID: builder.mutation({
      query: (id) => ({
        url: `/api/classroom/deleteSubjectByID/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subject"],
    }),
    deleteAimByID: builder.mutation({
      query: (id) => ({
        url: `/api/classroom/deleteAimByID/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Arm"],
    }),
    getAllYearGroupsByAccountID: builder.query({
      query: (accountId) =>
        `/api/classroom/getAllYearGroupsByAccountID/${accountId}`,
      providesTags: ["YearGroup"],
    }),
    getAllSubjectsByAccountID: builder.query({
      query: (accountId) =>
        `/api/classroom/getAllSubjectsByAccountID/${accountId}`,
      providesTags: ["Subject"],
    }),
    getAllArmsByAccountID: builder.query({
      query: (accountId) => `/api/classroom/getAllAimsByAccountID/${accountId}`,
      providesTags: ["Arm"],
    }),
    quizNextQuestion: builder.mutation({
      query: (data) => ({
        url: '/api/quiz/nextQuestion',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["Quiz"],
    }),

    generateUserGuide: builder.mutation({
      query: (accountId) => ({
        url: '/api/users/generateAndSendUserGuide',
        method: 'POST',
        body: { accountId },
      }),
    }),

    generateLesson: builder.mutation({
      query: (payload) => ({
        url: "/api/lessonplan/generate-lesson",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ClassRoom"],
    }),

    getGeneratedLessons: builder.query({
      query: () => "/api/lessonplan/lessons",
      providesTags: ["ClassRoom"],
    }),

    getLessonPlan: builder.query({
      query: (key) => ({
        url: `/api/lessonplan/lessons/${key}`,
        responseHandler: (response) => response.text(),
      }),
    }),
    deleteLessonPlan: builder.mutation({
      query: (key) => ({
        url: `/api/lessonplan/lessons/${key}`,
        method: "DELETE",
      }),
      // Optimistic update - remove the lesson immediately
        onQueryStarted: async (key, { dispatch, queryFulfilled }) => {
          // Optimistically remove the lesson from cache
          const patchResult = dispatch(
            apiSlice.util.updateQueryData('getGeneratedLessons', undefined, (draft) => {
              if (draft?.lessons) {
                draft.lessons = draft.lessons.filter(lesson => 
                  lesson.key !== key && lesson.filename !== key
                );
              }
            })
          );
          try {
                await queryFulfilled;
              } catch (error) {
                // If the mutation fails, undo the optimistic update
                patchResult.undo();
              }
            },
      invalidatesTags: ['Lesson'],
    }),

  }),
});

export const {
  useLoginMutation,
  useCurrentUserQuery,
  useCreateAccountMutation,
  useGetAllAccountsQuery,
  useGetAccountByIdQuery,
  useCreateUserMutation,
  useStudentRecommendationMutation,
  useRecommendObjectivesQuery,
  useUpdateNumberOfLearningObjectiveMutation,
  useUpdateProfileMutation,
  useValidateEmailAndRegisterUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendPasswordResetToParentMutation,
  useUpdatePasswordAfterResetMutation,
  useDeleteLicenseMutation,
  useDeleteAccountAndUsersMutation,
  useGetUsersByAccountIdQuery,
  useAddMoreLicensesMutation,
  useUpdatePasswordMutation,
  useUpdateMonthlyRequestLimitMutation,
  useCreateAgentMutation,
  useCompleteAgentSignupMutation,
  useGetAllAgentsQuery,
  useUpdateAgentStatusMutation,
  useResendAgentInvitationMutation,
  useDeleteAgentMutation,
  useCreateSchoolByAgentMutation,
  useGetSchoolsByAgentQuery,
  useGetPendingSchoolsQuery,
  useApproveSchoolMutation,
  useRejectSchoolMutation,
  useTransferSchoolMutation,
  useUpdateSchoolTierMutation,
  useGetTierOptionsQuery,
  // Earnings
  useGetAgentEarningsSummaryQuery,
  useGetAgentEarningsBySchoolQuery,
  useGetAgentEarningsHistoryQuery,
  useCalculateEarningsPreviewMutation,
  useGetCommissionSettingsQuery,
  useGetActiveUsersStatsQuery,
  useGetSchoolActivityDetailsQuery,
  useGetAllEarningsOverviewQuery,
  useUpdateCommissionSettingsMutation,
  useAssignSchoolServiceMutation,
  useUpdateStudentCountMutation,
  useMarkEarningsAsPaidMutation,
  //classRoom
  useCreateClassRoomMutation,
  useGetAllClassRoomsQuery,
  useDeleteClassRoomMutation,
  useGetAllClassRoomByAccountIdQuery,
  useJoinClassMutation,
  useFindMyClassesQuery,
  useFindMyClassesTeacherQuery,
  useGetAllChildrenQuery,
  useAddChildMutation,
  useRemoveChildMutation,
  useUpdatePassScoreMutation,
  useUpdateBioMutation,
  useGenerateStudentReportMutation,
  useAddSubjectPriorityMutation,
  useStudentDetailsQuery,
  useResultsByClassIdQuery,
  useCreateYearGroupMutation,
  useUpdateYearGroupByIDMutation,
  useDeleteYearGroupByIDMutation,
  useCreateArmMutation,
  useGetAllArmsByAccountIDQuery,
  useDeleteAimByIDMutation,
  useUpdateArmByIDMutation,
  useCreateSubjectMutation,
  useDeleteSubjectByIDMutation,
  useGetAllSubjectsByAccountIDQuery,
  useGetAllYearGroupsByAccountIDQuery,
  useUpdateSubjectByIDMutation,

  //objectives
  useCreateObjectiveMutation,
  useFindAllObjectivesQuery,
  useDeleteObjectiveMutation,
  useUploadObjectiveMutation,

  //Question
  useCreateQuestionMutation,
  useFindAllQuestionsQuery,
  useDeleteQuestionMutation,
  useUploadQuestionMutation,

  //quiz
  useCreateQuizMutation,
  useFindAllQuizQuery,
  useFindAllQuizByIdQuery,
  useFindAllQuizByIdForChildQuery,
  useQuizRandomSelectMutation,
  useAnalyzeResultMutation,
  useCreateQuizResultMutation,
  useUpdateQuizResultMutation,
  useGetQuizResultByUserIdQuery,
  useGetStrengthsAndweaknessesMutation,
  useGetAllQuizMutation,
  useQuizNextQuestionMutation,
  useGetPreviousQuestionMutation,
  useGetTestQuery,
  useGetAllQuizzesByTeacherIdQuery,
  // useGetAllQuizByObjCodeQuery,
  useUpdateQuizMutation,
  useLazyGetAllQuizByObjCodeQuery,

  // notification
  useGetAllNotificationsByUserIdQuery,
  useMarkNotificationAsReadMutation,

  // chat
  useChatMutation,

  //parent
  useGetChildResultQuery,
  useGetChildSandWMutation,

  // org admin
  useGenerateUserGuideMutation,
  useGenerateLessonMutation,
  useGetGeneratedLessonsQuery,
  useLazyGetLessonPlanQuery,
  useDeleteLessonPlanMutation,
} = apiSlice;
