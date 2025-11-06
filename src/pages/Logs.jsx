import search from "../assets/search.svg";

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
import Surveys from "./Survey";
import LogsSurveyNav from "../components/logsSurveyNav";
import Capture from "../components/Capture";

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
    update,
    survey,
    setSurvey,
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

  // const handleClick2 = () => {
  //   setStatus2((prev) => {
  //     if (prev === "High") return "Medium";
  //     if (prev === "Medium") return "Low";
  //     return "High";
  //   });
  // };

  // const getStatusStyles2 = () => {
  //   switch (status2) {
  //     case "High":
  //       return "bg-[#FFDDE2] text-[#CC001E] border-[#CC001E]";
  //     case "Medium":
  //       return "bg-[#FFFBEB] text-[#7A350D] border-[#B75406]";
  //     case "Low":
  //       return "bg-[#F6F6F6] text-[#464646] border-[#464646]";
  //     default:
  //       return "";
  //   }
  // };

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

  

  return (
    <div className="h-full min-h-screen w-full relative bg-[#E8E9EB] overflow-x-scroll">
      <Toaster position="top-center" richColors />
      
      <LogsSurveyNav />
      {/* Background pattern */}
      <div
        className="z-[1] w-full absolute top-0 h-[50%]
        bg-[length:23px_23px] 
        bg-[repeating-linear-gradient(0deg,#FFFFFF70_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#FFFFFF70_0_1px,transparent_1px_23px)]
        [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]
        [mask-repeat:no-repeat] [mask-size:100%_100%]"
      ></div>

      {survey ? (
        <Surveys />
      ) : (
        <>
          {issues.length === 0 ? (
            <div className="text-center z-[2] absolute flex flex-col justify-center items-center gap-2 top-[20%] p-4 left-[50%] translate-x-[-50%]">
              <img src={logo2} alt="" />
              <h1 className="font-benton-black text-[24px] leading-[125%] tracking-[-0.5px]">
                No Logged Issue
              </h1>
              <p className="font-benton-regular text-[15px] leading-[150%]">
                You currently have no logged issue, capture an issue to record
                and store
              </p>
            </div>
          ) : (
            <LoadedIssues />
          )}

          {cameraActive && <Camera update={update} />}

          {hold && (
            <Capture />
          )}
        </>
      )}
    </div>
  );
}
