import React from 'react'
import UserProvider from './context/UserContext'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import RentCustomers from './pages/Rent/RentCustomers'
import Register from "./pages/Auth/Register"
import Login from './pages/Auth/Login'
import { useSelector } from 'react-redux'
import AdminDashboard from './pages/Admin/AdminDashboard'
import ScrollToTop from './components/ScrollToTop'
import Rent from './routes/Rent'
import Hardware from './routes/Hardware'
import Grocery from './routes/Grocery'
import RentCustomerDetails from './pages/Rent/RentCustomerDetails'
import NoMatch from './components/NoMatch'
import RentGiveTool from './pages/Rent/RentGiveTool'
import RentCustomerNav from './pages/Rent/RentCustomerNav'
import RentTakeTool from './pages/Rent/RentTakeTool'
import RentCustomersHistory from './pages/Rent/RentCustomersHistory'
import RentCustomersAllHistory from './pages/Rent/RentCustomersAllHistory'
import RentTools from './pages/Rent/RentTools'
import UserDetails from './pages/Admin/UserDetails'
import RentHistoryNav from './pages/Rent/RentHistoryNav'
import RentHistoryCustomers from './pages/Rent/RentHistoryCustomers'
import RentHistoryTrade from './pages/Rent/RentHistoryTrade'
import Info from './routes/Info'
import Test from './pages/User/Test'

const App = () => {
  const {currentUser} = useSelector(state => state.user)
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <UserProvider>
        <Routes>
          <Route path='/' element={currentUser?.admin > 0 ? <AdminDashboard/> : <RentCustomers/>}/>

          <Route path='/rent' element={<Rent/>}>
            <Route index element={<RentCustomers/>}/>
            <Route path='customers' element={<RentCustomers/>}/>
            <Route path='customers/customer-details/:customer_name/:customer_id/:phone_number' element={<RentCustomerDetails/>}>
              <Route index element={<RentCustomerNav/>} />
              <Route path='give-tool' element={<RentGiveTool/>} />
              <Route path='take-tool' element={<RentTakeTool/>} />
              <Route path='history' element={<RentCustomersHistory/>} />
              <Route path='all-history' element={<RentCustomersAllHistory/>} />
            </Route>

            <Route path='history-rent' element={<RentHistoryNav/>}/>
            <Route path='history-rent/customers' element={<RentHistoryCustomers/>} />
            <Route path='history-rent/trade' element={<RentHistoryTrade/>} />

            <Route path='tools-rent' element={<RentTools/>}/>

          </Route>

          <Route path='/hardware' element={<Hardware/>}/>
          <Route path='/grocery' element={<Grocery/>}/>
          <Route path='/info' element={<Info/>}/>
    
          <Route path='/admin/dashboard' element={<AdminDashboard/>} />
          <Route path='/admin/user-details/:user_id' element={<UserDetails/>}/>
          <Route path='/admin/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>

          <Route path='*' element={<NoMatch/>} />
          <Route path='/test' element={<Test/>} />

        </Routes>      
      </UserProvider>
    </BrowserRouter>
  )
}

export default App