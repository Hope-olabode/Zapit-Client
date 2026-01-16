import { NavLink, useNavigate } from "react-router-dom";
import searchi from "../assets/search.svg";
import profile from "../assets/profile.svg";
import { useContext } from "react";
import { Context } from "../context/Context";

export default function LogsSurveyNav({register}) {
  const navigate = useNavigate();
  
  const { search, setSearch } = useContext(Context);
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
        {search ? "" : <img onClick={()=>setSearch(true)} className="lg:hidden" src={searchi} alt="" />}
        <img className="lg:hidden" onClick={() => navigate("/profile")} src={profile} alt="" />
        <div className="h-10 bg-[#F6F6F6] w-[360px] items-center gap-2 pr-3 rounded-[72px] hidden lg:flex">
          <img src={searchi} alt="" />
          <input  {...register("search")} className="focus:outline-none font-benton-bold text-[14px] leading-[16px] tracking-[-0.5px] placeholder:text-[#B7BBC2]" type="text" placeholder="Search" />
        </div>
      </div>
    </div>
  );
}
