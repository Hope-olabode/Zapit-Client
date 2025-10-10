import { Context } from "../context/Context";
import { useContext, useState } from "react";
import location3 from "../assets/location3.svg";
import clock from "../assets/clock.svg";
import dropdown from "../assets/dropdown.svg";
import empty from "../assets/empty.svg";
import cancle from "../assets/cancle.svg";
import di from "../assets/deleteImage.svg";
import ai from "../assets/addImage.svg";
import add2 from "../assets/addImage2.svg";

import cc from "../assets/catcancle.svg";
import ca from "../assets/catadd.svg";

export default function LoadedIssues() {
  const { issues, categories } = useContext(Context);
  const { newCategory, setNewCategory } = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [viewCategory, setViewCategory] = useState(false);

  const isSelected = (categoryName) =>
    selectedIssue.categories.includes(categoryName);

  return (
    <div className="div">
      <div className="absolute top-[100px] w-full left-[50%] translate-x-[-50%] z-10 px-4">
        {issues.map((issue, index) => (
          <div
            onClick={() => setSelectedIssue(issue)}
            key={index}
            className="mb-4 border-2 border-black rounded-lg bg-[#F6F7F9] flex flex-row"
          >
            <div className="w-[55%] flex flex-col">
              <div className="h-full mx-4 mt-4">
                <div className="div mb-[12px]">
                  <div className=" flex flex-row justify-between">
                    <div
                      onClick={() => {
                        setNewCategory(true);
                      }}
                      className="flex gap-1 items-center border rounded-[72px] h-[26px] pl-[8px] pr-[7px] max-w-[115px]"
                    >
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
                      <img src={dropdown} alt="" className="flex-shrink-0" />
                    </div>
                    <div className="flex gap-2">
                      <div
                        className={`w-[15px] border rounded-[72px] h-[26px] ${
                          issue.status === "Pending"
                            ? "bg-[#FFC529] text-[#461B02] border-[#461B02]"
                            : issue.status === "In Progress"
                            ? "bg-[#1513EC] text-[#D2D2F4] border-[#00003D]"
                            : "bg-[#73CA5E] text-[#0D301C] border-[#317223]"
                        }  }`}
                      ></div>
                      <div
                        className={`w-[15px] border rounded-[72px] h-[26px] ${
                          issue.priority === "Low"
                            ? "bg-[#F6F6F6] text-[#464646] border-[#464646]"
                            : issue.priority === "Medium"
                            ? "bg-[#FFFBEB] text-[#7A350D] border-[#B75406]"
                            : "bg-[#FFDDE2] text-[#CC001E] border-[#CC001E]"
                        }  }`}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="div">
                  <p className="font-benton-bold text-black text-[14px] leading-[150%]">
                    {issue.description}
                  </p>
                </div>
              </div>
              <div className="h-[2px] w-full mb-[15px] mt-[9px]  bg-black"></div>
              <div className="flex mx-4 mb-4 flex-col justify-end">
                <div className="flex flex-row mb-[15px] items-center gap-2">
                  <img src={location3} className="h-2.5 w-2.5" alt="" />
                  <p className="text-[10px] font-benton-bold leading-[150%] text-[#292C33]">
                    {issue.location}
                  </p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <img src={clock} className="h-2.5 w-2.5" alt="" />
                  <p className="text-[10px] font-benton-bold leading-[150%] text-[#292C33]">
                    {issue.dateTime}
                  </p>
                </div>
              </div>
            </div>

            {issue.images && issue.images.length > 0 ? (
              <img
                src={issue.images[0].url}
                alt={`Issue ${index + 1}`}
                className="w-[45%] h-[full] object-cover "
              />
            ) : (
              <div className=" w-[45%] overflow-hidden reltive ">
                <img
                  src={empty}
                  alt={`Issue ${index + 1}`}
                  className="     absolute left-[50%] translate-x-[100%]"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedIssue && (
        <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-10 h-screen">
          <div className="p-4 flex justify-center items-center ">
            <img
              src={cancle}
              onClick={() => {
                setSelectedIssue(null);
              }}
              alt="cancel"
              className="w-14 h-14 cursor-pointer"
            />
          </div>

          {/* Scrollable content */}
          <div className="relative flex-1 bg-white rounded-t-[12px] w-full overflow-y-auto">
            <div className="p-4 relative w-full h-[400px] rounded-xl">
              {selectedIssue.images.length === 0 && (
                <div className="flex flex-col items-center gap-[19.32px] h-full rounded-xl bg-[#E8E9EB]">
                  <img src={empty} alt="" className="" />
                  <div className="flex flex-col items-center gap-2">
                    <h3 className="font-benton-black text-[#1B1D22] text-[18px] leading-[125%]">
                      Empty Image
                    </h3>
                    <p className="font-benton-regular text-[#292C33] text-[14px] leading-[150%]">
                      Attach images to this Log
                    </p>
                    <img
                      //onClick={startCamera}
                      src={add2}
                      alt=""
                    />
                  </div>
                </div>
              )}

              <div className="w-full h-full relative rounded-xl overflow-hidden">
                {selectedIssue.images.map((src, i) => {
                  const count = selectedIssue.images.length;
                  let style = "";

                  if (count === 1) {
                    // One image: full container
                    style = "absolute top-0 left-0 w-full h-full";
                  } else if (count === 2) {
                    // Two images: split horizontally (side by side)
                    style = `absolute top-0 h-full w-1/2 ${
                      i === 0 ? "left-0" : "right-0"
                    }`;
                  } else if (count === 3) {
                    // Three images: left full half, right two split vertically
                    if (i === 0) style = "absolute top-0 left-0 w-1/2 h-full";
                    if (i === 1) style = "absolute top-0 right-0 w-1/2 h-1/2";
                    if (i === 2)
                      style = "absolute bottom-0 right-0 w-1/2 h-1/2";
                  }

                  return (
                    <img
                      key={i}
                      src={src.url}
                      alt={`Captured ${i + 1}`}
                      className={`object-cover  ${style}`}
                    />
                  );
                })}

                {/* Divider lines */}
                {selectedIssue.images.length === 2 && (
                  // Vertical line in the middle for 2 images
                  <div className="absolute top-0 left-1/2 w-[2px] h-full bg-black"></div>
                )}

                {selectedIssue.images.length === 3 && (
                  <>
                    {/* Vertical line in the middle */}
                    <div className="absolute top-0 left-1/2 w-[2px] h-full bg-black"></div>
                    {/* Horizontal line on the right half */}
                    <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-black"></div>
                  </>
                )}
              </div>

              {/* Buttons (top-right) */}
              <div className="flex flex-col items-center absolute top-[16px] right-[16px]">
                {selectedIssue.images.length != 3 && (
                  <img
                    // onClick={startCamera}
                    src={ai}
                    alt=""
                    className="cursor-pointer"
                  />
                )}

                <img // onClick={deleteLastImage}
                  src={di}
                  alt=""
                />
              </div>

              {/* Bottom info bar */}
              <div className="flex justify-between items-center absolute bottom-[24px] w-full left-0 px-6">
                <div
                  // onClick={() => {
                  //   setSelectLocation(true);
                  // }}
                  className="h-[26px] border border-black flex items-center gap-[6px] rounded-[8px] px-2.5 bg-[#E1E2E5]"
                >
                  <img src={location3} alt="" />
                  <p className="font-benton-bold text-[10px] leading-[150%]">
                    {selectedIssue.location}
                  </p>
                </div>
                <div className="h-[26px] border border-black flex items-center gap-[6px] rounded-[8px] px-2.5 bg-[#E1E2E5]">
                  <img src={clock} alt="" />
                  <p className="font-benton-bold text-[10px] leading-[150%]">
                    {selectedIssue.dateTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="mb-4 flex flex-row px-4 justify-between">
                <div
                  onClick={() => {
                    setViewCategory(true);
                  }}
                  className="flex gap-1 items-center border rounded-[72px] h-[26px] pl-[8px] pr-[7px] max-w-[240px]"
                >
                  <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px] truncate">
                    {selectedIssue.categories.length > 0
                      ? selectedIssue.categories.length <= 2
                        ? selectedIssue.categories
                            .map((cat, i) => (i === 0 ? cat : ` • ${cat}`))
                            .join("")
                        : `${selectedIssue.categories[0]} • ${
                            selectedIssue.categories[1]
                          }... +${selectedIssue.categories - 2}`
                      : "Category"}
                  </p>
                  <img src={dropdown} alt="" className="flex-shrink-0" />
                </div>
                <div className="flex gap-2">
                  <div
                    // onClick={handleClick}
                    className={`flex gap-1 items-center border rounded-[72px] h-[26px] pl-[8px] pr-[7px]  ${
                      selectedIssue.status === "Pending"
                        ? "bg-[#FFC529] text-[#461B02] border-[#461B02]"
                        : selectedIssue.status === "In Progress"
                        ? "bg-[#1513EC] text-[#D2D2F4] border-[#00003D]"
                        : "bg-[#73CA5E] text-[#0D301C] border-[#317223]"
                    }`}
                  >
                    <p>{selectedIssue.status}</p>
                  </div>
                  <div
                    // onClick={handleClick2}
                    className={`flex gap-1 items-center border rounded-[72px] h-[26px] pl-[8px] pr-[7px]  ${
                      selectedIssue.priority === "Low"
                        ? "bg-[#F6F6F6] text-[#464646] border-[#464646]"
                        : selectedIssue.priority === "Medium"
                        ? "bg-[#FFFBEB] text-[#7A350D] border-[#B75406]"
                        : "bg-[#FFDDE2] text-[#CC001E] border-[#CC001E]"
                    }`}
                  >
                    <p>{selectedIssue.priority}</p>
                  </div>
                </div>
              </div>
              {viewCategory && (
                <div className="div">
                  <div className="top-0 left-[16px] z-30 absolute">
                    <div>
                      <div className="w-[250px] h-[300px] bg-white rounded-3xl border-2 border-gray-800 shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-2 border-b-2 border-gray-800">
                          <h2 className="text-[12px] font-sans leading-[16px] font-semibold">
                            Categories
                          </h2>
                          <button
                            type="button"
                            // onClick={() => setShowAddModal(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <img src={ca} className="w-6 h-6 text-gray-800" />
                          </button>
                        </div>

                        {/* Categories Grid */}
                        <div className="overflow-y-scroll p-2 max-h-[230px] rounded-b-3xl pb-2">
                          <div className="flex flex-wrap gap-3">
                            {categories.map((category) => (
                              <button
                                type="button"
                                key={category._id}
                                // onClick={() => toggleCategory(category.name)}
                                className={`relative px-2 py-[5px] rounded-full h-[26px] text-base font-semibold
                                      transition-all duration-200 border-2 flex items-center
                                      ${
                                        isSelected(category.name)
                                          ? "border-gray-800"
                                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                      }`}
                              >
                                <span className="text-[12px] font-sans leading-[16px] font-semibold">
                                  {category.name}
                                </span>
                                {isSelected(category.name) && (
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
                  </div>
                  <div
                    onClick={() => setViewCategory(false)}
                    className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-10 h-screen"
                  ></div>
                </div>
              )}
            </div>

            <div className="px-4">
              {/* <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                type="text"
                placeholder="Description"
                className="w-full rounded h-[144px] font-benton-black text-[18px] leading-[145%] placeholder-[#CED0D5] border-0 focus:outline-none"
              /> */}
              <p className="w-full rounded h-[144px] font-benton-black text-[18px] leading-[145%]">
                {selectedIssue.description}
              </p>
            </div>
            <div className="border-dashed border-black border-1 my-4 "></div>
            <div className="px-4">
              {/* <textarea
                {...register("Caused_by", {
                  required: "Cause is required",
                })}
                type="text"
                placeholder="Caused by"
                className="w
                -full rounded h-[144px] font-benton-black text-[18px] leading-[145%] placeholder-[#CED0D5] border-0 focus:outline-none"
              /> */}
              <p className="w-full rounded h-[144px] font-benton-black text-[18px] leading-[145%]">
                {selectedIssue.Caused_by}
              </p>
            </div>
            <div className="border-dashed border-black border-1 my-4 "></div>
            <div className="px-4 pb-4">
              {/* <textarea
                {...register("Responsibility", {
                  required: "Responsibility is required",
                })}
                type="text"
                placeholder="Responsibility"
                className="w-full rounded h-[144px] font-benton-black text-[18px] leading-[145%] placeholder-[#CED0D5] border-0 focus:outline-none"
              /> */}
              <p className="w-full rounded h-[144px] font-benton-black text-[18px] leading-[145%]">
                {selectedIssue.responsibility}
              </p>
            </div>
            <div className="px-4 pb-4">
              <button
                type="submit"
                className="h-14 w-full bg-[#4ECDC4] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] flex items-center justify-center"
              >
                Update
              </button>
            </div>

            {/* {selectLocation && (
              <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-20">
                <div className="absolute bottom-[0px] w-[100%] left-[50%] translate-x-[-50%] bg-[#F6F7F9]  pt-6 rounded-4xl">
                  <p className=" text-center font-benton-black text-[16px] leading-[125%] mb-6">
                    Locations
                  </p>
                  <div className="w-full h-0.5 bg-black mb-6"></div>
                  <div className="px-4">
                    <div className="border-2 w-[100%] border-black rounded-xl overflow-hidden  bg-[#F6F7F9]  z-3">
                      <form
                        onSubmit={handleSubmitLocation(
                          onSubmitLocation,
                          onError
                        )}
                        className="border-b-2 w-full flex items-center justify-center gap-[2px] px-4"
                      >
                        <input
                          {...registerLocation("name", {
                            required: "Location is required",
                          })}
                          type="text"
                          placeholder="Add Location"
                          className="font-benton-bold text-[16px] leading-[150%] h-[48px] w-full  focus:outline-none placeholder:text-[#CED0D5]"
                        />
                        <button disabled={loading} type="submit">
                          <img src={la} alt="" />
                        </button>
                      </form>
                      {locations.map((loc, index) => {
                        const Selected = selectedLocation === loc._id;
                        return (
                          <div
                            onClick={() => {
                              setSelectedLocation(loc._id);
                              setSelect(true);
                              setLocationName(loc.name);
                            }}
                            key={loc._id}
                            className="flex items-center border-b-2 border-black last:border-b-0 px-4 py-3"
                          >
                            
                            <span className="w-6 font-benton-bold text-[16px] leading-[150%]">
                              {index + 1}
                            </span>

                            
                            <p className="ml-4 font-benton-bold text-[16px] leading-[150%]">
                              {loc.name}
                            </p>
                            {Selected && (
                              <img
                                src={mark}
                                alt=""
                                className="ml-auto w-6 h-6"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-4 justify-center items-center mt-6 mb-[29px]">
                      <button
                        onClick={() => {
                          setSelectLocation(false);
                          setSelectedLocation("");
                          setSelect(false);
                          setLocationName("");
                        }}
                        type="submit"
                        className="h-14 w-full bg-[#E8E9EB] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] flex items-center justify-center"
                      >
                        Cancle
                      </button>

                      <button
                        disabled={select === "false"}
                        onClick={() => setSelectLocation(false)}
                        type="submit"
                        className={`h-14 w-full ${
                          select === false ? "bg-[#E1E2E5]" : "bg-[#4ECDC4]"
                        }  font-benton-black text-[21px] leading-[150%] rounded-[12px]  ${
                          select === false
                            ? "shadow-[5px_5px_0px_0px_#CED0D5]"
                            : "shadow-[5px_5px_0px_0px_#1B1D22]"
                        } flex items-center justify-center ${
                          select === false ? "text-[#A1A6B0]" : ""
                        }`}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
            {/* {showAddModal && (
              <form onSubmit={handleSubmitCategory(onSubmitCategory, onError)}>
                <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-40">
                  <div className="absolute bottom-[0px] w-[100%] left-[50%] translate-x-[-50%] bg-[#F6F7F9]  pt-6 rounded-4xl">
                    <p className="font-benton-black text-[#1B1D22] text-[16px] leading-[125%] text-center mb-4">
                      Add Category
                    </p>
                    <div className="w-full h-0.5 bg-black mb-6"></div>
                    <div className="flex flex-col items-center">
                      <input
                        {...registerCategory("name", {
                          required: "category is Required",
                        })}
                        className="my-10 h-[26px] font-benton-black text-[#1B1D22] text-[18px] leading-[145%] w-[130px] placeholder:text-[#CED0D5] focus:outline-none"
                        placeholder="New Category"
                        type="text"
                      />
                      <div className="flex gap-4 justify-center items-center mt-6 mb-[29px] w-full px-[21px]">
                        <button
                          onClick={() => {
                            setShowAddModal(false);
                          }}
                          className="h-14 w-full bg-[#E8E9EB] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] flex items-center justify-center"
                        >
                          Cancle
                        </button>

                        <button
                          disabled={loading}
                          type="submit"
                          className={`h-14 w-full ${
                            categoryName.trim().length === 0
                              ? "bg-[#E1E2E5]"
                              : "bg-[#4ECDC4]"
                          }  font-benton-black text-[21px] leading-[150%] rounded-[12px]  ${
                            categoryName.trim().length === 0
                              ? "shadow-[5px_5px_0px_0px_#CED0D5]"
                              : "shadow-[5px_5px_0px_0px_#1B1D22]"
                          } flex items-center justify-center ${
                            categoryName.trim().length === 0
                              ? "text-[#A1A6B0]"
                              : ""
                          }`}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
}
