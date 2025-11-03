import { useMemo, useState, useContext } from "react";
import dropdown from "../assets/dropdown2.svg";
import rarrow from "../assets/rArrow.svg";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import SelectedIssue from "./SelectedIssue";

export default function IssuesByMonth({ filteredIssues }) {
  const navigate = useNavigate();
  const { setSelectedIssue, selectedIssue } = useContext(Context);
  // ✅ Step 1: Group issues by month
  const groupedIssues = useMemo(() => {
    const groups = {};

    filteredIssues.forEach((issue) => {
      const match = issue.dateTime.match(/(\w+),\s*\d{2}$/);
      if (!match) return;
      const monthAbbrev = match[1];

      const monthName =
        {
          Jan: "January",
          Feb: "February",
          Mar: "March",
          Apr: "April",
          May: "May",
          Jun: "June",
          Jul: "July",
          Aug: "August",
          Sep: "September",
          Oct: "October",
          Nov: "November",
          Dec: "December",
        }[monthAbbrev] || monthAbbrev;

      if (!groups[monthName]) groups[monthName] = [];
      groups[monthName].push(issue);
    });

    const monthOrder = [
      "December",
      "November",
      "October",
      "September",
      "August",
      "July",
      "June",
      "May",
      "April",
      "March",
      "February",
      "January",
    ];

    return Object.entries(groups)
      .sort(([a], [b]) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
      .reduce((acc, [month, data]) => ({ ...acc, [month]: data }), {});
  }, [filteredIssues]);

  // ✅ Handle month click
  const handleMonthClick = (month) => {
    sessionStorage.setItem("Month", JSON.stringify(month));
    navigate("/location/view/day");
    console.log(month);
  };

  return (
    <div className="flex flex-col gap-10 mt-6">
      {/* ✅ Month Sections */}
      {Object.entries(groupedIssues).map(([month, issues]) => (
        <div key={month} className="flex flex-col gap-2">
          {/* ✅ Header */}
          <div
            onClick={() => handleMonthClick(month)}
            className="flex justify-between items-center mb-1 cursor-pointer hover:opacity-80"
          >
            <h2 className="font-benton-black text-[16px] leading-[150%] text-[#1B1D22]">
              {month} '25
            </h2>
            <span className="font-benton-black text-[16px] leading-[150%] text-[#A1A6B0] flex gap-4 justify-center items-center pr-4">
              {issues.length} <img src={rarrow} alt="" />
            </span>
          </div>

          {/* ✅ Mini preview (first 4) */}
          <div className="flex flex-col border rounded-2xl bg-[#F6F7F9]">
            {issues.slice(0, 4).map((issue, index) => (
              <div
                key={index}
                className={`flex gap-3 px-4 py-5 ${
                  index === 0 ? "" : "border-t"
                }`}
                onClick={() => setSelectedIssue(issue)}
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
                                .map((cat, i) => (i === 0 ? cat : ` • ${cat}`))
                                .join("")
                            : `${issue.categories[0]} • ${
                                issue.categories[1]
                              }... +${issue.categories.length - 2}`
                          : "Category"}
                      </p>
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
        </div>
      ))}
      {selectedIssue && <SelectedIssue />}
    </div>
  );
}
