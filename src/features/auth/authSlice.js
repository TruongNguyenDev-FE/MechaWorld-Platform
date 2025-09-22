import { } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice";

const initialState = {
    isLoggedIn: false,
    user: null,
    shop: null,
    access_token: null,
    access_token_expires_at: null,
};
export const authSlice = createAppSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.access_token = action.payload.access_token;
            state.access_token_expires_at = action.payload.access_token_expires_at;
        },

        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.access_token = null;
            state.access_token_expires_at = null;
        },

        updateUser: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        },

        updateUserProfile: (state, action) => {
            state.user = action.payload;
        },
    }
})
export const { login, logout, updateUserProfile, updateUser } = authSlice.actions;
export default authSlice.reducer;