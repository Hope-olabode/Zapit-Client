import { Context } from "../context/Context";
import { useContext } from "react";
import Chart from "./Chart.jsx"
import dcc from "../assets/dcircularchart.svg";

export default function CircularChart() {
  const { issues } = useContext(Context);
  const pendingCount = issues.filter((i) => i.status === "Pending").length;
  const inProgressCount = issues.filter(
    (i) => i.status === "In Progress"
  ).length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;
  const totalCount = issues.length;
  const circles = Array.from({ length: 60 });
  return (
    <div className="border-2 rounded-2xl h-[240px] bg-[#F6F7F9] flex overflow-hidden">
      <div className="w-[33%] h-[100%] p-4 flex flex-col justify-between">
        <p className="font-benton-black text-[15px] leading-[150%] text-[#1B1D22]">
          Issue Percentage
        </p>
        <div className="h-[84px] flex flex-col justify-between">
          <div className="flex justify-between font-benton-bold text-[12px]">
            <p className="text-[#A1A6B0]">All</p>
            <p className="text-[#1B1D22]">{totalCount}</p>
          </div>
          <div className="flex justify-between font-benton-bold text-[12px]">
            <p className="text-[#FFC529]">Pending</p>
            <p className="text-[#1B1D22]">{pendingCount}</p>
          </div>
          <div className="flex justify-between font-benton-bold text-[12px]">
            <p className="text-[#1513EC]">In Progress</p>
            <p className="text-[#1B1D22]">{inProgressCount}</p>
          </div>
          <div className="flex justify-between font-benton-bold text-[12px]">
            <p className="text-[#48BB78]">Resolved</p>
            <p className="text-[#1B1D22]">{resolvedCount}</p>
          </div>
        </div>
      </div>

      <div className="w-[67%] h-full overflow-hidden">
        <div className="relative w-full h-full overflow-visible flex justify-center items-center">
          {circles.map((_, i) => {
            const size = 100 + i * 10;
            return (
              <div
                key={i}
                className="absolute border border-[#E1E2E5] rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              />
            );
          })}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {issues.length === 0 ? <img src={dcc} alt="" /> : <Chart
              value1={pendingCount}
              value2={inProgressCount}
              value3={resolvedCount}
            />}
          </div>
        </div>
      </div>
    </div>
  );
}
