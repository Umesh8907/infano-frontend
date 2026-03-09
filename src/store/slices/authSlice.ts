import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    phone: string;
    email?: string;
    fullName?: string;
    role: string;
    isDashboardActive: boolean;
    isOnboarded?: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
                // Also set cookie so Next.js middleware can read it for route protection
                document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                // Also clear the cookie
                document.cookie = 'token=; path=/; max-age=0';
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
