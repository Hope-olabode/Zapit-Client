import { useContext } from "react";
import cancle from "../assets/cancle.svg";
import capture from "../assets/capture.svg";
import { Context } from "../context/Context";
import SelectedIssue from "./SelectedIssue";

export default function Camera({ update }) {
  console.log(typeof update);
  console.log(update);

  const {
    stopCamera,
    videoRef,
    canvasRef,
    capturePhoto,
    capturePhoto2,
    ImgFiles2,
  } = useContext(Context);

  console.log();

  return (
    <div className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-20">
      {/* Cancel button at the top */}
      <div className="p-4 flex w-full justify-center">
        <img
          src={cancle}
          onClick={stopCamera}
          alt="cancel"
          className="w-14 h-14"
        />
      </div>

      {/* Video fills the rest of the screen */}
      <div className="relative flex-1 bg-black rounded-t-[12px] overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Capture button at bottom center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
          <button
            className="h-[72px] w-[72px] bg-[#4ECDC4] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] transform flex items-center justify-center transition-all duration-150"
            onClick={
              update
                ? () => {
                    capturePhoto2();
                    console.log(ImgFiles2);
                  }
                : capturePhoto
            }
          >
            <img src={capture} alt="capture" />
          </button>
        </div>
      </div>
    </div>
  );
}
