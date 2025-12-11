import { Toaster } from "sonner";
import search from "../assets/search.svg";
import { Context } from "../context/Context";
import { useContext, useState, useEffect } from "react";
import Chart from "../components/Chart.jsx";

import CircularChart from "../components/CircularChart.jsx";
import CategoryBreakdown from "../components/CategoryBreakdown.jsx";
import HeatMap from "../components/HeatMap.jsx";
import ComparativeAnalytics from "../components/ComparativeAnalytics.jsx";
import CurvedProgressBar from "../components/CurvedProgressBar.jsx";
import HighIssueLocation from "../components/HighIssueLocation.jsx";
import CustomLineChart from "../components/TrendChart.jsx";

export default function Report() {
  const { issues, isMobile } = useContext(Context);
  const [barLocation, setBarLocation] = useState("");
  const [barLocationView, setBarLocationView] = useState(false);
  const [cALogs, setCALogs] = useState(true);
  const [location1, setLocation1] = useState("");
  const [location2, setLocation2] = useState("");
  const [drop1, setDrop1] = useState(false);
  const [drop2, setDrop2] = useState(false);

  // Counts
  const pendingCount = issues.filter((i) => i.status === "Pending").length;
  const inProgressCount = issues.filter(
    (i) => i.status === "In Progress"
  ).length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;
  const totalCount = issues.length;

  const filteredIssues =
    barLocation === ""
      ? issues
      : issues.filter((i) => i.location === barLocation);

  // Count categories FROM filteredIssues
  const categoryCount = {};
  filteredIssues.forEach((issue) => {
    issue.categories.forEach((cat) => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
  });

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

  useEffect(() => {
    if (barLocationView || drop1 || drop2) {
      document.body.style.overflow = "hidden"; // disable scroll
    } else {
      document.body.style.overflow = "auto"; // enable scroll
    }

    return () => {
      document.body.style.overflow = "auto"; // cleanup
    };
  }, [barLocationView, drop1, drop2]);

  return (
    <div className="h-full min-h-screen w-full relative bg-[#E8E9EB] scrollbar-hide lg:pr-6 overflow-x-scroll">
      <Toaster position="top-center" richColors />

      {/* Background pattern */}
      <div
        className="z-[1] w-full absolute top-0 h-[50%]
        bg-[length:23px_23px] 
        bg-[repeating-linear-gradient(0deg,#e1e2e5b0_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#e1e2e5b0_0_1px,transparent_1px_23px)]"
      ></div>

      <div className="w-full relative z-5 px-4 pb-[150px] lg:pl-[144px] lg:pt-[56px] scrollbar-hide">
        <div className="flex justify-between items-center mt-4 w-full lg:mt-0">
          <p className="font-benton-black text-[32px] leading-[130%] tracking-[-0.5px] text-[#1B1D22]">
            Analytics
          </p>
          <div className="p-4 lg:hidden">
            <img src={search} alt="" />
          </div>
        </div>

        {/* Stats bar */}
        <div className="my-4 mb-10 lg:w-[393px]">
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

        {/* Fake Trend Chart */}
        {/* <div>
          <p className="font-benton-black text-[16px] leading-[150%] text-[#1B1D22]">
            Issue Trends
          </p>
          <div className="h-[400px] w-full border-2 rounded-2xl mt-1.5 mb-10 bg-[#F6F7F9] relative overflow-hidden">
            <div className="relative w-full h-[50%] bg-black p-4 flex justify-between">
              <div className="w-[1px] h-full bg-white absolute top-0"></div>
              <div className="w-[1px] h-[40%] bg-white"></div>
              <div className="w-[1px] h-[20%] bg-white"></div>
              <div className="w-[1px] h-[60%] bg-white"></div>
            </div>
            <div className="h-[40px] w-[calc(100%-12px)] bg-white border-2 rounded-xl absolute bottom-[6px] left-1/2 -translate-x-1/2 flex overflow-hidden">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex w-[8.3333333%] justify-evenly">
                  <div className="h-[40px] w-[1px] bg-amber-600"></div>
                  <div className="h-[40px] w-[1px] bg-amber-600"></div>
                  <div className="h-[40px] w-[1px] bg-amber-600"></div>
                  <div className="h-[40px] w-[1px] bg-amber-600"></div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
        <CustomLineChart />

        {isMobile && (
          <div className="h-[200px] flex mb-10 gap-4">
            <div className="w-[50%]">
              <CurvedProgressBar percent={75} />
            </div>
            <div className="w-[50%] h-full">
              <HighIssueLocation />
            </div>
          </div>
        )}

        {isMobile && (
          <div className="">
            {/* Circular Chart */}
            <CircularChart />
          </div>
        )}

        <div className={`${isMobile ? "" : "flex w-full gap-10 mt-10"}`}>
          <div className={`${isMobile ? "" : "w-[55%]"}`}>
            {/* Category Breakdown */}
            <CategoryBreakdown
              barLocation={barLocation}
              setBarLocation={setBarLocation}
              barLocationView={barLocationView}
              setBarLocationView={setBarLocationView}
            />
          </div>

          <div className={`${isMobile ? "" : "w-[45%]"}`}>
            {/* Heat Map */}
            <HeatMap />
          </div>
        </div>

        {/*  */}
        
        {isMobile ? (
          <ComparativeAnalytics
          cALogs={cALogs}
          setCALogs={setCALogs}
          drop1={drop1}
          setDrop1={setDrop1}
          drop2={drop2}
          setDrop2={setDrop2}
          location1={location1}
          setLocation1={setLocation1}
          location2={location2}
          setLocation2={setLocation2}
        />
        ) : (
          <div className="flex gap-10 mt-10 h-[530px]">
            <div className="w-[55%]">
              <ComparativeAnalytics
              cALogs={cALogs}
              setCALogs={setCALogs}
              drop1={drop1}
              setDrop1={setDrop1}
              drop2={drop2}
              setDrop2={setDrop2}
              location1={location1}
              setLocation1={setLocation1}
              location2={location2}
              setLocation2={setLocation2}
            />
            </div>
            <div className="flex flex-col w-[45%] gap-4">
              <div className="h-[240px]">
                <CircularChart />
              </div>
              <div className="h-[240px] flex mb-10 gap-4">
                <div className="w-[50%]">
                  <CurvedProgressBar percent={75} />
                </div>
                <div className="w-[50%] h-full">
                  <HighIssueLocation />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
