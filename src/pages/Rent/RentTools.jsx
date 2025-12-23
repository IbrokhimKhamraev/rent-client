import React, { useRef, useState, useContext, useEffect } from "react";
import { TbSettingsPlus } from "react-icons/tb";
import { IoLogoDesignernews, IoMdCard } from "react-icons/io";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Topbar from "../../components/layouts/Topbar";
import Modal from "../../components/Modal";
import { UserContext } from "../../context/UserContext";
import { RENT_MENU_DATA, RENT_TOOLS_SORT_DATA } from "../../utils/data";
import Input from "../../components/Inputs/Input";
import toast from "react-hot-toast";
import axios from "axios";
import SearchInput from "../../components/Inputs/SearchInput";
import CardLayout from "../../components/layouts/CardLayout";
import GridCard from "../../components/Cards/GridCard";
import { useSelector } from "react-redux";
import { LuSearch, LuTrash2 } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import ToolPhotoSelector from "../../components/Inputs/ToolPhotoSelector";
import uploadImage from "../../utils/uploadImage";
import DeleteAlert from "../../components/DeleteAlert";
import InfoCard from "../../components/Cards/InfoCard";
import { FaArrowLeft } from "react-icons/fa6";
import AmountInput from "../../components/Inputs/AmountInput";

const RentTools = () => {
  const { error, setError, loading, setLoading, navigate } =
    useContext(UserContext);
  const { currentUser, socketConnection } = useSelector((state) => state.user);

  const [sortBy, setSortBy] = useState("tool_name ASC");
  const [rentMenu, setRentMenu] = useState("tools-rent");
  const [searchBar, setSearchBar] = useState(false);

  const [openCreateAlert, setOpenCreateAlert] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const [toolId, setToolId] = useState(null);
  const [toolName, setToolName] = useState("");
  const [toolAmount, setToolAmount] = useState(0);
  const [toolInRent, setToolInRent] = useState(0);
  const [toolHeight, setToolHeight] = useState(0);
  const [toolLength, setToolLength] = useState(0);
  const [toolImage, setToolImage] = useState("");
  const [image, setImage] = useState("");
  const [img, setImg] = useState("");
  const [updImage, setUpdImage] = useState(false);

  const [measure, setMeasure] = useState(false);

  const [tools, setTools] = useState([]);

  const [heights, setHeights] = useState([{label: "Yangi", value: "."}])
  const [heightsForChange, setHeightsForChange] = useState([])
  const [height, setHeight] = useState(".")

  const changeChecked = (e) => {
    setMeasure(e)
    if(e === false) {
      setHeights([{label: "Yangi", value: "."}])
      setHeight(".")
      setToolName("")
      setToolHeight(0) 
      setToolLength(0)
      setImg("")
    } else {
      setHeights(heightsForChange)
    }
  }

  const [selectedId, setSelectedId] = useState(null);
  const [arrivalTool, setArrivalTool] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(false)
  const inputRef = useRef(null);

  const [products, setProducts] = useState([])

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

  const handleClear = () => {
    setError("");
    setOpenCreateAlert(false);
    setToolName("");
    setToolAmount(0);
    setToolInRent(0)
    setToolHeight(0);
    setToolLength(0);
    setImage("");
    setMeasure(false);
    setUpdImage(false);
    setToolId(null)
  };

  const handleSearchBar = () => {
    if (inputRef?.current?.value.length > 0) {
      setSearchBar(true);
    }
    if (searchBar) {
      setSearchBar(false);
    } else {
      setSearchBar(true);
      inputRef?.current?.focus();
    }
  };

  const addTool = async () => {
    let imageUrl = "";

    try {
      if(img) {
        imageUrl = img
      } else if (image) {
        const imgUploadRes = await uploadImage(image);
        if (imgUploadRes?.success) {
          imageUrl = imgUploadRes.imageUrl || "";
        }
      }
      const { data } = await axios.post("/tools/add", {
        imageUrl,
        toolName,
        toolAmount,
        toolHeight,
        toolLength,
      });
      if (data?.success) {
        handleClear();
        setSortBy("tool_name ASC");
        fetchTools();
        socketConnection.emit("updateTools", currentUser.id);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 409 || error.status === 401) {
        toast.error(error.response.data.message);
      }
    }
  };

  const updateTool = async () => {
    let imageUrl = toolImage;

    try {
      if (updImage) {
        const imgUploadRes = await uploadImage(image);
        if (imgUploadRes?.success) {
          imageUrl = imgUploadRes.imageUrl || "";
        }
      }
      const { data } = await axios.put(`/tools/update/${toolId}`, {
        imageUrl,
        toolImage,
        toolName,
        toolAmount,
        toolHeight,
        toolLength,
        updImage,
      });

      if (data?.success) {
        handleClear();
        setSortBy("tool_name ASC");
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toolName.trim()) {
      setError("Uskuna nomini kiriting");
      return;
    }

    if (toolId) {
      updateTool();
      return;
    }
    addTool();
  };

  const getToolDetails = (e) => {
    if (e) {
      setToolId(e.id);
      setToolName(e.tool_name);
      setToolAmount(e.amount);
      setToolInRent(e.in_rent)
      setToolHeight(e.height);
      setToolLength(e.length);
      setToolImage(e.img);
      setImage(e.img);

      if(e.height > 0) {
        setMeasure(true)
      }

      setOpenCreateAlert(true);
    }
  };

  const deleteTool = async () => {
    let imgUrl = ""
    if(toolHeight > 0) {
      const sameHeight = products[0].filter(item => item.height === toolHeight)
      console.log(sameHeight.length);
      if(sameHeight.length === 1) {
        imgUrl = toolImage
      }
    }
    try {
      const { data } = await axios.delete(
        `tools/delete/${toolName}?tool_img=${imgUrl}&&tool_height=${toolHeight}&&tool_length=${toolLength}`
      );
      if (data?.success) {
        toast.success(data.message);
        handleClear();
        setSortBy("tool_name ASC");
        fetchTools();
        setOpenDeleteAlert(false);
        socketConnection.emit("updateTools", currentUser.id);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 409 || error.status === 401) {
        toast.error(error.response.data.message);
      }
    }
  };
  
  const fetchTools = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setTools([]);
    try {
      const { data } = await axios.get(
        `/tools/get-tools?sort=${sortBy}&&searchTerm=${inputRef?.current?.value}`
        );
        if(data?.success) {
          const array = []
          const arr = []
          data.tools.map(item => {
            if(item.height === 0) {
              arr.push(item)
            } else {
              const index = arr.findIndex(i => i?.[0]?.tool_name === item.tool_name)
              if(index === -1) {
                arr.push([item])
              } else {
                arr[index].push(item)
              }

              const ind = array.findIndex(i => i.label === item.tool_name)
              if(ind === -1) {
                array.push({label: item.tool_name, value: item.tool_name + "_" + item.height, img: item.img})
              }
            }
          })
          setHeights([...array, {label: "Yangi", value: "."}])
          setHeightsForChange([...array, {label: "Yangi", value: "."}])
          setTools(arr)
          setProducts(arr)
        }
      setLoading(false)
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTools();
  }, [sortBy])

  useEffect(() => {
    navigate(`/rent/${rentMenu}`);
  }, [rentMenu]);


  const giveHeight = (e) => {
    setHeight(e)
    setToolName(e.split("_")[0])
    if(e === ".") {
      setToolHeight(0);
      setImg("")
    } else {
      setToolHeight(e.split("_")[1])
      setImg(heights.find(item => item.value === e).img)      
    }
  }

  window.addEventListener("popstate", () => {
    setSelectedGroup(false)
    setTools(products)
  })

  const selectGroup = (tool) => {
    setTools(tool)
    setSelectedGroup(true)
  }

  return (
    <>
      <Topbar style={"flex justify-between"}>
        <h3 className="title">uskunalar</h3>

        <div className="flex items-center gap-6">
          <button
            disabled={loading}
            onClick={() => setOpenCreateAlert(true)}
            className="p-2 text-white bg-blue-400 rounded-full"
          >
            <TbSettingsPlus />
          </button>

          <SelectDropdown
            options={RENT_TOOLS_SORT_DATA}
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            loading={loading}
            id={"sort"}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />

          <button
            disabled={loading}
            type="button"
            onClick={handleSearchBar}
            className="text-2xl text-black  bg-white rounded-md flex justify-between items-center"
          >
            <LuSearch />
          </button>

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
      <form
        onSubmit={fetchTools}
        className={`relative shadow-sm rounded-full overflow-hidden mx-5 my-2 transition-all ${
          searchBar ? "h-11" : "h-0"
        }`}
      >
        <SearchInput
          placeholder="Mahsulot nomini kiriting..."
          inputRef={inputRef}
        />

        <button
          className="absolute right-4 top-2 text-2xl transition-all"
          onClick={handleSearchBar}
        >
          <MdClose />
        </button>
      </form>
      <DashboardLayout activeMenu={"Ijara"}>
        <p>{currentUser?.username}</p>

        {inputRef?.current?.value?.length > 0 && (
          <h3 className="text-center my-4">
            "<span className="font-semibold">{inputRef.current.value}</span>"
            bo'yicha qidiruv natijalari: {tools.length} ta
          </h3>
        )}
        {inputRef?.current?.value?.length === 0 && tools.length === 0 && (
          <h3 className="text-center my-4">Uskunalar topilmadi.</h3>
        )}

        {selectedGroup && <div className="flex gap-4 text-xl bg-white rounded-xl shadow-md shadow-gray-100 border border-gray-200 p-2 mb-6">
          <button type="button" onClick={() => {setSelectedGroup(false), setTools(products)}} >
            <FaArrowLeft/>
          </button>
          <h3>{tools[0]?.tool_name}</h3>
        </div> }
        <CardLayout>
          {tools.length > 0 &&
            tools.map((tool, index) => (
              <button  key={index} onClick={() => {Array.isArray(tool) ? selectGroup(tool) : getToolDetails(tool)}}>
                <GridCard tool={tool}>
                  <h1 className="font-medium capitalize">{Array.isArray(tool) ? tool[0].tool_name : tool.height > 0 ?  tool.height + " x " + tool.length : tool.tool_name}</h1>
                </GridCard>
              </button>
            ))}
        </CardLayout>

        <Modal
          isOpen={openCreateAlert}
          onClose={handleClear}
          title={toolId ? "Mahsulotni yangilash" : "Yangi mahsulot qo'shish"}
        >
          {toolId && <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
            <InfoCard
              icon={<IoMdCard/>}
              label="Umumiy soni"
              value={toolAmount}
              color="bg-primary"
            />

            <InfoCard
              icon={<IoMdCard />}
              label="Ijarada"
              value={toolInRent}
              color="bg-violet-500"
            />

            <InfoCard
              icon={<IoMdCard />}
              label="Do'konda"
              value={toolAmount - toolInRent}
              color="bg-cyan-500"
            />
          </div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ToolPhotoSelector
              setUpdImage={setUpdImage}
              updImage={updImage}
              toolId={toolId}
              image={image}
              setImage={setImage}
            />

            <div className="flex items-center gap-3 py-3">
              <input
                checked={measure}
                type="checkbox"
                onChange={() => changeChecked(!measure)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
              />

              <p className="text-[13px] text-gray-800">
                Uzunlik va balandlik mavjud
              </p>
            </div>

            {measure && !toolId &&           
            <SelectDropdown
            select={true}
            options={heights}
            value={height}
            onChange={(value) => giveHeight(value)}
            loading={loading}
          /> }

            <div className="col-span-6 md:col-span-4">
              <label className="text-xs font-medium text-slate-600">
                Mahsulot nomi
              </label>

              <Input
                value={toolName}
                onChange={({ target }) => setToolName(target.value)}
                placeholder="Mahsulot nomi"
                type="text"
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              {measure &&  (
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Mahsulot balandligi
                  </label>

                  <Input
                    value={toolHeight}
                    onChange={({ target }) => setToolHeight(target.value)}
                    placeholder="Mahsulot balandligi"
                    type="number"
                  />
                </div>
              )}

              {measure && (
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Mahsulot uzunligi
                  </label>
                  <Input
                    value={toolLength}
                    onChange={({ target }) => setToolLength(target.value)}
                    placeholder="Mahsulot uzunligi"
                    type="number"
                  />
                </div>
              )}

              <div className="col-span-6 md:col-span-4 flex flex-col justify-center">
                <label className="text-xs font-medium text-slate-600">
                  Mahsulto soni
                </label>
                <AmountInput
                value={toolAmount}
                onChange={({ target }) => setToolAmount(target.value)}
                type="number"                
                add={() => setToolAmount(Number(toolAmount) + 1)}
                sub={() => setToolAmount(toolAmount - 1)}
                />
              </div>

              {toolId && <div className="col-span-6 md:col-span-4 mx-auto">
                <label className="text-xs font-medium text-slate-600">
                  Mahsulotni o'chirish
                </label>
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded my-3 px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  O'chirish <LuTrash2 className="text-base" />
                </button>
              </div>}
            </div>

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <div className="flex justify-end gap-4 pt-4">
              <button
                disabled={loading}
                type="submit"
                className="card-btn-fill"
              >
                {loading ? "QO'SHILMOQDA" : toolId ? "YANGILASH" : "QO'SHISH"}
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

          {openDeleteAlert && (
            <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50">
              <div className="relative p-4 w-full max-w-2xl max-h-full">
                {/* Modal content */}
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                  {/* Modal header */}

                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-lg font-meium text-gray-900 dark:text-white">
                      Ushbu mahsulotni o'chirmoqchimisiz
                    </h3>

                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                      onClick={() => setOpenDeleteAlert(false)}
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Modal body */}
                  <div className="p-4 md:p-5 space-y-4">
                    <DeleteAlert
                      content="Ushbu mahsulotni o'chirishga aminmisiz?"
                      onDelete={() => deleteTool()}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </DashboardLayout>
    </>
  );
};

export default RentTools;
