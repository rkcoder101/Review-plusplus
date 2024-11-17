import {configureStore} from '@reduxjs/toolkit'
import userRoleReducer from './userRoleSlice';
const store = configureStore({
    reducer: {
        userRole: userRoleReducer
    }
})
 
export default store;