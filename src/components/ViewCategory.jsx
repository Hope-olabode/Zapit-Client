import cc from "../assets/catcancle.svg";
import ca from "../assets/catadd.svg";
import { useContext } from "react";
import { Context } from "../context/Context";

export default function ViewCategory({
  viewOnlyCategory,
  setViewOnlyCategory,
}) {
  const { categories } = useContext(Context);

  console.log(viewOnlyCategory);
  const isSelected2 = (categoryName) =>
    viewOnlyCategory.categories.includes(categoryName);

  return (
    <div className="div">
      <div className="top-0 left-[16px] z-30 absolute">
        <div>
          <div className="w-[250px] h-[300px] bg-white rounded-3xl border-2 border-gray-800 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-2 border-b-2 border-gray-800">
              <h2 className="text-[12px] font-sans leading-[16px] font-semibold">
                Categories
              </h2>
              <button
                type="button"
                // onClick={() => setShowAddModal(true)}
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
                    // onClick={() => toggleCategory(category.name)}
                    className={`relative px-2 py-[5px] rounded-full h-[26px] text-base font-semibold
                                      transition-all duration-200 border-2 flex items-center
                                      ${
                                        isSelected2(category.name)
                                          ? "border-gray-800"
                                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                      }`}
                  >
                    <span className="text-[12px] font-sans leading-[16px] font-semibold"
                    style={{ color: category.colour }}>
                      {category.name}
                    </span>
                    {isSelected2(category.name) && (
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
      </div>
      <div
        onClick={() => setViewOnlyCategory(false)}
        className="fixed inset-0 bg-[#1B1D2280] flex flex-col z-10 h-screen"
      ></div>
    </div>
  );
}
