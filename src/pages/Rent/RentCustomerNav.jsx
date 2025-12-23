import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEllipsisVertical } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import AmountInput from "../../components/Inputs/AmountInput";
import Input from "../../components/Inputs/Input";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Modal from "../../components/Modal";
import { UserContext } from "../../context/UserContext";

const RentCustomerNav = () => {
  const {error, setError, loading, setLoading, navigate} = useContext(UserContext)
  const { currentUser, socketConnection } = useSelector((state) => state.user);

  const { customer_name, customer_id, phone_number } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [openChangeAlert, setOpenChangeAlert] = useState(false)

  const [customer, setCustomer] = useState({});

  const [changeData, setChangeData] = useState({
    seller: "",
    amount: 0,
    description: "",
    date: null,
    customer_id
  });
  
  
  const handleClear = () => {
    setError("");
    setOpenChangeAlert(false)
    setIsOpen(false)
    setChangeData({
      seller: "",
      amount: 0,
      description: "",
      date: null,
      customer_id
    })
  };

  const handleValueChange = (key, value) => {
    setChangeData((prevData) => ({ ...prevData, [key]: value }));
  };

  const fetchCustomer = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const { data } = await axios.get(
        `customers/get-customer/${customer_name}`
      );
      if (data?.success) {
        setCustomer(data.customer);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCustomer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      socketConnection.emit("updateTools", currentUser.id);
      const { data } = await axios.post(`/rent/change-debt?name=${customer_name}&&number=${phone_number}`, changeData);
      if (data?.success) {
        handleClear();
        setChangeData({
          seller: "",
          amount: 0,
          description: "",
          date: null,
          customer_id
        })
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 409 || error.status === 401) {
        toast.error(error.response.data.message);
      }
    }
  }


  return (
    <DashboardLayout activeMenu={"Ijara"}>
      <div
        className={`mt-5 ${
          isOpen && "mb-12"
        } bg-white px-6 py-4 rounded-lg shadow-md shadow-gray-100 border border-gray-200/50 font-medium flex justify-between items-center`}
      >
        <p>Qarzdorlik: {customer?.debt < 0 ? `+${Intl.NumberFormat().format(Math.abs(customer.debt))}` : Intl.NumberFormat().format(customer?.debt)} so'm</p>

        <div className="relative">
          <button
            disabled={loading}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl text-black  bg-white rounded-md flex justify-between items-center"
          >
            <FaEllipsisVertical />
          </button>

          {isOpen && (
            <div
              className={`absolute w-[150px] top-9 right-0 bg-white border border-slate-100 rounded-md mt-1 shawow-md z-10`}
            >
              <div
                onClick={() => setOpenChangeAlert(true)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                Holatni o'zgartirish
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 bg-white p-6 rounded-lg shadow-md shadow-gray-100 border border-gray-200/50 font-medium flex flex-col justify-between items-center gap-5">
        <Link
          to={`give-tool`}
          className="flex items-center justify-between w-full border-b pb-3 border-b-gray-500"
        >
          Mahsulot berish <MdOutlineKeyboardArrowRight className="text-2xl" />
        </Link>
        <Link
          to={`take-tool`}
          className="flex items-center justify-between w-full border-b pb-3 border-b-gray-500"
        >
          Mahsulot qaytarish{" "}
          <MdOutlineKeyboardArrowRight className="text-2xl" />
        </Link>
        <Link
          to={`history`}
          className="flex items-center justify-between w-full border-b pb-3 border-b-gray-500"
        >
          Tarix <MdOutlineKeyboardArrowRight className="text-2xl" />
        </Link>
        <Link
          to={`all-history`}
          className="flex items-center justify-between w-full"
        >
          Mijozning umumiy tarixi{" "}
          <MdOutlineKeyboardArrowRight className="text-2xl" />
        </Link>
      </div>
            
      <Modal
        isOpen={openChangeAlert}
        onClose={handleClear}
        title="Mijozning qarzodlik holatini o'zgartirish"
      >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="w-[250px]">
                <label className="text-xs font-medium text-slate-600">
                  Summasi
                </label>
                <div className="flex gap-5 items-center" >
                <AmountInput
                  value={changeData.amount}
                  onChange={({ target }) => {
                    handleValueChange("amount", target.value), setError("");
                  }}
                  type="number"
                  add={() => {
                    handleValueChange("amount", Number(changeData.amount) + 1), setError("");
                  }}
                  sub={() => {
                    handleValueChange("amount", changeData.amount - 1)
                  }}
                  subDis={changeData.amount === 0}
                />
                so'm
                </div>
              </div>

            <div className="">
              <label className="text-xs font-medium text-slate-600">
                Sotuvchi
              </label>

              <Input
                value={changeData?.seller}
                onChange={({ target }) =>
                  {handleValueChange("seller", target.value), setError("")}
                }
                placeholder="Sotuvchining ismi..."
                type="text"
              />
            </div>

            <div className="">
              <label className="text-xs font-medium text-slate-600">Izoh</label>

              <Input
                value={changeData?.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
                placeholder="Izoh..."
                type="text"
              />
            </div>

            <div className="">
              <label className="text-xs font-medium text-slate-600">
                Berilayotgan vaqt
              </label>

              <Input
                value={changeData.date}
                onChange={({ target }) =>
                  {handleValueChange("date", target.value), setError("")}
                }
                type={"datetime-local"}
              />
            </div>

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <div className="flex justify-end gap-4 pt-4">
              <button
                disabled={loading}
                type="submit"
                className="card-btn-fill"
              >
                {loading ? "JO'NATILMOQDA" : "JO'NATIISH"}
              </button>
              <button
                disabled={loading}
                className="card-btn"
                onClick={handleClear}
              >
                ORTGA
              </button>
            </div>
          </form>
      </Modal>
    </DashboardLayout>
  );
};

export default RentCustomerNav;
