import React from 'react'
import LOGO_BLACK from "../../assets/black.svg"
import LOGO_WHITE from "../../assets/white.svg"

const AuthLayout = ({children, title}) => {
  return <div className="flex flex-col md:flex-row justify-center h-screen">
      <div className="flex items-center justify-center md:w-[40vw] md:h-screen md:bg-blue-50 md:bg-[url('/bg-img.jpeg')] bg-cover bg-no-repeat bg-center overflow-hidden md:p-8">
         <div className="md:hidden">
            <img src={LOGO_BLACK} className="w-20  md:w-64"/>
         </div>
         <div className="hidden md:block">
            <img src={LOGO_WHITE} className="w-20  md:w-64"/>
         </div>
      </div>

      <div className="md:h-screen md:w-50vw px-12 pt-8 pb-12">
         {children}
      </div>
  </div>
}

export default AuthLayout