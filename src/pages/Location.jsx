import { useContext } from "react";
import api from "../api/axios";
import { useForm } from "react-hook-form";
import Loader from "../components/Loader";
import location2 from "../assets/location2.svg";
import la from "../assets/locationAdd.svg";
import { Context } from "../context/Context";

import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Location() {
  const { register, handleSubmit, reset } = useForm();
  const { loading, setLoading, locations, setLocations } = useContext(Context);

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
    <div className="h-full w-full relative bg-[#E8E9EB]">
      <Toaster position="top-center" richColors />
      <div className="flex flex-row justify-between items-center z-[2] absolute w-full p-4 h-[80px]">
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
        <div className="border-2 w-[90%] border-black rounded-xl overflow-hidden absolute top-[100px] bg-white left-[50%] translate-x-[-50%] z-3">
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
              onClick={()=>{
                sessionStorage.setItem(
                      "Location",
                      JSON.stringify(loc.name)
                    );
                    navigate("/location/view");
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
      )}
    </div>
  );
}
