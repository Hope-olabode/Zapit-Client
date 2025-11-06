import React, { useContext } from "react";
import { Context } from "../context/Context";
import cc from "../assets/catcancle.svg";
import ca from "../assets/catadd.svg";

export default function CategorySelector() {
  const {
    categories,
    setCategories,
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
