import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOrLoginUser = createAsyncThunk(
    'user/fetchOrLoginUser',
    async (_, thunkAPI) => {
        try {
            
            const oauthResponse = await fetch('http://127.0.0.1:8000/asgns/user_detail/', {
                method: 'GET',
                credentials: 'include',
            });
            if (oauthResponse.ok) {
                return await oauthResponse.json(); 
            }

            
            const loginResponse = await fetch('http://127.0.0.1:8000/asgns/login/', {
                method: 'GET',
                credentials: 'include',
            });
            if (loginResponse.ok) {
                return await loginResponse.json(); 
            }

            throw new Error('Failed to fetch user data from both OAuth and password login.');
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        logout(state) {
            state.user = null;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrLoginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrLoginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(fetchOrLoginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
