import { useState, useContext, useEffect } from "react";
import { Context } from "../context/Context";
import { toast } from "sonner";
import LogsSurveyNav from "../components/logsSurveyNav";
import { useNavigate } from "react-router-dom";
import copy from "../assets/copy.svg";
import Overlay from "../components/Overlay";
import { useMediaQuery } from "../hooks/useMediaQuery";
import UpdateSurvey from "../pages/UpdateSurvey.jsx";
import NewSurvey from "../pages/NewSurvey.jsx";
import { useForm } from "react-hook-form";
import Share from "../components/Share.jsx";

export default function Surveys() {
  const { register } = useForm();
  const {
    allSurveys,
    selectedSurvey,
    setSelectedSurvey,
    overlay,
    filteredSurveys,
    setFilteredSurveys,
    desktop,
    setDesktop,
    desktop2,
    setDesktop2,
    desktop3,
    setDesktop3, share, setShare
  } = useContext(Context);
  const navigate = useNavigate();

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

  const [minimize, setMinimize] = useState(true);

  // 🔹 Filter surveys based on month/year
  useEffect(() => {
    if (!allSurveys || allSurveys.length === 0) return;

    const filtered = allSurveys.filter((survey) => {
      // Expected date format: "09:08 • 27th Nov, 25"
      const match = survey.date.match(/(\w{3}), (\d{2})$/);
      if (!match) return false;

      const [_, monthStr, yearShort] = match;
      const yearFull = 2000 + parseInt(yearShort);

      return monthStr === selectedMonth && yearFull === selectedYear;
    });

    setFilteredSurveys(filtered);
  }, [allSurveys, selectedMonth, selectedYear]);

  // 🔹 Get full month name for display message
  const fullMonthName =
    months.find((m) => m.short === selectedMonth)?.full || selectedMonth;

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="h-full min-h-screen w-full relative bg-[#E8E9EB] overflow-x-scroll lg:overflow-x-auto">
      <div className="lg:hidden">
        <LogsSurveyNav register={register}  />
      </div>

      {/* Background pattern */}
      <div
        className="z-[1] w-full absolute top-0 h-[50%]
        bg-[length:23px_23px] 
        bg-[repeating-linear-gradient(0deg,#FFFFFF70_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#FFFFFF70_0_1px,transparent_1px_23px)]
        [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]
        [mask-repeat:no-repeat] [mask-size:100%_100%]"
      ></div>

      <div
        className={`${
          desktop || desktop2 || desktop3
            ? `${minimize ? "w-[calc(100vw-465px)]" : "w-[calc(100vw-40px)]"}`
            : "lg:pr-[40px]"
        }  mt-20 lg:pl-[144px]  lg:pt-[56px] lg:mt-0 flex gap-[32px] lg:h-[calc(100vh-65px)]`}
      >
        <div className={` ${minimize ? "w-full" : "hidden"} `}>
          <div className="hidden lg:block relative z-20">
            <LogsSurveyNav register={register}  />
          </div>
          <div className="mb-5 lg:mt-8 lg:mb-8">
            {/* 🔹 YEAR SELECTOR */}
            <div className="relative w-full overflow-x-auto py-2 z-20 scrollbar-hide">
              <div className="relative flex items-center w-max px-4 lg:px-0">
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
              <div className="relative flex items-center w-max px-4 lg:px-0">
                <div className="absolute inset-x-0 h-[2px] bg-black top-1/2 -translate-y-1/2 z-0" />

                {months.map((m, index) => (
                  <div
                    key={m.short + index}
                    onClick={() => setSelectedMonth(m.short)}
                    className={`relative w-[47px]  flex items-center justify-center h-[24px] border rounded-[50px] bg-[#F6F6F6] text-[14px] font-medium z-10 cursor-pointer transition-all lg:w-auto lg:px-2
                ${
                  m.short === selectedMonth
                    ? "border-[#464646] text-[#464646] bg-white"
                    : "border-[#CED0D5] text-[#B7BBC2]"
                }
                ${
                  index !== months.length - 1
                    ? "mr-[16px] md:mr-[40px] lg:mr-8 2xl:mr-[40px]"
                    : ""
                }`}
                  >
                    {isDesktop ? m.full : m.short}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 🔹 SURVEY LIST */}
          {filteredSurveys.length === 0 ? (
            <div className="flex flex-col justify-center items-center min-h-[70vh] lg:min-h-[calc(100vh-300px)] text-center">
              <h1 className="text-[24px] leading-[125%] font-benton-black tracking-normal [-0.5px] text-[#A1A6B0]">
                No Surveys Available
              </h1>
              <p className="text-[15px] leading-[150%] font-sans text-[#292C33] mt-2">
                No conducted survey in {fullMonthName} {selectedYear}.
              </p>
            </div>
          ) : (
            <div className="px-4 lg:px-0 lg:flex">
              <div className="bg-[#F6F7F9] border-2 relative w-full border-black rounded-xl overflow-hidden z-3">
                {filteredSurveys.map((survey, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      sessionStorage.setItem(
                        "selectedSurvey",
                        JSON.stringify(survey)
                      );
                      if (isDesktop) {
                        setDesktop(true);
                        setDesktop2(false);
                        setDesktop3(false);
                      } else {
                        navigate("/survey/update");
                      }
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
        {desktop && (
          <div className={`${minimize ? "w-[393px] z-10" : "w-full"}`}>
            <div className="lg:h-[calc(100vh-65px)] overflow-y-auto scrollbar-hide">
              <UpdateSurvey
                setDesktop={setDesktop}
                minimize={minimize}
                setMinimize={setMinimize}
              />
            </div>
          </div>
        )}
        {desktop2 && (
          <div className={`${minimize ? "w-[393px] z-10" : "w-full"}`}>
            <div className="lg:h-[calc(100vh-65px)] overflow-y-auto scrollbar-hide">
            <NewSurvey
              setDesktop2={setDesktop2}
              minimize={minimize}
              desktop2={desktop2}
              setMinimize={setMinimize}
              setDesktop3={setDesktop3}
            /></div>
          </div>
        )}
        {desktop3 && (
          <div className={`${minimize ? "w-[393px] z-10" : "w-full"}`}>
            <div className="lg:h-[calc(100vh-65px)] overflow-y-auto scrollbar-hide">
            <NewSurvey
              setDesktop3={setDesktop3}
              desktop2={desktop2}
              minimize={minimize}
              setMinimize={setMinimize}
              setDesktop2={setDesktop2}
            /></div>
          </div>
        )}
      </div>

      {/* 🔹 OVERLAY BOTTOM SHEET */}
      {overlay && (
        <Overlay
          filteredSurveys={filteredSurveys}
          setDesktop2={setDesktop2}
          setDesktop={setDesktop}
          setDesktop3={setDesktop3}
        />
      )}
      {share && (<Share />)}
    </div>
  );
}
