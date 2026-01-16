import Category from "../components/Category";
import LoadedIssues from "../components/LoadedIssuesD";
import logo2 from "../assets/logo2.svg";
import { Context } from "../context/Context";
import { useForm } from "react-hook-form";
import CategoryForm from "../components/CategoryForm";
import Locations from "../components/Locations";

import React, { useContext, useEffect, useState } from "react";

import Camera from "../components/Camera";
import Surveys from "./Survey";
import LogsSurveyNav from "../components/logsSurveyNav";
import Capture from "../components/Capture";

import { useNavigate } from "react-router-dom";

export default function Logs() {
  const { register,  watch } = useForm();
  const {
    cameraActive,
    hold,
    issues,
    update,
    survey,
    isMobile,
    hold2,
  } = useContext(Context);

  const searchTerm = watch("search", "");

  const filteredIssues = issues.filter((issue) =>
    issue.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const [formattedDateTime, setFormattedDateTime] = useState(
    getFormattedDateTime()
  );

  

  // const handleClick2 = () => {
  //   setStatus2((prev) => {
  //     if (prev === "High") return "Medium";
  //     if (prev === "Medium") return "Low";
  //     return "High";
  //   });
  // };
  console.log(isMobile);
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
    <div className="h-full min-h-screen w-full relative bg-[#E8E9EB] scrollbar-hide overflow-y-auto scrollbar-hide">

      <div className="lg:hidden">
        <LogsSurveyNav register={register} />
      </div>
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
            <div className="lg:pl-[144px] lg:pr-10 lg:pt-[56px] lg:flex lg:gap-8">
              <div
                className={`${hold2 ? "lg:w-[calc(100%-425px)]" : "w-full"}`}
              >
                <div className="hidden lg:block relative z-20">
                  <LogsSurveyNav register={register} />
                </div>
                <div className="flex justify-center items-center h-[calc(100vh-109.59px)] ">
                  <div className="text-center z-[2]  flex flex-col justify-center items-center gap-2 ">
                    <img
                      src={logo2}
                      alt=""
                    />
                    <h1 className="font-benton-black text-[24px] leading-[125%] tracking-[-0.5px]">
                      No Logged Issue
                    </h1>
                    <p className="font-benton-regular text-[15px] leading-[150%]">
                      You currently have no logged issue, capture an issue to
                      record and store
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${hold2 ? "w-[393px] z-10" : ""}`}>
                {hold2 && <Capture />}
              </div>
            </div>
          ) : (
            <div className="div">
              <LoadedIssues />
            </div>
          )}

          {cameraActive && <Camera update={update} />}

          {isMobile && hold && <Capture />}
        </>
      )}
    </div>
  );
}
