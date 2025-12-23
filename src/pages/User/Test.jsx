import React from 'react'
import axios from "axios"
import Topbar from "../../components/layouts/Topbar"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { useState } from 'react'
import { useEffect } from 'react'

const Test = () => {
  
   const [users, setUsers] = useState([])

   const fetchUsers = async () => {
      try {
         const {data} = await axios.get("/users/test")
         setUsers(data.users);
      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      fetchUsers()
   }, [])
  
   return (
    <>
      <Topbar back={true}>
         <h1 className="title">Test</h1>
      </Topbar>
      <DashboardLayout>
         <h1>Foydalanuvchilar: {users.length} ta</h1>
         {users.length > 0 && users.map((user, i) => (
            <div key={i} >
               <p>{i + 1}. {user?.username}</p>
            </div>
         ))}
      </DashboardLayout>
    </>
  )
}

export default Test