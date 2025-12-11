import React from "react";

export default function ResolutionTimeChart() {
  const percentage = 32;
  const strokeWidth = 35;
  const width = 168;
  const height = 86;
  const radius = width / 2;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI; // Semi-circle circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-[#F6F7F9] h-full min-w-[150.5px] w-full rounded-[16px] border-2  flex flex-col justify-between ">
      {/* Header Section */}
      <div className="px-4 pt-4">
        <h2 className="text-[#A1A6B0] font-benton-bold text-[12px] leading-[150%] mb-3">
          Resolution Time
        </h2>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-[#1B1D22] font-benton-bold text-[12px] leading-[150%]">
            <span className="">SLA</span>
            <span className="">3.5 days</span>
          </div>
          <div className="flex justify-between items-center text-[#1B1D22] font-benton-bold text-[12px] leading-[150%]">
            <span className="">Average</span>
            <span className="">8-10 days</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex items-center justify-center rounded-b-[14px] overflow-hidden">
        <div className="relative">
          <svg height={height} width="100%" viewBox={`0 0 ${width} ${height}`}>
            {/* Background semi-circle */}
            <path
              d={`M ${
                strokeWidth / 2
              } ${height} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${
                width - strokeWidth / 2
              } ${height}`}
              stroke="#E8E9EB"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Progress semi-circle */}
            <path
              d={`M ${
                strokeWidth / 2
              } ${height} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${
                width - strokeWidth / 2
              } ${height}`}
              stroke="#FB0404"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference + " " + circumference}
              style={{
                strokeDashoffset,
              }}
            />
          </svg>
          {/* Percentage text */}
          <div className="absolute inset-0 flex items-end justify-center">
            <span className="font-benton-black text-[24px] leading-[130%] tracking-[-0.5px]">
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
