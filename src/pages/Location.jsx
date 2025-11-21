import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useForm } from "react-hook-form";
import Loader from "../components/Loader";
import location2 from "../assets/location2.svg";
import la from "../assets/locationAdd.svg";
import { Context } from "../context/Context";
import search from "../assets/search.svg";

import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "../hooks/useMediaQuery";
import ViewLocation from "./ViewLocation.jsx";
import SelectedIssueD from "../components/SelectedIssueD.jsx";
import Category2 from "../components/Category2.jsx";

export default function Location() {
  const { register, handleSubmit, reset } = useForm();
  const {
    loading,
    setLoading,
    locations,
    setLocations,
    display,
    setDisplay,
    selectedIssue,
    setLocation,
    location,
    isMobile,
    setIsMobile,
    viewCategory,
    setViewCategory,
  } = useContext(Context);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);

    try {
      const response = await api.post("/locations/", data); // withCredentials is already set in api.js

      toast.success("Location created successfully"); // ✅ Success toast inside try (after await)
      console.log(response.data);

      // Update state with the actual response (includes ID, timestamps, etc.)
      setLocations([...locations, response.data.location]);

      reset(); // Clear the input field after successful submission
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create location");
      console.error("Create location error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onError = (formErrors) => {
    Object.values(formErrors).forEach((err) => {
      toast.error(err.message);
    });
  };

  const navigate = useNavigate();
  return (
    <div className="min-h-[100dvh]  w-full relative bg-[#E8E9EB] ">
      <Toaster position="top-center" richColors />
      <div className="flex flex-row justify-between items-center z-[2] absolute w-full p-4 h-[80px] lg:hidden">
        <p className="font-benton-black text-[32px] leading-[130%] ">
          Locations
        </p>
      </div>
      {/* Background pattern */}
      <div
        className="z-[1] w-full absolute top-0 h-[50%]
            bg-[length:23px_23px] 
            bg-[repeating-linear-gradient(0deg,#FFFFFF70_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#FFFFFF70_0_1px,transparent_1px_23px)]
            [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]
            [mask-repeat:no-repeat] [mask-size:100%_100%]"
      ></div>

      {locations.length === 0 ? (
        <div className="text-center z-[2] absolute flex flex-col justify-center items-center gap-2 top-[20%] p-4 left-[50%] translate-x-[-50%]">
          <img src={location2} alt="" />
          <h1 className="font-benton-black text-[24px] leading-[125%]">
            Add a Location
          </h1>
          <p className="font-benton-regular text-[15px] leading-[150%]">
            There are no saved locations.
          </p>
        </div>
      ) : (
        <div
          className={`pt-[100px] lg:pt-[56px] lg:ml-[144px] lg:mr-10 ${
            display ? " flex gap-8" : ""
          }`}
        >
          <div
            className={`flex flex-col  items-center lg:gap-[32px] ${
              display ? "w-[calc(100vw-610px)]" : ""
            }`}
          >
            <div className=" flex-row justify-between items-center z-[2] p-4 h-[80px] w-full hidden lg:flex lg:p-0 lg:h-[48px] lg:mt-[9px]">
              <p className="font-benton-black text-[32px] leading-[130%] ">
                Locations{isMobile ? 1 : 2}
              </p>
              <div className="h-10 bg-[#F6F6F6] w-[360px] items-center gap-2 pr-3 rounded-[72px] hidden lg:flex">
                <img src={search} alt="" />
                <input
                  className="focus:outline-none font-benton-bold text-[14px] leading-[16px] tracking-[-0.5px] placeholder:text-[#B7BBC2]"
                  type="text"
                  placeholder="Search"
                />
              </div>
            </div>
            <div className="border-2  border-black rounded-xl overflow-hidden  bg-white  w-[90%] lg:w-full z-3 ">
              {/* absolute top-[100px] left-[50%] w-[90%] translate-x-[-50%] */}
              <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="border-b-2 w-full flex items-center justify-center gap-[2px] px-4"
              >
                <input
                  {...register("name", { required: "Location is Required" })}
                  type="text"
                  placeholder="Add Location"
                  className="font-benton-bold text-[16px] leading-[150%] h-[48px] w-full  focus:outline-none placeholder:text-[#CED0D5]"
                />
                <button disabled={loading} type="submit">
                  <img src={la} alt="" />
                </button>
              </form>
              {locations.map((loc, index) => (
                <div
                  key={loc.id}
                  onClick={() => {
                    sessionStorage.setItem(
                      "Location",
                      JSON.stringify(loc.name)
                    );
                    if (isMobile) {
                      navigate("/location/view");
                    } else {
                      setDisplay(false);
                      setTimeout(() => {
                        console.log("done!");
                        setDisplay(true);
                      }, 1);

                      // setLocation(JSON.parse(sessionStorage.getItem("Location") || "null"))
                    }
                    // isMobile ? navigate("/location/view") : setDisplay(true);
                    // console.log(display);
                    // console.log(location)
                  }}
                  className="flex items-center border-b-2 border-black last:border-b-0 px-4 py-3"
                >
                  {/* Number */}
                  <span className="w-6 font-benton-bold text-[16px] leading-[150%]">
                    {index + 1}
                  </span>

                  {/* Location */}
                  <p className="ml-4 font-benton-bold text-[16px] leading-[150%]">
                    {loc.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {display && (
            <div className={`w-[393px] lg:h-[calc(100vh-65px)] relative ${selectedIssue && "z-10"}`}>
              {selectedIssue ? <SelectedIssueD /> : <ViewLocation />}
            </div>
          )}

          {/* {isMobile
                  ? ""
                  : viewCategory && (
                      <div className="div lg:relative">
                        <div className="top-[-50%] left-[50%] translate-x-[-50%] translate-y-[50%]  z-30 absolute ">
                          <Category2 />
                        </div>
                        <div
                          onClick={() => setViewCategory(false)}
                          className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-10 h-screen"
                        ></div>
                      </div>
                    )} */}

          {viewCategory && (
            <div
              onClick={() => setViewCategory(false)}
              className="inset-0 absolute z-10 bg-[#1B1D2280]"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%]  z-20 absolute "
              >
                <Category2 />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
