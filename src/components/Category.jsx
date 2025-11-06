import React, { useContext } from "react";
import { Context } from "../context/Context";
import cc from "../assets/catcancle.svg";
import ca from "../assets/catadd.svg";

export default function CategorySelector() {
  const {
    categories,
    setShowAddModal,
    selectedCategories,
    setSelectedCategories,
  } = useContext(Context);

  // Toggle category by name instead of id
  const toggleCategory = (categoryName) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((name) => name !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  const isSelected = (categoryName) =>
    selectedCategories.includes(categoryName);

  return (
    <div>
      <div className="w-[250px] h-[300px] bg-[#F6F6F6] rounded-t-3xl border-1 border-[#464646] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-2 border-b-1 border-[#464646]">
          <h2 className="text-[12px] font-sans leading-[16px] tracking-[-0.5px] font-semibold">
            Categories
          </h2>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full  "
          >
            <img src={ca} className="w-6 h-6 " />
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
                  transition-all duration-200 border-1 flex items-center
                  ${
                    isSelected(category.name)
                      ? "border-gray-800"
                      : "text-[#464646] border-[#E1E2E5]"
                  }`}
              >
                <span className="text-[12px] font-sans leading-[16px] font-semibold"
                style={{ color: category.colour }}>
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
  );
}
