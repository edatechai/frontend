import { createSlice } from "@reduxjs/toolkit";
import { string } from "zod";

type User = {
  user: {
    userInfo: string;
    _id: string;
  };
};

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
export const userInfo = (state: User) => state.user.userInfo;
export default userSlice.reducer;
