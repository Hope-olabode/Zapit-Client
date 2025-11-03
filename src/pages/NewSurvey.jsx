import CategoryCarousel from "./CategorySection";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import cancle2 from "../assets/cancle2.svg";
import save from "../assets/save.svg";
import dropdown from "../assets/dropdown2.svg";
import location3 from "../assets/location3.svg";
import Locations from "../components/Locations";
import Plus from "../assets/add.svg";
import edit from "../assets/edit.svg";
import share from "../assets/share2.png";
import dele from "../assets/delete2.svg";
import add from "../assets/addCategories.svg";
import { useNavigate } from "react-router-dom";
import clock from "../assets/clock.svg";
import { Context } from "../context/Context";
import CcInput from "./cc";
import ExpandingInput from "../components/ExpandingInput";
import api from "../api/axios";
import { toast, Toaster } from "sonner";


export default function NewSurvey() {
  const navigate = useNavigate();
  const [selectLocation, setSelectLocation] = useState(false);

  
  const [_formattedDateTime, setFormattedDateTime] = useState(
    getFormattedDateTime()
  );
  // const [title, setTitle] = useState("New Survey");
  const [editTitle, setEditTitle] = useState(false);

  const [open, setOpen] = useState(false);

  const [surveyData, setSurveyData] = useState(() => {
    const saved = sessionStorage.getItem("selectedSurvey");
    if (saved) return JSON.parse(saved);
    return {
      title: "New Survey",
      locationName: "",
      date: getFormattedDateTime(),
      ccList: [],
      categories: [],
      by: "",
    };
  });

  

  const { register, control, getValues, handleSubmit, setValue } =
    useForm({
      defaultValues: {
        title: surveyData?.title ?? "",
        ccList: surveyData?.ccList || [],
        by: surveyData?.by ?? "",
        categories:
          surveyData?.categories.length === 0
            ? [
                {
                  id: 1,
                  title: "Category 1",
                  score: null,
                  questions: [{ id: 1, text: "Question 1", answer: null }],
                  remark: "",
                },
              ]
            : surveyData?.categories,
      },
    });

  const carouselRef = useRef(null);

  const handleAddCategory = () => {
    // call child function
    carouselRef.current?.addCategory();
  };

  function getFormattedDateTime() {
    const now = new Date();

    // Format time (HH:MM)
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;

    // Get date parts
    const day = now.getDate();
    const monthNames = [
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
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear().toString().slice(-2); // last two digits of year

    // Add ordinal suffix (st, nd, rd, th)
    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const dayWithSuffix = `${day}${getOrdinal(day)}`;

    // Combine
    return `${time} • ${dayWithSuffix} ${month}, ${year}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newDateTime = getFormattedDateTime();

      // ✅ Also update surveyData.date
      setSurveyData((prev) => ({
        ...prev,
        date: newDateTime,
      }));
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedDateTime(getFormattedDateTime());
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, []);

  

  const onSubmit = async (data) => {
  const surveyPayload = {
    title: data.title,
    locationName: surveyData.locationName,
    date: surveyData.date,
    ccList: data.ccList,
    categories: data.categories,
    by: data.by,
  };

  console.log("📤 Sending survey data:", surveyPayload);

  try {
    // ✅ Send request to backend
    const response = await api.post("/surveys", surveyPayload);
    console.log("✅ Server Response:", response.data);

    // ✅ Show success
    toast.success("Survey created successfully!");

    // ✅ Optional: clear saved survey and navigate/refresh
    sessionStorage.removeItem("selectedSurvey");

    // If you have navigate set up:
     navigate("/surveys"); // e.g., redirect to survey list

    // Optional refresh:
    window.location.reload();
  } catch (error) {
    console.error("❌ Error submitting survey:", error);
    toast.error(error.response?.data?.message || "Failed to submit survey");
  }
};

  const onError = (formErrors) => {
    Object.values(formErrors).forEach((err) => {
      toast.error(err.message);
    });
  };

  const spanRef = useRef(null);
  const [_inputWidth, setInputWidth] = useState(60); // initial width

  useEffect(() => {
    if (spanRef.current) {
      const newWidth = spanRef.current.offsetWidth + 20; // + padding
      setInputWidth(newWidth < 60 ? 60 : newWidth); // minimum width
    }
  }, [surveyData.by]);

  return (
    <div className="bg-[#E8E9EB] min-h-screen relative pt-4">
      <Toaster position="top-center" richColors />
      <div
        className="z-[1] w-full absolute top-0 h-[50%]
        bg-[length:23px_23px] 
        bg-[repeating-linear-gradient(0deg,#FFFFFF70_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#FFFFFF70_0_1px,transparent_1px_23px)]
        [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]
        [mask-repeat:no-repeat] [mask-size:100%_100%]"
      ></div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className=" relative w-full z-10 ">
          <div className="px-4 flex flex-row justify-between items-center  w-full py-4 h-[48px] mb-2">
            <button
                          type="button"
                          onClick={() => {
                            navigate(-1);
                            sessionStorage.removeItem("selectedSurvey");
                          }}
                        >
                          <img src={cancle2} alt="" />
                        </button>
            <button onClick={handleSubmit}>
              <img src={save} alt="" />
            </button>
          </div>
          <div className="px-4">
            <div
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-1 relative w-fit"
            >
              {editTitle ? (
                <input
                  type="text"
                  {...register("title", { required: true })}
                  onBlur={(e) => {
                    setEditTitle(false);
                    // ensure form value is synced — optional safeguard
                    setValue("title", e.target.value);
                  }}
                  autoFocus
                  className="font-benton-black text-[32px] leading-[130%] focus:outline-none bg-transparent border-b border-gray-400 tracking-[-0.5px] max-w-full"
                  style={{
                    width: `${Math.max(
                      (getValues("title")?.length || 10) * 20,
                      200
                    )}px`,
                  }}
                />
              ) : (
                <h1
                  className={`${
                    getValues("title") === "New Survey"
                      ? "text-[#CED0D5]"
                      : "text-[#1B1D22]"
                  } font-benton-black text-[32px] leading-[130%] tracking-[-0.5px]`}
                >
                  {getValues("title")}
                </h1>
              )}
              <img src={dropdown} alt="" className="flex-shrink-0" />
              {open && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full left-[160px]"
                >
                  <div className="mt-2 w-[200px] absolute bg-white rounded-[16px] border-2 border-gray-800 shadow-lg overflow-hidden z-50">
                    <div
                      onClick={() => {
                        setEditTitle(true);
                        setOpen(false);
                      }}
                      className="p-3 flex items-center justify-between"
                    >
                      <p className="font-sans text-[14px] text-[#464646] leading-[16px] tracking-[-0.5px]">
                        Edit Name
                      </p>
                      <img src={edit} alt="" />
                    </div>

                    <div className="p-3 border-t-black border-t flex items-center justify-between">
                      <p className="font-sans text-[14px] text-[#464646] leading-[16px] tracking-[-0.5px]">
                        Share
                      </p>
                      <img src={share} alt="" />
                    </div>

                    <div className="p-3 border-t-black border-t flex items-center justify-between">
                      <p className="font-sans text-[14px] text-[#D60000] leading-[16px] tracking-[-0.5px]">
                        Delete
                      </p>
                      <img src={dele} alt="" />
                    </div>
                  </div>
                  <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-[#00000000]"
                  ></div>
                </div>
              )}
            </div>
            <div className="mt-4 ">
              <div className="flex justify-between items-center w-full">
                <div
                  onClick={() => {
                    setSelectLocation(true);
                  }}
                  className="h-[26px] border border-black flex items-center gap-[6px] rounded-[8px] px-2.5 bg-[#E1E2E5]"
                >
                  <img src={location3} alt="" />
                  <p className="font-benton-bold text-[10px] leading-[150%]">
                    {surveyData.locationName === ""
                      ? "Enter Location"
                      : surveyData.locationName}
                  </p>
                </div>
                <div className="h-[26px] border border-black flex items-center gap-[6px] rounded-[8px] px-2.5 bg-[#E1E2E5]">
                  <img src={clock} alt="" />
                  <p className="font-benton-bold text-[10px] leading-[150%]">
                    {surveyData.date}
                  </p>
                </div>
              </div>
              <ExpandingInput
                register={register}
                name="by"
                defaultValue={surveyData.by}
              />

              <CcInput control={control} name="ccList" />
            </div>
          </div>
          {selectLocation && (
            <Locations
              setLocationName={(name) =>
                setSurveyData((prev) => ({ ...prev, locationName: name }))
              }
              setSelectLocation={setSelectLocation}
            />
          )}

          <CategoryCarousel ref={carouselRef} control={control} />
        </div>

        <div className="absolute bottom-[40px] left-[50%] translate-x-[-50%]">
          <button
            type="submit"
            onClick={() => handleAddCategory()}
            className=" h-[72px] w-[72px] bg-[#4ECDC4] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px]  active:translate-x-[5px] font-benton-black text-[21px] leading-[150%] rounded-[12px] transform flex items-center justify-center transition-all duration-150"
          >
            <img src={add} alt="" />
          </button>
        </div>
      </form>
    </div>
  );
}
