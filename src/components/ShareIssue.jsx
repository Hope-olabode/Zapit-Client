import cancle from "../assets/cancle.svg";
import location4 from "../assets/location4.svg";
import by from "../assets/by.svg";
import { Context } from "../context/Context";
import { useContext } from "react";

export default function Share({ selectedIssue }) {
  const { loading } = useContext(Context);
  return (
    <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-20">
      <div className="absolute w-full bottom-[0px] flex flex-col justify-center items-center gap-4">
        <div className="div">
          <img src={cancle} alt="" />
        </div>
        <div className=" w-full bg-[#F6F7F9] px-4 pt-4 pb-6 rounded-t-3xl">
          <img
            className="h-[400px] w-full rounded-[12px] mb-6"
            src={selectedIssue.images[0].url}
            alt=""
          />
          <div className="mb-6">
            <p className="text-center font-benton-bold text-[18px] leading-[130%] tracking-norma[-0.5px] line-clamp-2 mb-3">
              {selectedIssue.description}
            </p>
            <div className="flex justify-center items-center gap-4">
              <div className="flex gap-1.5">
                <img src={location4} alt="" />
                <p className=" font-benton-bold text-[12px] leading-[150%] text-[#8B919D]">
                  {selectedIssue.location}
                </p>
              </div>
              <div className="flex gap-1.5">
                <img src={by} alt="" />
                <p className=" font-benton-bold text-[12px] leading-[150%] text-[#8B919D]">
                  {selectedIssue.Responsibility}
                </p>
              </div>
            </div>
          </div>
          <button
            disabled={loading}
            type="submit"
            className={`h-14 ${
              loading
                ? "bg-[#E1E2E5] shadow-[5px_5px_0px_0px_#CED0D5] text-[#A1A6B0]"
                : "bg-[#4ECDC4] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] text-[#1B1D22]"
            }  font-benton-black text-[21px] leading-[150%] rounded-[12px] transform flex items-center justify-center transition-all duration-150 w-full`}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
