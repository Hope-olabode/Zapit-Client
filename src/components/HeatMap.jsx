import { Context } from "../context/Context";
import { useContext } from "react";

export default function HeatMap() {
  const { issues, locations, isMobile } = useContext(Context);

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
    <div className="mt-10 lg:mt-0 lg:relative lg:bg-bg-[#F6F7F9] lg:border-2 lg:rounded-2xl lg:bg-[#F6F7F9] lg:h-[480px]">
      <p className="mb-2 font-benton-black text-[16px] leading-[150%] text-[#1B1D22] lg:mt-4 lg:px-4">
        HeatMap
      </p>
      <div className={`h-[320px] overflow-y-auto border-2 rounded-2xl bg-[#F6F7F9] lg:bg-transparent lg:h-full lg:border-none`}>
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
    </div>
  );
}
