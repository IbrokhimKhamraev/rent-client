import React, { useContext, useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Topbar from "../../components/layouts/Topbar";
import { UserContext } from "../../context/UserContext";
import { RENT_MENU_DATA } from "../../utils/data";

const RentHistoryNav = () => {
  const { error, setError, loading, setLoading, navigate } =
  useContext(UserContext);
  const [selectedId, setSelectedId] = useState(null);
  const [rentMenu, setRentMenu] = useState("history-rent");
  useEffect(() => {
    navigate(`/rent/${rentMenu}`);
  }, [rentMenu]);
  return (
    <>
      <Topbar style={"flex justify-between"}>
        <h3 className="title">Tarix</h3>

        <div className="flex items-center gap-6">
          <SelectDropdown
            options={RENT_MENU_DATA}
            value={rentMenu}
            onChange={(value) => setRentMenu(value)}
            loading={loading}
            id={"menu"}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>
      </Topbar>

      <DashboardLayout activeMenu={"Ijara"}>
        <div className="mt-5 bg-white p-6 rounded-lg shadow-md shadow-gray-100 border border-gray-200/50 font-medium flex flex-col justify-between items-center gap-5">
          <Link
            to={`/rent/history-rent/customers`}
            className="flex items-center justify-between w-full border-b pb-3 border-b-gray-500"
          >
            Mijozlar tarixi <MdOutlineKeyboardArrowRight className="text-2xl" />
          </Link>
          <Link
            to={`/rent/history-rent/trade`}
            className="flex items-center justify-between w-full border-b pb-3 border-b-gray-500"
          >
            Savdo tarixi <MdOutlineKeyboardArrowRight className="text-2xl" />
          </Link>
        </div>
      </DashboardLayout>
    </>
  );
};

export default RentHistoryNav;
