import React from 'react'
import { useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { UserContext } from '../../context/UserContext'
import Input from "../../components/Inputs/Input"
import { useState } from 'react'
import SelectDropdown from '../../components/Inputs/SelectDropdown'
import { Link } from 'react-router-dom'
import axios from "axios"
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layouts/DashboardLayout'

const Register = () => {

   const {error, setError, loading, setLoading} = useContext(UserContext)
   const [username, setUsername] = useState("")
   const [password, setPassword] = useState("")
   const [dis, setDis] = useState("simple")

   const [checkList, setChecklist] = useState([
      {text: "Uskunalar ijarasi", have: false},
      {text: "Qurilish mollari", have: false},
      {text: "Oziq-ovqat", have: false},
   ])

   const updateChecklist = (e) => {
      if(error.trim()) {
        setError("")
      }
     const filter = checkList.filter(item => item.text !== e.text)     
     setChecklist([{text: e.text, have: !e.have}, ...filter])
    }

    const discount = [{label: "6 + 1", value:"seventh"}, {label: "Juma", value:"friday"}, {label: "Oddiy", value: "simple"}]

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
      if(!checkList.some(item => item.have)) {
        setError("Biror bir hizmat turini tanlang")
        return
      }

      setLoading(true)
      try {
        const {data} = await axios.post("/auth/register", {username, password, checkList, discount: dis})
        if(data.success) {
          toast.success(data.message)
          setUsername("")
          setPassword("")
          setDis("simple")
          setChecklist([
            {text: "Uskunalar ijarasi", have: false},
            {text: "Qurilish mollari", have: false},
            {text: "Oziq-ovqat", have: false},
         ])
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        if(error.status === 409 || error.status === 401) {
          toast.error(error.response.data.message)
        }
      }
    }


  return (
    <DashboardLayout activeMenu={"Ro'yxatdan o'tish"} >
          <AuthLayout> 
      <div className="flex flex-col justify-center w-full items-center h-full">
      <h3 className="title mb-3">Register</h3>
      
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

          <SelectDropdown
            select={true}
            options={discount}
            value={dis}
            onChange={(value) => setDis(value)}
            loading={loading}
          />

         {checkList?.sort((a, b) => (a.text > b.text) ? -1 : 1)?.map((item, index) => (
                <TodoCheckList
                  key={`todo_${index}`}
                  text={item.text}
                  isChecked={item?.have}
                  onChange={() => updateChecklist(item)}
                  loading={loading}
                />
          ))}
         </div>

         {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

         <button disabled={loading} type='submit' className="btn-primary">{loading ? "Yuklanmoqda" : "Ro'yxatdan o'tish"}</button>
      </form>
      <Link to={'/login'} className="text-[13px] mt-2 text-blue-700">Hisobga kirish</Link>
      </div>
    </AuthLayout>
    </DashboardLayout>
  )
}

export default Register


const TodoCheckList = ({text, isChecked, onChange, loading}) => {
   return <div className="flex items-center gap-3 p-3">
     <input 
       disabled={loading}
       type="checkbox" 
       checked={isChecked}
       onChange={onChange}
       className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"  
     />
 
     <p className="text-[13px] text-gray-800">{text}</p>
   </div>
 }