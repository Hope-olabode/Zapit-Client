import { Context } from "../context/Context";
import { useContext } from "react";

export default function ResolutionTimeChart() {
  const { sla, issues } = useContext(Context);
  const resolvedIssues = issues.filter(
    (i) => i.status === "Resolved" && i.completedAt
  );
  const parseCustomDate = (dateStr) => {
    if (!dateStr) return null;

    // "15:42 • 6th Nov, 25"
    const [time, date] = dateStr.split(" • ");
    const [hour, minute] = time.split(":").map(Number);

    const match = date.match(/(\d+)(st|nd|rd|th)\s(\w+),\s(\d+)/);
    if (!match) return null;

    const [, day, , monthStr, yearShort] = match;

    const months = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    return new Date(
      2000 + Number(yearShort),
      months[monthStr],
      Number(day),
      hour,
      minute
    );
  };
  const getResolutionDays = (issue) => {
    if (!issue.dateTime || !issue.completedAt) return null;

    const start = parseCustomDate(issue.dateTime);
    const end = parseCustomDate(issue.completedAt);

    if (!start || !end) return null;

    return (end - start) / (1000 * 60 * 60 * 24);
  };
  const resolutionDays = resolvedIssues
    .map(getResolutionDays)
    .filter((d) => d !== null);
  const metSlaCount = resolutionDays.filter((days) => days <= sla).length;

  const percentageFromData =
    resolutionDays.length === 0
      ? 0
      : Math.round((metSlaCount / resolutionDays.length) * 100);

  const percentage = Math.min(percentageFromData, 100);

  const strokeWidth = 40;
  const width = 240;
  const height = 120;

  const radius = width / 2;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI;

  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const averageDays =
    resolutionDays.length === 0
      ? 0
      : resolutionDays.reduce((a, b) => a + b, 0) / resolutionDays.length;

  return (
    <div className="bg-[#F6F7F9] h-full min-w-[150.5px] w-full rounded-[16px] border-2  flex flex-col justify-between ">
      {/* Header Section */}
      <div className="px-4 pt-4">
        <h2 className="text-[#A1A6B0] lg:text-[#1B1D22]  lg:font-benton-black font-benton-bold text-[12px] lg:text-[16px] leading-[150%] mb-3">
          Resolution Time
        </h2>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-[#1B1D22] font-benton-bold text-[12px] leading-[150%]">
            <span className="">SLA</span>
            <span className={`${sla ? "" : "border-b border-b-[#4ECDC4]"}`}>
              {sla ? `${sla} days` : "Not Set"}
            </span>
          </div>
          <div className="flex justify-between items-center text-[#1B1D22] font-benton-bold text-[12px] leading-[150%]">
            <span className="">Average</span>
            <span className="">
              {" "}
              {resolutionDays.length > 0
                ? `${averageDays.toFixed(1)} days`
                : "--"}
            </span>
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
            <span
              className={`font-benton-black text-[24px] leading-[130%] tracking-[-0.5px] ${
                percentage === 0 ? "text-[#CED0D5]" : "text-[#1B1D22]"
              }`}
            >
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
