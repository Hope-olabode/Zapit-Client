import edit from "../assets/edit.svg";
import space from "../assets/space.svg";
import analytics from "../assets/analytics.svg";
import archive from "../assets/archive.svg";
import { set } from "react-hook-form";

export default function Menue({ setMenue, setEditLocation }) {
  return (
    <div
      onClick={() => setMenue(false)}
      className="fixed inset-0 bg-[#00000000] z-20"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[200px] rounded-2xl border-2 border-[#464646] bg-[#F6F6F6] absolute top-14 right-4"
      >
        <div
          onClick={() => {
            setEditLocation(true);
            setMenue(false);
          }}
          className="h-11 border-b border-[#464646] flex justify-between items-center px-2"
        >
          <p className="font-sans font-semibold leading-[16px] text-[14px] tracking-[-0.5px] text-[#464646]">
            Edit Location
          </p>
          <img src={edit} alt="" />
        </div>
        <div className="h-11 border-b border-[#464646] flex justify-between items-center px-2">
          <p className="font-sans font-semibold leading-[16px] text-[14px] tracking-[-0.5px] text-[#464646]">
            Add Space
          </p>
          <img src={space} alt="" />
        </div>
        <div className="h-11 border-b border-[#464646] flex justify-between items-center px-2">
          <p className="font-sans font-semibold leading-[16px] text-[14px] tracking-[-0.5px] text-[#464646]">
            Analytics
          </p>
          <img src={analytics} alt="" />
        </div>
        <div className="h-11 flex justify-between items-center px-2">
          <p className="font-sans font-semibold leading-[16px] text-[14px] tracking-[-0.5px] text-[#D60000]">
            Archive
          </p>
          <img src={archive} alt="" />
        </div>
      </div>
    </div>
  );
}
