import { Context } from "../context/Context";
import { useContext, useState, useEffect } from "react";
import check from "../assets/check.svg";
import dropdown from "../assets/dropdown.svg";

export default function Share() {
  const { setShare, share, locations } = useContext(Context);

  const [locationName, setLocationName] = useState("");
  const [locationView, setLocationView] = useState(false);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (share) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [share]);

  return (
    <div
      className="absolute bottom-0 z-40 w-full border rounded-t-4xl bg-[#F6F7F9]"
      onClick={(e) => {
        setLocationView(false);
        e.stopPropagation();
      }} // close dropdown when clicking outside
    >
      {/* Header */}
      <div className="border-b pt-6 pb-4">
        <p className="font-benton-black text-center text-[16px] leading-[125%] tracking-[-0.5px] text-[#1B1D22]">
          Export Formats
        </p>
      </div>

      <div className="px-4">
        <div className="my-8">
          {/* Export format list */}
          <div className="border-2 rounded-2xl overflow-hidden">
            {[
              "PDF document (.pdf)",
              "PowerPoint (.pptx)",
              "Excel sheet (.xlsx)",
              "Microsoft Word (.docx)",
              "Markdown (.md)",
            ].map((label) => (
              <div
                key={label}
                className="px-4 py-3 flex justify-between items-center border-b-2 last:border-b-0"
              >
                <p className="font-benton-bold text-[#1B1D22] text-[16px] leading-[150%]">
                  {label}
                </p>
                <img src={check} alt="" />
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex justify-between mt-4 gap-2">
            {/* Location Dropdown */}
            <div className="relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setLocationView((prev) => !prev);
                }}
                className="border-2 rounded-2xl h-10 flex items-center justify-between px-4 w-[174.5px] cursor-pointer bg-white"
              >
                <div className="font-benton-bold text-[16px] text-[#1B1D22] leading-[150%] truncate">
                  {locationName || "All Locations"}
                </div>
                <img src={dropdown} alt="" />
              </div>

              {locationView && (
                <div className="fixed inset-0 z-10">
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-[100px] left-[16px] rounded-2xl border-2 w-[200px]
                             bg-[#F6F6F6] border-[#464646] h-[200px]
                             z-30 overflow-y-scroll scrollbar-hide"
                  >
                    <div
                      onClick={() => {
                        setLocationName("");
                        setLocationView(false);
                      }}
                      className="px-3 h-8 flex items-center cursor-pointer hover:bg-[#EAEAEA]"
                    >
                      All Locations
                    </div>

                    {locations.map((location, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setLocationName(location.name);
                          setLocationView(false);
                        }}
                        className="px-3 h-8 flex items-center cursor-pointer border-t
                                 hover:bg-[#EAEAEA]"
                      >
                        {location.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Time Filter (static for now) */}
            <div className="border-2 rounded-2xl h-10 flex items-center justify-between px-4 w-[174.5px] bg-white">
              <div className="font-benton-bold text-[16px] text-[#1B1D22] leading-[150%]">
                All Time
              </div>
              <img src={dropdown} alt="" />
            </div>
          </div>
        </div>

        {/* Export Button */}
        <button
          type="button"
          className="h-14 bg-[#4ECDC4] w-full mb-4
            shadow-[5px_5px_0px_0px_#1B1D22]
            active:shadow-[0px_0px_0px_0px_#1B1D22]
            active:translate-y-[5px] active:translate-x-[5px]
            font-benton-black text-[21px] leading-[150%]
            rounded-[12px] flex items-center justify-center
            transition-all duration-150"
        >
          Export
        </button>
      </div>
    </div>
  );
}
