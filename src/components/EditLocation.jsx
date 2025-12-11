import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { Context } from "../context/Context";
import { useContext } from "react";
import api from "../api/axios";

export default function EditLocation({ setEditLocation, setLocation }) {
  const { locations, setLocations, loading, setLoading } = useContext(Context);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      Location: JSON.parse(sessionStorage.getItem("Location")) || "",
    },
  });

  // Get saved location (safe for both "Lagos" and Lagos)
  const savedLocation = (sessionStorage.getItem("Location") || "").replace(
    /"/g,
    ""
  );

  const onSubmit = async (data) => {
  try {
    setLoading(true);

    // Find the location ID from the locations array using the saved location name
    const locationToUpdate = locations.find(
      (loc) => loc.name === savedLocation
    );

    if (!locationToUpdate) {
      toast.error("Location not found");
      return;
    }

    // Extract the actual ID string - handle both formats
    const locationId = locationToUpdate._id?.$oid || locationToUpdate._id;

    // Make API call to update the location
    await api.put(
      `/locations/${locationId}`,
      { name: data.Location.trim() }
    );

    // Update the locations in context
    setLocations((prevLocations) =>
      prevLocations.map((loc) => {
        const locId = loc._id?.$oid || loc._id;
        return locId === locationId
          ? { ...loc, name: data.Location.trim() }
          : loc;
      })
    );

    

    // Update sessionStorage with new location name
    sessionStorage.setItem("Location", JSON.stringify(data.Location.trim()));
    setLocation(data.Location.trim())

    toast.success("Location updated successfully");
    setEditLocation(false);
  } catch (error) {
    console.error("Update location error:", error);
    toast.error(
      error.response?.data?.message || "Failed to update location"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="div fixed inset-0 bg-[#0000007c] z-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="div rounded-t-[32px] bg-[#F6F7F9] w-full bottom-0 absolute  pb-6"
      >
        <div className="pt-6 pb-4 border-b px-4">
          <p className=" font-benton-black text-[16px] leading-[125%] tracking-[-0.5px] text-center">
            Edit Location
          </p>
        </div>
        <div className="py-10 px-4">
          <input
            {...register("Location")}
            className="h-[26px]  text-center font-benton-black text-[18px] leading-[145%] tracking-[-0.5px] border-0 focus:outline-none w-full text-[#1B1D22]"
            type="text"
          />
        </div>
        <div className="div px-4 flex justify-between gap-4">
          <button
            onClick={() => {
              setEditLocation(false);
            }}
            className="h-14 w-full bg-[#E8E9EB] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] flex items-center justify-center"
          >
            Cancle
          </button>

          <button
            type="submit"
            className="h-14 w-full bg-[#4ECDC4] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] flex items-center justify-center "
          >
            Done
          </button>
        </div>
      </form>
    </div>
  );
}
