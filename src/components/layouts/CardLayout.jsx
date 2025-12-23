import React from 'react'

const CardLayout = ({children}) => {
  return (         
   <div className='flex justify-between flex-wrap gap-y-6 mb-[100px] md:gap-6 md:justify-center'>
      {children}
    </div>
  )
}

export default CardLayout