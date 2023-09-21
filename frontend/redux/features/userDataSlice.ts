// "use client"

// // userDataSlice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import { AppThunk, RootState } from "../store"; // Adjust the path based on your project structure
// import { useParams } from "next/navigation";

// const initialState = {
//   user: null, // Modify this structure based on your data
// };

// const userDataSlice = createSlice({
//   name: "userData",
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<any>) => {
//       state.user = action.payload;
//     },
//   },
// });

// export const { setUser } = userDataSlice.actions;
// export default userDataSlice.reducer;


// export const fetchUserData = (): AppThunk => async (dispatch) => {
//   const User = useParams().username;
//   try {
//     const response = await axios.get(`http://localhost:3000/profile/${User}`); // Adjust the endpoint
//     dispatch(setUser(response.data));
//   } catch (error) {
//     // Handle error if needed
//   }
// };

// export const selectUserData = (state: RootState) => state.userData.user;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserData = {
  value: object;
};

const initialState = {
  value: {},
} as UserData;

export const userData = createSlice({
    name: "userData",
    initialState,
    reducers: {
      reset: () => initialState,
      setUserData: (state, action: PayloadAction<object>) => {
        state.value = action.payload ;
      },
    },
  });

  export const {setUserData} = userData.actions;
  export default userData.reducer;
