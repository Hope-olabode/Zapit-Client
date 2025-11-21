import { useContext, useState, useEffect } from "react";
import { Context } from "../context/Context";
import copy from "../assets/copy.svg";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "../hooks/useMediaQuery";

export default function Overlay({ filteredSurveys, setDesktop2, setDesktop, setDesktop3 }) {
  // const [filteredSurveys, setFilteredSurveys ] = useState([]);
  const { setOverlay } = useContext(Context);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const navigate = useNavigate();
  

  

  return (
    <div className="div lg">
      <div
        onClick={() => setOverlay(false)}
        className="fixed inset-0 bg-[#00000058] z-20 flex flex-col justify-end lg:justify-center lg:items-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#F6F7F9] w-full rounded-t-3xl pt-6 lg:w-[393px] lg:rounded-3xl"
        >
          {/* Header */}
          <div className="pb-4 mb-[32px] border-b border-black">
            <p className="font-benton-black text-center text-[16px] text-[#1B1D22] leading-[125%] tracking-[-0.5px]">
              Survey
            </p>
          </div>

          <p className="font-benton-bold text-center text-[16px] text-[#1B1D22] leading-[150%]">
            Choose an existing survey to duplicate.
          </p>

          {/* Scrollable Survey List */}
          <div className="px-4">
            <div className="mt-3 border-2 border-black rounded-xl overflow-y-auto max-h-[50vh]">
              {filteredSurveys.map((survey, index) => (
                <div
                  key={index}
                  onClick={() => {
                    // ✅ Save to localStorage
                    sessionStorage.setItem(
                      "selectedSurvey",
                      JSON.stringify(survey)
                    );
                    setOverlay(false);
                    if (isDesktop) {
                      setDesktop3(true);
                      setDesktop2(false);
                      setDesktop(false);
                    } else {
                      navigate("/survey/new");
                    }
                    
                  }}
                  className="flex justify-between items-center border-b-2 border-black last:border-b-0 px-4 pb-3 pt-4 cursor-pointer hover:bg-gray-100 transition"
                >
                  <div className="">
                    <p className="font-benton-bold text-[16px] leading-[150%] text-[#1B1D22]">
                      {survey.title}
                    </p>
                  </div>

                  <img src={copy} alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* Button */}
          <div className="mt-[32px] px-4 mb-6">
            <button
              onClick={() => {
                sessionStorage.removeItem("selectedSurvey");
                setOverlay(false);

                if (isDesktop) {
                  setDesktop2(true);
                  setDesktop(false);
                  setDesktop3(false);
                } else {
                  navigate("/survey/new");
                }
              }}
              className="h-14 bg-[#4ECDC4] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] text-[#1B1D22] font-benton-black text-[21px] leading-[150%] rounded-[12px] transform flex items-center justify-center transition-all duration-150 w-full"
            >
              + New Survey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
