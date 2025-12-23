import React from 'react'
import { useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa6"

const Input = ({value, onChange, placeholder, type, loading}) => {
  
   const [showPassword, setShowPassword] = useState(false)
  
   const toggleShowPassword = () => {
      setShowPassword(!showPassword)
   }

  return <div>
    <div className="input-box">
      <input
         type={type === "password" ? showPassword ? "text" : "password" : type === "number" ? "text" : type} 
         placeholder={placeholder} 
         className="w-full bg-transparent outline-none disabled:text-gray-400"
         value={value}
         onChange={(e) => onChange(e)}
         disabled={loading} 
         size={type === "tel" ? "20" : undefined} 
         minLength={type === "tel" ? "3" : undefined} 
         maxLength={type === "tel" ? "17" : undefined}
      />

      {type === "password" && (
         <>
            {showPassword ? (
               <FaRegEye
                  size={22}
                  className="text-primary cursor-pointer"
                  onClick={toggleShowPassword}
               />
            ) : (
               <FaRegEyeSlash
                  size={22}
                  className="text-slate-400 cursor-pointer"
                  onClick={toggleShowPassword}
               /> 
            )}
         </>
      )}
    </div>
  </div>
  
}

export default Input