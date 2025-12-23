import React, { useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'

const SelectDropdown = ({ options, value, onChange, placeholder, loading, select, id, selectedId, setSelectedId}) => {
  
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option) => {
   onChange(option)
   setIsOpen(false)
   setSelectedId(null)
  }


  const change = () => {
   if(!isOpen) {
      setIsOpen(true)
      setSelectedId(id)
      return
   } else if(id !== selectedId) {
      setIsOpen(true)
      setSelectedId(id)
      return
   }
   setIsOpen(false)
   setSelectedId(null)
   return 
   }

  const DynamicIcon = () => {
      const IconComponent = options.find((opt) => opt.value === value)?.icon

      return <IconComponent/>
  }   

   return <div className="relative w-full">
      {/* Dropdown Button */}
      {select ? <button
         disabled={loading}
         type='button'
         onClick={() => setIsOpen(!isOpen)}
         className="w-full text-sm text-black outline-none bg-white border border-slate-200 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center"
      >
         {value ? options?.find((opt) => opt.value === value)?.label : placeholder}
         <p className="ml-2">{isOpen ? <LuChevronDown className="rotate-180" /> : <LuChevronDown/> }</p>
      </button>
      
      : <button
         disabled={loading}
         type='button'
         onClick={change}
         className="text-2xl text-black  bg-white rounded-md flex justify-between items-center"
      >
        <DynamicIcon/>
      </button>

      }

      {/* Dropdown Menu */}
      {select ? isOpen && (
         <div className={`absolute ${select ?  'w-full' : 'w-[150px] right-0'} bg-white border border-slate-100 rounded-md mt-1 shawow-md z-10`}>
            {options?.map((option) => (
               <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
               >
                  {option.label}
               </div>
            ))}
         </div>
      )
      : selectedId === id && (
         <div className={`absolute ${select ?  'w-full' : 'w-[150px] right-0'} bg-white border border-slate-100 rounded-md mt-1 shawow-md z-10`}>
            {options?.map((option) => (
               <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
               >
                  {option.label}
               </div>
            ))}
         </div>
      )
      }
   </div>
  
}

export default SelectDropdown