import search from "../assets/search.svg";
import notification from "../assets/notification.svg";
import profile from "../assets/profile.svg";
import Category from "../components/Category";
import LoadedIssues from "../components/LoadedIssues";
import logo2 from "../assets/logo2.svg";
import cancle from "../assets/cancle.svg";
import capture from "../assets/capture.svg";
import dropdown from "../assets/dropdown.svg";
import location3 from "../assets/location3.svg";
import api from "../api/axios";
import ai from "../assets/addImage.svg";
import di from "../assets/deleteImage.svg";
import clock from "../assets/clock.svg";
import la from "../assets/locationAdd.svg";
import mark from "../assets/mark.svg";
import empty from "../assets/empty.svg";
import add2 from "../assets/addImage2.svg";
import { Context } from "../context/Context";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";

import React, { useContext, useEffect, useState } from "react";

export default function Logs() {
  const { register, handleSubmit, reset } = useForm();

  const {
    register: registerLocation,
    handleSubmit: handleSubmitLocation,
    reset: resetLocation,
  } = useForm();

  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    reset: resetCategory,
    watch: watchCategory,
  } = useForm();

  const {
    cameraActive,
    previews,
    setPreviews,
    stopCamera,
    videoRef,
    canvasRef,
    capturePhoto,
    startCamera,
    locations,
    loading,
    setLoading,
    setLocations,
    imgFiles,
    setImgFiles,
    showAddModal,
    setShowAddModal,
    categories,
    setCategories,
    selectedCategories,
    hold,
    setHold,
    issues,
    setIssues,
    setSelectedCategories
  } = useContext(Context);

  const [category, setCategory] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [status2, setStatus2] = useState("High");
  const [selectLocation, setSelectLocation] = useState(false);
  const [select, setSelect] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationName, setLocationName] = useState("");
  const [formattedDateTime, setFormattedDateTime] = useState(
    getFormattedDateTime()
  );

  const categoryName = watchCategory("name", "");

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
    setHold(false)
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


  const onSubmitLocation = async (data) => {
    console.log("location Form Data:", data);
    setLoading(true);

    try {
      const response = await api.post("/locations/", data); // withCredentials is already set in api.js

      toast.success("Location created successfully"); // ✅ Success toast inside try (after await)
      console.log(response.data);

      // Update state with the actual response (includes ID, timestamps, etc.)
      setIssues((prev) => [...prev, response.data.issue]);

      resetLocation(); // Clear the input field after successful submission
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create location");
      console.error("Create location error:", error);
    } finally {
      setLoading(false);
    }
    // Clears the location form
  };

  const onSubmitCategory = async (data) => {
    console.log(data);
    setLoading(true);

    try {
      const response = await api.post("/categories/", data); // withCredentials is already set in api.js

      toast.success("Category created successfully"); // ✅ Success toast inside try (after await)
      console.log(response.data);

      // Update state with the actual response (includes ID, timestamps, etc.)
      setCategories([...categories, response.data.category]);

      resetCategory(); // Clear the input field after successful submission
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
      console.error("Create category error:", error);
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
      <div className="flex flex-row justify-between items-center z-[2] absolute w-full p-4 [h-80px]">
        <p className="font-benton-black text-[32px] leading-[130%] ">Logs</p>
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

      {issues.length === 0 ? (<div className="text-center z-[2] absolute flex flex-col justify-center items-center gap-2 top-[20%] p-4 left-[50%] translate-x-[-50%]">
        <img src={logo2} alt="" />
        <h1 className="font-benton-black text-[24px] leading-[125%]">
          No Logged Issue
        </h1>
        <p className="font-benton-regular text-[15px] leading-[150%]">
          You currently have no logged issue, capture an issue to record and
          store
        </p>
      </div>) : (<LoadedIssues />)}

      {cameraActive && (
        <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-20">
          {/* Cancel button at the top */}
          <div className="p-4 flex-shrink-0">
            <img
              src={cancle}
              onClick={stopCamera}
              alt="cancel"
              className="w-14 h-14"
            />
          </div>

          {/* Video fills the rest of the screen */}
          <div className="relative flex-1 bg-black rounded-t-[12px] overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Capture button at bottom center */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              <button onClick={capturePhoto}>
                <img src={capture} alt="capture" />
              </button>
            </div>
          </div>
        </div>
      )}

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
                  type="submit"
                  className="h-14 w-full bg-[#4ECDC4] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] flex items-center justify-center"
                >
                  Save
                </button>
              </div>
            </form>
            {selectLocation && (
              <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-20">
                <div className="absolute bottom-[0px] w-[100%] left-[50%] translate-x-[-50%] bg-[#F6F7F9]  pt-6 rounded-4xl">
                  <p className=" text-center font-benton-black text-[16px] leading-[125%] mb-6">
                    Locations
                  </p>
                  <div className="w-full h-0.5 bg-black mb-6"></div>
                  <div className="px-4">
                    <div className="border-2 w-[100%] border-black rounded-xl overflow-hidden  bg-[#F6F7F9]  z-3">
                      <form
                        onSubmit={handleSubmitLocation(
                          onSubmitLocation,
                          onError
                        )}
                        className="border-b-2 w-full flex items-center justify-center gap-[2px] px-4"
                      >
                        <input
                          {...registerLocation("name", {
                            required: "Location is required",
                          })}
                          type="text"
                          placeholder="Add Location"
                          className="font-benton-bold text-[16px] leading-[150%] h-[48px] w-full  focus:outline-none placeholder:text-[#CED0D5]"
                        />
                        <button disabled={loading} type="submit">
                          <img src={la} alt="" />
                        </button>
                      </form>
                      {locations.map((loc, index) => {
                        const Selected = selectedLocation === loc._id;
                        return (
                          <div
                            onClick={() => {
                              setSelectedLocation(loc._id);
                              setSelect(true);
                              setLocationName(loc.name);
                            }}
                            key={loc._id}
                            className="flex items-center border-b-2 border-black last:border-b-0 px-4 py-3"
                          >
                            {/* Number */}
                            <span className="w-6 font-benton-bold text-[16px] leading-[150%]">
                              {index + 1}
                            </span>

                            {/* Location */}
                            <p className="ml-4 font-benton-bold text-[16px] leading-[150%]">
                              {loc.name}
                            </p>
                            {Selected && (
                              <img
                                src={mark}
                                alt=""
                                className="ml-auto w-6 h-6"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-4 justify-center items-center mt-6 mb-[29px]">
                      <button
                        onClick={() => {
                          setSelectLocation(false);
                          setSelectedLocation("");
                          setSelect(false);
                          setLocationName("");
                        }}
                        type="submit"
                        className="h-14 w-full bg-[#E8E9EB] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] flex items-center justify-center"
                      >
                        Cancle
                      </button>

                      <button
                        disabled={select === "false"}
                        onClick={() => setSelectLocation(false)}
                        type="submit"
                        className={`h-14 w-full ${
                          select === false ? "bg-[#E1E2E5]" : "bg-[#4ECDC4]"
                        }  font-benton-black text-[21px] leading-[150%] rounded-[12px]  ${
                          select === false
                            ? "shadow-[5px_5px_0px_0px_#CED0D5]"
                            : "shadow-[5px_5px_0px_0px_#1B1D22]"
                        } flex items-center justify-center ${
                          select === false ? "text-[#A1A6B0]" : ""
                        }`}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showAddModal && (
              <form onSubmit={handleSubmitCategory(onSubmitCategory, onError)}>
                <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-40">
                  <div className="absolute bottom-[0px] w-[100%] left-[50%] translate-x-[-50%] bg-[#F6F7F9]  pt-6 rounded-4xl">
                    <p className="font-benton-black text-[#1B1D22] text-[16px] leading-[125%] text-center mb-4">
                      Add Category
                    </p>
                    <div className="w-full h-0.5 bg-black mb-6"></div>
                    <div className="flex flex-col items-center">
                      <input
                        {...registerCategory("name", {
                          required: "category is Required",
                        })}
                        className="my-10 h-[26px] font-benton-black text-[#1B1D22] text-[18px] leading-[145%] w-[130px] placeholder:text-[#CED0D5] focus:outline-none"
                        placeholder="New Category"
                        type="text"
                      />
                      <div className="flex gap-4 justify-center items-center mt-6 mb-[29px] w-full px-[21px]">
                        <button
                          onClick={() => {
                            setShowAddModal(false);
                          }}
                          className="h-14 w-full bg-[#E8E9EB] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] flex items-center justify-center"
                        >
                          Cancle
                        </button>

                        <button
                          disabled={loading}
                          type="submit"
                          className={`h-14 w-full ${
                            categoryName.trim().length === 0
                              ? "bg-[#E1E2E5]"
                              : "bg-[#4ECDC4]"
                          }  font-benton-black text-[21px] leading-[150%] rounded-[12px]  ${
                            categoryName.trim().length === 0
                              ? "shadow-[5px_5px_0px_0px_#CED0D5]"
                              : "shadow-[5px_5px_0px_0px_#1B1D22]"
                          } flex items-center justify-center ${
                            categoryName.trim().length === 0
                              ? "text-[#A1A6B0]"
                              : ""
                          }`}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
