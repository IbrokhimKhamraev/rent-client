import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Input from '../../components/Inputs/Input'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Topbar from '../../components/layouts/Topbar'
import { UserContext } from '../../context/UserContext'

const RentHistoryTrade = () => {

  const {error, setError, loading, setLoading, navigate} = useContext(UserContext)

  const [mainShow, setMainShow] = useState(0)
  const [todayShow, setTodayShow] = useState(0)
  const [weekShow, setWeekShow] = useState(0)
  const [monthShow, setMonthShow] = useState(0)
  const [yearShow, setYearShow] = useState(0)

  
  
  // const time2 = new Date(date).getTime()
  const months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr",];
 
  
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
  
  const daily = 86400000
  const hourly = 3600000
  const minute = new Date().getMinutes()
  const hour = new Date().getHours()
  const weekday = new Date().getDay()
  const day = new Date().getDate()
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()
  const time = new Date().getTime()
  // const monthstart = new Date(`${month}.01.${year}`)
  const monthstart = `${year}-${month}-01`
  const yearstart = `${year}-01-01`
 
  
  // const time3 = new Date(date2).getTime() + (19 * hourly)
  
  // const weekstart = time - ((weekday === 0 ? weekday + 6 : weekday - 1) * daily) - ((hour * hourly) + (minute * (hourly / 60))) 
  
  // const today = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
  const today = `${year}-${month}-${day < 10 ? `0${day}` : day}`
  const weekstartTime = time - ((weekday === 0 ? weekday + 6 : weekday - 1) * daily) - ((hour * hourly) + (minute * (hourly / 60))) 
  const weekstart = `${new Date(weekstartTime).getFullYear()}-${new Date(weekstartTime).getMonth() + 1}-${new Date(weekstartTime).getDate()}`
  
  const [date, setDate] = useState(monthstart)
  const [date2, setDate2] = useState(today)

  const [start, setStart] = useState(monthstart)
  const [end, setEnd] = useState(time)
  const startDay = new Date(start).getDate()
  const startMonth = new Date(start).getMonth() 
  const endDay = new Date(end).getDate()
  const endMonth = new Date(end).getMonth() 

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (e) => {
    if(e) {
      e.preventDefault()
    }
    setLoading(true)
    try {
      const {data} = await axios.get(`/history/get-trade?today=${today}&&tomorrow=${today.slice(0, 8)}${Number(today.slice(8, 10)) + 1}&&weekstart=${weekstart}&&monthstart=${monthstart}&&yearstart=${yearstart}&&date1=${date}&&date2=${date2.slice(0, 8)}${Number(date2.slice(8, 10)) + 1}`)
      // const {data} = await axios.get(`/history/get-trade?date1=${d1}&&date2=${d2}`)
      setLoading(false)
      if(data.success) {
        setMainShow(data.data[0][0].main);
        setTodayShow(data.data[1][0].todayly);
        setWeekShow(data.data[2][0].weekly);
        setMonthShow(data.data[3][0].monthly);
        setYearShow(data.data[4][0].yearly);
      }
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  return (
    <>
      <Topbar back={true} style={"flex justify-start"}>
        <h3 className="title">savdo tarixi</h3>        
      </Topbar>

      <DashboardLayout activeMenu={"Ijara"} >
        
      <div className='bg-white my-4 p-5 rounded-lg shadow-md shadow-gray-100 border border-gray-200/50 text-center'>
        <p className="text-3xl font-semibold mb-3">{Intl.NumberFormat().format(mainShow) || 0}<span> so'm</span></p>
        <p className='text-sm truncate max-w-[100%] flex justify-between'>
          <span>{date.slice(8, 10)} {getMonth[date.slice(5, 7)]} {date.slice(0, 4)}</span>
          <span>{date2.slice(8, 10)} {getMonth[date2.slice(5, 7)]} {date2.slice(0, 4)}</span>
          {/* <span>{date === '' ? new Date(monthstart).getDate() : startDay} {months[(date === '' ? new Date(monthstart).getMonth()  : startMonth)]} - {date2 === '' ? new Date(time).getDate() : endDay - 1} {months[(date2 === '' ? new Date(time).getMonth() : endMonth)]}</span> */}
        </p>
      </div>

      <div className="mt-5 bg-white p-6 rounded-lg shadow-md shadow-gray-100 border border-gray-200/50 text-md font-medium flex flex-col justify-between items-center gap-5">
        <div className='flex items-center justify-start gap-5 w-full border-b pb-3 border-b-gray-500'>
          <p>Bugungi: </p>
          <span>{Intl.NumberFormat().format(todayShow) || 0}<span> so'm</span></span>
        </div>

      <div className='flex items-center justify-start gap-5 w-full border-b pb-3 border-b-gray-500'>
        <p>Shu Haftaniki: </p>
        <span>{Intl.NumberFormat().format(weekShow) || 0}<span> so'm</span></span>
      </div>

      <div className='flex items-center justify-start gap-5 w-full border-b pb-3 border-b-gray-500'>
        <p>Shu Oyniki: </p>
        <span>{Intl.NumberFormat().format(monthShow) || 0}<span> so'm</span></span>
      </div>

      <div className='flex items-center justify-start gap-5 w-full border-b pb-3 border-b-gray-500'>
        <p>Shu Yilniki: </p>
        <span>{Intl.NumberFormat().format(yearShow) || 0} <span> so'm</span></span>
      </div>
      </div>

        <form className='mt-5 mb-20 p-5 bg-white rounded-lg shadow-md shadow-gray-100 border border-gray-200/50'>
          <div className="flex justify-between">
            <div className="">
              <label className="text-xs font-medium text-slate-600">
                dan
              </label>

              <Input
                value={date}
                onChange={({ target }) =>
                  setDate(target.value)
                }
                type={"date"}
              />
            </div>

            <div className="">
              <label className="text-xs font-medium text-slate-600">
                gacha
              </label>

              <Input
                value={date2}
                onChange={({ target }) =>
                  setDate2(target.value)
                }
                type={"date"}
              />
            </div>
          </div>
          <button type='button' onClick={fetchData} className='btn-primary'>Ko'rish</button>
        </form>
      </DashboardLayout>
    </>
  )
}

export default RentHistoryTrade