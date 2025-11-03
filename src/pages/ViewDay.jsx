import back from "../assets/back.svg";
import menue from "../assets/menue.svg";
import dropdown from "../assets/dropdown.svg";
import display from "../assets/display.svg";
import { Context } from "../context/Context";
import { useState, useContext, useEffect, useMemo } from "react";
import Category from "../components/Category3";
import issuesData from "../data/issues.json";
import IssuesByMonth from "../components/IssuesByMonth";
import capture from "../assets/capture.svg";
import Camera from "../components/Camera";
import Capture from "../components/Capture";
import { useNavigate } from "react-router-dom";
import SelectedIssue from "../components/SelectedIssue";
import search from "../assets/search.svg";
import cancle3 from "../assets/cancle3.svg";
import { useForm } from "react-hook-form";

export default function ViewDay() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [category, setCategory] = useState(false);
  const [viewOnlyCategory, setViewOnlyCategory] = useState(null);
  const [searchActive, setSearchActive] = useState(false);

  const { register, watch, setValue } = useForm({
    defaultValues: { searchTerm: "" },
  });

  const searchTerm = watch("searchTerm");

  const {
    issues,
    startCamera,
    cameraActive,
    update,
    hold,
    setSelectedIssue,
    selectedIssue,
  } = useContext(Context);
  const [location, setLocation] = useState(() => {
    const saved = sessionStorage.getItem("Location");
    return saved ? JSON.parse(saved) : null; // load from storage if exists
  });
  const [month, setMonth] = useState(() => {
    const saved = sessionStorage.getItem("Month");
    return saved ? JSON.parse(saved) : null; // load from storage if exists
  });
  const [issue, setissue] = useState(issuesData);
  const [selectedDay, setSelectedDay] = useState(null);
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    if (month) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const monthNumber =
        typeof month === "string"
          ? monthNames.findIndex(
              (m) => m.toLowerCase() === month.toLowerCase()
            ) + 1
          : month;

      if (monthNumber > 0) {
        const year = new Date().getFullYear();

        // ✅ Get total days in this month
        const currentMonthDays = new Date(year, monthNumber, 0).getDate();

        // ✅ Get total days in previous month
        const prevMonthDays = new Date(year, monthNumber - 1, 0).getDate();

        // ✅ Get the last 3 days of previous month
        const prevThree = [prevMonthDays - 2, prevMonthDays - 1, prevMonthDays];

        // ✅ Combine previous 3 + current month days
        const daysArray = [
          ...prevThree.map((d) => ({ day: d, isPrev: true })),
          ...Array.from({ length: currentMonthDays }, (_, i) => ({
            day: i + 1,
            isPrev: false,
          })),
        ];

        setDaysInMonth(daysArray);
      }
    }
  }, [month]);

  const handleClick = (item) => {
    if (!item.isPrev) setSelectedDay(item.day);
  };

  const filteredIssues = useMemo(() => {
    if (!issues || issues.length === 0) return [];

    let filtered = [...issues];

    // ✅ Filter by location (exact match)
    if (location) {
      filtered = filtered.filter(
        (item) => item.location?.toLowerCase() === location.toLowerCase()
      );
    }

    // ✅ Filter by month — extract month name from `dateTime`
    if (month) {
      const monthLower = month.toLowerCase();

      filtered = filtered.filter((item) => {
        const dateText = item.dateTime || "";
        const match = dateText.match(/([A-Za-z]+)/g);
        const monthWord = match?.find((w) =>
          [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december",
            "jan",
            "feb",
            "mar",
            "apr",
            "jun",
            "jul",
            "aug",
            "sep",
            "sept",
            "oct",
            "nov",
            "dec",
          ].includes(w.toLowerCase())
        );

        if (!monthWord) return false;
        return monthWord.toLowerCase().startsWith(monthLower.slice(0, 3));
      });
    }

    // ✅ Filter by selected day (from day buttons)
    if (selectedDay) {
      filtered = filtered.filter((item) => {
        const dateText = item.dateTime || "";
        // match something like "10th" or "11th"
        const dayMatch = dateText.match(/(\d{1,2})(?:st|nd|rd|th)/);
        const dayNum = dayMatch ? parseInt(dayMatch[1]) : null;
        return dayNum === selectedDay;
      });
    }

    // ✅ Filter by selected categories (if any)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        item.categories?.some((cat) => selectedCategories.includes(cat))
      );
    }

    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.description?.toLowerCase().includes(lower) ||
          item.location?.toLowerCase().includes(lower) ||
          item.categories?.some((cat) => cat.toLowerCase().includes(lower))
      );
    }

    return filtered;
  }, [issues, location, month, selectedDay, selectedCategories, searchTerm]);

  // ✅ Compute stats from filtered issues
  const pendingCount = filteredIssues.filter(
    (i) => i.status === "Pending"
  ).length;
  const inProgressCount = filteredIssues.filter(
    (i) => i.status === "In Progress"
  ).length;
  const resolvedCount = filteredIssues.filter(
    (i) => i.status === "Resolved"
  ).length;
  const totalCount = filteredIssues.length;

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
    <div className="bg-[#E8E9EB] min-h-screen relative pt-4">
      <div className="fixed bottom-[36px] left-[50%] translate-x-[-50%] z-10">
        <button
          className="
          h-[72px] w-[72px] bg-[#4ECDC4]
          font-benton-black text-[21px] leading-[150%]
          rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22]
          active:shadow-[0px_0px_0px_0px_#1B1D22]
          active:translate-y-[5px] active:translate-x-[5px]
          flex items-center justify-center transition-all duration-150"
          onClick={startCamera}
        >
          <img src={capture} alt="capture" />
        </button>
      </div>

      <div
        className="z-[1] w-full absolute top-0 h-[50%]
        bg-[length:23px_23px] 
        bg-[repeating-linear-gradient(0deg,#FFFFFF70_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#FFFFFF70_0_1px,transparent_1px_23px)]
        [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]
        [mask-repeat:no-repeat] [mask-size:100%_100%]"
      ></div>
      <div className=" relative w-full px-4 z-5 ">
        {/* Top navigation */}

        <div className="w-full py-4 h-[48px] mb-4">
          <button onClick={() => navigate(-1)}>
            <img src={back} alt="" />
          </button>
        </div>

        {/* Location title */}
        <div className="mb-6">
          <div className="flex-1 min-w-0">
            <p className="font-benton-bold text-[13px] text-[#8B919D] leading-[130%] tracking-[-0.5px">
              {location}
            </p>
            <p className="truncate text-[32px] font-benton-black text-[#1B1D22] leading-[130%] tracking-[-0.5px]">
              {month || "Unknown Location"}
            </p>
          </div>
        </div>

        {searchActive ? (
          <div></div>
        ) : (
          <div>
            <div className="w-full flex justify-center mt-6 mb-3">
              <div className="flex overflow-x-auto bg-[#F6F7F9] rounded-2xl border-2 scrollbar-hide">
                {daysInMonth.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleClick(item)}
                    disabled={item.isPrev}
                    className={`min-w-[51.6px] h-[56px] text-[24px] font-benton-black leading-[130%] tracking-[-0.5px] flex items-center justify-center font-bold transition-all
              ${
                item.isPrev
                  ? "text-[#CED0D5] cursor-not-allowed"
                  : selectedDay === item.day
                  ? "bg-[#1B1D22] text-[#F6F7F9]"
                  : "text-[#1B1D22] hover:bg-gray-200"
              }`}
                  >
                    {item.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats bar */}
            <div className=" mb-4">
              <div className="flex items-stretch border border-black rounded-[16px] overflow-hidden w-full">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`${stat.color} ${stat.textColor} p-4 flex flex-col justify-between min-w-[60px]`}
                    style={{
                      flexGrow: getFlexGrow(stat.value, i),
                      flexBasis: 0,
                    }}
                  >
                    <p className="font-benton-bold text-[12px] leading-[150%] truncate">
                      {stat.label}
                    </p>
                    <p className="font-benton-black text-[32px] tracking-[-0.5px] leading-[130%]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category filter */}

        {searchActive ? (
          <div className="flex w-full mb-8 justify-center items-center">
            <img
              onClick={() => {
                setSearchActive(false);
                setValue("searchTerm", ""); // ✅ clears the input
              }}
              src={cancle3}
              alt=""
            />
            <div className="flex items-center gap-2 h-[26px] rounded-[72px] px-2 border border-[#1B1D22] bg-[#F6F6F6] w-full mr-2 ml">
              <img className="w-3.5 h-3.5" src={search} alt="" />
              <input
                {...register("searchTerm")}
                className="border-0 focus:outline-none h-[14.5px] w-full text-[#989898] font-benton-bold text-[12px] leading-[16px] tracking-[-0.5px]"
                type="text"
                placeholder="Search Logs"
                autoFocus
              />
            </div>
            <button>
              <img src={display} alt="" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="mb-4 flex flex-row justify-between">
              <div className="flex gap-[6px] justify-center items-center">
                <img
                  onClick={() => setSearchActive(true)}
                  src={search}
                  alt=""
                />
                <div
                  onClick={() => {
                    setCategory(true);
                  }}
                  className="flex bg-[#F6F6F6] gap-1 items-center border rounded-[72px] h-[26px] pl-[8px] pr-[7px] max-w-[240px]"
                >
                  <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px] truncate">
                    {selectedCategories.length > 0
                      ? selectedCategories.length <= 2
                        ? selectedCategories
                            .map((cat, i) => (i === 0 ? cat : ` • ${cat}`))
                            .join("")
                        : `${selectedCategories[0]} • ${
                            selectedCategories[1]
                          }... +${selectedCategories.length - 2}`
                      : "Category"}
                  </p>
                  <img src={dropdown} alt="" className="flex-shrink-0" />
                </div>
              </div>
              <button>
                <img src={display} alt="" />
              </button>
            </div>

            {category && (
              <div className="div">
                <div className="top-0 left-[16px] z-30 absolute">
                  <Category
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                  />
                </div>
                <div
                  onClick={() => setCategory(false)}
                  className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-10 h-screen"
                ></div>
              </div>
            )}
          </div>
        )}

        {/* <IssuesByMonth filteredIssues={filteredIssues} /> */}
        {/* Issues list or empty state */}
        <div className="min-h-[60vh] flex flex-col justify-center items-center w-full">
          {filteredIssues.length === 0 ? (
            searchActive ? (
              <div className="flex flex-col items-center justify-center text-center">
                <h1 className="font-benton-black text-[24px] leading-[125%] tracking-[-0.5px] text-[#1B1D22]">
                  "{searchTerm}"
                </h1>
                <p className="text-[#292C33] font-benton-regular text-[15px] leading-[150%]">
                  No log matches your search input
                </p>
              </div>
            ) : (
              <p className="text-center text-[#292C33] font-benton-regular text-[15px] leading-[150%]">
                No log found
              </p>
            )
          ) : (
            <div className="flex flex-col border rounded-2xl bg-[#F6F7F9] w-full">
              {filteredIssues.map((issue, index) => (
                <div
                  onClick={() => setSelectedIssue(issue)}
                  key={index}
                  className={`flex gap-3 px-4 py-5 ${
                    index === 0 ? "" : "border-t"
                  }`}
                >
                  <img
                    className="h-12 w-12 rounded-[8px]"
                    src={issue.images[0].url}
                    alt=""
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate w-full font-benton-bold text-[14px] leading-[150%]">
                      {issue.description}
                    </p>
                    <div className="flex justify-between mt-[4px] items-center">
                      <div className="flex gap-1 items-center border rounded-[72px] h-[22px] pl-[8px] pr-[7px] max-w-[115px]">
                        <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px] truncate">
                          {issue.categories.length > 0
                            ? issue.categories.length <= 2
                              ? issue.categories
                                  .map((cat, i) =>
                                    i === 0 ? cat : ` • ${cat}`
                                  )
                                  .join("")
                              : `${issue.categories[0]} • ${
                                  issue.categories[1]
                                }... +${issue.categories.length - 2}`
                            : "Category"}
                        </p>
                        <img src={dropdown} alt="" className="flex-shrink-0" />
                      </div>

                      <div className="flex gap-1">
                        <div
                          className={`w-[15px] h-[22px] border rounded-[72px] ${
                            issue.status === "Pending"
                              ? "bg-[#FFC529] border-[#461B02]"
                              : issue.status === "In Progress"
                              ? "bg-[#1513EC] border-[#00003D]"
                              : "bg-[#73CA5E] border-[#317223]"
                          }`}
                        ></div>
                        <div
                          className={`w-[15px] h-[22px] border rounded-[72px] ${
                            issue.priority === "Low"
                              ? "bg-[#F6F6F6] border-[#464646]"
                              : issue.priority === "Medium"
                              ? "bg-[#FFFBEB] border-[#B75406]"
                              : "bg-[#FFDDE2] border-[#CC001E]"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {cameraActive && <Camera update={update} />}
      {hold && <Capture />}
      {selectedIssue && <SelectedIssue />}
    </div>
  );
}
