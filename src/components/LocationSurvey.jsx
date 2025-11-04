import back from "../assets/back.svg";
import menue from "../assets/menue.svg";

import { Context } from "../context/Context";
import { useState, useContext, useEffect, useMemo } from "react";

import { useNavigate } from "react-router-dom";

export default function LocationSurvey() {
  const { logs, setLogs, allSurveys, filteredSurveys, setFilteredSurveys } =
    useContext(Context);

  const [location, _setLocation] = useState(() => {
    const saved = sessionStorage.getItem("Location");
    return saved ? JSON.parse(saved) : null; // load from storage if exists
  });

  const years = Array.from({ length: 2080 - 2025 + 1 }, (_, i) => 2025 + i);
  const months = [
    { short: "Jan", full: "January" },
    { short: "Feb", full: "February" },
    { short: "Mar", full: "March" },
    { short: "Apr", full: "April" },
    { short: "May", full: "May" },
    { short: "Jun", full: "June" },
    { short: "Jul", full: "July" },
    { short: "Aug", full: "August" },
    { short: "Sep", full: "September" },
    { short: "Oct", full: "October" },
    { short: "Nov", full: "November" },
    { short: "Dec", full: "December" },
  ];

  // 🔹 Default to current month & year
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    months[currentDate.getMonth()].short
  );

  // 🔹 Filter surveys based on month/year
  useEffect(() => {
    if (!allSurveys || allSurveys.length === 0) return;

    const filtered = allSurveys.filter((survey) => {
      // 🔹 Extract month and year from survey.date
      // Expected format: "19:45 • 3rd Nov, 25"
      const match = survey.date.match(/(\w{3}), (\d{2})$/);
      if (!match) return false;

      const [_, monthStr, yearShort] = match;
      const yearFull = 2000 + parseInt(yearShort);

      // 🔹 Match month & year
      const matchesMonthYear =
        monthStr === selectedMonth && yearFull === selectedYear;

      // 🔹 Match location
      const matchesLocation =
        !location ||
        survey.locationName?.toLowerCase() === location.toLowerCase();

      return matchesMonthYear && matchesLocation;
    });

    setFilteredSurveys(filtered);
  }, [allSurveys, selectedMonth, selectedYear, location]);

  // 🔹 Get full month name for display message
  const fullMonthName =
    months.find((m) => m.short === selectedMonth)?.full || selectedMonth;

  const navigate = useNavigate();
  return (
    <div className="di">
      <div className=" relative w-full px-4 z-5 ">
        {/* Top navigation */}

        <div className="flex flex-row justify-between items-center  w-full py-4 h-[48px] mb-4">
          <button
            className="w-[48px] h-[48px] flex justify-center items-center"
            onClick={() => navigate(-1)}
          >
            <img className="w-[32px] h-[32px]" src={back} alt="" />
          </button>
          <div className="h-[36px] w-[120px] bg-[#F6F6F6] rounded-[32px] flex justify-center items-center">
            <button
              onClick={() => setLogs(true)}
              className={`h-full rounded-l-[32px] font-benton-black text-[12px] leading-[16px] tracking-[-0.5px] w-[50%] ${
                logs === true ? "bg-[#1B1D22] text-[#E1E2E5]" : "#1B1D22"
              }`}
            >
              Logs
            </button>
            <button
              onClick={() => setLogs(false)}
              className={`h-full text-center rounded-r-[32px] font-benton-black text-[12px] leading-[16px] tracking-[-0.5px] w-[50%] ${
                logs === true ? "#1B1D22" : "bg-[#1B1D22] text-[#E1E2E5]"
              }`}
            >
              Survey
            </button>
          </div>
          <button className="flex-shrink-0">
            <img src={menue} alt="menu" />
          </button>
        </div>

        {/* Location title */}

        <div className="flex-1 min-w-0 mb-4">
          <p className="truncate text-[32px] font-benton-black text-[#1B1D22] leading-[130%] tracking-[-0.5px]">
            {location || "Unknown Location"}
          </p>
        </div>
      </div>
      <div className="mt-4 w-full">
        <div className="mb-5">
          {/* 🔹 YEAR SELECTOR */}
          <div className="relative w-full overflow-x-auto py-2 z-20 scrollbar-hide">
            <div className="relative flex items-center w-max px-4">
              <div className="absolute inset-x-0 h-[2px] bg-black top-1/2 -translate-y-1/2 z-0" />

              {years.map((year, index) => (
                <div
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`relative w-[61px] flex items-center justify-center h-[26px] border rounded-[72px] bg-white font-medium text-sm z-10 text-[18px] font-benton-black leading-[16px] tracking-[-0.5px] cursor-pointer transition-all
                ${
                  year === selectedYear
                    ? "border-black text-black"
                    : "border-[#CED0D5] text-[#B7BBC2]"
                }
                ${index !== years.length - 1 ? "mr-[78vw]" : ""}`}
                >
                  {year}
                </div>
              ))}
            </div>
          </div>

          {/* 🔹 MONTH SELECTOR */}
          <div className="relative w-full overflow-x-auto py-2 z-20 scrollbar-hide">
            <div className="relative flex items-center w-max px-4">
              <div className="absolute inset-x-0 h-[2px] bg-black top-1/2 -translate-y-1/2 z-0" />

              {months.map((m, index) => (
                <div
                  key={m.short + index}
                  onClick={() => setSelectedMonth(m.short)}
                  className={`relative w-[47px] flex items-center justify-center h-[24px] border rounded-[50px] bg-[#F6F6F6] text-[14px] font-medium z-10 cursor-pointer transition-all
                ${
                  m.short === selectedMonth
                    ? "border-[#464646] text-[#464646] bg-white"
                    : "border-[#CED0D5] text-[#B7BBC2]"
                }
                ${index !== months.length - 1 ? "mr-[16px]" : ""}`}
                >
                  {m.short}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🔹 SURVEY LIST */}
        {filteredSurveys.length === 0 ? (
          <div className="flex flex-col justify-center items-center min-h-[70vh] text-center">
            <h1 className="text-[24px] leading-[125%] font-benton-black tracking-normal [-0.5px] text-[#A1A6B0]">
              No Surveys Available
            </h1>
            <p className="text-[15px] leading-[150%] font-sans text-[#292C33] mt-2">
              No conducted survey in {fullMonthName} {selectedYear}.
            </p>
          </div>
        ) : (
          <div className="px-4">
            <div className="bg-[#F6F7F9] border-2 relative w-full border-black rounded-xl overflow-hidden z-3">
              {filteredSurveys.map((survey, index) => (
                <div
                  key={index}
                  onClick={() => {
                    sessionStorage.setItem(
                      "selectedSurvey",
                      JSON.stringify(survey)
                    );
                    navigate("/survey/update");
                  }}
                  className="flex items-center border-b-2 border-black last:border-b-0 px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
                >
                  <span className="w-6 font-benton-bold text-[16px] leading-[150%]">
                    {index + 1}
                  </span>

                  <div className="ml-4">
                    <p className="font-benton-bold text-[16px] leading-[150%]">
                      {survey.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
