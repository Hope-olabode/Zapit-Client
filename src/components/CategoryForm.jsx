import { useForm } from "react-hook-form";
import { useContext } from "react";
import { Context } from "../context/Context";
import api from "../api/axios";
import { toast } from "sonner";

export default function CategoryForm({setShowAddModal}) {
    const { register, handleSubmit, reset, watch } = useForm();
    const categoryName = watch("name", "");

    const { categories, setCategories, loading, setLoading} = useContext(Context);

    const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);

    try {
      const response = await api.post("/categories/", data); // withCredentials is already set in api.js

      toast.success("Category created successfully"); // ✅ Success toast inside try (after await)
      console.log(response.data);

      // Update state with the actual response (includes ID, timestamps, etc.)
      setCategories([...categories, response.data.category]);

      reset(); // Clear the input field after successful submission
      setShowAddModal(false); // Close the modal after successful submission
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
      console.error("Create category error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onError = (formErrors) => {
    Object.values(formErrors).forEach((err) => {
      toast.error(err.message);
    });
  };
    return(
        <form onSubmit={handleSubmit(onSubmit, onError)}>
                <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-40">
                  <div className="absolute bottom-[0px] w-[100%] left-[50%] translate-x-[-50%] bg-[#F6F7F9]  pt-6 rounded-4xl">
                    <p className="font-benton-black text-[#1B1D22] text-[16px] leading-[125%] text-center mb-4">
                      Add Category
                    </p>
                    <div className="w-full h-0.5 bg-black mb-6"></div>
                    <div className="flex flex-col items-center">
                      <input
                        {...register("name", {
                          required: "category is Required",
                        })}
                        className="my-10 h-[26px] font-benton-black text-[#1B1D22] text-[18px] leading-[145%] w-[130px] placeholder:text-[#CED0D5] focus:outline-none"
                        placeholder="New Category"
                        type="text"
                      />
                      <div className="flex gap-4 justify-center items-center mt-6 mb-[29px] w-full px-[21px]">
                        <button
                          onClick={() => {
                            setShowAddModal(false);
                          }}
                          className="h-14 w-full bg-[#E8E9EB] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] flex items-center justify-center"
                        >
                          Cancle
                        </button>

                        <button
                          disabled={loading}
                          type="submit"
                          className={`h-14 w-full ${
                            categoryName.trim().length === 0
                              ? "bg-[#E1E2E5]"
                              : "bg-[#4ECDC4]"
                          }  font-benton-black text-[21px] leading-[150%] rounded-[12px]  ${
                            categoryName.trim().length === 0
                              ? "shadow-[5px_5px_0px_0px_#CED0D5]"
                              : "shadow-[5px_5px_0px_0px_#1B1D22]"
                          } flex items-center justify-center ${
                            categoryName.trim().length === 0
                              ? "text-[#A1A6B0]"
                              : ""
                          }`}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
    )
}