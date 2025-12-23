import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {Link} from "react-router-dom"
import axios from "axios"
import { useEffect } from 'react'
import UserCard from '../../components/Cards/UserCard'
import DashboardLayout from '../../components/layouts/DashboardLayout'

const AdminDashboard = () => {
   const {currentUser} = useSelector(state => state.user)
  
  const [allUsers, setAllUsers] = useState([])


   const fetchAllUsers = async () => {
    try {
      const {data} = await axios.get("/users/get-users")
      if(data?.success) {
        setAllUsers(data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
   } 
  
   useEffect(() => {
    fetchAllUsers()
   }, [])


   return (
    <DashboardLayout activeMenu={"Panel"} >
    <div className="mt-5 mb-10">
    <div className="flex md:flex-row md:items-center justify-between">
      <h2 className="title">Admin Paneli</h2>

    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {allUsers?.map((user) => (
        <Link to={`/admin/user-details/${user.id}`} >
          <UserCard key={user.id} userInfo={user} />
        </Link>
      ))}
    </div>
  </div>
  </DashboardLayout>

  )
}

export default AdminDashboard