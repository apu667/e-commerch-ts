import type { IUser } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user: IUser | null;
}
const initialState: UserState = {
    user: null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser | null>) => {
            state.user = action.payload
        },
        logout: (state) => {
            state.user = null;
        },
    }
})

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;