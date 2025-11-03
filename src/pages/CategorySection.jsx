import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import dropdown from "../assets/dropdown2.svg";
import edit from "../assets/edit.svg";
import exp from "../assets/export.svg";
import dele from "../assets/delete2.svg";
import plus from "../assets/add.svg";
import add2 from "../assets/add2.svg";

function CategorySection({
  index,
  control,
  categories,
  onDelete,
  isActive,
}) {
  const [open2, setOpen2] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <Controller
      control={control}
      name={`categories.${index}`}
      render={({ field }) => {
        const { title, score, questions = [], remark } = field.value || {};

        const updateField = (updates) => {
          field.onChange({
            ...field.value,
            ...updates,
          });
        };

        const handleAnswer = (qIndex, answer) => {
          const updatedQuestions = questions.map((q, i) =>
            i === qIndex ? { ...q, answer: q.answer === answer ? null : answer } : q
          );
          updateField({ questions: updatedQuestions });
        };

        const addQuestion = () => {
          const newQuestion = {
            id: questions.length + 1,
            text: `Question ${questions.length + 1}`,
            answer: null,
          };
          updateField({ questions: [...questions, newQuestion] });
        };

        const handleTextChange = (qIndex, newText) => {
          const updatedQuestions = questions.map((q, i) =>
            i === qIndex ? { ...q, text: newText } : q
          );
          updateField({ questions: updatedQuestions });
        };

        const handleScoreSelect = (num) => {
          updateField({ score: num });
        };

        const handleTitleSave = (newTitle) => {
          setIsEditingTitle(false);
          updateField({ title: newTitle });
        };

        return (
          <div
            className={`${
              categories.length === 1 ? "w-full" : "min-w-[85vw]"
            } snap-center overflow-visible`}
          >
            <div className="div relative overflow-visible">
              {/* Header */}
              <div className="flex relative flex-row gap-1 items-center">
                {isEditingTitle ? (
                  <input
                    type="text"
                    defaultValue={title || "Category Title"}
                    onBlur={(e) => handleTitleSave(e.target.value)}
                    autoFocus
                    className="text-[#1B1D22] font-bold text-[24px] leading-[130%] tracking-[-0.5px] bg-transparent border-b border-gray-400 outline-none"
                  />
                ) : (
                  <h1
                    className="text-[#1B1D22] font-bold text-[24px] leading-[130%] tracking-[-0.5px] cursor-pointer"
                    onClick={() => setOpen2((prev) => !prev)}
                  >
                    {title || "Category Title"}
                  </h1>
                )}

                <img
                  src={dropdown}
                  alt=""
                  onClick={() => setOpen2((prev) => !prev)}
                  className="cursor-pointer"
                />

                {/* Dropdown Menu */}
                {open2 && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[calc(100%-5px)] left-[10px]"
                  >
                    <div className="mt-2 w-[200px] absolute bg-white rounded-[16px] border-2 border-gray-800 shadow-lg overflow-hidden z-20">
                      <div className="px-3 py-2 flex items-center justify-between">
                        <p className="font-sans text-[14px] text-[#464646]">Score</p>
                      </div>

                      <div className="flex items-center border-t">
                        {[1, 2, 3, 4].map((num) => (
                          <p
                            key={num}
                            onClick={() => handleScoreSelect(num)}
                            className={`font-bold py-4 px-[19px] text-[20px] leading-[130%] tracking-[-0.5px] cursor-pointer transition-all ${
                              score === num
                                ? "bg-[#4ECDC4]"
                                : "text-[#464646] hover:bg-gray-100"
                            }`}
                          >
                            {num}
                          </p>
                        ))}
                      </div>

                      {/* Edit Title */}
                      <div
                        onClick={() => {
                          setIsEditingTitle(true);
                          setOpen2(false);
                        }}
                        className="p-3 border-t flex items-center justify-between cursor-pointer"
                      >
                        <p className="font-sans text-[14px] text-[#464646]">
                          Edit Title
                        </p>
                        <img src={edit} alt="" />
                      </div>

                      {/* Add Section */}
                      <div className="p-3 border-t flex items-center justify-between">
                        <p className="font-sans text-[14px] text-[#464646]">
                          Add Section
                        </p>
                        <img src={exp} alt="" />
                      </div>

                      {/* Delete */}
                      <div
                        onClick={onDelete}
                        className="p-3 border-t flex items-center justify-between cursor-pointer"
                      >
                        <p className="font-sans text-[14px] text-[#D60000]">Delete</p>
                        <img src={dele} alt="" />
                      </div>
                    </div>
                    <div
                      onClick={() => setOpen2(false)}
                      className="fixed z-10 inset-0 bg-[#02020200]"
                    ></div>
                  </div>
                )}
              </div>

              {/* Question Section */}
              <div className="border-2 border-black rounded-2xl mt-3 p-4 bg-gray-50 relative">
                {score && (
                  <div className="absolute top-[-45px] right-3 bg-[#1B1D22] text-white rounded-t-[8px] w-[40px] h-[43px] flex items-center justify-center font-bold text-[14px]">
                    {score}
                  </div>
                )}

                {questions.map((q, qIndex) => (
                  <div
                    key={qIndex}
                    className={`${
                      questions.length > 1 ? "mb-6 pb-6" : "mb-3 pb-3"
                    } border-b-2 border-dashed border-black last:border-b-0`}
                  >
                    <input
                      type="text"
                      value={q.text || ""}
                      placeholder={`Question ${qIndex + 1}`}
                      onChange={(e) => handleTextChange(qIndex, e.target.value)}
                      className="text-[16px] placeholder:text-[#CED0D5] text-[#1B1D22] font-bold leading-[150%] w-full bg-transparent outline-none mb-3"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAnswer(qIndex, "YES")}
                        className={`flex-1 h-10 rounded-lg border-2 border-[#464646] text-[#464646] font-bold text-[12px] ${
                          q.answer === "YES" ? "bg-[#48BB78]" : ""
                        }`}
                      >
                        YES
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAnswer(qIndex, "NO")}
                        className={`flex-1 h-10 rounded-lg border-2 border-[#464646] text-[#464646] font-bold text-[12px] ${
                          q.answer === "NO" ? "bg-red-600" : ""
                        }`}
                      >
                        NO
                      </button>

                      <img
                        src={plus}
                        alt="add"
                        onClick={addQuestion}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                ))}

                <div
                  onClick={addQuestion}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <p className="text-[#CED0D5] font-benton-bold text-[16px] leading-[150%] select-none">
                    Add Question
                  </p>
                  <img src={add2} alt="" />
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="h-[56px] p-4 mt-3 w-full border-2 border-[#B7BBC2] bg-[#F6F7F9] rounded-[16px]">
              <input
                type="text"
                value={remark || ""}
                onChange={(e) => updateField({ remark: e.target.value })}
                className="font-bold placeholder:text-[#CED0D5] text-[#1B1D22] text-[16px] h-full focus:outline-none w-full bg-transparent"
                placeholder="Leave Remarks"
              />
            </div>
          </div>
        );
      }}
    />
  );
}

