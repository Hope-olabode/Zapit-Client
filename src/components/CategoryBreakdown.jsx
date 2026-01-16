import { Context } from "../context/Context";
import { useContext } from "react";
import dropdown from "../assets/dropdown.svg";
import dbar from "../assets/defaultbar.svg";

export default function CategoryBreakdown({
  barLocation,
  setBarLocation,
  barLocationView,
  setBarLocationView,
}) {
  const { categories, locations, isMobile } = useContext(Context);
  const categoryCount = {};
  const visibleCategories =
    barLocation === ""
      ? categories // show ALL categories on default
      : categories.filter((cat) => categoryCount[cat.name] > 0); // hide 0-count categories only when filtered
  return (
    <div className="mt-10 lg:mt-0">
      <div className="lg:flex justify-between">
        <p className="font-benton-black text-[16px] leading-[150%] text-[#1B1D22] mb-2  ">
          Categories Breakdown
        </p>
        <div
          onClick={() => {visibleCategories.length != 0 && setBarLocationView(true)}}
          className="lg:flex hidden gap-1 items-center border-2 border-[#464646] rounded-[72px] h-[26px] pl-[8px] pr-[7px] bg-[#F6F6F6] z-20 cursor-pointer"
        >
          <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px]">
            {barLocation || "All Locations"}
          </p>
          <img src={dropdown} alt="" />
        </div>
      </div>

      <div
        className={`border-2 relative border-black rounded-2xl  overflow-hidden  bg-[#F6F7F9] h-[400px] lg:h-[480px] `}
      >
        <div
          className="z-[1] w-full absolute top-0 h-[100%]
                  bg-[length:23px_23px] 
                  bg-[repeating-linear-gradient(0deg,#e1e2e5b0_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#e1e2e5b0_0_1px,transparent_1px_23px)]"
        ></div>

        {visibleCategories.length === 0 ? (
          <div className="h-full">
            <div className="flex absolute lg:hidden top-[6px] right-[6px] gap-1 items-center border-2 border-[#464646] rounded-[72px] h-[26px] pl-[8px] pr-[7px]  z-20 cursor-pointer">
              <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px]">
                All Locations
              </p>
              <img src={dropdown} alt="" />
            </div>
            <div className="h-full flex flex-col justify-center items-center absolute w-full z-30">
              <img src={dbar} alt="" />
              <p className="font-benton-regular pt-3 text-[10px] leading-[150%] text-[#292C33]">
                There is currently no data to display.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-[12px] overflow-hidden h-[400px] relative overflow-y-scroll z-10 lg:rounded-none lg:h-[428px] scrollbar-hide">
            {visibleCategories.map((category, index) => {
              const count = categoryCount[category.name] || 0;
              const isOdd = index % 2 !== 0;

              return (
                <div
                  key={category._id}
                  style={{
                    width: `${100 + count * 2}px`,
                  }}
                  className={`flex items-center justify-between gap-3 px-2 font-benton-bold text-[12px] leading-[150%] h-8 rounded-r-[4px]  ${
                    isOdd ? "bg-[#000000]" : "bg-[#083532]"
                  }`}
                >
                  <span className="text-[#B7BBC2] truncate">
                    {category.name}
                  </span>

                  <span className="text-sm text-[#166F69]">{count}</span>
                </div>
              );
            })}

            {/* Location Filter */}
            <div
              onClick={() => setBarLocationView(true)}
              className="flex absolute top-[6px] lg:hidden right-[6px] gap-1 items-center border-2 border-[#464646] rounded-[72px] h-[26px] pl-[8px] pr-[7px] bg-[#F6F6F6] z-20 cursor-pointer"
            >
              <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px]">
                {barLocation || "All Locations"}
              </p>
              <img src={dropdown} alt="" />
            </div>

            {/* Dropdown menu */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`${
                barLocationView ? "absolute" : "hidden"
              } top-[6px] right-[6px] rounded-2xl border-2  w-[200px] bg-[#F6F6F6] border-[#464646] h-[200px] z-30 overflow-y-scroll scrollbar-hide`}
            >
              {locations.map((location, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setBarLocation(location.name);
                    setBarLocationView(false);
                  }}
                  className={`px-2 h-8 flex items-center text-[#464646] border-t ${
                    index === 0 ? "border-t-0" : ""
                  }`}
                >
                  {location.name}
                </div>
              ))}
            </div>

            {/* Overlay click area */}
            <div
              onClick={() => setBarLocationView(false)}
              className={`${
                barLocationView ? "fixed" : "hidden"
              }  inset-0 z-10`}
            ></div>
          </div>
        )}
        {visibleCategories.length === 0 && (
          <div className=" inset-0 bg-[#ffffff7e] absolute z-20 "></div>
        )}
      </div>
    </div>
  );
}
