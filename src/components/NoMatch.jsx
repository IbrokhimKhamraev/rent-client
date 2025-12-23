import React from 'react'
import { Link } from 'react-router-dom'

const NoMatch = () => {
  return (
    <div className='text-center mt-20'>
      <h1 className='text-2xl mb-2'>Sahifa topilmadi.</h1>

      <Link to={'/'} className="text-blue-500">Bosh sahifaga qaytish</Link>
    </div>
  )
}

export default NoMatch