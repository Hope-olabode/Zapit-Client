import { useState, useRef, useEffect } from "react";
import { Context } from "./Context";
import api from "../api/axios";
import { toast, Toaster } from "sonner";
import { set } from "react-hook-form";

export const Provider = ({ children }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [previews, setPreviews] = useState([]); // store multiple images
  const [imgFiles, setImgFiles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([])
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [hold, setHold] = useState(false);
  const [issues, setIssues] = useState([])

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
        const file = new File([blob], `photo-${previews.length + 1}.png`, { type: "image/png" });
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
        console.log(data)
        console.log(categories)
      } catch (error) {
        console.error("Error fetching categories:", error);
        if (error.response?.status === 401) {
          toast.error("You must be logged in to view categories");
        } else {
          toast.error("Failed to fetch categories");
        }
      } finally {
        setLoading(false);
        console.log(categories)
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
        setIssues
      }}
    >
      <Toaster position="top-right" richColors />
      {children}
    </Context.Provider>
  );
};
