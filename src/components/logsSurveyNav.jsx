import { NavLink } from "react-router-dom";
import search from "../assets/search.svg";
import profile from "../assets/profile.svg";

export default function LogsSurveyNav() {
  return (
    <div className="flex flex-row justify-between items-center z-[2] absolute w-full px-4  [h-48px] mt-4">
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
        <img src={search} alt="" />
        <img src={profile} alt="" />
      </div>
    </div>
  );
}
