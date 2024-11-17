import { createSlice } from "@reduxjs/toolkit";

interface IUser {
    user: {
        id:string | undefined
    } | undefined;
}

const initialState = {
    user: undefined
} as IUser;

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = { id: action.payload };
        }
    }
})

const userReducer = userSlice.reducer;

export const { setUser } = userSlice.actions;

export default userReducer;