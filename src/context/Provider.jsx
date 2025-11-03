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

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [allSurveys, setAllSurveys] = useState([]);

  const [selectedSurvey, setSelectedSurvey] = useState(() => {
  const saved = sessionStorage.getItem("selectedSurvey");
  return saved ? JSON.parse(saved) : null;
});

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [survey, setSurvey] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [hold, setHold] = useState(false);
  const [issues, setIssues] = useState([]);
  const [overlay, setOverlay] = useState(false)

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
        setHold(true);
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
    const fetchLocations = async () => {
      try {
        const { data } = await api.get("/locations");
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        if (error.response?.status === 401) {
          toast.error("You must be logged in to view locations");
        } else {
          toast.error("Failed to fetch locations");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
        console.log(data);
        console.log(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        if (error.response?.status === 401) {
          toast.error("You must be logged in to view categories");
        } else {
          toast.error("Failed to fetch categories");
        }
      } finally {
        setLoading(false);
        console.log(categories);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data } = await api.get("/issues");
        setIssues(data.issues || []);
        console.log("Fetched Issues from API:", data);
      } catch (error) {
        console.error("Error fetching Issues:", error);
        if (error.response?.status === 401) {
          toast.error("You must be logged in to view issues");
        } else {
          toast.error("Failed to fetch issues");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  useEffect(() => {
    const getAllSurveys = async () => {
      try {
        const response = await api.get("/surveys"); // matches app.use("/api/surveys", surveyRoutes)
        setAllSurveys(response.data);
        console.log(allSurveys)
      } catch (error) {
        console.error("❌ Error fetching surveys:", error);
        toast.error(error.response?.data?.message || "Failed to fetch surveys");
      }
    };

    getAllSurveys();
  }, []); // ✅ important: add [] to prevent infinite requests
console.log(allSurveys)
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
        setOverlay
      }}
    >
      <Toaster position="top-right" richColors />
      {children}
    </Context.Provider>
  );
};
