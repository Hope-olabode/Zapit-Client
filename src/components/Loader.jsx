import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col">
      {/* Rectangle with shadow */}
      <div className="flex flex-col justify-center gap-[12px] items-end">
        <div className="rect-wrapper">
          <div className="rect-shadow"></div>
          <div className="rect">
            <div className="fill"></div>
          </div>
        </div>

        {/* Circle */}
        <div className="circle shadow-[5px_5px_0px_0px_#1B1D22]">
          <div className="fillc"></div>
        </div>
      </div>
    </div>
  );
}
