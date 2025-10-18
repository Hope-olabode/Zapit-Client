import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "sonner"; // optional if you’re using Sonner

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await api.get("/locations"); // protected route
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        if (error.response?.status === 401) {
          toast.error("You must be logged in to view locations");
        } else {
          toast.error("Failed to fetch locations");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    // <div className="p-4">
    //   <h2 className="text-xl font-semibold mb-2">All Locations</h2>
    //   {locations.length === 0 ? (
    //     <p>No locations found.</p>
    //   ) : (
    //     <ul className="space-y-2">
    //       {locations.map((loc) => (
    //         <li key={loc._id} className="border p-2 rounded-md">
    //           {loc.name}
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>
    <button
  class="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-[0_6px_0_0_#1e3a8a] active:shadow-[0_2px_0_0_#1e3a8a] active:translate-y-[4px] active:translate-x-[4px] transition-all duration-150"
>
  Press Me
</button>

  );
};

export default LocationList;
