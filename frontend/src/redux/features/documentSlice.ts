import { createSlice } from "@reduxjs/toolkit";

interface DocumentState {
    userDocuments: any | null;
    openedDocument: any  | null;
    notUserDocuments: any  | null;
    onlyUserDocuments: any  | null;
} 

const initialState:DocumentState = {
    userDocuments: null,// owned by anyone 
    notUserDocuments:null, // owned by other user
    onlyUserDocuments:null,// owned by user 
    openedDocument:null
}

const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setDocuments: (state, action) => {
            state.userDocuments = action.payload.documents
        },
        setOpenedDocument:(state,action)=>{
            state.openedDocument = action.payload.openedDocument
        },
        setOnlyUserDocument:(state,action)=>{
            state.onlyUserDocuments = action.payload.documents
        },
        setNotUserDocument:(state,action)=>{
            state.notUserDocuments = action.payload.documents
        },
    }
})

const documentReducer = documentSlice.reducer;

export const {setDocuments,setOpenedDocument,setOnlyUserDocument,setNotUserDocument} = documentSlice.actions;
export default documentReducer;