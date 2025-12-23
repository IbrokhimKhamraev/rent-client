import React, { useRef, useState, useContext, useEffect } from "react";
import { IoMdCard } from "react-icons/io";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Modal from "../../components/Modal";
import { UserContext } from "../../context/UserContext";
import Input from "../../components/Inputs/Input";
import toast from "react-hot-toast";
import axios from "axios";
import SearchInput from "../../components/Inputs/SearchInput";
import CardLayout from "../../components/layouts/CardLayout";
import GridCard from "../../components/Cards/GridCard";
import { useSelector } from "react-redux";
import { MdOutlineMenu } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import {HiOutlinePencilSquare} from "react-icons/hi2"
import AmountInput from "../../components/Inputs/AmountInput";
import InfoCard from "../../components/Cards/InfoCard";
import { LuTrash2 } from "react-icons/lu";
import { useParams } from "react-router-dom";

const RentGiveTool = () => {
  const { error, setError, loading, setLoading, navigate } =
    useContext(UserContext);
  const { currentUser, socketConnection } = useSelector((state) => state.user);

  const {customer_id, customer_name, phone_number} = useParams()

  const [toolId, setToolId] = useState(null);
  const [toolName, setToolName] = useState("");
  const [toolAmount, setToolAmount] = useState(0);
  const [toolInRent, setToolInRent] = useState(0);
  const [toolHeight, setToolHeight] = useState(0);
  const [toolLength, setToolLength] = useState(0);

  const [openToolAlert, setOpenToolAlert] = useState(false);

  const [openListAlert, setOpenListAlert] = useState(false);

  const [tools, setTools] = useState([]);
  const [toolsOnRent, setToolsOnRent] = useState([]);

  const [arrivalTool, setArrivalTool] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(false);
  const inputRef = useRef(null);

  const [products, setProducts] = useState([]);

  const [giveData, setGiveData] = useState({
    seller: "",
    description: "",
    date: null,
    customer_id
  });

  const [list, setList] = useState([]);

  const [amount, setAmount] = useState(0);
  const [typeCalc, setTypeCalc] = useState("");
  const [typeAmount, setTypeAmount] = useState("piece");
  const [price, setPrice] = useState(0);
  const [amountAdditional, setAmountAdditional] = useState(0);
  const [nameAdditional, setNameAdditional] = useState("");


  const handleAddToList = (e) => {
    e.preventDefault();
    if (amount > toolAmount - toolInRent) {
      setError("Do'kondagi mahsulot soni yetarli emas!");
      return;
    }
    if (amount === 0) {
      setError("Mahsulot sonini kiriting!");
      return;
    }
    if (!typeCalc.trim()) {
      setError("Kunlik yoki soatlikni belgilang!");
      return;
    }
    if (price === 0) {
      setError("Narxni kiriting!");
      return;
    }

    setList((prev) => prev.filter(item => item.tool_name !== toolName))

    setList((prev) => [
      ...prev,
      {
        id: toolId,
        tool_name: toolName,
        toolAmount,
        toolInRent,
        amount,
        due: typeCalc,
        price,
        typeAmount,
        nameAdditional,
        amountAdditional,
      },
    ]);

    handleClear();
  };

  const handleValueChange = (key, value) => {
    setGiveData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleClear = () => {
    setError("");
    setOpenToolAlert(false);
    setAmount(0);
    setTypeCalc("");
    setTypeAmount("piece");
    setPrice(0);
    setAmountAdditional(0);
    setNameAdditional("");
    setToolId(null);
  };

  const getToolDetails = (e) => {
    const finded = list.find(item => item.id === e.id)
    const onRent = toolsOnRent.find(item => item.tool_id === e.id)
    if (!openListAlert && finded === undefined && onRent === undefined) {
      setToolId(e.id);
      setToolName(`${e.tool_name} ${e.height > 0 ? e.height + " x " + e.length : ""}`);
      setToolAmount(e.amount);
      setToolInRent(e.in_rent)
      setToolHeight(e.height);
      setToolLength(e.length);
      setOpenToolAlert(true);
    } else if(!openListAlert && onRent) {
        setOpenListAlert(false)
        setToolId(onRent.tool_id),
        setToolName(e.tool_name),
        setToolAmount(e.amount),
        setToolInRent(e.in_rent)
        setTypeCalc(onRent.due),
        setPrice(onRent.price),
        setTypeAmount(onRent.type_amount),
        setNameAdditional(onRent.nameAdditional),
        setAmountAdditional(onRent.amountAdditional)
        setOpenListAlert(false)
        setOpenToolAlert(true);
      } 
    else {
      if(!openListAlert && finded) {
        setOpenListAlert(false)
        setToolId(finded.id),
        setToolName(finded.tool_name),
        setToolAmount(finded.toolAmount),
        setToolInRent(finded.toolInRent)
        setAmount(finded.amount),
        setTypeCalc(finded.due),
        setPrice(finded.price),
        setTypeAmount(finded.typeAmount),
        setNameAdditional(finded.nameAdditional),
        setAmountAdditional(finded.amountAdditional)
        setOpenListAlert(false)
        setOpenToolAlert(true);
      } else {
        setOpenListAlert(false)
        setToolId(e.id),
        setToolName(e.tool_name),
        setToolAmount(e.toolAmount),
        setToolInRent(e.toolInRent)
        setAmount(e.amount),
        setTypeCalc(e.due),
        setPrice(e.price),
        setTypeAmount(e.typeAmount),
        setNameAdditional(e.nameAdditional),
        setAmountAdditional(e.amountAdditional)
        setOpenListAlert(false)
        setOpenToolAlert(true);
      }
    }

  }; 

  useEffect(() => {
    if (socketConnection) {
      socketConnection.on("fetchTools", (data) => {
        setArrivalTool({
          user_id: data,
        });
      });
    }
  }, []);

  useEffect(() => {
    arrivalTool && arrivalTool?.user_id === currentUser.id && fetchTools();
  }, [arrivalTool]);

  const fetchTools = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setTools([]);
    try {
      const { data } = await axios.get(
        `/tools/get-tools?sort=${"tool_name ASC"}&&searchTerm=${
          inputRef?.current?.value
        }`
      );
      if (data?.success) {
        const array = [];
        const arr = [];
        data.tools.map((item) => {
          if (item.height === 0) {
            arr.push(item);
          } else {
            const index = arr.findIndex(
              (i) => i?.[0]?.tool_name === item.tool_name
            );
            if (index === -1) {
              arr.push([item]);
            } else {
              arr[index].push(item);
            }

            const ind = array.findIndex((i) => i.label === item.tool_name);
            if (ind === -1) {
              array.push({
                label: item.tool_name,
                value: item.tool_name + "_" + item.height,
              });
            }
          }
        });
        setTools(arr);
        setProducts(arr);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchToolsOnRent = async (e) => {
    try {
      const { data } = await axios.get(`/rent/on-rent/${customer_id}`);
      if (data?.success) {
        setToolsOnRent(data.all);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTools();
    fetchToolsOnRent()
  }, []);

  window.addEventListener("popstate", () => {
    setSelectedGroup(false);
    setTools(products);
  });

  const selectGroup = (tool) => {
    setTools(tool);
    setSelectedGroup(true);
    window.history.pushState(null, "", window.location.href);
  };

  const handleTypeCalc = (e) => {
    setTypeCalc(e.target.value);
    setError("");
  };

  const deleteFromList = (e) => {
    setList((prev) => prev.filter(item => item.id !== e.id))
  }

  const handleGiveTools = async (e) => {
    e.preventDefault()
    if(!giveData.seller.trim()) {
      setError("Sotuvchini ismini kiriting!") 
      return
    }
    if(giveData.date === null) {
      setError("Vaqtni kiriting!")  
      return
    }
    
    try {
      const { data } = await axios.post(`/rent/give?name=${customer_name}&&number=${phone_number}`, {tools: list, data: giveData});
      if (data?.success) {
        handleClear();
        setGiveData({
          seller: "",
          description: "",
          date: null,
          customer_id
        })
        setList([])
        // setSortBy("tool_name ASC");
        setOpenListAlert(false)
        fetchTools();
        toast.success(data.message);
        socketConnection.emit("updateTools", currentUser.id);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 409 || error.status === 401) {
        toast.error(error.response.data.message);
      }
    }
  }



  return (
    <div>
      <div className="flex justify-between font-medium capitalize px-5 mx-5 py-4 mt-2 mb-5 bg-white">
        <h3>Mahsulot berish</h3>
        <button type="button" onClick={() => setOpenListAlert(true)}>
          <MdOutlineMenu className="text-2xl" />
        </button>
      </div>
      <form
        onSubmit={fetchTools}
        className={`relative shadow-sm rounded-full overflow-hidden mx-5 my-3 transition-all h-11`}
      >
        <SearchInput
          placeholder="Mahsulot nomini kiriting..."
          inputRef={inputRef}
        />
      </form>
      <DashboardLayout activeMenu={"Ijara"}>

        {inputRef?.current?.value?.length > 0 && (
          <h3 className="text-center my-4">
            "<span className="font-semibold">{inputRef.current.value}</span>"
            bo'yicha qidiruv natijalari: {tools.length} ta
          </h3>
        )}
        {inputRef?.current?.value?.length === 0 && tools.length === 0 && (
          <h3 className="text-center my-4">Uskunalar topilmadi.</h3>
        )}

        {selectedGroup && (
          <div className="flex gap-4 text-xl bg-white rounded-xl shadow-md shadow-gray-100 border border-gray-200 p-2 mb-6">
            <button
              type="button"
              onClick={() => {
                setSelectedGroup(false), setTools(products);
              }}
            >
              <FaArrowLeft />
            </button>
            <h3>{tools[0]?.tool_name}</h3>
          </div>
        )}

        <CardLayout>
          {tools.length > 0 &&
            tools.map((tool, index) => (
              <button
                key={index}
                onClick={() => {
                  Array.isArray(tool)
                    ? selectGroup(tool)
                    : getToolDetails(tool);
                }}
              >
                <GridCard tool={tool}>
                  <h1 className="font-medium capitalize">
                    {Array.isArray(tool)
                      ? tool[0].tool_name
                      : tool.height > 0
                      ? tool.height + " x " + tool.length
                      : tool.tool_name}
                  </h1>
                </GridCard>
              </button>
            ))}
        </CardLayout>

        <Modal
          isOpen={openToolAlert}
          onClose={handleClear}
          title={toolName}
        >
          {toolId && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
              <InfoCard
                icon={<IoMdCard />}
                label="Do'konda"
                value={toolAmount - toolInRent}
                color="bg-cyan-500"
              />
            </div>
          )}

          <form onSubmit={handleAddToList} className="flex flex-col gap-4">
            <div className="flex gap-4 mt-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-slate-600">
                  Mahsulto soni
                </label>
                <AmountInput
                  value={amount}
                  onChange={({ target }) => {
                    setAmount(target.value), setError("");
                  }}
                  type="number"
                  add={() => {
                    setAmount(Number(amount) + 1), setError("");
                  }}
                  sub={() => {
                    setAmount(amount - 1), setError("");
                  }}
                  addDis={toolAmount === amount || toolAmount < amount}
                  subDis={amount === 0}
                />
              </div>

              <div className="flex justify-end flex-1">
                <div className="flex flex-col  gap-3 px-3 py-3 my-2">
                  <label className="text-xs font-medium text-slate-600">
                    Kunlik
                  </label>
                  <input
                    className=""
                    type="radio"
                    value={"daily"}
                    onChange={handleTypeCalc}
                    checked={typeCalc === "daily"}
                  />
                </div>

                <div className="flex flex-col  gap-3 px-3 py-3 my-2">
                  <label className="text-xs font-medium text-slate-600">
                    Soatlik
                  </label>
                  <input
                    type="radio"
                    value={"hourly"}
                    onChange={handleTypeCalc}
                    checked={typeCalc === "hourly"}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium text-slate-600">
                  Narxi
                </label>

                <Input
                  value={price}
                  onChange={({ target }) => {
                    setPrice(target.value), setError("");
                  }}
                  placeholder="Mahsulot Narxi"
                  type="number"
                />
              </div>

              <div className="flex-1 mb-2">
                <SelectDropdown
                  select={true}
                  options={[
                    { label: "dona", value: "piece" },
                    { label: "komplekt", value: "set" },
                    { label: "yarim-komplekt", value: "half-set" },
                    { label: "metr", value: "metr" },
                  ]}
                  value={typeAmount}
                  onChange={(value) => setTypeAmount(value)}
                  loading={loading}
                />
              </div>
            </div>

            <div className="flex justify-between items-end gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium text-slate-600">
                  Qoshimcha soni
                </label>

                <AmountInput
                  value={amountAdditional}
                  onChange={({ target }) => setAmountAdditional(target.value)}
                  type="number"
                  add={() => setAmountAdditional(Number(amountAdditional) + 1)}
                  sub={() => setAmountAdditional(amountAdditional - 1)}
                  subDis={amountAdditional === 0}
                />
              </div>

              <div className="flex-1">
                <label className="text-xs font-medium text-slate-600">
                  Qoshimcha nomi
                </label>

                <Input
                  value={nameAdditional}
                  onChange={({ target }) => setNameAdditional(target.value)}
                  placeholder="Qoshimcha nomi"
                  type="text"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <div className="flex justify-end gap-4 pt-4">
              <button
                disabled={loading}
                type="submit"
                className="card-btn-fill"
              >
                RO'YXATGA QO'SHISH
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

        <Modal
          isOpen={openListAlert}
          onClose={() => setOpenListAlert(false)}
          title={"Mahsulot berish ro'yxati"}
        >
          {list?.map((item, index) => (
            <div
              key={item}
              className="flex justify-between items-center text-xs text-black bg-gray-50 border border-gray-100 px-1 py-2 rounded-md mb-3 mt-2"
            >
              <span className="text-xs text-gray-400 font-semibold">
                {index < 9 ? `0${index + 1}` : index + 1}
              </span>
              <p>{item.tool_name}</p>
              <p>
                {item.due === "daily" ? "kuniga" : "soatiga"} {item.price} so'm
              </p>
              <p>{item.amount} ta</p>

              <button
                className="flex items-center gap-1.5 text-[13px] font-medium text-primary bg-blue-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                onClick={() => getToolDetails(item)}
              >
                <HiOutlinePencilSquare className="text-base" />
              </button>

              <button 
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => deleteFromList(item)}
                >
                  <LuTrash2 className="text-base" />
                </button>
            </div>
          ))}
          <form onSubmit={handleGiveTools} className="flex flex-col gap-4">
            <div className="">
              <label className="text-xs font-medium text-slate-600">
                Sotuvchi
              </label>

              <Input
                value={giveData?.seller}
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
                value={giveData.description}
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
                value={giveData.date}
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
                onClick={() => setOpenListAlert(false)}
              >
                ORTGA
              </button>
            </div>
          </form>
        </Modal>
      </DashboardLayout>
    </div>
  );
};

export default RentGiveTool;
