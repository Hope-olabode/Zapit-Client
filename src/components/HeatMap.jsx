import { Context } from "../context/Context";
import { useContext, useState } from "react";
import dHeat from "../assets/defaultHeatMap.svg";

export default function HeatMap() {
  const { issues, locations,  isMobile } = useContext(Context);
  

  const getLocationColor = (locationName) => {
    // Count how many times this location appears in all issues
    const locationCount = issues.filter(
      (issue) => issue.location === locationName
    ).length;

    // Calculate percentage
    const totalIssues = issues.length;
    const percentage = (locationCount / totalIssues) * 100;

    // Return color based on percentage
    if (percentage <= 25) {
      return "bg-[#F6F7F9] text-black";
    } else if (percentage <= 50) {
      return "bg-[#ECBD13] text-black";
    } else if (percentage <= 75) {
      return "bg-[#F94700] text-black";
    } else {
      return "bg-[#FB0404] text-black";
    }
  };

  return (
    <div className="mt-10 lg:mt-0 ">
      <p className="mb-2 font-benton-black text-[16px] leading-[150%] text-[#1B1D22] ">
        HeatMap
      </p>
      {locations.length === 0 ? (
        <div
          className={`h-[400px] lg:h-[480px]   relative overflow-y-auto border-2 rounded-2xl bg-[#F6F7F9] `}
        >
          <div className="absolute inset-0 bg-[#ffffff7e] flex flex-col justify-center items-center">
            <img src={dHeat} alt="" />
            <p className="font-benton-regular pt-3 text-[10px] leading-[150%] text-[#292C33]">
              There is currently no data to display.
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`h-[400px] lg:h-[480px] overflow-y-auto border-2 rounded-2xl bg-[#F6F7F9] `}
        >
          <div className="grid grid-cols-6 overflow-hidden bg-[#F6F7F9]">
            {locations.map((item, index) => (
              <div
                key={index}
                className={`h-[60px] flex items-center justify-center ${getLocationColor(
                  item.name
                )}`}
              >
                <span className="truncate px-2 font-benton-bold text-[10px] leading-[150%]">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
