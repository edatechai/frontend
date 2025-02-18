import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const getToken = () => {
  const token = localStorage.getItem("Token");
  if (!token) {
    console.log({ token });
  }
  return token;
};


// Define our single API slice object
//https://edatbackend.azurewebsites.net/
//http://localhost:5000
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://edat-backend.onrender.com",
    // baseUrl: "http://localhost:5000/",
    // baseUrl: "https://edatbackend.azurewebsites.net/",
    //https://edatbackend-production-frfhc5aagkhbhafk.eastus-01.azurewebsites.net/
    //https://edatech-backend-production-server-dchucmeddgbtgdcy.ukwest-01.azurewebsites.net/
    //https://edatech-backend-production-server-dchucmeddgbtgdcy.ukwest-01.azurewebsites.net/
    //https://server.edatech.io
    baseUrl: "https://server.edatech.io",
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
      query: (id) => `/api/classroom/findMyClasses/${id}`,
      providesTags: ["ClassRoom"],
    }),

    findMyClassesTeacher: builder.query({
      query: (id) => `/api/classroom/findMyClassesTeacher/${id}`,
      providesTags: ["ClassRoom"],
    }),

    studentDetails: builder.query({
      query: (id) => `/api/quiz/getQuizResultByUserId/${id}`,
      // providesTags: ["ClassRoom"],
    }),

    resultsByClassId: builder.query({
      query: (id) => `/api/quiz/getQuizResultByClassId/${id}`,
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
      query: (id) => `/api/quiz/findQuizByClassId/${id}`,
      providesTags: ["Quiz"],
    }),

    findAllQuizByIdForChild: builder.query({
      query: ({id, childId}) => `/api/quiz/findQuizByClassIdForChild/${id}/${childId}`,
      providesTags: ["Quiz"],
    }),

    getAllQuizByObjCode: builder.query({
      query: ({ lo, country, objCode }) =>
        `/api/quiz/getAllQuizByObjCode?country=${country}&lo=${lo}&objCode=${objCode}`,
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
      query: (id) => `/api/quiz/getAllQuizByTeacherId/${id}`,
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
      query: (id) => `/api/quiz/getQuizResultByUserId/${id}`,
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
              ...result.map(({ id }) => ({ type: 'AddChild' as const, id })),
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
        method: "PUT",
        body: { bio, newPassword, oldPassword },
      }),
      invalidatesTags: ["CurrentUser"],
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
      query: (childId) => `/api/users/getChildReport/${childId}`,
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
  useDeleteLicenseMutation,
  useDeleteAccountAndUsersMutation,
  useGetUsersByAccountIdQuery,
  useAddMoreLicensesMutation,
  useUpdatePasswordMutation,
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
} = apiSlice;
