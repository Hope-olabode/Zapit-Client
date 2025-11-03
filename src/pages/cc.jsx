import { useState, useEffect } from "react";
import { useFieldArray, useWatch } from "react-hook-form";

export default function CcInput({ control, name }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name, // "ccList"
  });

  const ccList = useWatch({ control, name }); // current array values
  const [activeInput, setActiveInput] = useState(Date.now());
  const [inputValues, setInputValues] = useState({});

  // ✅ Adds current input value to ccList if not empty
  const confirmInput = (id) => {
    const trimmed = (inputValues[id] || "").trim();
    if (trimmed && !ccList.includes(trimmed)) {
      append(trimmed);
      setInputValues((prev) => ({ ...prev, [id]: "" }));
      setActiveInput(null);
    }
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmInput(id);
    }
  };

  const handleBlur = (id) => {
    confirmInput(id);
  };

  const handleAddInput = () => {
    const newId = Date.now();
    setActiveInput(newId);
  };

  // ✅ Auto resize input width based on content
  useEffect(() => {
    if (!activeInput) return;
    const inputEl = document.getElementById(`cc-input-${activeInput}`);
    const spanEl = document.getElementById(`cc-span-${activeInput}`);
    if (inputEl && spanEl) {
      const width = Math.max(spanEl.offsetWidth + 10, 40);
      inputEl.style.width = `${width}px`;
      inputEl.focus();
    }
  }, [inputValues, activeInput]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 border border-[#464646] rounded-full bg-[#F6F6F6] px-1.5 min-h-[26px] flex-wrap">
        <span className="font-sans text-[12px] text-[#464646] leading-[16px] tracking-[-0.5px]">
          Cc:
        </span>

        {/* ✅ Render confirmed ccList */}
        {ccList?.map((name, i) => (
          <span
            key={i}
            className="flex items-center gap-1 text-[#A1A6B0] text-[12px]"
          >
            <span>{name}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-red-500 hover:text-black text-sm leading-none"
            >
              ×
            </button>
            {(i < ccList.length - 1 || activeInput) && (
              <span className="text-[#A1A6B0] pt-[2px]">•</span>
            )}
          </span>
        ))}

        {/* ✅ Active Input */}
        {activeInput && (
          <span className="flex items-center gap-1">
            <input
              id={`cc-input-${activeInput}`}
              type="text"
              value={inputValues[activeInput] || ""}
              onChange={(e) =>
                setInputValues({
                  ...inputValues,
                  [activeInput]: e.target.value,
                })
              }
              onKeyDown={(e) => handleKeyDown(e, activeInput)}
              onBlur={() => handleBlur(activeInput)}
              className="bg-transparent focus:outline-none placeholder:text-[#B7BBC2] text-[#B7BBC2] text-[12px] font-sans leading-[16px] tracking-[-0.5px]"
              placeholder="Enter name"
              style={{ width: "40px" }}
              autoFocus
            />
            <span
              id={`cc-span-${activeInput}`}
              className="absolute invisible whitespace-pre text-[12px]"
            >
              {inputValues[activeInput] || " "}
            </span>
          </span>
        )}
      </div>

      {/* ✅ Plus button */}
      <button
        type="button"
        onClick={handleAddInput}
        className="flex items-center justify-center w-6 h-6 rounded-full border border-[#464646] hover:bg-[#E1E2E5] transition"
      >
        +
      </button>
    </div>
  );
}
