import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    collaborators:[] as any
}

const collaboratorSlice  = createSlice({
    name:'collaborators',
    initialState,
    reducers:{
        setCollaborators:(state,action)=>{
            state.collaborators = action.payload.collaborators
        }
    }
})

export const {setCollaborators} = collaboratorSlice.actions;

export const collaboratorReducer = collaboratorSlice.reducer;