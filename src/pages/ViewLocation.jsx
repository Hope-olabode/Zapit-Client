import back from "../assets/back.svg";
import menue from "../assets/menue.svg";
import dropdown from "../assets/dropdown.svg";
import display from "../assets/display.svg";
import { Context } from "../context/Context";
import { useState, useContext, useEffect, useMemo } from "react";
import Category from "../components/Category3";
import issuesData from "../data/issues.json";
import IssuesByMonth from "../components/IssuesByMonth";
import { useNavigate } from "react-router-dom";
import capture from "../assets/capture.svg";
import Camera from "../components/Camera";
import Capture from "../components/Capture";
import search from "../assets/search.svg";
import cancle3 from "../assets/cancle3.svg";
import { useForm } from "react-hook-form";
import LocationLogs from "../components/LocationLogs";
import LocationSurvey from "../components/LocationSurvey";
import surveyImg from "../assets/survey.svg";
import Overlay from "../components/Overlay";

export default function ViewLocation() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [category, setCategory] = useState(false);
  const [viewOnlyCategory, setViewOnlyCategory] = useState(null);
  const [searchActive, setSearchActive] = useState(false);

  const {
    issues,
    startCamera,
    cameraActive,
    update,
    hold,
    setSelectedIssue,
    selectedIssue,
    logs,
    overlay,
    setOverlay,
    filteredSurveys
  } = useContext(Context);
  const [location, setLocation] = useState(() => {
    const saved = sessionStorage.getItem("Location");
    return saved ? JSON.parse(saved) : null; // load from storage if exists
  });
  const [issue, setissue] = useState(issuesData);
  console.log(issues);

  const { register, watch, setValue } = useForm({
    defaultValues: { searchTerm: "" },
  });

  const searchTerm = watch("searchTerm");

  const navigate = useNavigate();

  const filteredIssues = useMemo(() => {
    let filtered = issues.filter((item) => item.location === location);

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        item.categories.some((cat) => selectedCategories.includes(cat))
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
  }, [issues, location, selectedCategories, searchTerm]);

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
        {selectedIssue ? (
          ""
        ) : logs ? (
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
        ) : (
          <button
            onClick={() => setOverlay(true)}
            className="h-[72px] w-[72px] bg-[#4ECDC4] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] transform flex items-center justify-center transition-all duration-150"
          >
            <img src={surveyImg} alt="survey" />
          </button>
        )}
      </div>

      <div
        className="z-[1] w-full absolute top-0 h-[50%]
        bg-[length:23px_23px] 
        bg-[repeating-linear-gradient(0deg,#FFFFFF70_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#FFFFFF70_0_1px,transparent_1px_23px)]
        [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]
        [mask-repeat:no-repeat] [mask-size:100%_100%]"
      ></div>
      {logs ? <LocationLogs /> : <LocationSurvey />}
      {overlay && <Overlay filteredSurveys={filteredSurveys} />}
    </div>
  );
}
