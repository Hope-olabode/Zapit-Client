import { Context } from "../context/Context";
import { useContext } from "react";
import dropdown from "../assets/dropdown.svg";
import compare from "../assets/compare.svg";

export default function ComparativeAnalytics({
  cALogs,
  setCALogs,
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
    <div className="mt-10 lg:relative lg:mt-0 lg:h-full lg:border-2 lg:rounded-2xl lg:bg-[#F6F7F9]">
      <div className="lg:absolute lg:top-4 lg:z-10 w-full lg:px-4 lg:flex lg:justify-between lg:items-center">
        <div className="div">
          <p className="mb-2 font-benton-black text-[16px] leading-[150%] text-[#1B1D22]">
            Comparative Analysis
          </p>
        </div>
        <div className="h-9 rounded-full w-full overflow-hidden mb-6 lg:w-auto lg:mb-0">
          <button
            onClick={() => {
              setCALogs(true);
            }}
            className={`${
              cALogs
                ? "bg-[#1B1D22] text-[#E1E2E5]"
                : "bg-[#F6F6F6] text-[#1B1D22]"
            } w-[50%] h-full font-benton-black text-[13px] leading-[16px] tracking-[-0.5px] lg:w-[88px] rounded-l-full`}
          >
            logs
          </button>
          <button
            onClick={() => {
              setCALogs(false);
            }}
            className={`${
              cALogs
                ? "bg-[#F6F6F6] text-[#1B1D22] "
                : "bg-[#1B1D22] text-[#E1E2E5]"
            } w-[50%] h-full font-benton-black text-[13px] leading-[16px] tracking-[-0.5px] lg:w-[88px] rounded-r-full`}
          >
            Survey
          </button>
        </div>
      </div>

      <div className="h-[434px] overflow-y-auto border-2 rounded-2xl relative bg-[#F6F7F9] lg:bg-transparent lg:border-none lg:rounded-none">
        <div
          className="z-[1] w-full absolute top-0 h-[50%]
              bg-[length:23px_23px] 
              bg-[repeating-linear-gradient(0deg,#e1e2e5b0_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#e1e2e5b0_0_1px,transparent_1px_23px)]
              [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]
              [mask-repeat:no-repeat] [mask-size:100%_100%]"
        ></div>
        <div className="relative z-10 lg:top-[68px]">
          <div className="flex justify-between z-10 relative pt-1.5 px-1.5 lg:px-4">
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
                className={`${drop1 ? "fixed" : "hidden"}  inset-0 z-10`}
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
                className={`${drop2 ? "fixed" : "hidden"}  inset-0 z-10`}
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
      </div>
    </div>
  );
}
