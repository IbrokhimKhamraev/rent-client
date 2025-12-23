import React from "react";

const CalculateCard = ({ item }) => {
   const dueVariants = {
      daily: "kunlik",
      hourly: "soatlik"
    }
  
    const typeVariants = {
      piece: "dona",
      set: "komplekt",
      metr: "metr",
    }
  return (
    <div key={item.id} className="text-[13px] px-5 pb-2 bg-white uppercase border-b-1 border-dotted">
      <div className="text-[13px] flex gap-x-3 flex-wrap">
        <p>{item.amount} ta</p>
        <p>{item.tool_name}</p>
        <p>{dueVariants[item.due]}</p>
        <p>{Intl.NumberFormat().format(item.price)} so'm</p>
        <p>{typeVariants[item.typeAmount]} ga</p>
        {item.amountAdditional > 0 && (
          <p>
            {item.amountAdditional} ta {item.nameAdditional}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-4 mt-2 text-[12px] font-medium">
        {item.employeDiscount > 0 && (
          <div className="flex flex-col items-center">
            <p className="text-[10px]">Jami</p>
            <p>{Intl.NumberFormat().format(item.subtotal.toFixed(0))} so'm</p>
          </div>
        )}
        {item.employeDiscount > 0 && (
          <div className="flex flex-col items-center">
            <p className="text-[10px]">Chegirma</p>
            <p>{Intl.NumberFormat().format(item.employeDiscount.toFixed(0))} so'm</p>
          </div>
        )}
        <div className="flex flex-col items-center">
          <p className="text-[10px]">To'lash summasi</p>
          <p>
            {Intl.NumberFormat().format(item.subtotal.toFixed(0) - item.employeDiscount.toFixed(0))} so'm
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculateCard;
