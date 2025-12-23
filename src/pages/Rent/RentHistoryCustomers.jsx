import React, { useRef, useState, useContext, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Topbar from '../../components/layouts/Topbar'
import Modal from '../../components/Modal'
import { UserContext } from '../../context/UserContext'
import axios from 'axios'
import SearchInput from '../../components/Inputs/SearchInput'
import CardLayout from '../../components/layouts/CardLayout'
import GridCard from '../../components/Cards/GridCard'
import { LuSearch } from 'react-icons/lu'
import {MdClose} from "react-icons/md"
import ReceiptCard from '../../components/Cards/ReceiptCard'

const RentHistoryCustomers = () => {
  
  const {error, setError, loading, setLoading, navigate} = useContext(UserContext)

  const [searchBar, setSearchBar] = useState(false)
  
  const [openAlert, setOpenAlert] = useState(false)
  const [selected, setSelected] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [customers, setCustomers] = useState([])
  
  const inputRef = useRef(null)

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

  const fetchCustomers = async (e) => {
    if(e)  {
      e.preventDefault()
    }
    setCustomers([])
    try {
      const {data} = await axios.get(`/history/get-customers?searchTerm=${inputRef?.current?.value}&&date=${selectedDate === null ? "" : selectedDate}`)
      if(data?.success) {
        setCustomers(data.customers);
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchCustomers()
  }, [selectedDate])


  const getMonth = {
    "01": "Yanvar",
    "02": "Fevral",
    "03": "Mart",
    "04": "Aprel",
    "05": "May",
    "06": "Iyun",
    "07": "Iyul",
    "08": "Avgust",
    "09": "Sentabr",
    "10": "Oktabr",
    "11": "Noyabr",
    "12": "Dekabr"
  }

  return (
    <>
      <Topbar back={true} style={"flex justify-start"}>
        <h3 className="title">mijozlar tarixi</h3>
        
          <div className="flex items-center gap-6 ml-auto">
            <input onChange={(e) => setSelectedDate(e.target.value)} className='w-5' type="date" name="" id="" />

            <button
              disabled={loading}
              type='button'
              onClick={handleSearchBar}
              className="text-2xl text-black  bg-white rounded-md flex justify-between items-center"
            >
              <LuSearch/>
            </button>
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

      {selectedDate !== null && <div className="flex justify-between font-medium capitalize px-5 mx-5 py-4 mt-2 mb-5 bg-white">
        <h3>{selectedDate.slice(8, 10)} {getMonth[selectedDate.slice(5, 7)]} {selectedDate.slice(0, 4)}</h3>
        <button onClick={() => setSelectedDate(null)} type="button">
          <p className="text-2xl">x</p>
        </button>
      </div>}
      <DashboardLayout activeMenu={"Ijara"}>


      {inputRef?.current?.value?.length > 0 && <h3 className='text-center my-4' >"<span className='font-semibold'>{inputRef.current.value}</span>" bo'yicha qidiruv natijalari: {customers.length} ta</h3>}
      {inputRef?.current?.value?.length === 0 && customers.length === 0 && <h3 className='text-center my-4'>Mijozlar topilmadi.</h3>}

      <CardLayout>
      {customers.length > 0 && customers.map(customer => (
        <button type='button' onClick={() => {setSelected(customer), setOpenAlert(true)}}> 
            <p className='text-[10px]' >{customer.created_at.slice(8, 10)} {getMonth[customer.created_at.slice(5, 7)]} {customer.created_at.slice(0, 4)}</p>
            <GridCard>
            <h1 className='font-medium capitalize truncate max-w-[100%]'>{customer.customer_name}</h1>
            <p className='text-xs truncate max-w-[100%]'>{customer.phone_number}</p>
            </GridCard>
        </button>
        ))}
      </CardLayout>
      
      <Modal
        isOpen={openAlert}
        onClose={() => setOpenAlert(false)}
        title={selected?.customer_name}
      >
        <p className='text-center' >{selected?.type === "rent" ? "Ketdi" : "Keldi"}</p>
        <ReceiptCard item={selected} type={selected?.type} getMonth={getMonth} />
      </Modal>
    </DashboardLayout>
    </>
  )
}

export default RentHistoryCustomers