import React from 'react'

const ReceiptCard = ({item, getMonth, type}) => {

  const dueVariants = {
    daily: "kunlik",
    hourly: "soatlik"
  }

  const typeVariants = {
    piece: "dona",
    set: "komplekt",
    metr: "metr",
  }

  const signetType = {
    debt: {style: "bg-emerald-50 text-emerald-500 border border-emerald-500", text: "to'langan"},
    paid: {style: "bg-emerald-50 text-emerald-500 border border-emerald-500", text: "to'langan"},
    unpaid: {style: "bg-rose-50 text-rose-500 border border-rose-500", text: "to'lanmagan"},
  }

  return (
    <div className='p-5 bg-white mb-5 uppercase'>
      <p className='text-center font-medium pb-3 border-dotted border-b-1'>{item.created_at.slice(8, 10)} - {getMonth[item.created_at.slice(5, 7)]}, {item.created_at.slice(0, 4)} - yil, soat: {item.created_at.slice(11, 16)}</p>
      <div className='py-3 border-dotted border-b-1' >
        <p className='text-[13px] flex justify-between mb-2'>sotuvchi: <span className='font-medium'>{item.seller_name}</span></p>
        <p className='text-[13px] flex justify-between'>izoh: <span className='font-medium text-end'>{item.desc}</span></p>
      </div>
      <div className='py-4 border-dotted border-b-1 flex flex-col gap-3'>
        {type !== "debt" ? item.tools.map(tool => (
          <div key={tool.id} className='text-[13px] flex gap-x-3 flex-wrap'>
            <p>{tool.amount} ta</p>
            <p>{tool.tool_name}</p> 
            <p>{dueVariants[tool.due]}</p> 
            <p>{Intl.NumberFormat().format(tool.price)} so'm</p>
            <p>{typeVariants[tool.typeAmount]} ga</p>
            {tool.amountAdditional > 0 && <p>{tool.amountAdditional} ta {tool.nameAdditional}</p>}
          </div>
        ))
          : <div className='text-[13px] flex gap-x-3 flex-wrap'>
              Qarzdorlik yoki avans uchun berilgan pul
            </div>
      }
      </div>
      {
        type !== 'rent' && <div className='mt-2 border-dotted border-b-1 pb-1 flex items-center'>

          <p className={`${signetType[type].style} w-max h-max mx-auto p-2 font-semibold origin-bottom -rotate-10`}>
            {signetType[type].text}
          </p>
          <div className="flex flex-col items-end font-medium text-[13px]">
              <div className="flex items-end gap-3">
                <p className="text-[12px]">Jami:</p>
                <p>{Intl.NumberFormat().format(item.subtotal.toFixed(0))} so'm</p>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-[12px]">Chegirma:</p>
                <p>{Intl.NumberFormat().format(item.discount.toFixed(0))} so'm</p>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-[12px]">To'lov:</p>
                <p>
                  {Intl.NumberFormat().format(item.subtotal.toFixed(0) - item.discount.toFixed(0))} so'm
                </p>
              </div>
            </div>
        </div>
      }
    </div>
  )
}

export default ReceiptCard