import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    logOut: (state) => {
      state.userInfo = null;
    },
  },
});
export const { setUserInfo, logOut } = userSlice.actions;
export const userInfo = (state) => state.user.userInfo;
export default userSlice.reducer;
