import React from 'react'

const AmountInput = ({value, onChange, placeholder, type, loading, add, sub, addDis, subDis}) => {
  return <div className="amount-input-box">
  <button
    type="button"
    onClick={sub}
    disabled={subDis}
  >
    -
  </button>
      <input 
         type={type} 
         keyboardType={type}
         placeholder={placeholder} 
         className="w-full text-center bg-transparent outline-none disabled:text-gray-400"
         value={value}
         onChange={(e) => onChange(e)}
         disabled={loading}
         autoCapitalize="none"
         autoCorrect={false} 
      />
  <button
    type="button"
    onClick={add}
    disabled={addDis}
  >
    +
  </button>
</div>
  
}

export default AmountInput