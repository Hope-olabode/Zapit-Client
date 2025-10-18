import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { Context } from "../context/Context";
import api from "../api/axios";
import { toast } from "sonner";
import la from "../assets/locationAdd.svg";
import mark from "../assets/mark.svg";

export default function IssueLocations({
  // setLocationName,
  setSelectLocation,
  selectedIssue,
  setSelectedIssue
}) {
  const { register, handleSubmit, reset } = useForm();

  const { locations, loading, setLoading, setLocations } = useContext(Context);
  const [select, setSelect] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  const onSubmitLocation = async (data) => {
    console.log("location Form Data:", data);
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
    // Clears the location form
  };

  const onError = (formErrors) => {
    Object.values(formErrors).forEach((err) => {
      toast.error(err.message);
    });
  };

  return (
    <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-20">
      <div className="absolute bottom-[0px] w-[100%] left-[50%] translate-x-[-50%] bg-[#F6F7F9]  pt-6 rounded-4xl">
        <p className=" text-center font-benton-black text-[16px] leading-[125%] mb-6">
          Locations
        </p>
        <div className="w-full h-0.5 bg-black mb-6"></div>
        <div className="px-4">
          <div className="border-2 w-[100%] border-black rounded-xl overflow-hidden  bg-[#F6F7F9]  z-3">
            <form
              onSubmit={handleSubmit(onSubmitLocation, onError)}
              className="border-b-2 w-full flex items-center justify-center gap-[2px] px-4"
            >
              <input
                {...register("name", {
                  required: "Location is required",
                })}
                type="text"
                placeholder="Add Location"
                className="font-benton-bold text-[16px] leading-[150%] h-[48px] w-full  focus:outline-none placeholder:text-[#CED0D5]"
              />
              <button disabled={loading} type="submit">
                <img src={la} alt="" />
              </button>
            </form>
            {locations.map((loc, index) => {
              const isSelected =
                selectedLocation === loc._id ||
                selectedIssue.location === loc.name;

              return (
                <div
                  key={loc._id}
                  onClick={() => {
                    // toggle selection logic
                    const isSameLocation = selectedLocation === loc._id;

                    if (isSameLocation) {
                      // unselect if clicking again
                      setSelectedLocation("");
                      setSelectedIssue((prev) => ({ ...prev, location: "" }));
                    } else {
                      // select new location
                      setSelectedLocation(loc._id);
                      setSelectedIssue((prev) => ({
                        ...prev,
                        location: loc.name,
                      }));
                    }

                    // setLocationName(isSameLocation ? "" : loc.name);
                    setSelect(!isSameLocation);
                  }}
                  className={`flex items-center border-b-2 border-black last:border-b-0 px-4 py-3 cursor-pointer
        ${isSelected ? "bg-[#E0FFFA]" : "bg-transparent"}
      `}
                >
                  {/* Number */}
                  <span className="w-6 font-benton-bold text-[16px] leading-[150%]">
                    {index + 1}
                  </span>

                  {/* Location Name */}
                  <p className="ml-4 font-benton-bold text-[16px] leading-[150%]">
                    {loc.name}
                  </p>

                  {/* Checkmark if selected */}
                  {isSelected && (
                    <img
                      src={mark}
                      alt="selected"
                      className="ml-auto w-6 h-6"
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 justify-center items-center mt-6 mb-[29px]">
            <button
              onClick={() => {
                setSelectLocation(false);
                setSelectedLocation("");
                setSelect(false);
                // setLocationName("");
              }}
              type="submit"
              className="h-14 w-full bg-[#E8E9EB] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] flex items-center justify-center"
            >
              Cancle
            </button>

            <button
              disabled={select === "false"}
              onClick={() => setSelectLocation(false)}
              type="submit"
              className={`h-14 w-full ${
                select === false ? "bg-[#E1E2E5]" : "bg-[#4ECDC4]"
              }  font-benton-black text-[21px] leading-[150%] rounded-[12px]  ${
                select === false
                  ? "shadow-[5px_5px_0px_0px_#CED0D5]"
                  : "shadow-[5px_5px_0px_0px_#1B1D22]"
              } flex items-center justify-center ${
                select === false ? "text-[#A1A6B0]" : ""
              }`}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
