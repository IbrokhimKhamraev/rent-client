import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import { IoMdCard } from 'react-icons/io';
import { LuTrash2 } from 'react-icons/lu';
import { MdOutlineMenu } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CalculateCard from '../../components/Cards/CalculateCard';
import GridCard from '../../components/Cards/GridCard';
import InfoCard from '../../components/Cards/InfoCard';
import AmountInput from '../../components/Inputs/AmountInput';
import Input from '../../components/Inputs/Input';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import CardLayout from '../../components/layouts/CardLayout';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Modal from '../../components/Modal';
import { UserContext } from '../../context/UserContext';
import { loginFailure } from '../../redux/user/userSlice';

const RentTakeTool = () => {

  const { error, setError, loading, setLoading, navigate } =
  useContext(UserContext);
  const { currentUser, socketConnection } = useSelector((state) => state.user);

  const {customer_id, customer_name, phone_number} = useParams()
  const [allTools, setAllTools] = useState([]);
  const [tools, setTools] = useState([]);
  const [openToolAlert, setOpenToolAlert] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(false);
  const [arrivalTool, setArrivalTool] = useState(null);

  const [openListAlert, setOpenListAlert] = useState(false);
  const [openCalculateAlert, setOpenCalculateAlert] = useState(false);

  const [id, setId] = useState(null);
  const [toolId, setToolId] = useState(null);
  const [toolName, setToolName] = useState("");
  const [toolAmount, setToolAmount] = useState(0);
  const [toolNameAdditional, setToolNameAdditional] = useState("");
  const [toolAmountAdditional, setToolAmountAdditional] = useState(0);
  const [toolInRent, setToolInRent] = useState(0);
  const [toolHeight, setToolHeight] = useState(0);
  const [toolLength, setToolLength] = useState(0);
  
  const [returnData, setReturnData] = useState({
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

  const fetchToolsOnRent = async (e) => {
    try {
      const { data } = await axios.get(`/rent/on-rent/${customer_id}`);
      if (data?.success) {
        setAllTools(data.all)
        let arr = []
        data.sorted.map(item => {
          const index = arr.findIndex(i => i.tool_id === item.tool_id)
          if(index === -1) {
            arr.push(item)
          } else {
            arr[index].amount = arr[index].amount + item.amount
            if(arr[index].additional_amount > 0 || item.additional_amount > 0) {
              if(arr[index].additional_amount > 0) {
                arr[index].additional_amount = Number(arr[index].additional_amount) + Number(item.additional_amount)
              } else if(arr[index].additional_amount === 0 && item.additional_amount > 0) {
                arr[index].additional_name = item.additional_name
              }
            }
          }
          
        })
        setTools(arr);
      }
      setLoading(false);  
    } catch (error) {
      setLoading(false);
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
    arrivalTool && arrivalTool?.user_id === currentUser.id && fetchToolsOnRent();
  }, [arrivalTool]);

  useEffect(() => {
    setLoading(true);
    fetchToolsOnRent()
  }, []);

  const deleteFromList = (e) => {
    setList((prev) => prev.filter(item => item.id !== e.id))
  }

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

  window.addEventListener("popstate", () => {
    setSelectedGroup(false);
    setTools(products);
  });

  const selectGroup = (tool) => {
    setTools(tool);
    setSelectedGroup(true);
    window.history.pushState(null, "", window.location.href);
  };
  const getToolDetails = (e) => {
    const finded = list.find(item => item.id === e.id)
    if (!openListAlert && finded === undefined) {
      setId(e.id);
      setToolId(e.tool_id);
      setToolName(`${e.tool_name} ${e.height > 0 ? e.height + " x " + e.length : ""}`);
      setToolAmount(e.amount);
      setTypeCalc(e.due),
      setPrice(e.price),
      setTypeAmount(e.type_amount),
      setToolNameAdditional(e.additional_name),
      setToolAmountAdditional(e.additional_amount),
      setNameAdditional(e.additional_name)
      setToolHeight(e.height)
      setToolLength(e.length)
      setOpenToolAlert(true);
    } 
    else {
      if(!openListAlert && finded) {
        setOpenListAlert(false)
        setId(finded.id),
        setToolId(finded.tool_id),
        setToolName(finded.tool_name),
        setToolAmount(finded.toolAmount),
        setToolInRent(finded.toolInRent)
        setAmount(finded.amount),
        setTypeCalc(finded.due),
        setPrice(finded.price),
        setTypeAmount(finded.typeAmount),
        setNameAdditional(finded.nameAdditional),
        setAmountAdditional(finded.amountAdditional)
        setToolHeight(finded.height)
        setToolLength(finded.length)
        setOpenListAlert(false)
        setOpenToolAlert(true);
      } else {
        setOpenListAlert(false)
        setId(e.id),
        setToolId(e.tool_id),
        setToolName(e.tool_name),
        setToolAmount(e.toolAmount),
        setToolInRent(e.toolInRent)
        setAmount(e.amount),
        setTypeCalc(e.due),
        setPrice(e.price),
        setTypeAmount(e.typeAmount),
        setNameAdditional(e.nameAdditional),
        setAmountAdditional(e.amountAdditional),
        setToolHeight(e.height),
        setToolLength(e.length),
        setOpenListAlert(false)
        setOpenToolAlert(true);
      }
    }

  };

  const handleAddToList = (e) => {
    e.preventDefault();
    if (amount > toolAmount - toolInRent) {
      setError("Mijozdagi mahsulot soni ko'p emas!");
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
    if (amountAdditional > toolAmountAdditional) {
      setError("Mijozdagi qo'shimchalar soni ko'p emas!");
      return;
    }

    setList((prev) => prev.filter(item => item.tool_name !== toolName))

    setList((prev) => [
      ...prev,
      {
        id: id,
        tool_id: toolId,
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
    setReturnData((prevData) => ({ ...prevData, [key]: value }));
  };

  const [toUpdate, setToUpdate] = useState([])
  const [toDelete, setToDelete] = useState([])
  let [additionals, setadditionals] = useState([])

  const handleCalculate = (e) => {
    e.preventDefault()
    if(list.length === 0) {
      setError("Qaytgan mahsulotlar ro'yxatini kiriting!") 
      return
    }
    if(!returnData.seller.trim()) {
      setError("Sotuvchini ismini kiriting!") 
      return
    }
    if(returnData.date === null) {
      setError("Vaqtni kiriting!") 
      return
    }

    list.map(item => {
      item.subtotal = 0
      item.employeDiscount = 0
      let amount = Number(item.amount)
      let amountAdd = Number(item.amountAdditional)
      const findedTools = allTools.filter(i => i.tool_id === item.tool_id)
      findedTools.sort((a,b) => a.created_at > b.created_at ? 1 : -1)
      for (let i = 0; i < findedTools.length; i++) {
        findedTools[i].type_amount = item.typeAmount
        findedTools[i].due = item.due
        findedTools[i].price = item.price
        if(amount > 0) {
          if(amount >= findedTools[i].amount) {
            amount = amount - findedTools[i].amount
            if(findedTools[i].additional_amount > 0) {
              if(amountAdd >= findedTools[i].additional_amount) {
                amountAdd = amountAdd - findedTools[i].additional_amount
              } else if(findedTools[i + 1]) {
                findedTools[i + 1].additional_amount = Number(findedTools[i + 1].additional_amount) + (findedTools[i].additional_amount - amountAdd)
                findedTools[i + 1].additional_name = findedTools[i].additional_name
              }
            }
            let perPiece = findedTools[i].price
            if(findedTools[i].type_amount === "piece") {
              perPiece = findedTools[i].price
            } else if(findedTools[i].type_amount === "set") {
              perPiece = findedTools[i].price / 24
            } else if(findedTools[i].type_amount === "half-set") {
              perPiece = findedTools[i].price / 12
            } else if(findedTools[i].type_amount === "metr") {
              perPiece = findedTools[i].price * findedTools[i].length
            }
            const timeDifference = new Date(returnData.date) - new Date(findedTools[i].created_at)
            if(findedTools[i].due === 'hourly') {
              const hourDifference = Math.ceil(timeDifference / (1000 * 60 * 60)) // due daily || hourly
              item.subtotal = Number(item.subtotal) + (findedTools[i].amount * perPiece * hourDifference)
              // subtotal = Number(subtotal) + (findedTools[i].amount * perPiece * hourDifference)
            } else if(findedTools[i].due === 'daily') {
              const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) // due daily || hourly
              let discountDays = 0
              if(currentUser.discount === "seventh") {
                discountDays = Math.floor(dayDifference / 7)
              } else if(currentUser.discount === "friday") {
                let start = new Date(findedTools[i].created_at)
                let end = new Date(returnData.date)
                while (start <=end) {
                  let day = start.getDay()
                  if(day === 5) {
                    discountDays++
                  }
                  start.setDate(start.getDate() + 1)
                }
              } else {
                discountDays = 0
              }
              item.subtotal = Number(item.subtotal) + (findedTools[i].amount * perPiece * dayDifference)
              // subtotal = Number(subtotal) + (findedTools[i].amount * perPiece * dayDifference)
              if(discountDays > 0) {
                item.employeDiscount = Number(item.employeDiscount) + (findedTools[i].amount * perPiece * discountDays)
                // employeDiscount = Number(employeDiscount) + (findedTools[i].amount * perPiece * discountDays)
              }
            }
            
            setToDelete(prev => [...prev, findedTools[i]])
          } else if(amount < findedTools[i].amount) {
            findedTools[i].amount = findedTools[i].amount - amount
            if(findedTools[i].additional_amount > 0) {
              if(amountAdd >= findedTools[i].additional_amount) {
                amountAdd = amountAdd - findedTools[i].additional_amount
              } else if(amountAdd < findedTools[i].additional_amount) {
                findedTools[i].additional_amount = findedTools[i].additional_amount - amountAdd
              }
            }
            let perPiece = findedTools[i].price
            if(findedTools[i].type_amount === "piece") {
              perPiece = findedTools[i].price
            } else if(findedTools[i].type_amount === "set") {
              perPiece = findedTools[i].price / 24
            } else if(findedTools[i].type_amount === "half-set") {
              perPiece = findedTools[i].price / 12
            } else if(findedTools[i].type_amount === "metr") {
              perPiece = findedTools[i].price * findedTools[i].length
            }
            const timeDifference = new Date(returnData.date) - new Date(findedTools[i].created_at)
            if(findedTools[i].due === 'hourly') {
              const hourDifference = Math.ceil(timeDifference / (1000 * 60 * 60)) 
              item.subtotal = Number(item.subtotal) + (amount * perPiece * hourDifference)
              // subtotal = Number(subtotal) + (amount * perPiece * hourDifference)
            } else if(findedTools[i].due === 'daily') {
              const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
              let discountDays = 0
              if(currentUser.discount === "seventh") {
                discountDays = Math.floor(dayDifference / 7)
              } else if(currentUser.discount === "friday") {
                let start = new Date(findedTools[i].created_at)
                let end = new Date(returnData.date)
                
                while (start <=end) {
                  let day = start.getDay()
                  if(day === 5) {
                    discountDays++
                  }
                  start.setDate(start.getDate() + 1)
                }
              } else {
                discountDays = 0
              }


              item.subtotal = Number(item.subtotal) + (amount * perPiece * dayDifference)
              // subtotal = Number(subtotal) + (amount * perPiece * dayDifference)
              if(discountDays > 0) {
                item.employeDiscount = Number(item.employeDiscount) + (amount * perPiece * discountDays)
                // employeDiscount = Number(employeDiscount) + (amount * perPiece * discountDays)
              }
            }
            setToUpdate(prev => [...prev, findedTools[i]])
          }
        } else if (amount < 1 && amountAdd > 0) {
          if(findedTools[i + 1]) {
            findedTools[i + 1].additional_amount = Number(findedTools[i + 1].additional_amount) + amountAdd
            findedTools[i + 1].additional_name = item.nameAdditional
          } else {
            additionals.push({
              additional_name: item.nameAdditional,
              additional_amount: amountAdd
            })
          }
        }        
      }
      // item.subtotal = subtotal
      // item.employeDiscount = employeDiscount
      // subtotal = 0
      // employeDiscount = 0
      // item.amount = savedAmount
    })
  
    setOpenCalculateAlert(true)
    setOpenListAlert(false)
  };

  const handleReturnTools = async (e) => {
    e.preventDefault()

    const type = e.target.textContent === "TO'LANGAN" ? "paid" : "unpaid"
    try {
      // socketConnection.emit("updateTools", currentUser.id);
      const { data } = await axios.post(`/rent/return?name=${customer_name}&&number=${phone_number}`, {tools: list, data: returnData, toUpdate, toDelete, type, totalSumm});
      if (data?.success) {
        handleClear();
        setReturnData({
          seller: "",
          description: "",
          date: null,
          customer_id
        })
        setList([])
        setOpenListAlert(false)
        setOpenCalculateAlert(false)
        fetchToolsOnRent()
        socketConnection.emit("updateTools", currentUser.id);
        toast.success(data.message);
      }  
    } catch (error) {
      console.log(error);
      if (error.status === 409 || error.status === 401) {
        toast.error(error.response.data.message);
      }
    }
  }

  const handleTypeCalc = (e) => {
    setTypeCalc(e.target.value);
    setError("");
  };


  const totalSumm = list.reduce((total, current) => {
    const {employeDiscount, subtotal} = current

    total.employeDiscount += Number(employeDiscount)
    total.subtotal += Number(subtotal)

    return total
  }, {employeDiscount: 0, subtotal: 0})

  const cancelCalculate = () => {
    setOpenCalculateAlert(false), 
    setOpenListAlert(true)
    setToDelete([]), setToUpdate([])
    fetchToolsOnRent()
    // list.map(item => {
    //   item.employeDiscount = 0
    //   item.subtotal = 0
    // })
  }
  return (
    <div>
      <div className="flex justify-between font-medium capitalize px-5 mx-5 py-4 mt-2 mb-5 bg-white">
        <h3>Mahsulot qaytarish</h3>
        <button type="button" onClick={() => setOpenListAlert(true)}>
          <MdOutlineMenu className="text-2xl" />
        </button>
      </div>
      <DashboardLayout activeMenu={"Ijara"}>
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
                <GridCard tool={tool} inRent={true}>
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
          title={toolHeight > 0 ? `${toolHeight} x ${toolLength}` : toolName}
        >
          {toolId && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
              <InfoCard
                icon={<IoMdCard />}
                label="Ushbu mijozda"
                value={toolAmount}
                color="bg-primary"
              />

              <InfoCard
                icon={<IoMdCard />}
                label={toolAmountAdditional > 0 ? toolNameAdditional : "Qo'shimchalar"}
                value={toolAmountAdditional}
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
                  addDis={toolAmountAdditional === amountAdditional || toolAmountAdditional < amountAdditional}
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
          title={"Mahsulot qaytarish ro'yxati"}
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
          <form onSubmit={handleCalculate} className="flex flex-col gap-4">
            <div className="">
              <label className="text-xs font-medium text-slate-600">
                Sotuvchi
              </label>

              <Input
                value={returnData.seller}
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
                value={returnData.description}
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
                value={returnData.date}
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
                HISOBLASH
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
        
        <Modal
          isOpen={openCalculateAlert}
          onClose={() => cancelCalculate()}
          title={"Hisoblash"}
        >
            {list.map(item => (
              <div key={item.id} >
                <CalculateCard item={item}/>
              </div>
            ))}
            <div className="flex flex-col items-end font-medium">
              <div className="flex items-end gap-3">
                <p className="text-[14px]">Jami:</p>
                <p>{Intl.NumberFormat().format(totalSumm.subtotal.toFixed(0))} so'm</p>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-[14px]">Chegirma:</p>
                <p>{Intl.NumberFormat().format(totalSumm.employeDiscount.toFixed(0))} so'm</p>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-[14px]">To'lash summasi:</p>
                <p>
                  {Intl.NumberFormat().format(totalSumm.subtotal.toFixed(0) - totalSumm.employeDiscount.toFixed(0))} so'm
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 pt-4">
              <div className='flex justify-end gap-3' >
              <button
                disabled={loading}
                payment={"paid"}
                onClick={(e) => handleReturnTools(e)}
                className="card-btn-fill"
              >
                {loading ? "QAYTARILMOQDA": "TO'LANGAN"}
              </button>
              <button
                disabled={loading}
                onClick={(e) => handleReturnTools(e)}
                className="card-btn-unpaid"
              >
                {loading ? "QAYTARILMOQDA": "TO'LANMAGAN"}
              </button>
              </div>

              <button
                disabled={loading}
                className="card-btn"
                onClick={() => cancelCalculate()}
              >
                ORTGA
              </button>
            </div>
        </Modal>
      </DashboardLayout>
    </div>
  )
}

export default RentTakeTool