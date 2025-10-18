import cancle from "../assets/cancle.svg";
import deleteImg from "../assets/delete.svg";
import share from "../assets/share.svg";
import dropdown from "../assets/dropdown.svg";
import location3 from "../assets/location3.svg";
import api from "../api/axios";
import ai from "../assets/addImage.svg";
import di from "../assets/deleteImage.svg";
import clock from "../assets/clock.svg";
import empty from "../assets/empty.svg";
import add2 from "../assets/addImage2.svg";
import { Context } from "../context/Context";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import cc from "../assets/catcancle.svg";
import ca from "../assets/catadd.svg";
import CategoryForm from "./CategoryForm";
import Camera from "./Camera.jsx";

import { useContext, useState } from "react";
import IssueLocations from "./IssueLocations";
import DeleteIssue from "./DeleteIssue.jsx";

export default function SelectedIssue() {
  const {
    categories,
    cameraActive,
    startCamera,
    imgFiles2,
    setImgFiles2,
    setIssues,
    setLoading,
    update,
    setUpdate,
    setSelectedIssue,
    selectedIssue,
    loading,
  } = useContext(Context);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      description: selectedIssue?.description || "",
      Caused_by: selectedIssue?.Caused_by || "",
      Responsibility: selectedIssue?.Responsibility || "",
    },
  });
  const [viewCategory, setViewCategory] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // const [locationName, setLocationName] = useState("");
  const [selectLocation, setSelectLocation] = useState(false);
  const [status, setStatus] = useState(selectedIssue.status || "Pending");
  const [status2, setStatus2] = useState(selectedIssue.priority || "High");

  const isSelected = (categoryName) =>
    selectedIssue.categories.includes(categoryName);

  console.log(selectedIssue);

  const toggleCategory = (categoryName) => {
    setSelectedIssue((prev) => {
      const alreadySelected = prev.categories.includes(categoryName);
      const updatedCategories = alreadySelected
        ? prev.categories.filter((name) => name !== categoryName)
        : [...prev.categories, categoryName];

      return { ...prev, categories: updatedCategories };
    });
  };

  const deleteLastImage = () => {
    setImgFiles2((prevImages) => prevImages.slice(0, -1));
    setSelectedIssue((prev) => ({
      ...prev,
      images: prev.images.slice(0, -1),
    }));
  };

  const handleClick = () => {
    setStatus((prev) => {
      if (prev === "Pending") return "In Progress";
      if (prev === "In Progress") return "Resolved";
      return "Pending";
    });
  };

  const getStatusStyles = () => {
    switch (status) {
      case "Pending":
        return "bg-[#FFC529] text-[#461B02] border-[#461B02]";
      case "In Progress":
        return "bg-[#1513EC] text-[#D2D2F4] border-[#00003D]";
      case "Resolved":
        return "bg-[#73CA5E] text-[#0D301C] border-[#317223]";
      default:
        return "";
    }
  };

  const handleClick2 = () => {
    setStatus2((prev) => {
      if (prev === "High") return "Medium";
      if (prev === "Medium") return "Low";
      return "High";
    });
  };

  const getStatusStyles2 = () => {
    switch (status2) {
      case "High":
        return "bg-[#FFDDE2] text-[#CC001E] border-[#CC001E]";
      case "Medium":
        return "bg-[#FFFBEB] text-[#7A350D] border-[#B75406]";
      case "Low":
        return "bg-[#F6F6F6] text-[#464646] border-[#464646]";
      default:
        return "";
    }
  };

  const onSubmit = async (data) => {
    console.log("🧾 Form Data:", data);
    console.log("📸 Image Files (for upload):", imgFiles2);
    console.log("📝 Selected Issue State:", selectedIssue.images);

    if (!selectedIssue.location) return toast.error("Please select a location");
    if (!selectedIssue.categories?.length)
      return toast.error("Please select a category");

    setLoading(true);

    try {
      const formData = new FormData();

      // 🔹 Append text fields
      formData.append(
        "description",
        data.description || selectedIssue.description
      );
      formData.append("Caused_by", data.Caused_by || selectedIssue.Caused_by);
      formData.append(
        "Responsibility",
        data.Responsibility || selectedIssue.Responsibility
      );
      formData.append("location", selectedIssue.location);
      formData.append("status", selectedIssue.status);
      formData.append("priority", selectedIssue.priority);
      formData.append("dateTime", selectedIssue.dateTime);
      formData.append("categories", JSON.stringify(selectedIssue.categories));

      // 🔹 Append only valid Cloudinary images
      const existingUrls = (selectedIssue.images || [])
        .filter((img) => img.url && !img.url.startsWith("blob:"))
        .map((img) => ({
          url: img.url,
          public_id: img.public_id,
        }));

      formData.append("existingImages", JSON.stringify(existingUrls));

      // 🔹 Append the new files (from imgFiles2)
      imgFiles2.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });

      console.log("📤 FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const response = await api.put(`/issues/${selectedIssue._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Issue updated successfully!");
      console.log("✅ Server response:", response.data);

      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === response.data.issue._id ? response.data.issue : issue
        )
      );

      reset();
      setImgFiles2([]);
    } catch (error) {
      console.error("❌ Update issue error:", error);
      toast.error(error.response?.data?.message || "Failed to update issue");
    } finally {
      setLoading(false);
    }
  };

  const onError = (formErrors) => {
    Object.values(formErrors).forEach((err) => {
      toast.error(err.message);
    });
  };

  return (
    <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-10 h-screen">
      <div className="p-4 w-full flex justify-between items-center ">
        <img
          src={cancle}
          onClick={() => {
            setSelectedIssue(null);
          }}
          alt="cancel"
          className="w-14 h-14 cursor-pointer"
        />
        <div className="flex gap-2">
          <img
            src={deleteImg}
            onClick={() => {
              setConfirmDelete(true);
            }}
            alt="cancel"
            className="w-14 h-14 cursor-pointer"
          />
          <img
            src={share}
            onClick={() => {
              setSelectedIssue(null);
            }}
            alt="cancel"
            className="w-14 h-14 cursor-pointer"
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="relative flex-1 bg-white rounded-t-[12px] w-full overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="p-4 relative w-full h-[400px] rounded-xl">
            {selectedIssue.images.length === 0 && (
              <div className="flex flex-col items-center gap-[19.32px] h-full rounded-xl bg-[#E8E9EB]">
                <img src={empty} alt="" className="" />
                <div className="flex flex-col items-center gap-2">
                  <h3 className="font-benton-black text-[#1B1D22] text-[18px] leading-[125%]">
                    Empty Image
                  </h3>
                  <p className="font-benton-regular text-[#292C33] text-[14px] leading-[150%]">
                    Attach images to this Log
                  </p>
                  <img onClick={startCamera} src={add2} alt="" />
                </div>
              </div>
            )}

            <div className="w-full h-full relative rounded-xl overflow-hidden">
              {selectedIssue.images.map((src, i) => {
                const count = selectedIssue.images.length;
                let style = "";

                if (count === 1) {
                  // One image: full container
                  style = "absolute top-0 left-0 w-full h-full";
                } else if (count === 2) {
                  // Two images: split horizontally (side by side)
                  style = `absolute top-0 h-full w-1/2 ${
                    i === 0 ? "left-0" : "right-0"
                  }`;
                } else if (count === 3) {
                  // Three images: left full half, right two split vertically
                  if (i === 0) style = "absolute top-0 left-0 w-1/2 h-full";
                  if (i === 1) style = "absolute top-0 right-0 w-1/2 h-1/2";
                  if (i === 2) style = "absolute bottom-0 right-0 w-1/2 h-1/2";
                }

                return (
                  <img
                    key={i}
                    src={src.url}
                    alt={`Captured ${i + 1}`}
                    className={`object-cover  ${style}`}
                  />
                );
              })}

              {/* Divider lines */}
              {selectedIssue.images.length === 2 && (
                // Vertical line in the middle for 2 images
                <div className="absolute top-0 left-1/2 w-[2px] h-full bg-black"></div>
              )}

              {selectedIssue.images.length === 3 && (
                <>
                  {/* Vertical line in the middle */}
                  <div className="absolute top-0 left-1/2 w-[2px] h-full bg-black"></div>
                  {/* Horizontal line on the right half */}
                  <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-black"></div>
                </>
              )}
            </div>

            {/* Buttons (top-right) */}
            <div className="flex flex-col items-center absolute top-[16px] right-[16px]">
              {selectedIssue.images.length != 3 && (
                <img
                  onClick={() => {
                    setUpdate(true);
                    startCamera();
                  }}
                  src={ai}
                  alt=""
                  className="cursor-pointer"
                />
              )}

              <img onClick={deleteLastImage} src={di} alt="" />
            </div>

            {/* Bottom info bar */}
            <div className="flex justify-between items-center absolute bottom-[24px] w-full left-0 px-6">
              <div
                onClick={() => {
                  setSelectLocation(true);
                }}
                className="h-[26px] border border-black flex items-center gap-[6px] rounded-[8px] px-2.5 bg-[#E1E2E5]"
              >
                <img src={location3} alt="" />
                <p className="font-benton-bold text-[10px] leading-[150%]">
                  {selectedIssue.location}
                </p>
              </div>
              <div className="h-[26px] border border-black flex items-center gap-[6px] rounded-[8px] px-2.5 bg-[#E1E2E5]">
                <img src={clock} alt="" />
                <p className="font-benton-bold text-[10px] leading-[150%]">
                  {selectedIssue.dateTime}
                </p>
              </div>
            </div>
          </div>

          {cameraActive && <Camera update={update} />}

          <div className="relative">
            {/* onething */}
            <div className="mb-4 flex flex-row px-4 justify-between">
              <div
                onClick={() => {
                  setViewCategory(true);
                }}
                className="flex gap-1 items-center border rounded-[72px] h-[26px] pl-[8px] pr-[7px] max-w-[240px]"
              >
                <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px] truncate">
                  {selectedIssue.categories.length > 0
                    ? selectedIssue.categories.length <= 2
                      ? selectedIssue.categories
                          .map((cat, i) => (i === 0 ? cat : ` • ${cat}`))
                          .join("")
                      : `${selectedIssue.categories[0]} • ${
                          selectedIssue.categories[1]
                        }... +${selectedIssue.categories - 2}`
                    : "Category"}
                </p>
                <img src={dropdown} alt="" className="flex-shrink-0" />
              </div>
              <div className="flex gap-2">
                <div
                  onClick={handleClick}
                  className={`flex gap-1 items-center border rounded-[72px] h-[26px] pl-[8px] pr-[7px]  ${getStatusStyles()}`}
                >
                  <p>{status}</p>
                </div>
                <div
                  onClick={handleClick2}
                  className={`flex gap-1 items-center border rounded-[72px] h-[26px] pl-[8px] pr-[7px]  ${getStatusStyles2()}`}
                >
                  <p>{status2}</p>
                </div>
              </div>
            </div>
            {viewCategory && (
              <div className="div">
                <div className="top-0 left-[16px] z-30 absolute">
                  <div>
                    <div className="w-[250px] h-[300px] bg-white rounded-3xl border-2 border-gray-800 shadow-lg overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between p-2 border-b-2 border-gray-800">
                        <h2 className="text-[12px] font-sans leading-[16px] font-semibold">
                          Categories
                        </h2>
                        <button
                          type="button"
                          onClick={() => setShowAddModal(true)}
                          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <img src={ca} className="w-6 h-6 text-gray-800" />
                        </button>
                      </div>

                      {/* Categories Grid */}
                      <div className="overflow-y-scroll p-2 max-h-[230px] rounded-b-3xl pb-2">
                        <div className="flex flex-wrap gap-3">
                          {categories.map((category) => (
                            <button
                              type="button"
                              key={category._id}
                              onClick={() => toggleCategory(category.name)}
                              className={`relative px-2 py-[5px] rounded-full h-[26px] text-base font-semibold
                                      transition-all duration-200 border-2 flex items-center
                                      ${
                                        isSelected(category.name)
                                          ? "border-gray-800"
                                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                      }`}
                            >
                              <span className="text-[12px] font-sans leading-[16px] font-semibold">
                                {category.name}
                              </span>
                              {isSelected(category.name) && (
                                <span>
                                  <img src={cc} className="w-5 h-5" />
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setViewCategory(false)}
                  className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-10 h-screen"
                ></div>
              </div>
            )}
          </div>
          <div className="px-4">
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              type="text"
              placeholder="Description"
              className="w-full rounded h-[144px] font-benton-black text-[18px] leading-[145%] placeholder-[#CED0D5] border-0 focus:outline-none"
            />
          </div>
          <div className="border-dashed border-black border-1 my-4 "></div>
          <div className="px-4">
            <textarea
              {...register("Caused_by", {
                required: "Cause is required",
              })}
              type="text"
              placeholder="Caused by"
              className="w-full rounded h-[144px] font-benton-black text-[18px] leading-[145%] placeholder-[#CED0D5] border-0 focus:outline-none"
            />
          </div>
          <div className="border-dashed border-black border-1 my-4 "></div>
          <div className="px-4 pb-4">
            <textarea
              {...register("Responsibility", {
                required: "Responsibility is required",
              })}
              type="text"
              placeholder="Responsibility"
              className="w-full rounded h-[144px] font-benton-black text-[18px] leading-[145%] placeholder-[#CED0D5] border-0 focus:outline-none"
            />
          </div>
          <div className="px-4 pb-4">
            <button
              disabled={loading}
              type="submit"
              className={`h-14 ${
                loading
                  ? "bg-[#E1E2E5] shadow-[5px_5px_0px_0px_#CED0D5] text-[#A1A6B0]"
                  : "bg-[#4ECDC4] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] text-[#1B1D22]"
              }  font-benton-black text-[21px] leading-[150%] rounded-[12px] transform flex items-center justify-center transition-all duration-150 w-full`}
            >
              Update
            </button>
          </div>
        </form>

        {selectLocation && (
          <IssueLocations
            // setLocationName={setLocationName}
            setSelectLocation={setSelectLocation}
            selectedIssue={selectedIssue}
            setSelectedIssue={setSelectedIssue}
          />
        )}
        {showAddModal && <CategoryForm setShowAddModal={setShowAddModal} />}
        {confirmDelete && (
          <DeleteIssue
            img={selectedIssue.images}
            setConfirmDelete={setConfirmDelete}
          />
        )}
      </div>
    </div>
  );
}
