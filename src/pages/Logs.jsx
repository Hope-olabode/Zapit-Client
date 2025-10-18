import search from "../assets/search.svg";
import notification from "../assets/notification.svg";
import profile from "../assets/profile.svg";
import Category from "../components/Category";
import LoadedIssues from "../components/LoadedIssues";
import logo2 from "../assets/logo2.svg";
import cancle from "../assets/cancle.svg";

import dropdown from "../assets/dropdown.svg";
import location3 from "../assets/location3.svg";
import api from "../api/axios";
import ai from "../assets/addImage.svg";
import di from "../assets/deleteImage.svg";
import clock from "../assets/clock.svg";

import empty from "../assets/empty.svg";
import add2 from "../assets/addImage2.svg";
import { Context } from "../context/Context";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import CategoryForm from "../components/CategoryForm";
import Locations from "../components/Locations";

import React, { useContext, useEffect, useState } from "react";
import Camera from "../components/Camera";

export default function Logs() {
  const { register, handleSubmit, reset } = useForm();

 

  const {
    cameraActive,
    previews,
    setPreviews,
    stopCamera,
    
    startCamera,

    loading,
    setLoading,
    imgFiles,
    setImgFiles,
    showAddModal,
    setShowAddModal,
    selectedCategories,
    hold,
    setHold,
    issues,
    setIssues,
    setSelectedCategories,
    update
  } = useContext(Context);

  const [category, setCategory] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [status2, setStatus2] = useState("High");
  const [selectLocation, setSelectLocation] = useState(false);
  
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

    console.log(formData)

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
    <div className="h-full w-full relative bg-[#E8E9EB] overflow-x-scroll">
      <Toaster position="top-center" richColors />
      <div className="flex flex-row justify-between items-center z-[2] absolute w-full px-4  [h-48px] mt-4">
        <p className="font-benton-black text-[32px] leading-[130%] tracking-[-0.5px]">
          Logs
        </p>
        <div className="flex flex-row">
          <img src={search} alt="" />
          <img src={notification} alt="" />
          <img src={profile} alt="" />
        </div>
      </div>
      {/* Background pattern */}
      <div
        className="z-[1] w-full absolute top-0 h-[50%]
        bg-[length:23px_23px] 
        bg-[repeating-linear-gradient(0deg,#FFFFFF70_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#FFFFFF70_0_1px,transparent_1px_23px)]
        [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]
        [mask-repeat:no-repeat] [mask-size:100%_100%]"
      ></div>

      {issues.length === 0 ? (
        <div className="text-center z-[2] absolute flex flex-col justify-center items-center gap-2 top-[20%] p-4 left-[50%] translate-x-[-50%]">
          <img src={logo2} alt="" />
          <h1 className="font-benton-black text-[24px] leading-[125%] tracking-[-0.5px]">
            No Logged Issue
          </h1>
          <p className="font-benton-regular text-[15px] leading-[150%]">
            You currently have no logged issue, capture an issue to record and
            store
          </p>
        </div>
      ) : (
        <LoadedIssues />
      )}

      {cameraActive && <Camera update={update} />}

      {hold && (
        <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-10 h-screen">
          <div className="p-4 flex justify-center items-center ">
            <img
              src={cancle}
              onClick={() => {
                setPreviews([]);
                setImgFiles([]);
                setHold(false);
                stopCamera();
              }}
              alt="cancel"
              className="w-14 h-14 cursor-pointer"
            />
          </div>

          {/* Scrollable content */}
          <div className="relative flex-1 bg-white rounded-t-[12px] w-full overflow-y-auto">
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
                      if (i === 2)
                        style = "absolute bottom-0 right-0 w-1/2 h-1/2";
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
                    <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px] truncate">
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
                      className={`flex gap-1 items-center border rounded-[72px] h-[26px] pl-[8px] pr-[7px]  ${getStatusStyles()}`}
                    >
                      <p>{status}</p>
                    </div>
                    <div
                      onClick={handleClick2}
                      className={`flex gap-1 items-center border rounded-[72px] h-[26px] pl-[8px] pr-[7px]  ${getStatusStyles2()}`}
                    >
                      <p>{status2}</p>
                    </div>
                  </div>
                </div>
                {category && (
                  <div className="div">
                    <div className="top-0 left-[16px] z-30 absolute">
                      <Category />
                    </div>
                    <div
                      onClick={() => setCategory(false)}
                      className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-10 h-screen"
                    ></div>
                  </div>
                )}
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
              <div className="px-4">
                <textarea
                  {...register("Caused_by", {
                    required: "Cause is required",
                  })}
                  type="text"
                  placeholder="Caused by"
                  className="w-full rounded h-[144px] font-benton-black text-[18px] leading-[145%] placeholder-[#CED0D5] border-0 focus:outline-none"
                />
              </div>
              <div className="border-dashed border-black border-1 my-4 "></div>
              <div className="px-4 pb-4">
                <textarea
                  {...register("Responsibility", {
                    required: "Responsibility is required",
                  })}
                  type="text"
                  placeholder="Responsibility"
                  className="w-full rounded h-[144px] font-benton-black text-[18px] leading-[145%] placeholder-[#CED0D5] border-0 focus:outline-none"
                />
              </div>
              <div className="px-4 pb-4">
                <button
                disabled={loading}
                  type="submit"
                  className={`h-14 ${loading ? "bg-[#E1E2E5] shadow-[5px_5px_0px_0px_#CED0D5] text-[#A1A6B0]": "bg-[#4ECDC4] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] text-[#1B1D22]"}  font-benton-black text-[21px] leading-[150%] rounded-[12px] transform flex items-center justify-center transition-all duration-150 w-full`}
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
      )}
    </div>
  );
}
