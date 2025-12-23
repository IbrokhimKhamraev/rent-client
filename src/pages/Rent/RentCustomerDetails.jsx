import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import {  Outlet, useParams } from "react-router-dom";
import Topbar from "../../components/layouts/Topbar";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const RentCustomerDetails = () => {
  const { customer_name, customer_id } = useParams();
  const { setLoading, navigate } = useContext(UserContext);

  const { currentUser, socketConnection } = useSelector((state) => state.user);

  const [customer, setCustomer] = useState({});

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const fetchCustomer = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const { data } = await axios.get(`customers/get-customer/${customer_name}`);
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

  const deleteCustomer = async () => {
    try {
      const { data } = await axios.delete(
        `customers/delete-customer/?id=${customer_id}&&name=${customer_name}&&number=${customer.phone_number}`
        );
        if (data?.success) {
          setOpenDeleteAlert(false);
          socketConnection.emit("deleteCustomer", currentUser.id);
          toast.success(data.message);
          navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Topbar back={true} style={"justify-between"}>
        <div className="flex flex-col justify-center items-center">
          <h3 className="title">{customer?.customer_name}</h3>
          <p className="text-xs">{customer?.phone_number}</p>
        </div>
        <div className="">
          <button
            className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
            onClick={() => setOpenDeleteAlert(true)}
          >
            <LuTrash2 className="text-base" />
          </button>
        </div>
      </Topbar>
      <Outlet />

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Mijozni o'chirish"
      >
        <DeleteAlert
          content="Ushbu mijozni o'chirishga aminmisiz?"
          onDelete={() => deleteCustomer()}
        />
        
      </Modal>
    </>
  );
};

export default RentCustomerDetails;
