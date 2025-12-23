import React, { useRef, useState, useContext, useEffect } from 'react'
import { FaUserPlus } from 'react-icons/fa6'
import SelectDropdown from '../../components/Inputs/SelectDropdown'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Topbar from '../../components/layouts/Topbar'
import Modal from '../../components/Modal'
import { UserContext } from '../../context/UserContext'
import { RENT_CUSTOMERS_SORT_DATA, RENT_MENU_DATA } from '../../utils/data'
import { getFormattedInputValue } from '../../utils/helper'
import Input from "../../components/Inputs/Input"
import toast from "react-hot-toast"
import axios from 'axios'
import SearchInput from '../../components/Inputs/SearchInput'
import { Link } from 'react-router-dom'
import CardLayout from '../../components/layouts/CardLayout'
import GridCard from '../../components/Cards/GridCard'
import { useSelector } from 'react-redux'
import { LuSearch } from 'react-icons/lu'
import {MdClose} from "react-icons/md"

const RentCustomers = () => {
  
  const {error, setError, loading, setLoading, navigate} = useContext(UserContext)
  const {currentUser, socketConnection} = useSelector(state => state.user)

  const [sortBy, setSortBy] = useState("id DESC")
  const [rentMenu, setRentMenu] = useState("customers")
  const [searchBar, setSearchBar] = useState(false)
  
  const [openCreateAlert, setOpenCreateAlert] = useState(false)
  const [formData, setFormData] = useState({customerName: ""})
  const [phoneValue, setPhoneValue] = useState('+998')
  const [customers, setCustomers] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [arrivalCustomer, setArrivalCustomer] = useState(null)
  
  const inputRef = useRef(null)

  useEffect(() => {
    if(currentUser?.rent === 0 && currentUser?.hardware === 1) {
      navigate('/hardware')
    } else if(currentUser?.rent === 0 && currentUser?.grocery === 1) {
      navigate('/grocery')
    }
  },[currentUser])
  
  useEffect(() => {
    if(socketConnection) {
      socketConnection.on("fetchCustomers", data => {
        setArrivalCustomer({
          user_id: data,
        })
      })
    }
  }, [])
  
  useEffect(() => {
    arrivalCustomer && arrivalCustomer?.user_id === currentUser.id &&
    fetchCustomers()
  }, [arrivalCustomer])


  const handleChange = (e) => {
      setError("")
      const {value} = e.target
      const formattedInputValue = getFormattedInputValue(value)
      setPhoneValue(formattedInputValue)
  }

  const handleClear = () => {
    setError("")
    setPhoneValue("+998")
    setFormData({customerName: ""})
    setOpenCreateAlert(false)
  }

  const handleSearchBar = () => {
    if(inputRef?.current?.value.length > 0) {
      setSearchBar(true)
    }
    if(searchBar) {
      setSearchBar(false)
    } else {
      setSearchBar(true)
      inputRef?.current?.focus()
    }
  }

  const handleAddCustomer = async (e) => {
    e.preventDefault()
    if(!formData.customerName.trim()) {
      setError("Mijozning ismini kiriting")
      return
    }
    if(phoneValue.length < 17) {
      setError("Telefon raqamni to'liq yozing!")
      return
    }
    formData.phoneNumber = phoneValue.split('-').join("")

    socketConnection.emit("addCustomer", currentUser.id
    )

    try {
      const {data} = await axios.post('/customers/add', formData)
      if(data?.success) {
        handleClear()
        setSortBy("id DESC")
        fetchCustomers()
        toast.success(data.message)
      }
    } catch (error) {
      if(error.status === 409 || error.status === 401) {
        toast.error(error.response.data.message)
      }
    }
  }

  const fetchCustomers = async (e) => {
    if(e)  {
      e.preventDefault()
    }
    setCustomers([])
    setLoading(true)
    try {
      const {data} = await axios.get(`/customers/get-customers?searchTerm=${inputRef?.current?.value}`)
      if(data?.success) {
        setCustomers(data.customers);
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleSort = (value) => {
    if(value === "id DESC") {
      customers.sort((a, b) => a.id < b.id ? 1 : -1)
    }
    if(value === "id ASC") {
      customers.sort((a, b) => a.id > b.id ? 1 : -1)
    }
    if(value === "customer_name DESC") {
      customers.sort((a, b) => a.customer_name < b.customer_name ? 1 : -1)
    }
    if(value === "customer_name ASC") {
      customers.sort((a, b) => a.customer_name > b.customer_name ? 1 : -1)
    }
  }

  useEffect(() => {
    navigate(`/rent/${rentMenu}`)
  },[rentMenu])


  return (
    <>
      <Topbar style={"flex justify-between"}>
        <h3 className="title">mijozlar</h3>
        
        <div className="flex items-center gap-6">
          <button disabled={loading} onClick={() => setOpenCreateAlert(true)} className='p-2 text-white bg-blue-400 rounded-full'>
            <FaUserPlus/>
          </button>

          <SelectDropdown
            options={RENT_CUSTOMERS_SORT_DATA}
            value={sortBy}
            onChange={(value) => {setSortBy(value), handleSort(value)}}
            loading={loading}
            id={"sort"}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />

          <button
            disabled={loading}
            type='button'
            onClick={handleSearchBar}
            className="text-2xl text-black  bg-white rounded-md flex justify-between items-center"
          >
            <LuSearch/>
          </button>

          <SelectDropdown
            options={RENT_MENU_DATA}
            value={rentMenu}
            onChange={(value) => setRentMenu(value)}
            loading={loading}
            id={"menu"}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>
      </Topbar>
      <form onSubmit={fetchCustomers} className={`relative shadow-sm rounded-full overflow-hidden mx-5 my-2 transition-all ${searchBar ? "h-11" : "h-0"}`}>
        <SearchInput
          placeholder='Ism yoki telefon raqam kiriting...'
          inputRef={inputRef}
        />

        <button className='absolute right-4 top-2 text-2xl transition-all' onClick={handleSearchBar}>
          <MdClose/>
        </button>
      </form>
      <DashboardLayout activeMenu={"Ijara"}>

      <p>{currentUser?.username}</p>

      {inputRef?.current?.value?.length > 0 && <h3 className='text-center my-4' >"<span className='font-semibold'>{inputRef.current.value}</span>" bo'yicha qidiruv natijalari: {customers.length} ta</h3>}
      {inputRef?.current?.value?.length === 0 && customers.length === 0 && <h3 className='text-center my-4'>Mijozlar topilmadi.</h3>}

      <CardLayout>
      {customers.length > 0 && customers.map(customer => (
        <Link to={`customer-details/${customer?.customer_name}/${customer?.id}/${customer?.phone_number}`} key={customer?.id}> 
            <GridCard>
            <h1 className='font-medium capitalize truncate max-w-[100%]'>{customer.customer_name}</h1>
            <p className='text-xs truncate max-w-[100%]'>{customer.phone_number}</p>
            </GridCard>
        </Link>
        ))}
      </CardLayout>
      
      <Modal
        isOpen={openCreateAlert}
        onClose={handleClear}
        title="Yangi mijoz qo'shish"
      >
        <form onSubmit={handleAddCustomer} >
          <Input
            value={formData.customerName}
            onChange={({target}) => {setFormData({...formData, customerName: target.value}), setError("")}}
            placeholder="Mijozning ismi"
            type="text"  
          />
          <Input
            value={phoneValue}
            onChange={handleChange}
            placeholder="Mijozning telefon raqami"
            type="tel"  
          />

         {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

         <div className="flex justify-end gap-4 pt-4">
            <button disabled={loading} type="submit" className="card-btn-fill">{loading ? "QO'SHILMOQDA" : "QO'SHISH"}</button>
            <button disabled={loading} className="card-btn" onClick={handleClear}>ORTGA</button>
         </div>
        </form>
      </Modal>
    </DashboardLayout>
    </>
  )
}

export default RentCustomers