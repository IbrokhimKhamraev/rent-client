import React, { useRef } from 'react'
import { useEffect } from 'react'

const SearchInput = ({placeholder, loading, inputRef}) => {
  
  return <div>
    <div className="w-full text-sm text-black bg-slate-100/50 rounded px-4 py-3 border border-slate-200 outline-none">
      <input 
         type="text" 
         placeholder={placeholder} 
         className="w-full bg-transparent rounded-full outline-none disabled:text-gray-400"
         disabled={loading}
         ref={inputRef}
      />
    </div>
  </div>
  
}

export default SearchInput