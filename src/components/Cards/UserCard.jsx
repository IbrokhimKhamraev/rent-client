import React from 'react'

const UserCard = ({userInfo}) => {
     const getServerTagColor = (status) => {
      switch (status) {
         case "rent":
            return "text-cyan-500 bg-cyan-50 border border-cyan-500/10 py-0.5 px-4 rounded";
      
         case "hardware":
            return "text-lime-500 bg-lime-50 border border-lime-500/20 py-0.5 px-4 rounded";
      
         default:
            return "text-violet-500 bg-violet-50 border border-violet-500/10 py-0.5 px-4 rounded";
      }
   }
   const getDiscount = (dis) => {
    switch (dis) {
       case "seventh":
          return "6 + 1";
    
       case "friday":
          return "Juma";
    
       default:
          return "Oddiy";
    }
 }
  return (
    <div className="user-card p-2">
      <p className="text-sm font-medium">{userInfo?.username}</p>
      {/* <div className='flex gap-3 items-center text-[11px] my-2'>
        {userInfo.rent > 0 && <p className={`${getServerTagColor("rent")}`} >Ijara</p>}
        {userInfo.hardware > 0 &&  <p className={`${getServerTagColor("hardware")}`} >Do'kon</p>}
        {userInfo.grocery > 0 &&  <p className={`${getServerTagColor("grocesry")}`} >Oziq-ovqat</p>}
      </div>

      <div>
        <label className="text-xs text-gray-500">Chegirma</label>
        <p className='text-[13px] font-medium text-gray-900'>{getDiscount(userInfo.discount)}</p>
      </div> */}
    </div>
  )
}

export default UserCard
