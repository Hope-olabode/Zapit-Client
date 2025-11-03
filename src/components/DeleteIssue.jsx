import { Context } from "../context/Context";
import { toast, Toaster } from "sonner";
import api from "../api/axios";

import React, { useContext } from "react";

export default function DeleteIssue({ img, setConfirmDelete }) {
  const { setIssues, setLoading, loading, setSelectedIssue, selectedIssue } =
    useContext(Context);

  console.log("Delete Image:", img);
  const firstImageUrl = img?.[0]?.url;

  const deleteIssue = async () => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    setLoading(true);
    try {
      const res = await api.delete(`/issues/${selectedIssue._id}`);

      toast.success(res.data.message || "Issue deleted successfully");

      // 🧹 Remove from array immediately
      setIssues((prevIssues) =>
        prevIssues.filter((issue) => issue._id !== selectedIssue._id)
      );

      // Optional: close modal or clear selection
      setSelectedIssue(null);
      setConfirmDelete(false);
    } catch (error) {
      console.error("❌ Delete issue error:", error);
      toast.error(error.response?.data?.message || "Failed to delete issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-20">
      <Toaster position="top-center" richColors />
      <div className="absolute w-full bottom-[0px] bg-[#F6F7F9] px-4 pt-10 pb-6 rounded-t-3xl flex flex-col gap-6 justify-center items-center">
        <div className="shadow-[4.2px_3.2px_0px_0px_#1B1D22] rounded-[7.68px] overflow-hidden">
          <img className="w-[128px] h-[153px]" src={firstImageUrl} alt="" />
        </div>
        <div className="div">
          <h1 className="font-benton-black text-[24px] leading-[125%] tracking-[-0.5px] text-[#1B1D22] mb-2">
          Delete Issue?
        </h1>
        <p className="font-benton-regular text-[15px] leading-[150%] text-[#292C33]">
          Move this issue to trash
        </p>
        </div>
        <div className="flex w-full justify-between gap-[21px] ">
          <button
            disabled={loading}
            onClick={() => setConfirmDelete(false)}
            className={`h-14 ${
              loading
                ? "bg-[#E1E2E5] shadow-[5px_5px_0px_0px_#CED0D5] text-[#A1A6B0]"
                : "bg-[#E8E9EB] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] text-[#1B1D22]"
            }  font-benton-black text-[21px] w-full leading-[150%] rounded-[12px] transform flex items-center justify-center transition-all duration-150`}
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={deleteIssue}
            className={`h-14 ${
              loading
                ? "bg-[#E1E2E5] shadow-[5px_5px_0px_0px_#CED0D5] text-[#A1A6B0]"
                : "bg-[#D60000] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] text-[#1B1D22]"
            }  font-benton-black text-[21px] w-full leading-[150%] rounded-[12px] transform flex items-center justify-center transition-all duration-150`}
          >
            Trash
          </button>
        </div>
      </div>
    </div>
  );
}
