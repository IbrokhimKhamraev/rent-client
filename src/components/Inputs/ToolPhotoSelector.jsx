import React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { LuUpload, LuTrash } from "react-icons/lu"
import { LiaToolsSolid } from "react-icons/lia"
import { url } from '../../axios/global-intances'

const ToolPhotoSelector = ({image, setImage, toolId, setUpdImage, updImage}) => {
  
   const inputRef = useRef(null)
   const [previewUrl, setPreviewUrl] = useState(null)
   
   const handleImageChange = (event) => {
      const file = event.target.files[0]
      if(file) {
         // Update the image state
         setImage(file)

         // Generate preview URL from the file
         const preview = URL.createObjectURL(file)
         setPreviewUrl(preview)
      }
   }

   const handleRemoveImage = () => {
      setImage(null)
      setPreviewUrl(null)
      toolId && setUpdImage(true)
   }

   const onChooseFile = () => {
      inputRef.current.click()
   }
   return <div className="flex justify-center mt-3 mb-6">
      <input 
         type="file" 
         accept='image/*'
         ref={inputRef}
         onChange={handleImageChange}
         className="hidden"
      />


      {!image ? (
         <div>
         <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 relative cursor-pointer">
            <LiaToolsSolid className='text-4xl text-primary'/> 
         </div>
            <button type='button' className='w-full text-sm flex items-center justify-center gap-1 p-1 bg-primary text-white rounded-lg cursor-pointer'  onClick={onChooseFile}>Rasm <LuUpload/></button>
      </div>
      ) : (
         <div className="relative">
            {toolId ?
            updImage ? 
            <img src={previewUrl} alt="profile photo" className='w-20 h-20 object-cover'/> 
            : 
            <img src={`${url}/public/${image}`} alt="profile photo" className='w-20 h-20 object-cover'/>
            : <img src={previewUrl} alt="profile photo" className='w-20 h-20 object-cover'/>
            }
            <button type='button' className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1' onClick={handleRemoveImage}><LuTrash/></button>
         </div>
      ) }
   </div>
}

export default ToolPhotoSelector