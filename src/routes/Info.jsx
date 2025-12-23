import axios from 'axios'
import React, { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch} from 'react-redux'
import DashboardLayout from '../components/layouts/DashboardLayout'
import Topbar from '../components/layouts/Topbar'
import { UserContext } from '../context/UserContext'
import { logoutSuccess } from '../redux/user/userSlice'
import Modal from "../components/Modal"
import { LuLogOut } from 'react-icons/lu'

const Info = () => {
   const {error, setError, loading, setLoading, navigate} = useContext(UserContext)

   const dispatch = useDispatch()

   const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
   const [username, setUsername] = useState("")
   const [incomes, setIncomes] = useState("")

   const fetchData = async () => {
    setLoading(true)  
    try {
      const {data} = await axios.get(`/users/user-info`)
      setUsername(data.user.username)
      setIncomes(data.user.incomes)
      setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
   }

   useEffect(() => {
    fetchData()
   }, [])

   const handleSignout = async () => {
    try {
      const {data} = await axios.post("/auth/logout")
      if(data.success) {
        toast.success(data.message)
        dispatch(logoutSuccess())
        navigate('/login')
      }
    } catch (error) {
      console.log(error);
    }
   }

  return (
   <>
      <Topbar style={"flex justify-between"}>
         <h3 className="title">ma'lumotlar</h3>
        <button onClick={() => setOpenDeleteAlert(true)} className='card-btn'> <span className='text-lg'><LuLogOut/></span> Chiqish</button>
      </Topbar>
      <DashboardLayout activeMenu={"Ma'lumotlar"} >
       
      <div className="mt-5 bg-white p-6 rounded-lg shadow-md shadow-gray-100 border border-gray-200/50 text-sm font-medium flex flex-col justify-between items-center gap-5">
        <div className='flex items-center justify-start gap-5 w-full border-b pb-3 border-b-gray-500'>
          <p>Foydalanuvchi: <span className='font-semibold text-lg' >{username}</span></p>
        </div>

      <div className='flex items-center justify-start gap-5 w-full border-b pb-3 border-b-gray-500'>
        <p>Umumiy savdo miqdori: <span className='font-semibold text-lg'>{Intl.NumberFormat().format(Number(incomes))}</span> so'm</p>
      </div>

      </div>

      
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Chiqish"
      >
            <p>Agarda hozir chiqib ketsangiz, qaytib kirish uchun foydalanuvchi nomi va paroli kerak bo'ladi.</p>
            <p>Tizimdan chiqishga aminmisiz ?</p>
            <div className="flex justify-end gap-4 pt-4">
              <button
                disabled={loading}
                onClick={handleSignout}
                className="card-btn-fill"
              >
                Chiqish
              </button>
              <button
                disabled={loading}
                className="card-btn"
                onClick={() => setOpenDeleteAlert(false)}
              >
                ORTGA
              </button>
            </div>
      </Modal>
      </DashboardLayout>
   </>
  )
}

export default Info