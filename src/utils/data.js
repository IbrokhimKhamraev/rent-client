import {FaBasketShopping, FaShop, FaHammer, FaUserPlus, FaHouse, FaEllipsisVertical, FaUserTag} from "react-icons/fa6"
import { LuCalendarArrowDown, LuCalendarArrowUp } from "react-icons/lu"
import {ImSortAlphaAsc, ImSortAlphaDesc} from "react-icons/im"

export const MENU_DATA = [
   {
      id: "01",
      label: "Panel",
      icon: FaHouse,
      path: "/admin/dashboard"
   },
   {
      id: "02",
      label: "Ro'yxatdan o'tish",
      icon: FaUserPlus,
      path: "/admin/register"
   },
   {
      id: "03",
      label: "Ma'lumotlar",
      icon: FaUserTag,
      path: "/info"
   }
]

export const MENU_DATA_USER = [
   {
      id: "01",
      label: "Ijara",
      icon: FaHammer,
      path: "/rent"
   },
   {
      id: "02",
      label: "Do'kon",
      icon: FaShop,
      path: "/hardware"
   },
   {
      id: "03",
      label: "Oziq-ovqat",
      icon: FaBasketShopping,
      path: "/grocery"
   },,
   {
      id: "04",
      label: "Ma'lumotlar",
      icon: FaUserTag,
      path: "/info"
   }
]

export const RENT_CUSTOMERS_SORT_DATA = [
   {
      value:"customer_name ASC", 
      label: "Ism A - Z",
      icon: ImSortAlphaAsc,
   }, 
   {
      value:"customer_name DESC", 
      label: "Ism Z - A",
      icon: ImSortAlphaDesc,
   }, 
   {
      value:"id ASC", 
      label: "Avval eskilar",
      icon: LuCalendarArrowUp,
   }, 
   {
      value: "id DESC", 
      label: "Avval yangilar",
      icon: LuCalendarArrowDown,
   }
 ]

 export const RENT_TOOLS_SORT_DATA = [
   {
      value:"tool_name ASC", 
      label: "Nomi A - Z",
      icon: ImSortAlphaAsc,
   }, 
   {
      value:"tool_name DESC", 
      label: "Nomi Z - A",
      icon: ImSortAlphaDesc,
   },
 ]

 export const RENT_MENU_DATA = [
   {value: "customers", label: "Mijozlar", icon: FaEllipsisVertical},
   {value: "history-rent", label: "Tarix", icon: FaEllipsisVertical},
   {value: "tools-rent", label: "Asbob uskunalar", icon: FaEllipsisVertical},
 ]
