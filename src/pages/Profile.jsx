import { useState } from "react";
import { useNavigate } from "react-router-dom";
import back from "../assets/back.svg";
import SL from "../assets/stambicLogo.svg";
import plus from "../assets/plus.svg";
import minus from "../assets/minus.svg";

export default function Profile() {
  const navigate = useNavigate();
  const [sla, setSla] = useState(1);
  return (
    <div className="h-screen w-full relative bg-[#E8E9EB]">
      <div
        className="z-[1] w-full absolute top-0 h-[50%]
        bg-[length:23px_23px] 
        bg-[repeating-linear-gradient(0deg,#FFFFFF70_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#FFFFFF70_0_1px,transparent_1px_23px)]
        [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]
        [mask-repeat:no-repeat] [mask-size:100%_100%]"
      ></div>
      <div className="relative z-10 h-[100%] flex flex-col justify-between px-4 pb-4">
        <div className="">
          <div className="div pt-4 h-[48px]">
            <img src={back} onClick={() => navigate(-1)} alt="" />
          </div>
          <h1 className="mt-1 font-benton-black text-[32px] leading-[130%] tracking-[-0.5px]">
            Profile
          </h1>
          <div className="flex flex-col items-center mt-6">
            <img src={SL} alt="" />
            <div className="flex flex-col mt-4 items-center gap-0.5">
              <h1 className="font-benton-black text-[48px] leading-[130%] tracking-[-0.5px]">
                Hi! Carrington
              </h1>
              <p className=" font-benton-regular text-[15px] leading-[150%]`">
                waltercarrington@stanbicibtc.com
              </p>
            </div>
          </div>
          <div className="mt-9 flex items-center justify-between">
            <div className="div">
              <h1 className="font-benton-bold text-[#1B1D22] text-[16px] leading-[150%]">
                SLA
              </h1>
              <p className="font-benton-bold text-[#8B919D] text-[10px] leading-[150%]">
                Service Level Agreement
              </p>
            </div>
            <div className="h-[64px] rounded-2xl bg-[#FFFFFF] flex items-center justify-center w-[160px] ">
              <div onClick={() => setSla((prev) => prev + 1)} className="pr-7">
                <img src={plus} alt="" />
              </div>
              <p className="w-8 h-8 font-benton-black text-[#1B1D22] text-[21px] leading-[150%] flex justify-center">
                {sla}
              </p>
              <div onClick={() => setSla((prev) => prev - 1)} className="pl-7">
                <img src={minus} alt="" />
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="h-14 w-full bg-[#D60000] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] transform flex items-center justify-center transition-all duration-150"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
