import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import DeleteAlert from "../../components/DeleteAlert";
import Input from "../../components/Inputs/Input";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Topbar from "../../components/layouts/Topbar";
import Modal from "../../components/Modal";
import { UserContext } from "../../context/UserContext";

const UserDetails = () => {
  const {error, setError, loading, setLoading, navigate} = useContext(UserContext)

  const { user_id } = useParams();

  const [user, setUser] = useState({});
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dis, setDis] = useState("simple");

  const [checkList, setChecklist] = useState([]);

  const updateChecklist = (e) => {
    if (error.trim()) {
      setError("");
    }
    const filter = checkList.filter((item) => item.text !== e.text);
    setChecklist([{ text: e.text, have: !e.have }, ...filter]);
  };

  const discount = [
    { label: "6 + 1", value: "seventh" },
    { label: "Juma", value: "friday" },
    { label: "Oddiy", value: "simple" },
  ];

  const fetchUser = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const { data } = await axios.get(`users/get-user-detail/${user_id}`);
      if (data?.success) {
        setUser(data.user);
        setUsername(data.user.username)
        setChecklist([  
          { text: "Uskunalar ijarasi", have: data.user.rent === 1},
          { text: "Qurilish mollari", have: data.user.hardware === 1},
          { text: "Oziq-ovqat", have: data.user.grocery === 1},
          { text: "Faol", have: data.user.active === 1},
        ])
          setDis(data.user.discount)
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUser();
  }, []);

  const deleteUser = async () => {
    try {
      const { data } = await axios.delete(
        `users/delete-user/${user_id}`
      );
      if (data?.success) {
        setOpenDeleteAlert(false);
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!username.trim()) {
      setError("Foydalanuvhi nomini kiriting") 
      return
    }

    if(!checkList.some(item => item.have)) {
      setError("Biror bir hizmat turini tanlang")
      return
    }

    setLoading(true)
    try {
      const {data} = await axios.put(`users/update-user-detail/${user_id}`, {username, password, checkList, discount: dis})
      if(data.success) {
        console.log(data);
        toast.success(data.message)
        setPassword("")
        setUser(data.user);
        setUsername(data.user.username)
        setChecklist([  
          { text: "Uskunalar ijarasi", have: data.user.rent === 1},
          { text: "Qurilish mollari", have: data.user.hardware === 1},
          { text: "Oziq-ovqat", have: data.user.grocery === 1},])
        setDis(data.user.discount)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      if(error.status === 409 || error.status === 401) {
        toast.error(error.response.data.message)
      }
    }
  }

  return (
    <>
        <Topbar back={true} style={"items-center"} >
          <h3 className="title">{user?.username}</h3>
        </Topbar>
        <DashboardLayout activeMenu={"Foydalanuvchi ma'lumotlari"}>


        <div className="my-3 bg-white p-6 rounded-lg shadow-md shadow-gray-100 border border-gray-200/50 flex flex-col items-start gap-3">
            <p>Umumiy savdo: <span className="font-semibold" >{Intl.NumberFormat().format(Number(user?.incomes))}</span> so'm</p>
            <p>So'ngi savdo: <span className="font-semibold" >{Intl.NumberFormat().format(user?.last_trade_amount)}</span> so'm</p>
            <p>So'ngi amaliyot: <span className="font-semibold">{user?.last_trade_date}</span> da</p>
          </div>

        <div className="mb-20 flex flex-col justify-center w-full items-center h-full">
          <form className="w-full my-3 bg-white p-6 rounded-lg shadow-md shadow-gray-100 border border-gray-200/50" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <Input
                value={username}
                onChange={({ target }) => {
                  setError(""), setUsername(target.value);
                }}
                placeholder="Foydalanuvchi ismi"
                type="text"
                loading={loading}
              />

              <Input
                value={password}
                onChange={({ target }) => {
                  setError(""), setPassword(target.value);
                }}
                placeholder="Parol"
                type="password"
                loading={loading}
              />

              <SelectDropdown
                select={true}
                options={discount}
                value={dis}
                onChange={(value) => setDis(value)}
                loading={loading}
              />

              {checkList
                ?.sort((a, b) => (a.text > b.text ? -1 : 1))
                ?.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item.text}
                    isChecked={item?.have}
                    onChange={() => updateChecklist(item)}
                    loading={loading}
                  />
                ))}
            </div>


            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <button disabled={loading} type="submit" className="btn-primary">
              {loading ? "Yuklanmoqda" : "O'zgartirish"}
            </button>
            <button type="button" disabled={loading} onClick={() => setOpenDeleteAlert(true)} className="w-full text-sm font-medium text-white bg-rose-500 shadow-lg shadow-purple-600/5 p-[10px] rounded-md my-1 border border-rose-100 hover:border-rose-300 hover:bg-rose-200 hover:text-rose-500 cursor-pointer">
              O'chirish
            </button>
          </form>
        </div>

        <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Foydalanuvchini o'chirish"
      >
        <DeleteAlert
          content="Ushbu foydalanuvchini o'chirishga aminmisiz?"
          onDelete={() => deleteUser()}
        />
      </Modal>
    </DashboardLayout>
    </>
  );
};

export default UserDetails;

const TodoCheckList = ({ text, isChecked, onChange, loading }) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        disabled={loading}
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
      />

      <p className="text-[13px] text-gray-800">{text}</p>
    </div>
  );
};
