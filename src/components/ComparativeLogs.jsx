import dropdown from "../assets/dropdown.svg";
import compare from "../assets/compare.svg";
import { Context } from "../context/Context";
import { useContext } from "react";

export default function ComparativeLogs({
  drop1,
  setDrop1,
  drop2,
  setDrop2,
  location1,
  setLocation1,
  location2,
  setLocation2,
}) {
  const { issues, locations } = useContext(Context);
  const getCategoryStats = (locationName) => {
    const locationIssues = issues.filter(
      (issue) => issue.location === locationName
    );
    const categoryCounts = {};

    locationIssues.forEach((issue) => {
      if (issue.categories && Array.isArray(issue.categories)) {
        issue.categories.forEach((category) => {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
      }
    });

    return categoryCounts;
  };

  const getAllCategories = () => {
    const location1Stats = getCategoryStats(location1);
    const location2Stats = getCategoryStats(location2);

    const allCategories = new Set([
      ...Object.keys(location1Stats),
      ...Object.keys(location2Stats),
    ]);

    return Array.from(allCategories).sort();
  };

  const getComparisonColor = (count1, count2) => {
    // No background when this location has no count
    if (count1 === 0) {
      return "";
    }

    // Gray when other location has no count but this one does
    if (count2 === 0) {
      return "bg-gray-200 font-semibold font-sans text-[12px] leading-[16px] tracking-[-0.5px] text-[#461B02] border border-[#461B02]";
    }

    // When both have counts, compare them
    if (count1 > count2)
      return "bg-green-500 font-semibold font-sans text-[12px] leading-[16px] tracking-[-0.5px] text-[#461B02] border border-[#461B02]";
    if (count2 > count1)
      return "bg-red-500 font-semibold font-sans text-[12px] leading-[16px] tracking-[-0.5px] text-[#461B02] border border-[#461B02]";

    // Equal counts
    return "bg-gray-200 font-semibold font-sans text-[12px] leading-[16px] tracking-[-0.5px] text-[#461B02] border border-[#461B02]";
  };
  return (
    <div className="relative z-10">
      <div className="flex justify-between z-10 relative pt-1.5 px-1.5">
        <div className="div">
          <div
            onClick={() => setDrop1(true)}
            className="flex gap-1 items-center border-2 border-[#464646] rounded-[72px] h-[26px] pl-[8px] pr-[7px] bg-[#F6F6F6] z-20 cursor-pointer"
          >
            <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px]">
              {location1 || "Select Location"}
            </p>
            <img src={dropdown} alt="" />
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className={`${
              drop1 ? "absolute" : "hidden"
            } top-[6px] left-[6px] rounded-2xl border-2 w-[200px] bg-[#F6F6F6] border-[#464646] h-[200px] z-30 overflow-y-scroll scrollbar-hide`}
          >
            {locations.map((location, index) => (
              <div
                key={index}
                onClick={() => {
                  setLocation1(location.name);
                  setDrop1(false);
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
            onClick={() => setDrop1(false)}
            className={`${
              drop1 ? "fixed" : "hidden"
            } bg-[#0000007a] inset-0 z-10`}
          ></div>
        </div>
        <img src={compare} alt="" />
        <div className="div">
          <div
            onClick={() => setDrop2(true)}
            className="flex gap-1 items-center border-2 border-[#464646] rounded-[72px] h-[26px] pl-[8px] pr-[7px] bg-[#F6F6F6] z-20 cursor-pointer"
          >
            <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px]">
              {location2 || "Select Location"}
            </p>
            <img src={dropdown} alt="" />
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${
              drop2 ? "absolute" : "hidden"
            } top-[6px] right-[6px] rounded-2xl border-2 w-[200px] bg-[#F6F6F6] border-[#464646] h-[200px] z-30 overflow-y-scroll scrollbar-hide`}
          >
            {locations.map((location, index) => (
              <div
                key={index}
                onClick={() => {
                  setLocation2(location.name);
                  setDrop2(false);
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
            onClick={() => setDrop2(false)}
            className={`${
              drop2 ? "fixed" : "hidden"
            } bg-[#0000007a] inset-0 z-10`}
          ></div>
        </div>
      </div>
      <div className="mt-6 relative  px-1.5">
        {location1 && location2 && (
          <div className="mt-4">
            <div className=" overflow-hidden ">
              {getAllCategories().map((category, index) => {
                const location1Stats = getCategoryStats(location1);
                const location2Stats = getCategoryStats(location2);
                const count1 = location1Stats[category] || 0;
                const count2 = location2Stats[category] || 0;

                return (
                  <div
                    key={index}
                    className="flex justify-between items-center  last:border-b-0 h-12 "
                  >
                    <div
                      className={`flex items-center w-[29px] h-[29px] rounded-full justify-center   ${getComparisonColor(
                        count1,
                        count2
                      )}`}
                    >
                      {count1 > 0 ? count1 : "-"}
                    </div>
                    <div className="flex items-center justify-center bg-[#E8E9EB] px-[7px] h-[26px] rounded-full font-semibold font-sans text-[12px] leading-[16px] tracking-[-0.5px] text-[#464646]">
                      <span className="truncate">{category}</span>
                    </div>
                    <div
                      className={`flex items-center w-[29px] h-[29px] rounded-full justify-center  ${getComparisonColor(
                        count2,
                        count1
                      )}`}
                    >
                      {count2 > 0 ? count2 : "-"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
