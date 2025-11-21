import React, { useContext } from "react";
import logb from "../assets/logsb.svg";
import log from "../assets/logs.svg";
import location from "../assets/location.svg";
import locationb from "../assets/locationb.svg";
import report from "../assets/report.svg";
import reportb from "../assets/reportb.svg";
import capture from "../assets/capture.svg";
import surveyImg from "../assets/survey.svg";
import smallLogo from "../assets/smallLogo.svg";
import profile from "../assets/profile.svg";
import { Context } from "../context/Context";
import {
  NavLink,
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import addLocation from "../assets/addLocation.svg"; // 👈 alternate image for active state

export default function Nav() {
  const {
    setNewLocation,
    newLocation,
    startCamera,
    setOverlay,
    filteredSurveys,
    setDesktop2,
  } = useContext(Context);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const click = () => {
    if (pathname === "/location") {
      setNewLocation(true);
      console.log("clicked");
      console.log(newLocation);
    }
  };

  return (
    <div className="lg:flex lg:justify-between lg:flex-col lg:h-full ">
      <img className="hidden lg:block" src={smallLogo} alt="" />
      <div className="flex flex-row items-center justify-center gap-[8px] z-10 lg:flex-col">
        <div className="flex w-[160px] h-[64px] lg:w-[64px] lg:h-[160px] justify-center gap-7 items-center rounded-[16px] bg-white lg:flex-col">
          <NavLink to="/logs">
            {({ isActive }) => {
              const active = isActive || pathname === "/surveys"; // ✅ condition for both

              return active ? (
                <img src={logb} alt="logo" className="w-[24px]" />
              ) : (
                <img src={log} alt="logo" className="w-[24px]" />
              );
            }}
          </NavLink>

          <NavLink to="/location">
            {({ isActive }) =>
              isActive ? (
                <img src={locationb} alt="logo" className="w-[24px]" />
              ) : (
                <img src={location} alt="logo" className="w-[24px]" />
              )
            }
          </NavLink>
          <NavLink to="/report">
            {({ isActive }) =>
              isActive ? (
                <img src={reportb} alt="logo" className="w-[24px]" />
              ) : (
                <img src={report} alt="logo" className="w-[24px]" />
              )
            }
          </NavLink>
        </div>

        {pathname === "/surveys" ? (
          <div className="div">
            {<button
              onClick={
                filteredSurveys.length === 0
                  ? ()=> navigate("/survey/new")
                  : () => setOverlay(true)
              }
              className="lg:hidden h-[72px] w-[72px] bg-[#4ECDC4] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] transform flex items-center justify-center transition-all duration-150"
            >
              <img src={surveyImg} alt="survey" />
            </button>}
            <button
              onClick={
                filteredSurveys.length === 0
                  ? ()=>setDesktop2(true)
                  : () => setOverlay(true)
              }
              className="hidden lg:flex h-[72px] w-[72px] bg-[#4ECDC4] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] transform items-center justify-center transition-all duration-150"
            >
              <img src={surveyImg} alt="survey" />
            </button>
          </div>
        ) : pathname === "/location" ? (
          <button
            onClick={() => setOverlay(true)}
            className="h-[72px] w-[72px] bg-[#4ECDC4] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] transform flex items-center justify-center transition-all duration-150"
          >
            <img src={surveyImg} alt="capture" />
          </button>
        ) : (
          <button
            className="h-[72px] w-[72px] bg-[#4ECDC4] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] transform flex items-center justify-center transition-all duration-150"
            onClick={startCamera}
          >
            <img src={capture} alt="capture" />
          </button>
        )}
      </div>
      <img className="hidden lg:block" src={profile} alt="" />
    </div>
  );
}
