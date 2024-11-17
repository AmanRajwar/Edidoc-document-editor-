import { createSlice, nanoid } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface IState {
    id: string;
    message: string;
}

const initialState = {
    messages: [] as IState[],  // Corrected initial state, empty array is better
};

export const ToastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        openToast: (state, action) => {
            const msg = {
                id: nanoid(),
                message: action.payload,
            }
            state.messages.push(msg);
        },
        closeToast: (state, action) => {
            state.messages = state.messages.filter(msg => msg.id !== action.payload);  // Assign the filtered result
        },
    },
});

export const { openToast, closeToast } = ToastSlice.actions;

export default ToastSlice.reducer;