const CategoryCarousel = forwardRef(({ control }, ref) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const addCategory = () => {
    append({
      id: fields.length + 1,
      title: `Category ${fields.length + 1}`,
      score: null,
      questions: [{ id: 1, text: "Question 1", answer: null }],
      remark: "",
    });
  };

  useImperativeHandle(ref, () => ({
    addCategory,
  }));

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const itemWidth = scrollRef.current.offsetWidth * 0.85;
        const newIndex = Math.round(scrollLeft / itemWidth);
        setActiveIndex(newIndex);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="w-full">
      {/* Progress Indicator */}
      <div className="flex gap-1 justify-center my-8">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className={`h-1 flex-1 transition-colors duration-300 ${
              fields.length === 1
                ? "bg-black"
                : index === activeIndex
                ? "bg-[#48BB78]"
                : "bg-black"
            }`}
          />
        ))}
      </div>

      {/* Scrollable Categories */}
      <div
        ref={scrollRef}
        className="flex px-4 overflow-x-auto gap-4 overflow-y-visible snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {fields.map((field, index) => (
          <CategorySection
            key={field.id}
            index={index}
            control={control}
            categories={fields}
            onDelete={() => remove(index)}
            isActive={index === activeIndex}
          />
        ))}
      </div>

      {/* Add Category Button */}
      {/* <div className="mt-6 px-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={addCategory}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          ➕ Add New Category
        </button>
      </div> */}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
});

export default CategoryCarousel;