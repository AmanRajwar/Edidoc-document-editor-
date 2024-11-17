import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from 'react-redux'
import ToastSlice from "./features/ToastSlice";
import userReducer from "./features/userSlice";
import documentReducer from "./features/documentSlice";
import { collaboratorReducer } from "./features/collaboratorSlice";
export const store = configureStore({
    reducer: {
        toast: ToastSlice,
        user:userReducer,
        documents:documentReducer,
        collaborators:collaboratorReducer
    }
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;



// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()