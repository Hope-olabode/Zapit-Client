import { Context } from "../context/Context";
import { useContext } from "react";
import dhi from "../assets/dhighissue.svg";

export default function HighIssueLocation() {
  const { issues } = useContext(Context);
 

  function getTop3Locations() {
    if (!issues || issues.length === 0) return [];

    // Count issues per location
    const counts = issues.reduce((acc, issue) => {
      const loc = issue.location || "Unknown";
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {});

    // Convert to array and sort by count (descending)
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // high → low
      .slice(0, 3); // top 3 only

    // Return as objects
    return sorted.map(([location, count]) => ({
      location,
      count,
    }));
  }

  const top3 = getTop3Locations(issues);
  console.log(top3);

  return (
    <div className="bg-[#F6F7F9] h-full w-full min-w-[150.5px]  rounded-[16px] border-2  flex flex-col justify-between p-4">
      {issues.length === 0 ? (
        <div className="h-full">
          <h2 className="text-[#A1A6B0] font-benton-bold text-[12px] leading-[150%] pb-2 lg:pb-4">
            High Issues Locations
          </h2>
          <div className="px-[26px] py-[26px] lg:flex flex-col gap-3 lg:items-center lg:justify-center" >
            <img src={dhi} alt="" />
            <p className="text-center font-benton-regular text-[10px] leading-[150%] mt-[12px] lg:mt-0">There is currently no data to display.</p>
          </div>
        </div>
      ) : (
        <div className=" flex flex-col justify-between h-full">
          <div className="div">
            <h2 className="text-[#A1A6B0] lg:text-[#1B1D22] lg:text-[16px] lg:font-benton-black font-benton-bold text-[12px] leading-[150%] mb-2">
              High Issues Locations
            </h2>
            <div className="flex flex-col">
              <div className="flex flex-col gap-1">
                {top3.map((top, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-2 text-[#1B1D22] font-benton-bold text-[12px] leading-[150%]"
                  >
                    <span className="truncate">{top.location}</span>
                    <span className="">{top.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-[2px]">
            {top3.map((top, index) => (
              <div
                key={index}
                className={`${
                  index === 0
                    ? "bg-[#AD0000]"
                    : index === 1
                    ? "bg-[#6D0000]"
                    : "bg-[#000000]"
                } h-[22.67px] rounded`}
                style={{
                  width: `${Math.min(top.count, 100)}%`, // ensures max 100%
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
