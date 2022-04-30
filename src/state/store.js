import { configureStore } from '@reduxjs/toolkit'
import secretReducer from '../state/secretSlice'

export default configureStore({
    reducer: {
        secret: secretReducer
    }
})
