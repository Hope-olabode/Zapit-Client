import { useState, useRef, useEffect } from "react";
import { Context } from "./Context";
import api from "../api/axios";
import { toast, Toaster } from "sonner";

export const Provider = ({ children }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [previews, setPreviews] = useState([]); // store multiple images
  const [imgFiles, setImgFiles] = useState([]);

  const [update, setUpdate] = useState(false);
  const [previews2, setPreviews2] = useState([]); // store multiple images
  const [imgFiles2, setImgFiles2] = useState([]);

  const [share, setShare] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [allSurveys, setAllSurveys] = useState([]);

  const [display, setDisplay] = useState(false);
  const [display2, setDisplay2] = useState(false);
  const [display3, setDisplay3] = useState(false);
  const [display4, setDisplay4] = useState(false);

  const [location, setLocation] = useState(() => {
    const saved = sessionStorage.getItem("Location");
    return saved ? JSON.parse(saved) : null; // load from storage if exists
  });

  const [category, setCategory] = useState(false);

  const [viewCategory, setViewCategory] = useState(false);

  const [desktop, setDesktop] = useState(false);
  const [desktop2, setDesktop2] = useState(false);
  const [desktop3, setDesktop3] = useState(false);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(() => {
    const saved = sessionStorage.getItem("selectedSurvey");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [survey, setSurvey] = useState(false);

  const [hold2, setHold2] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [hold, setHold] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState(false);

  const [issues, setIssues] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [logs, setLogs] = useState(true);
  const [sla, setSla] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  console.log(imgFiles2);

  // 📸 Start Camera
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera Access Error:", err);
      alert("Failed to access the camera. Please check your permissions.");
    }
  };

  // 🛑 Stop Camera
  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
    setCameraActive(false);
    setUpdate(false);
  };

  // 🖼️ Capture Photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo-${previews.length + 1}.png`, {
          type: "image/png",
        });
        const newPreview = URL.createObjectURL(blob);
        setPreviews((prev) => [...prev, newPreview]);
        setImgFiles((prev) => [...prev, file]);

        if (isMobile) {
          setHold(true);
        } else {
          setHold2(true);
          setSelectedIssue(false);
        }
      }
    }, "image/png");
    console.log(imgFiles);
    console.log(previews);
    stopCamera();
  };

  const capturePhoto2 = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      // 📸 Create a new File object and preview URL
      const file = new File([blob], `photo-${Date.now()}.png`, {
        type: "image/png",
      });
      const newPreview = URL.createObjectURL(blob);

      // ✅ Append new file to existing captured files
      setImgFiles2((prev) => [...prev, file]);

      // ✅ Add to selectedIssue images for UI display
      setSelectedIssue((prev) => ({
        ...prev,
        images: [...(prev?.images || []), { url: newPreview, file }],
      }));
    }, "image/png");

    // 🛑 Stop camera after capture
    stopCamera();
  };

  console.log(imgFiles2);

  // 🧹 Cleanup camera if user leaves while it's on
  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (!isLogin) return;

    const fetchDashboardData = async () => {
      try {
        const [locationsRes, categoriesRes, issuesRes, surveysRes, slaRes] =
          await Promise.all([
            api.get("/locations"),
            api.get("/categories"),
            api.get("/issues"),
            api.get("/surveys"),
            api.get("/sla"),
          ]);

        setCategories(categoriesRes.data);
        setIssues(issuesRes.data.issues || []);
        setSla(slaRes.data?.sla);
        setLocations(locationsRes.data);
        setAllSurveys(surveysRes.data);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("You must be logged in");
        } else {
          toast.error("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isLogin]);

  console.log(allSurveys);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        setLoading(true);
        await api.get("/auth/is-logged-in");
        setIsLogin(true);
      } catch {
        setIsLogin(false);
        setLoading(false);
      } finally {
        setLoading(false); // ✅ always runs
      }
    };

    checkLogin();
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

    // Run once to ensure correct width on mount
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchSla = async () => {
      try {
        const res = await api.get("/sla");
        if (res.data?.sla !== undefined) {
          setSla(res.data.sla);
        }
      } catch (error) {
        console.error("Error fetching SLA:", error);
      }
    };

    fetchSla();
  }, []);

  return (
    <Context.Provider
      value={{
        cameraActive,
        setCameraActive,
        startCamera,
        stopCamera,
        videoRef,
        canvasRef,
        capturePhoto,
        previews,
        setPreviews,
        imgFiles,
        setImgFiles,
        locations,
        setLocations,
        loading,
        setLoading,
        categories,
        setCategories,
        showAddModal,
        setShowAddModal,
        selectedCategories,
        setSelectedCategories,
        hold,
        setHold,
        issues,
        setIssues,
        capturePhoto2,
        previews2,
        setPreviews2,
        imgFiles2,
        setImgFiles2,
        update,
        setUpdate,
        selectedIssue,
        setSelectedIssue,
        survey,
        setSurvey,
        allSurveys,
        setAllSurveys,
        selectedSurvey,
        setSelectedSurvey,
        overlay,
        setOverlay,
        logs,
        setLogs,
        filteredSurveys,
        setFilteredSurveys,
        desktop,
        setDesktop,
        desktop2,
        setDesktop2,
        desktop3,
        setDesktop3,
        display,
        setDisplay,
        location,
        setLocation,
        isMobile,
        setIsMobile,
        hold2,
        setHold2,
        category,
        setCategory,
        viewCategory,
        setViewCategory,
        display2,
        setDisplay2,
        display3,
        setDisplay3,
        searchValue,
        setSearchValue,
        display4,
        setDisplay4,
        share,
        setShare,
        search,
        setSearch,
        sla,
        setSla,
      }}
    >
      <Toaster position="top-center" richColors />
      {children}
    </Context.Provider>
  );
};
