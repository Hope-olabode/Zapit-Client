import search from "../assets/search.svg";
import { Context } from "../context/Context";
import { useContext, useState, useMemo } from "react";
import Chart from "../components/Chart.jsx";

import CircularChart from "../components/CircularChart.jsx";
import CategoryBreakdown from "../components/CategoryBreakdown.jsx";
import HeatMap from "../components/HeatMap.jsx";
import ComparativeAnalytics from "../components/ComparativeAnalytics.jsx";
import CurvedProgressBar from "../components/CurvedProgressBar.jsx";
import HighIssueLocation from "../components/HighIssueLocation.jsx";
import CustomLineChart from "../components/TrendChart.jsx";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Share from "../components/Share.jsx";
import slide from "../assets/slide.svg";

export default function Report() {
  const { issues, isMobile, share, setShare } = useContext(Context);
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

  // useEffect(() => {
  //   if (barLocationView || drop1 || drop2) {
  //     document.body.style.overflow = "hidden"; // disable scroll
  //   } else {
  //     document.body.style.overflow = "auto"; // enable scroll
  //   }

  //   return () => {
  //     document.body.style.overflow = "auto"; // cleanup
  //   };
  // }, [barLocationView, drop1, drop2]);

  const currentDate = new Date();

  const highPriorityThisMonth = useMemo(() => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  return issues.filter((issue) => {
    const created = new Date(issue.createdAt);
    return (
      issue.priority === "High" &&
      created.getMonth() === month &&
      created.getFullYear() === year
    );
  }).length;
}, [issues]);


  return (
    <div className="h-full min-h-screen w-full relative bg-[#E8E9EB] lg:pr-6 scrollbar-hide">
      {/* Background pattern */}
      <div
        className="z-[1] w-full absolute top-0 h-[50%]
        bg-[length:23px_23px] 
        bg-[repeating-linear-gradient(0deg,#e1e2e5b0_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#e1e2e5b0_0_1px,transparent_1px_23px)] scrollbar-hide"
      ></div>

      <div className="w-full relative z-5 px-4 pb-[150px] lg:pl-[144px] lg:pt-[56px] scrollbar-hide">
        <div className="flex justify-between items-center pt-4 w-full lg:mt-0">
          <p className="font-benton-black text-[32px] leading-[130%] tracking-[-0.5px] text-[#1B1D22]">
            Analytics
          </p>
          <div className="p-4 lg:hidden">
            <img src={search} alt="" />
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex justify-between">
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
          <div className="border-2 mt-4 border-black rounded-2xl bg-[#F6F7F9] h-[120px] hidden lg:flex w-[393px]">
            <div className="w-1/2 p-4 flex flex-col justify-between h-full border-black border-r-[0.5px]">
              <div className="div">
                <p className="font-benton-bold text-[#1B1D22] text-[12px] leading-[150%]">
                  Urgency: High
                </p>
                <p className="font-benton-bold text-[#A1A6B0] text-[12px] leading-[150%]">
                  {currentDate.toLocaleString("en-NG", { month: "long" })}
                </p>
              </div>
              <div className="flex flex-col justify-end">
                <h1  className="font-benton-black text-[#1B1D22] h-[34px] text-[32px] leading-[130%] tracking-[-0.5px]">{highPriorityThisMonth}</h1>
              </div>
            </div>
            <div className="w-1/2 h-full flex items-center border-black border-l-[0.5px]">
              <img src={slide} alt="" />
            </div>
          </div>
        </div>

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
      {share && (
        <div
          onClick={() => setShare(false)}
          className="fixed inset-0 z-20 bg-[#0000006c]"
        >
          <Share />
        </div>
      )}
    </div>
  );
}
