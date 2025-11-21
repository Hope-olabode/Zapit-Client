import { NavLink } from "react-router-dom";
import search from "../assets/search.svg";
import profile from "../assets/profile.svg";

export default function LogsSurveyNav() {
  return (
    <div className="flex flex-row justify-between items-center z-[2] absolute w-full px-4 [h-48px] pt-3 lg:static lg:px-0">
      <div className="flex gap-2">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-[#1B1D22] font-benton-black text-[32px] leading-[130%] tracking-[-0.5px]"
              : "text-[#CED0D5] font-benton-black text-[32px] leading-[130%] tracking-[-0.5px]"
          }
          to="/logs"
        >
          Logs
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-[#1B1D22] font-benton-black text-[32px] leading-[130%] tracking-[-0.5px]"
              : "text-[#CED0D5] font-benton-black text-[32px] leading-[130%] tracking-[-0.5px]"
          }
          to="/surveys"
        >
          Surveys
        </NavLink>
      </div>
      <div className="flex flex-row">
        <img className="lg:hidden" src={search} alt="" />
        <img className="lg:hidden" src={profile} alt="" />
        <div className="h-10 bg-[#F6F6F6] w-[360px] items-center gap-2 pr-3 rounded-[72px] hidden lg:flex">
          <img src={search} alt="" />
          <input className="focus:outline-none font-benton-bold text-[14px] leading-[16px] tracking-[-0.5px] placeholder:text-[#B7BBC2]" type="text" placeholder="Search" />
        </div>
      </div>
    </div>
  );
}
