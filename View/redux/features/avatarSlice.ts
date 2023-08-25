import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OpponentAvatarState = {
  value: string;
};

const initialState = {
  value: "",
} as OpponentAvatarState;

export const opponentAvatar = createSlice({
    name: "opponentAvatar",
    initialState,
    reducers: {
      reset: () => initialState,
      setOpponentAvatar: (state, action: PayloadAction<string>) => {
        state.value = action.payload ;
      },
    },
  });

  export const {setOpponentAvatar} = opponentAvatar.actions;
  export default opponentAvatar.reducer;