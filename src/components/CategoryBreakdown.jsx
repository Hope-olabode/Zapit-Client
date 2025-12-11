import { Context } from "../context/Context";
import { useContext } from "react";
import dropdown from "../assets/dropdown.svg";

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
    <div className="mt-10 lg:relative lg:bg-[#F6F7F9] lg:mt-0 lg:border-black lg:rounded-2xl lg:border-2 lg:overflow-hidden lg:h-[480px]">
      <div
        className="z-[1] w-full  hidden absolute lg:block top-0 h-[100%]
                  bg-[length:23px_23px] 
                  bg-[repeating-linear-gradient(0deg,#e1e2e5b0_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#e1e2e5b0_0_1px,transparent_1px_23px)]"
      ></div>
      <p className="font-benton-black text-[16px] leading-[150%] text-[#1B1D22] mb-2 lg:absolute z-10 lg:pt-4 lg:px-4">
        Categories Breakdown
      </p>

      <div
        className={`border-2 relative border-black rounded-2xl lg:border-0 overflow-hidden lg:top-[48px] bg-[#F6F7F9] lg:bg-transparent lg:rounded-none `}
      >
        <div
          className="z-[1] w-full absolute lg:hidden top-0 h-[100%]
                  bg-[length:23px_23px] 
                  bg-[repeating-linear-gradient(0deg,#e1e2e5b0_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#e1e2e5b0_0_1px,transparent_1px_23px)]"
        ></div>

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
                <span className="text-[#B7BBC2] truncate">{category.name}</span>

                <span className="text-sm text-[#166F69]">{count}</span>
              </div>
            );
          })}

          {/* Location Filter */}
          <div
            onClick={() => setBarLocationView(true)}
            className="flex absolute top-[6px] right-[6px] gap-1 items-center border-2 border-[#464646] rounded-[72px] h-[26px] pl-[8px] pr-[7px] bg-[#F6F6F6] z-20 cursor-pointer"
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
            } top-[6px] right-[6px] rounded-2xl border-2 w-[200px] bg-[#F6F6F6] border-[#464646] h-[200px] z-30 overflow-y-scroll scrollbar-hide`}
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
            className={`${barLocationView ? "fixed" : "hidden"}  inset-0 z-10`}
          ></div>
        </div>
      </div>
    </div>
  );
}
