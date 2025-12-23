import {createSlice} from "@reduxjs/toolkit"

const initialState = {
   currentUser: null,
   error: null,
   loading: false,
   onlineUsers: [],
   socketConnection: null,
}

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      loginStart: (state) => {
         state.loading = true
      },
      loginSuccess: (state, action) => {
         state.currentUser = action.payload
         state.loading = false 
         state.error = null
      },
      loginFailure: (state, action) => {
         state.error = action.payload
         state.loading = false
      },
      logoutSuccess: (state, action) => {
         state.currentUser = null,
         state.loading = false,
         state.error = null
      },
      setOnlineUsers : (state, action) => {
         state.onlineUsers = action.payload
      },
      setSocketConnection: (state, action) => {
         state.socketConnection = action.payload
      }
   }
})

export const {loginStart, loginSuccess, loginFailure, logoutSuccess, setOnlineUsers, setSocketConnection} = userSlice.actions

export default userSlice.reducer