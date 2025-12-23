import React from 'react'
import { FaArrowLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Topbar = ({back, children, style}) => {
  return (
   <div className={`flex items-center ${style} gap-2 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] h-[60px] px-5 sticky top-0 z-30`}>
      {back && 
      <Link to={-1}>
         <FaArrowLeft/>
      </Link>}
      
      {children}
   </div>
  )
}

export default Topbar