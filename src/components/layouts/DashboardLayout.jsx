import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { UserContext } from '../../context/UserContext'
import Navbar from './Navbar'
import Loading from "../Loading"

const DashboardLayout = ({children, activeMenu}) => {
   
   const {currentUser} = useSelector(state => state.user)
  const {loading} = useContext(UserContext)
   

   return (
    <div className='h-full'>
      {currentUser && (
        <div className="mx-5 lg:mx-20">
          {loading 
          && <div className="fixed top-14 right-0 left-0 z-50 text-center pt-10 w-full h-[calc(100%-6.5rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50">
            <Loading/>
          </div>}
          
          {children}
        </div>
      )}

      <Navbar activeMenu={activeMenu} />
    </div>
  )
}

export default DashboardLayout