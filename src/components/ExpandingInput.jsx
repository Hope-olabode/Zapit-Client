import { useRef, useEffect, useState } from "react";

export default function ExpandingInput({ register, name, defaultValue = "" }) {
  const spanRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(60); // minimum width
  const [value, setValue] = useState(defaultValue);

  // Dynamically resize input
  useEffect(() => {
    if (spanRef.current) {
      const newWidth = spanRef.current.offsetWidth + 15;
      setInputWidth(newWidth < 60 ? 60 : newWidth);
    }
  }, [value]);

  return (
    <div className="flex flex-row items-center h-[26px] rounded-[72px] border border-[#464646] bg-[#F6F6F6] font-sans text-[12px] leading-[16px] tracking-[-0.5px] px-1.5 gap-1.5 my-2 w-fit">
      <p className="text-[#464646]">by:</p>

      <div className="relative flex items-center">
        {/* Hidden span to measure width */}
        <span
          ref={spanRef}
          className="absolute invisible whitespace-pre font-sans text-[12px] leading-[16px] tracking-[-0.5px]"
        >
          {value || "Seyi Ogunlade"}
        </span>

        <input
          {...register(name, { required: true })}
          className="text-[#B7BBC2] focus:outline-none placeholder:text-[#A1A6B0] bg-transparent"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Seyi Ogunlade"
          style={{
            width: `${inputWidth}px`,
            minWidth: "60px",
          }}
        />
      </div>
    </div>
  );
}
