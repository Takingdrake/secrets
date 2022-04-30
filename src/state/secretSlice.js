import { createSlice } from '@reduxjs/toolkit'
import {
    set,
    ref,
} from "firebase/database";
import { db } from "../firebase/firebase"

export const secretSlice = createSlice({
    name: 'secret',
    initialState: {
        uid: "",
        secrets: {}
    },
    reducers: {
        addUID: (state, action) => {
            state.uid = action.payload
        },
        loadSecrets: (state, action) => {
            action.payload.forEach(v => state.secrets[v] = "")
            if(state.uid){
                set( ref(db, state.uid + '/secrets'), Array(...Object.keys(state.secrets)).sort() );
            }
        },
        addSecret: (state, action) => {
            if( !(action.payload in state.secrets) ){

                state.secrets[action.payload] = ""

                if(state.uid){
                    set( ref(db, state.uid + '/secrets'), Array(...Object.keys(state.secrets)).sort() );
                }
            }
        },
        deleteSecret: (state, action) => {
            if( action.payload in state.secrets ){

                delete state.secrets[action.payload]

                if(state.uid){
                    set( ref(db, state.uid + '/secrets'), Array(...Object.keys(state.secrets)).sort() );
                }
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const { addSecret, deleteSecret, loadSecrets, addUID } = secretSlice.actions

export const selectUID = (state) => state.secret.uid
export const selectSecrets = (state) => state.secret.secrets

export default secretSlice.reducer