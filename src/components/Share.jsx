import { Context } from "../context/Context";
import { useContext, useState, useEffect } from "react";

export default function Share() {
  const { setShare } = useContext(Context);
  return (
    <div className="fixed inset-0 bg-[#0000006c]">
      <div className="div">
        <div className="border-b pt-6 pb-4">
          <p className="font-benton-black text-center text-[16px] leading-[125%] tracking-[-0.5px] text-[#1B1D22]">Export Formats</p>
        </div>
      </div>
    </div>
  );
}
