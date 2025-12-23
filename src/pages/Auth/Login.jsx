import React from 'react'
import { useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { UserContext } from '../../context/UserContext'
import Input from "../../components/Inputs/Input"
import { useState } from 'react'
import axios from "axios"
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess } from '../../redux/user/userSlice'

const Login = () => {

   const [username, setUsername] = useState("")
   const [password, setPassword] = useState("")

  const {error, setError, navigate, loading, setLoading} = useContext(UserContext) 
  const dispatch = useDispatch()

    const handleSubmit = async (e) => {
      e.preventDefault()
      if(!username.trim()) {
        setError("Foydalanuvhi nomini kiriting") 
        return
      }

      if(!password.trim()) {
        setError("Parolni kiriting")
        return 
      }
      setLoading(true)
      try {
        const {data} = await axios.post("/auth/login", {username, password})
        if(data.success) {
          if(data.user.active === 1) {
            toast.success(data.message)
            dispatch(loginSuccess(data.user))
            setUsername("")
            setPassword("")
            if(data.user.admin > 0) {
              navigate("/admin/dashboard")
            } else {
              navigate("/")
            }
          }
        }
        setLoading(false)
      } catch (error) {
        console.error(error.response.data.message)
        if(error.status === 403) {
          setError(error.response.data.message)
        }

        setLoading(false)
      }
    }
    
  return (
    <AuthLayout> 
      <div className="flex flex-col justify-center w-full items-center h-full">
      <h3 className="title mb-3">Login</h3>
      
      <form className="w-full" onSubmit={handleSubmit} >
         <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
         <Input
            value={username}
            onChange={({target}) => {setError(""),setUsername(target.value)}}
            placeholder="Foydalanuvchi ismi"
            type="text"
            loading={loading}
         />

         <Input
            value={password}
            onChange={({target}) => {setError(""), setPassword(target.value)}}
            placeholder="Parol"
            type="password"
            loading={loading}
         />

         </div>

         {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

         <button disabled={loading} type='submit' className="btn-primary">{loading ? "Yuklanmoqda" : "Hisobga kirish"}</button>
      </form>
      </div>
    </AuthLayout>
  )
}

export default Login
