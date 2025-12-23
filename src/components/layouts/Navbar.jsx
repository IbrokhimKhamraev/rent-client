import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { FaUserTag } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MENU_DATA, MENU_DATA_USER } from '../../utils/data'

const Navbar = ({activeMenu}) => {

   const {currentUser} = useSelector(state => state.user)

   const [menuData, setMenuData] = useState([{
      id: "03",
      label: "Ma'lumotlar",
      icon: FaUserTag,
      path: "/info"
   }])

   useEffect(() => {
      if(currentUser) {
         const filteredMenuDataUser = MENU_DATA_USER.filter(item =>  currentUser[item.path.slice('1')] === undefined || currentUser[item.path.slice('1')] !== 0)
         setMenuData(currentUser?.admin > 0 ? MENU_DATA : filteredMenuDataUser)
      }
   }, [currentUser])

   const navigate = useNavigate()

   const handleClick = (route) => {
      navigate(route)
   }


   return (
    <div className='flex items-center gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] h-[60px] px-7 fixed bottom-0 w-full z-30' >
    {menuData.map((item, index) => (
      <button 
         key={`menu_${index}`}
         className={`w-full flex items-center flex-col text-[13px] ${
            activeMenu == item.label
            ? "text-primary"
            : ""
         } cursor-pointer`}
         onClick={() => handleClick(item.path)}
         >
            <item.icon className="text-sm" />
            {item.label}
      </button>
   ))}
    </div>
  )
}

export default Navbar