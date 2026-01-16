import { Context } from "../context/Context";
import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import Category from "../components/Category";
import cancel from "../assets/cancel.svg";

import dropdown from "../assets/dropdown.svg";
import location3 from "../assets/location3.svg";
import api from "../api/axios";
import ai from "../assets/addImage.svg";
import di from "../assets/deleteImage.svg";
import clock from "../assets/clock.svg";

import empty from "../assets/empty.svg";
import add2 from "../assets/addImage2.svg";

import { toast } from "sonner";
import CategoryForm from "../components/CategoryForm";
import Locations from "../components/Locations";

export default function Capture() {
  const {
    cameraActive,
    startCamera,
    stopCamera,
    previews,
    setPreviews,
    imgFiles,
    setImgFiles,
    loading,
    showAddModal,
    setShowAddModal,
    selectedCategories,
    setHold,
    setLoading,
    setIssues,
    setSelectedCategories,
    setHold2,
    isMobile,
    category,
    setCategory,
  } = useContext(Context);

  const { register, handleSubmit, reset } = useForm();

  const [status, setStatus] = useState("Pending");
  const [status2, setStatus2] = useState("High");
  const [selectLocation, setSelectLocation] = useState(false);

  const [causedBy, setCausedBy] = useState(false);
  const [responsibility, setResponsibility] = useState(false);

  const [locationName, setLocationName] = useState("");
  const [formattedDateTime, setFormattedDateTime] = useState(
    getFormattedDateTime()
  );

  const handleClick = () => {
    setStatus((prev) => {
      if (prev === "Pending") return "In Progress";
      if (prev === "In Progress") return "Resolved";
      return "Pending";
    });
  };

  const getStatusStyles = () => {
    switch (status) {
      case "Pending":
        return "bg-[#FFC529] text-[#461B02] border-[#461B02]";
      case "In Progress":
        return "bg-[#1513EC] text-[#D2D2F4] border-[#00003D]";
      case "Resolved":
        return "bg-[#73CA5E] text-[#0D301C] border-[#317223]";
      default:
        return "";
    }
  };

  const handleClick2 = () => {
    setStatus2((prev) => {
      if (prev === "High") return "Medium";
      if (prev === "Medium") return "Low";
      return "High";
    });
  };

  const getStatusStyles2 = () => {
    switch (status2) {
      case "High":
        return "bg-[#FFDDE2] text-[#CC001E] border-[#CC001E]";
      case "Medium":
        return "bg-[#FFFBEB] text-[#7A350D] border-[#B75406]";
      case "Low":
        return "bg-[#F6F6F6] text-[#464646] border-[#464646]";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (cameraActive) {
      document.body.style.overflow = "hidden"; // disable scroll
    } else {
      document.body.style.overflow = ""; // reset back to default
    }

    // Cleanup in case component unmounts while modal is open
    return () => {
      document.body.style.overflow = "";
    };
  }, [cameraActive]);

  function getFormattedDateTime() {
    const now = new Date();

    // Format time (HH:MM)
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;

    // Get date parts
    const day = now.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear().toString().slice(-2); // last two digits of year

    // Add ordinal suffix (st, nd, rd, th)
    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const dayWithSuffix = `${day}${getOrdinal(day)}`;

    // Combine
    return `${time} • ${dayWithSuffix} ${month}, ${year}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedDateTime(getFormattedDateTime());
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, []);

  const deleteLastImage = () => {
    setImgFiles((prevImages) => prevImages.slice(0, -1));
    setPreviews((prevImages) => prevImages.slice(0, -1));
  };

  const onSubmitMain = async (data) => {
    console.log("Main Form Data:", data);

    // Validation
    if (!locationName) {
      return toast.error("Please select a location");
    }
    if (selectedCategories.length === 0) {
      return toast.error("Please select a category");
    }

    setLoading(true);

    // 🧩 Create a FormData object for multipart upload
    const formData = new FormData();

    // Append normal text fields
    formData.append("description", data.description);
    formData.append("Caused_by", data.Caused_by);
    formData.append("Responsibility", data.Responsibility);
    formData.append("location", locationName);
    formData.append("status", status);
    formData.append("priority", status2);
    formData.append("dateTime", formattedDateTime);
   

    // Append categories (if array)
    selectedCategories.forEach((category) => {
      formData.append("categories[]", category);
    });

    // Append all image files
    imgFiles.forEach((file) => {
      formData.append("images", file);
    });

    console.log(formData);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      // 🛰 Send to your Express route
      const response = await api.post("/issues/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Issue was logged successfully!");
      console.log("Server response:", response.data);

      // Update state with new issue
      setIssues((prev) => [...prev, response.data.issue]);

      // Reset form and local state
      setHold(false);
      reset();
      setImgFiles([]);
      setSelectedCategories([]);
    } catch (error) {
      console.error("Create issue error:", error);
      toast.error(error.response?.data?.message || "Failed to create issue");
    } finally {
      setLoading(false);
    }
  };

  const onError = (formErrors) => {
    Object.values(formErrors).forEach((err) => {
      toast.error(err.message);
    });
  };
  return (
    <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-10 min-h-[100dvh] lg:static lg:inset-auto lg:min-h-auto lg:h-[calc(100vh-56px)] lg:bg-transparent">
      <div className="p-4 flex justify-center items-center ">
        <img
          src={cancel}
          onClick={() => {
            setPreviews([]);
            setImgFiles([]);
            isMobile ? setHold(false) : setHold2(false);

            stopCamera();
          }}
          alt="cancel"
          className="w-14 h-14 cursor-pointer"
        />
      </div>

      {/* Scrollable content */}
      <div className="relative flex-1 bg-white rounded-t-[24px] w-full overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+16px)] lg:pb-0">
        <form onSubmit={handleSubmit(onSubmitMain, onError)}>
          <div className="p-4 relative w-full h-[400px] rounded-xl">
            {previews.length === 0 && (
              <div className="flex flex-col items-center gap-[19.32px] h-full rounded-xl bg-[#E8E9EB]">
                <img src={empty} alt="" className="" />
                <div className="flex flex-col items-center gap-2">
                  <h3 className="font-benton-black text-[#1B1D22] text-[18px] leading-[125%]">
                    Empty Image
                  </h3>
                  <p className="font-benton-regular text-[#292C33] text-[14px] leading-[150%]">
                    Attach images to this Log
                  </p>
                  <img onClick={startCamera} src={add2} alt="" />
                </div>
              </div>
            )}

            <div className="w-full h-full relative rounded-xl overflow-hidden">
              {previews.map((src, i) => {
                const count = previews.length;
                let style = "";

                if (count === 1) {
                  // One image: full container
                  style = "absolute top-0 left-0 w-full h-full";
                } else if (count === 2) {
                  // Two images: split horizontally (side by side)
                  style = `absolute top-0 h-full w-1/2 ${
                    i === 0 ? "left-0" : "right-0"
                  }`;
                } else if (count === 3) {
                  // Three images: left full half, right two split vertically
                  if (i === 0) style = "absolute top-0 left-0 w-1/2 h-full";
                  if (i === 1) style = "absolute top-0 right-0 w-1/2 h-1/2";
                  if (i === 2) style = "absolute bottom-0 right-0 w-1/2 h-1/2";
                }

                return (
                  <img
                    key={i}
                    src={src}
                    alt={`Captured ${i + 1}`}
                    className={`object-cover  ${style}`}
                  />
                );
              })}

              {/* Divider lines */}
              {previews.length === 2 && (
                // Vertical line in the middle for 2 images
                <div className="absolute top-0 left-1/2 w-[2px] h-full bg-black"></div>
              )}

              {previews.length === 3 && (
                <>
                  {/* Vertical line in the middle */}
                  <div className="absolute top-0 left-1/2 w-[2px] h-full bg-black"></div>
                  {/* Horizontal line on the right half */}
                  <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-black"></div>
                </>
              )}
            </div>

            {/* Buttons (top-right) */}
            <div className="flex flex-col items-center absolute top-[16px] right-[16px]">
              {imgFiles.length != 3 && (
                <img
                  onClick={startCamera}
                  src={ai}
                  alt=""
                  className="cursor-pointer"
                />
              )}

              <img onClick={deleteLastImage} src={di} alt="" />
            </div>

            {/* Bottom info bar */}
            <div className="flex justify-between items-center absolute bottom-[24px] w-full left-0 px-6">
              <div
                onClick={() => {
                  setSelectLocation(true);
                }}
                className="h-[26px] border border-black flex items-center gap-[6px] rounded-[8px] px-2.5 bg-[#E1E2E5]"
              >
                <img src={location3} alt="" />
                <p className="font-benton-bold text-[10px] leading-[150%]">
                  {locationName === "" ? "Enter Location" : locationName}
                </p>
              </div>
              <div className="h-[26px] border border-black flex items-center gap-[6px] rounded-[8px] px-2.5 bg-[#E1E2E5]">
                <img src={clock} alt="" />
                <p className="font-benton-bold text-[10px] leading-[150%]">
                  {formattedDateTime}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="mb-4 flex flex-row px-4 justify-between">
              <div
                onClick={() => {
                  setCategory(true);
                }}
                className="flex gap-1 items-center border rounded-[72px] h-[26px] pl-[8px] pr-[7px] max-w-[240px]"
              >
                <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px] truncate tracking-[-0.5px]">
                  {selectedCategories.length > 0
                    ? selectedCategories.length <= 2
                      ? selectedCategories
                          .map((cat, i) => (i === 0 ? cat : ` • ${cat}`))
                          .join("")
                      : `${selectedCategories[0]} • ${
                          selectedCategories[1]
                        }... +${selectedCategories.length - 2}`
                    : "Category"}
                </p>
                <img src={dropdown} alt="" className="flex-shrink-0" />
              </div>
              <div className="flex gap-2">
                <div
                  onClick={handleClick}
                  className={`font-sans font-semibold text-[12px] leading-[16px] tracking-[-0.5px] px-2 border rounded-[72px] flex justify-center items-center  ${getStatusStyles()}`}
                >
                  <p>{status}</p>
                </div>
                <div
                  onClick={handleClick2}
                  className={`font-sans font-semibold text-[12px] leading-[16px] tracking-[-0.5px] px-2 border rounded-[72px] flex justify-center items-center ${getStatusStyles2()}`}
                >
                  <p>{status2}</p>
                </div>
              </div>
            </div>
            {isMobile
              ? category && (
                  <div className="div lg:relative">
                    <div className="top-0 left-[16px] z-30 absolute ">
                      <Category />
                    </div>
                    <div
                      onClick={() => setCategory(false)}
                      className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-10 h-screen"
                    ></div>
                  </div>
                )
              : ""}
          </div>

          <div className="px-4">
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              type="text"
              placeholder="Description"
              className="w-full rounded h-[144px] font-benton-black text-[18px] leading-[145%] placeholder-[#CED0D5] border-0 focus:outline-none"
            />
          </div>
          <div className="border-dashed border-black border-1 my-4 "></div>
          <div className="px-4 relative">
            <textarea
              {...register("Caused_by", {
                required: "Cause is required",
                onChange: () => setCausedBy(true),
              })}
              type="text"
              placeholder="Caused by"
              className="w-full rounded h-[144px] font-benton-black text-[18px] leading-[145%] placeholder-[#CED0D5] border-0 focus:outline-none"
            />
            {causedBy && (
              <div className="h-5 absolute border text-[#464646] font-sans font-semibold text-[10px] leading-[16px] tracking-[-0.5px] border-[#464646] bg-[#F6F6F6] rounded-[72px] px-[7px] flex justify-center items-center top-[-27px]">
                Caused by
              </div>
            )}
          </div>
          <div className="border-dashed border-black border-1 my-4 "></div>
          <div className="px-4 pb-4 relative">
            <textarea
              {...register("Responsibility", {
                required: "Responsibility is required",
                onChange: () => setResponsibility(true),
              })}
              type="text"
              placeholder="Responsibility"
              className="w-full rounded h-[144px] font-benton-black text-[18px] leading-[145%] placeholder-[#CED0D5] border-0 focus:outline-none"
            />
            {responsibility && (
              <div className="h-5 absolute border text-[#464646] font-sans font-semibold text-[10px] leading-[16px] tracking-[-0.5px] border-[#464646] bg-[#F6F6F6] rounded-[72px] px-[7px] flex justify-center items-center top-[-27px]">
                Responsibility
              </div>
            )}
          </div>
          <div className="px-4 pb-4">
            <button
              disabled={loading}
              type="submit"
              className={`h-14 ${
                loading
                  ? "bg-[#E1E2E5] shadow-[5px_5px_0px_0px_#CED0D5] text-[#A1A6B0]"
                  : "bg-[#4ECDC4] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] text-[#1B1D22]"
              }  font-benton-black text-[21px] leading-[150%] rounded-[12px] transform flex items-center justify-center transition-all duration-150 w-full`}
            >
              Save
            </button>
          </div>
        </form>
        {selectLocation && (
          <Locations
            setLocationName={setLocationName}
            setSelectLocation={setSelectLocation}
          />
        )}
        {showAddModal && <CategoryForm setShowAddModal={setShowAddModal} />}
      </div>
    </div>
  );
}
