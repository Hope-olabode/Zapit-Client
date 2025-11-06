import { Context } from "../context/Context";
import { useContext, useState } from "react";
import location3 from "../assets/location3.svg";
import clock from "../assets/clock.svg";
import dropdown from "../assets/dropdown.svg";
import empty from "../assets/empty.svg";

import cc from "../assets/catcancle.svg";
import ca from "../assets/catadd.svg";
import SelectedIssue from "./SelectedIssue";

export default function LoadedIssues() {
  const { issues, categories, setSelectedIssue, selectedIssue } = useContext(Context);

  

  const [viewOnlyCategory, setViewOnlyCategory] = useState(null);

  console.log(categories);
  

  const isSelected2 = (issue, categoryName) =>
    Array.isArray(issue.categories) && issue.categories.includes(categoryName);

  const pendingCount = issues.filter(
    (i) => i.status === "Pending"
  ).length;
  const inProgressCount = issues.filter(
    (i) => i.status === "In Progress"
  ).length;
  const resolvedCount = issues.filter(
    (i) => i.status === "Resolved"
  ).length;
  const totalCount = issues.length;

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
    <div className="">
      <div className="absolute mt-[88px]  w-full left-[50%] translate-x-[-50%] z-5">
        {/* Stats bar */}
        <div className="h-[120px] mb-4 px-4">
          <div className="flex h-full items-stretch border-2 border-black rounded-[16px] overflow-hidden w-full">
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
        <div className=" px-4 mb-[150px]">
          {issues.map((issue, index) => (
            <div
              onClick={() => setSelectedIssue(issue)}
              key={index}
              className={`mb-4 border-1 border-black rounded-[16px] overflow-hidden bg-[#F6F7F9] flex  ${
                index === 0 ? "flex-col" : " flex-row h-[144px]"
              }`}
            >
              <div
                className={`flex flex-col ${index === 0 ? "w-full" : "w-full"}`}
              >
                <div className="h-full mx-4 mt-[15px]">
                  <div
                    className={`div  ${
                      index === 0 ? "mb-[20px]" : "mb-[12px]"
                    }`}
                  >
                    {/* onething */}
                    <div
                      className={`relative w-full flex  justify-between flex-row`}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation(); // 👈 prevent parent click from firing
                          setViewOnlyCategory(
                            viewOnlyCategory === index ? null : index // 👈 toggle based on index
                          );
                        }}
                        className={`flex gap-1 items-center border rounded-[72px] ${
                          index === 0 ? "h-[26px]" : "h-[22px]"
                        } pl-[8px] pr-[7px] max-w-[115px]`}
                      >
                        <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px] truncate tracking-[-0.5px]">
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
                      <div className="flex gap-2">
                        <div
                          className={`${
                            index === 0 ? "px-2" : "w-[15px]"
                          } border rounded-[72px] flex justify-center items-center  ${
                            issue.status === "Pending"
                              ? "bg-[#FFC529] text-[#461B02] border-[#461B02]"
                              : issue.status === "In Progress"
                              ? "bg-[#1513EC] text-[#D2D2F4] border-[#00003D]"
                              : "bg-[#73CA5E] text-[#0D301C] border-[#317223]"
                          }  }`}
                        >
                          {index === 0 ? <p className="font-sans font-semibold text-[12px] leading-[16px] tracking-[-0.5px]">{issue.status}</p> : ""}
                        </div>
                        <div
                          className={`${
                            index === 0 ? "px-2" : "w-[15px]"
                          } border rounded-[72px] flex justify-center items-center ${
                            issue.priority === "Low"
                              ? "bg-[#F6F6F6] text-[#464646] border-[#464646]"
                              : issue.priority === "Medium"
                              ? "bg-[#FFFBEB] text-[#7A350D] border-[#B75406]"
                              : "bg-[#FFDDE2] text-[#CC001E] border-[#CC001E]"
                          }  }`}
                        >
                          {index === 0 ? <p className="font-sans font-semibold text-[12px] leading-[16px] tracking-[-0.5px]">{issue.priority}</p> : ""}
                        </div>
                      </div>

                      {viewOnlyCategory === index && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="top-0 left-[0px] z-30 absolute"
                        >
                          <div className="w-[200px] fixed pb-2 z-20 h-[150px] bg-[#F6F6F6] rounded-[14px] border-1 border-gray-800 shadow-lg overflow-hidden">
                            {/* Header */}
                            <div className="p-2 border-b-1 border-gray-800">
                              <div className="flex items-center justify-between h-[14px]">
                                <h2 className="text-[12px] font-sans leading-[16px] font-semibold">
                                  Categories
                                </h2>
                                <button
                                  type="button"
                                  // onClick={() => setShowAddModal(true)}
                                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                >
                                  <img
                                    src={ca}
                                    className="w-6 h-6 text-gray-800"
                                  />
                                </button>
                              </div>
                            </div>
                            <div className="h-[117px] overflow-y-auto rounded-b-3xl">
                              <div className="p-2 rounded-b-3xl">
                                <div className="flex flex-wrap gap-3">
                                  {categories.map((category) => (
                                    <button
                                      type="button"
                                      key={category._id}
                                      onClick={() => console.log(category.name)}
                                      className={`relative px-2 py-[5px] rounded-full h-[26px] text-base font-semibold
                                                    transition-all duration-200 border-1 flex items-center
                                                    ${
                                                      isSelected2(issue, category.name)
                                                        ? "border-gray-800"
                                                        : "text-gray-700 border-gray-300 hover:border-gray-400"
                                                    }`}
                                    >
                                      <span className="text-[12px] font-sans leading-[16px] font-semibold"
                                      style={{ color: category.colour }}>
                                        {category.name}
                                      </span>
                                      {isSelected2(issue, category.name) && (
                                        <span>
                                          <img src={cc} className="w-5 h-5" />
                                        </span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewOnlyCategory(null);
                            }}
                            className="fixed inset-0 bg-[#00000000] flex flex-col z-10"
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`${index === 0 ? "mb-4" : ""}`}>
                    <p
                      className={`font-benton-bold truncate text-black  ${
                        index === 0
                          ? "text-[18px] leading-[130%] tracking-[-0.5px]"
                          : "text-[14px] leading-[150%]"
                      } `}
                    >
                      {issue.description}
                    </p>
                  </div>
                </div>
                {index === 0 ? (
                  ""
                ) : (
                  <div className=" w-full mb-[15px] mt-[8px] h-[1px] border-black  bg-black"></div>
                )}

                {index === 0 ? (
                  ""
                ) : (
                  <div className="flex mx-4 mb-[15px] flex-col justify-end">
                    <div
                      className={`flex flex-row mb-[15px] items-center  gap-2 ${
                        index === 0 ? "h-[13px]" : "h-[9.29px]"
                      }`}
                    >
                      <img src={location3} className="h-2.5 w-2.5" alt="" />
                      <p className="text-[10px] font-benton-bold leading-[150%] text-[#292C33]">
                        {issue.location}
                      </p>
                    </div>
                    <div
                      className={`flex flex-row items-center  gap-2 ${
                        index === 0 ? "h-[13px]" : "h-[9.29px]"
                      }`}
                    >
                      <img src={clock} className="h-2.5 w-2.5" alt="" />
                      <p className="text-[10px] font-benton-bold leading-[150%] text-[#292C33]">
                        {issue.dateTime}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {issue.images && issue.images.length > 0 ? (
                <div className="">
                  <img
                    src={issue.images[0].url}
                    alt={`Issue ${index + 1}`}
                    className={` h-[full] object-cover ${
                      index === 0 ? "w-full h-[188px]" : "w-[164px] h-[100%]"
                    }`}
                  />
                </div>
              ) : (
                <div className="w-[45%] overflow-hidden reltive ">
                  <img
                    src={empty}
                    alt={`Issue ${index + 1}`}
                    className="     absolute left-[50%] translate-x-[100%]"
                  />
                </div>
              )}
              {index === 0 ? (
                <div className="flex mx-4 mt-[20px] items-center mb-[16px] flex-row justify-between">
                  <div className="flex flex-row items-center  gap-2 h-[13px]">
                    <img src={location3} className="h-3.5 w-3.5" alt="" />
                    <p className="text-[12px] font-benton-bold leading-[150%] text-[#292C33]">
                      {issue.location}
                    </p>
                  </div>
                  <div className="flex flex-row items-center  gap-2 h-[13px]">
                    <img src={clock} className="h-3.5 w-3.5" alt="" />
                    <p className="text-[12px] font-benton-bold leading-[150%] text-[#292C33]">
                      {issue.dateTime}
                    </p>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div>
      {selectedIssue && (
        
        <SelectedIssue />
      )}
    </div>
  );
}





