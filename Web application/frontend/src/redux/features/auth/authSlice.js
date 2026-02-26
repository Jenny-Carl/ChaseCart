import { createSlice } from '@reduxjs/toolkit';

const loadUserFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('user');
        if (serializedState == null) return {user:null};
        return {user:JSON.parse(serializedState)};
    } catch (error) {
        return {user:null};
    }
}
const initialState = loadUserFromLocalStorage();

const authSlice=createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setUser :(state, action)=>{
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(state.user))
        },
        logout: (state)=>{
            // enlevé car sinon ca marche pas //state.user = null;
            localStorage.removeItem('user');
            return { user: null };
        }
    }
})

export const {setUser, logout} = authSlice.actions;
export default authSlice.reducer;