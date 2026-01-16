import React, { useState, useRef, useEffect, useContext } from "react";
import { Context } from "../context/Context";
import dropdown from "../assets/dropdown.svg";
import dline from "../assets/defaultline.svg";

const CustomLineChart = () => {
  const { isMobile, categories, issues, locations } = useContext(Context);
  const [location1, setLocation1] = useState("");
  const [hoverPoint, setHoverPoint] = useState(null);
  const svgRef = useRef(null);
  const [drop1, setDrop1] = useState(false);

  // Function to generate datasets from issues and categories
  const generateChartDatasets = (issues, categories, selectedCategory = "") => {
    if (!issues || !categories) return [];

    // Get the last 12 months
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      months.push(monthKey);
    }

    // Create a map of category names to category details
    const categoryMap = new Map();
    categories.forEach((cat) => {
      categoryMap.set(cat.name, {
        color: cat.colour,
        label: cat.name,
      });
    });

    // Initialize count object for each category
    const categoryCounts = new Map();

    // Process each issue
    issues.forEach((issue) => {
      const issueDate = new Date(issue.createdAt.$date || issue.createdAt);
      const monthKey = `${issueDate.getFullYear()}-${String(
        issueDate.getMonth() + 1
      ).padStart(2, "0")}`;

      // Count each category in this issue
      if (issue.categories && Array.isArray(issue.categories)) {
        issue.categories.forEach((categoryName) => {
          // Filter by selected category if one is chosen
          if (selectedCategory && categoryName !== selectedCategory) {
            return;
          }

          if (!categoryCounts.has(categoryName)) {
            categoryCounts.set(categoryName, new Map());
          }

          const categoryMonthCounts = categoryCounts.get(categoryName);
          categoryMonthCounts.set(
            monthKey,
            (categoryMonthCounts.get(monthKey) || 0) + 1
          );
        });
      }
    });

    // Build datasets array
    const datasets = [];

    categoryCounts.forEach((monthCounts, categoryName) => {
      const categoryInfo = categoryMap.get(categoryName);

      if (categoryInfo) {
        const data = months.map((month) => monthCounts.get(month) || 0);

        datasets.push({
          data: data,
          color: categoryInfo.color,
          label: categoryInfo.label,
        });
      }
    });

    return datasets;
  };

  // Generate datasets from actual data - pass location1 as selected category
  const datasets = generateChartDatasets(issues, categories, location1);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Chart dimensions
  const padding = {
    top: 60,
    right: isMobile ? 20 : 40,
    bottom: 20,
    left: isMobile ? 20 : 40,
  };
  const [chartWidth, setChartWidth] = useState(800);
  const [chartHeight, setChartHeight] = useState(400);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const { width } = svgRef.current.getBoundingClientRect();
        setChartWidth(width);
        setChartHeight(400); // Fixed at 400px for both mobile and desktop
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(handleResize, 100);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [datasets]);

  const width = chartWidth - padding.left - padding.right;
  const height = chartHeight - padding.top - padding.bottom;

  // Scale data
  const allData = datasets.flatMap((d) => d.data);
  const minValue = -60;
  const maxValue = Math.max(...allData, 10) + 10;

  const scaleX = (index) =>
    (width / (Math.max(datasets[0]?.data.length || 12, 1) - 1)) * index;
  const scaleY = (value) =>
    height - ((value - minValue) / (maxValue - minValue)) * height;

  // Generate smooth curved path using catmull-rom spline
  const generateSmoothPath = (data) => {
    if (data.length === 0) return "";

    const points = data.map((value, index) => ({
      x: scaleX(index),
      y: scaleY(value),
    }));

    if (points.length < 2) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const tension = 0.3;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
  };

  const handleMouseMove = (e) => {
    if (!svgRef.current || datasets.length === 0) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - padding.left;

    if (mouseX < 0 || mouseX > width) {
      setHoverPoint(null);
      return;
    }

    const index = Math.round((mouseX / width) * (datasets[0].data.length - 1));
    const clampedIndex = Math.max(
      0,
      Math.min(datasets[0].data.length - 1, index)
    );

    const x = scaleX(clampedIndex);

    const values = datasets.map((dataset) => ({
      value: dataset.data[clampedIndex],
      y: scaleY(dataset.data[clampedIndex]),
      color: dataset.color,
      label: dataset.label,
    }));

    setHoverPoint({
      x,
      values,
      month: months[clampedIndex],
    });
  };

  const handleMouseLeave = () => {
    setHoverPoint(null);
  };

  // Show message if no data
  if (!datasets || datasets.length === 0) {
    return (
      <div className="mb-10">
        <h2 className="font-benton-black text-[16px] leading-[150%] text-[#1B1D22] mb-1.5">
          Issue Trends
        </h2>
        <div className="relative bg-[#F6F7F9] border-2 border-black rounded-2xl p-8 text-center h-[400px]">
          <div className="div h-full flex flex-col justify-center items-center">
            <img src={dline} alt="" />
            <p className="font-benton-regular pt-3 text-[10px] leading-[150%]">
              There is currently no data to display.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 ">
      <h2 className=" font-benton-black text-[16px] leading-[150%] text-[#1B1D22] mb-1.5 lg:hidden">
        Issue Trends
      </h2>

      <div className="relative bg-[#F6F7F9] border-2 border-black rounded-2xl overflow-hidden h-[400px]">
        <div className=" relative  z-10">
          <div className="flex justify-between absolute top-[6px] px-1.5 w-full z-10">
            <h2 className=" font-benton-black text-[16px] leading-[150%] text-[#1B1D22] mb-1.5 hidden lg:block ">
              Issue Trends
            </h2>
            <div className="lg:gap-4 flex justify-between lg:justify-normal w-full lg:w-auto">
              <div className="flex gap-1 items-center border-2 border-[#464646] rounded-[72px] h-[26px] pl-[8px] pr-[7px] bg-[#F6F6F6]  cursor-pointer">
                <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px]">
                  All time
                </p>
                <img src={dropdown} alt="" />
              </div>
              <div
                onClick={() => setDrop1(true)}
                className="flex gap-1 items-center border-2 border-[#464646] rounded-[72px] h-[26px] pl-[8px] pr-[7px] bg-[#F6F6F6]  cursor-pointer"
              >
                <p className="text-[#464646] font-sans font-semibold text-[12px] leading-[16px]">
                  {location1 ? location1 : "All Categories"}
                </p>
                <img src={dropdown} alt="" />
              </div>
            </div>
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${
              drop1 ? "absolute" : "hidden"
            } top-[6px] right-[6px] rounded-2xl border-2 w-[200px] bg-[#F6F6F6] border-[#464646] h-[200px] z-30 overflow-y-scroll scrollbar-hide`}
          >
            {/* Add "All Categories" option */}
            <div
              onClick={() => {
                setLocation1("");
                setDrop1(false);
              }}
              className="px-2 h-8 flex items-center text-[#464646] font-semibold"
            >
              All Categories
            </div>
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => {
                  setLocation1(category.name);
                  setDrop1(false);
                }}
                className="px-2 h-8 flex items-center text-[#464646] border-t"
              >
                {category.name}
              </div>
            ))}
          </div>

          {/* Overlay click area */}
          <div
            onClick={() => setDrop1(false)}
            className={`${drop1 ? "fixed" : "hidden"}  inset-0 z-10`}
          ></div>

          <div className=" absolute bottom-[11px] px-[6px] w-full  h-10 ">
            <div className="h-full flex justify-between lg:gap-10 border-2 rounded-2xl overflow-hidden bg-[#F6F7F9]">
              <div className=" h-full w-full border-[#E8E9EB] flex justify-evenly relative">
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <p className="absolute top-[50%] translate-y-[-50%] hidden lg:block">
                  Jan
                </p>
              </div>
              <div className=" h-full w-full border-l border-[#E8E9EB] flex justify-evenly relative">
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <p className="absolute top-[50%] translate-y-[-50%] hidden lg:block">
                  Feb
                </p>
              </div>
              <div className=" h-full w-full border-l border-[#E8E9EB] flex justify-evenly relative">
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <p className=" absolute top-[50%] translate-y-[-50%]">Mar</p>
              </div>
              <div className=" h-full w-full border-l border-[#E8E9EB] flex justify-evenly relative">
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <p className="absolute top-[50%] translate-y-[-50%] hidden lg:block">
                  Apr
                </p>
              </div>
              <div className=" h-full w-full border-l border-[#E8E9EB] flex justify-evenly relative">
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <p className="absolute top-[50%] translate-y-[-50%] hidden lg:block">
                  May
                </p>
              </div>
              <div className=" h-full w-full border-l border-[#E8E9EB] flex justify-evenly relative">
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <p className=" absolute top-[50%] translate-y-[-50%]">Jun</p>
              </div>
              <div className=" h-full w-full border-l border-[#E8E9EB] flex justify-evenly relative">
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <p className="absolute top-[50%] translate-y-[-50%] hidden lg:block">
                  Jul
                </p>
              </div>
              <div className=" h-full w-full border-l border-[#E8E9EB] flex justify-evenly relative">
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <p className="absolute top-[50%] translate-y-[-50%] hidden lg:block">
                  Aug
                </p>
              </div>
              <div className=" h-full w-full border-l border-[#E8E9EB] flex justify-evenly relative">
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <p className=" absolute top-[50%] translate-y-[-50%]">Sep</p>
              </div>
              <div className=" h-full w-full border-l border-[#E8E9EB] flex justify-evenly relative">
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <p className="absolute top-[50%] translate-y-[-50%] hidden lg:block">
                  Oct
                </p>
              </div>
              <div className=" h-full w-full border-l border-[#E8E9EB] flex justify-evenly relative">
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <p className="absolute top-[50%] translate-y-[-50%] hidden lg:block">
                  Nov
                </p>
              </div>
              <div className=" h-full w-full border-l border-[#E8E9EB] flex justify-evenly relative">
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <div className="w-[1px] h-full bg-[#E8E9EB]"></div>
                <p className=" absolute top-[50%] translate-y-[-50%]">Dec</p>
              </div>
            </div>
          </div>

          {hoverPoint && (
            <div
              className="absolute pointer-events-none z-20"
              style={{
                left: `${hoverPoint.x + padding.left}px`,
                top: `${
                  Math.min(...hoverPoint.values.map((v) => v.y)) +
                  padding.top -
                  30 -
                  hoverPoint.values.length * 20
                }px`,
                transform: "translate(-50%, 0)",
              }}
            >
              <div className="bg-slate-800 rounded-lg px-4 py-2 opacity-95 min-w-max">
                <div className="text-xs text-white font-semibold text-center mb-2">
                  {hoverPoint.month}
                </div>
                {hoverPoint.values.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: val.color }}
                    />
                    <span className="text-xs text-white whitespace-nowrap">
                      {val.label}: {val.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <svg
            ref={svgRef}
            width="100%"
            height={chartHeight}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="cursor-crosshair"
            style={{ overflow: "visible" }}
          >
            <g transform={`translate(${padding.left}, ${padding.top})`}>
              {datasets.map((dataset, idx) => (
                <path
                  key={idx}
                  d={generateSmoothPath(dataset.data)}
                  fill="none"
                  stroke={dataset.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {hoverPoint && (
                <>
                  <line
                    x1={hoverPoint.x}
                    y1={Math.max(...hoverPoint.values.map((v) => v.y))}
                    x2={hoverPoint.x}
                    y2={height + 80} // Extend the line 50px beyond the chart height
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />

                  {hoverPoint.values.map((val, idx) => (
                    <circle
                      key={idx}
                      cx={hoverPoint.x}
                      cy={val.y}
                      r="6"
                      fill="white"
                      stroke={val.color}
                      strokeWidth="3"
                    />
                  ))}
                </>
              )}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CustomLineChart;
