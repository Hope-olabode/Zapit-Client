import { toast, Toaster } from "sonner";
import search from "../assets/search.svg";
import { Context } from "../context/Context";
import { useContext, useState } from "react";

export default function Report() {
  const { issues } = useContext(Context);

  const pendingCount = issues.filter((i) => i.status === "Pending").length;
  const inProgressCount = issues.filter(
    (i) => i.status === "In Progress"
  ).length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;
  const totalCount = issues.length;

  const stats = [
    {
      label: "Total",
      value: totalCount,
      color: "bg-white",
      textColor: "text-[#1B1D22]",
    },
    {
      label: "Pending",
      value: pendingCount,
      color: "bg-[#FFC529]",
      textColor: "text-[#1B1D22]",
    },
    {
      label: "In Progress",
      value: inProgressCount,
      color: "bg-[#1513EC]",
      textColor: "text-[#D2D2F4]",
    },
    {
      label: "Resolved",
      value: resolvedCount,
      color: "bg-[#48BB78]",
      textColor: "text-[#1B1D22]",
    },
  ];

  const getFlexGrow = (value, index) => {
    const length = String(value).length;
    return index === 0 ? length + 4 : length + 1;
  };

  return (
    <div className="h-full min-h-screen w-full relative bg-[#E8E9EB] overflow-x-scroll">
      <Toaster position="top-center" richColors />

      {/* Background pattern */}
      <div
        className="z-[1] w-full absolute top-0 h-[50%]
        bg-[length:23px_23px] 
        bg-[repeating-linear-gradient(0deg,#FFFFFF70_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#FFFFFF70_0_1px,transparent_1px_23px)]
        [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]
        [mask-repeat:no-repeat] [mask-size:100%_100%]"
      ></div>

      <div className="w-full relative z-10 px-4">
        <div className="flex justify-between items-center mt-4 w-full">
          <p className=" font-benton-black text-[32px] leading-[130%] tracking-[-0.5px] text-[#1B1D22]">
            Analytics
          </p>
          <div className="p-4">
            <img src={search} alt="" />
          </div>
        </div>

        {/* Stats bar */}
        <div className=" my-4 mb-10">
          <div className="flex items-stretch border-2 border-black rounded-[16px] overflow-hidden w-full">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`${stat.color} ${stat.textColor} p-4 flex flex-col justify-between min-w-[60px]`}
                style={{ flexGrow: getFlexGrow(stat.value, i), flexBasis: 0 }}
              >
                <p className="font-benton-bold text-[12px] leading-[150%] truncate mb-[40px]">
                  {stat.label}
                </p>
                <p className="font-benton-black text-[32px] tracking-[-0.5px] leading-[75%]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="div">
          <p className="font-benton-black text-[16px] leading-[150%] text-[#1B1D22]">
            Issue Trends
          </p>
          <div className="h-[400px] w-full border-2 rounded-2xl mt-1.5 mb-10 bg-[#F6F7F9] relative">
            <div className="h-[40px] w-[calc(100%-12px)] bg-white border-2 rounded-xl absolute bottom-[6px] left-1/2 -translate-x-1/2 flex overflow-hidden">
              <div className="flex w-[8.3333333%] justify-evenly">
                <div className="h-[40px] w-[1px] bg-amber-600"></div>
                <div className="h-[40px] w-[1px] bg-amber-600"></div>
                <div className="h-[40px] w-[1px] bg-amber-600"></div>
                <div className="h-[40px] w-[1px] bg-amber-600"></div>
                
              </div>
              <div className="flex w-[8.3333333%] justify-evenly">
                <div className="h-[40px] w-[1px] bg-amber-600"></div>
                <div className="h-[40px] w-[1px] bg-amber-600"></div>
                <div className="h-[40px] w-[1px] bg-amber-600"></div>
                <div className="h-[40px] w-[1px] bg-amber-600"></div>
              </div>
              <div className="flex w-[8.3333333%] justify-evenly">
                <div className="h-[40px] w-[1px] bg-amber-600"></div>
                <div className="h-[40px] w-[1px] bg-amber-600"></div>
                <div className="h-[40px] w-[1px] bg-amber-600"></div>
                <div className="h-[40px] w-[1px] bg-amber-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
