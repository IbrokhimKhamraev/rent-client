import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { data, useParams } from "react-router-dom";
import ReceiptCard from '../../components/Cards/ReceiptCard';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const RentCustomersAllHistory = () => {
  const {customer_id, phone_number} = useParams()
  const [receipts, setReceipts] = useState([])

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(`/rent/all-history/${customer_id}?number=${phone_number}`);
      if (data?.success && data.data.length > 0) {
        setReceipts(data.data);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 409 || error.status === 401) {
        toast.error(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    fetchHistory()
  },[])

  const bgVariants = {
    unpaid: "bg-emerald-50 text-emerald-500 border border-emerald-500/10 rounded-sm",
    paid: "bg-emerald-50 text-emerald-500 border border-emerald-500/10 rounded-sm",
    debt: "bg-emerald-50 text-emerald-500 border border-emerald-500/10 rounded-sm",
    rent: "bg-cyan-50 text-cyan-500 border border-cyan-500/10 rounded-sm",
  }

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

  const [openId, setOpenId] = useState(null)

  const handleOpen = (id) => {
    setOpenId(openId === id ? null : id)
  }



  return (
    <DashboardLayout>
      <h3 className='font-medium text-center m-4' >Mijozning umumiy tarixi</h3>

      <div className='pb-10'>
      {receipts.length > 0 && receipts.sort((a, b) => a.created_at > b.created_at ? 1 : -1).map(item => (
        <div key={item.id} className="mb-2" >
          <div className={`${bgVariants[item.type]} text-xs px-4 py-1 flex justify-between items-center`} onClick={() => handleOpen(item.id)} >
            <h4>{item.type === "rent" ? "Ketdi" : "Keldi"}</h4>
            <p>{item.created_at.slice(8, 10)} {getMonth[item.created_at.slice(5, 7)]} {item.created_at.slice(0, 4)}</p>
            {openId === item.id ? <FaChevronUp/> : <FaChevronDown/> }
          </div>
          {openId === item.id && <ReceiptCard item={item} getMonth={getMonth} type={item.type}/>}
        </div>
      ))}
      </div>
    </DashboardLayout>
  )
}

export default RentCustomersAllHistory