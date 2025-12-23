import React from 'react'
import CustomerIcon from '../../assets/customer.png'
import { url } from '../../axios/global-intances'
const GridCard = ({children, tool, inRent}) => {
   return (
      <div className='w-[110px] md:w-[200px] flex flex-col justify-center items-center bg-white rounded-xl shadow-md shadow-gray-100 border border-gray-200 p-2'>
         <div className={`text-5xl p-2 relative`}>
           <img className={`bg-white ${tool ? "rounded-lg w-14 h-14" : "rounded-full w-12 h-12"}`} src={tool ? `${url}/public/${Array.isArray(tool) ? tool[0].img : tool?.img}` : CustomerIcon} alt="" />
            {tool && !Array.isArray(tool) && <div className="w-6 h-6 flex items-center justify-center text-sm font-medium bg-[#4F3FFF] text-white rounded-full absolute right-0 bottom-0">{inRent ? tool.amount : tool.amount - tool.in_rent}</div>}
        </div>
         {children}
      </div>
    )
}

export default GridCard