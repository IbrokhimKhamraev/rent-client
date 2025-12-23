import axios from 'axios'
import React, { useRef } from 'react'
import { useEffect } from 'react'
import { useState, createContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import {loginSuccess, logoutSuccess, setOnlineUsers, setSocketConnection} from "../redux/user/userSlice"

export const UserContext = createContext()

const UserProvider = ({children}) => {

  const {currentUser, onlineUsers} = useSelector(state => state.user)

  const socket = useRef()
  

  useEffect(() => {
    socket.current = io("ws://rent-server-production.up.railway.app:8900")
    dispatch(setSocketConnection(socket.current))
  }, [])
  
  useEffect(() => {
    socket?.current?.on("getUsers", (users) => {
      dispatch(setOnlineUsers(users))
    })
  }, [currentUser])


  const dispatch = useDispatch()
  const navigate = useNavigate()

   const [loading, setLoading] = useState(false)
   const [error, setError] = useState("")

   const fetchUser = async () => {
    try {
      const {data} = await axios.get(`/auth/check-auth?connectId=${currentUser?.connectId}`)
      if(data?.success) {
        dispatch(loginSuccess(data.user))
        socket?.current?.emit("addUser", data.user.id, data.user.connectId)
        socket?.current?.on("getUsers", (users) => {
          dispatch(setOnlineUsers(users))
        })
      } else {
        navigate("/login")
      }
    } catch (error) {
      console.log(error);
      if(error.status === 401 || error.status === 403) {
        dispatch(logoutSuccess())
        navigate("/login")
      }
      console.error("User not authenticated", error)
    }
   } 

   useEffect(() => {
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{loading, setLoading, error, setError, socket, navigate}} >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider