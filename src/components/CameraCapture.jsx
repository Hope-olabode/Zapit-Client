import { useRef, useState, useEffect } from "react";

export default function Camera() {
  const [cameraActive, setCameraActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imgFile, setImgFile] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 📸 Start Camera
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
        const file = new File([blob], "photo.png", { type: "image/png" });
        setPreview(URL.createObjectURL(blob));
        setImgFile(file);
      }
    }, "image/png");

    stopCamera();
  };

  // 🧹 Cleanup camera if user leaves while it's on
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {!cameraActive ? (
        <button
          onClick={startCamera}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Open Camera
        </button>
      ) : (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black z-50">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-full border border-gray-700"
            style={{ width: "296px", height: "296px", objectFit: "cover" }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />

          <div className="flex gap-4 mt-4">
            <button
              onClick={capturePhoto}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Captured"
            className="w-48 h-48 rounded-full object-cover"
          />
        </div>
      )}

      {/* <input
        type="file"
        accept="image/*"
        capture="environment" // or "user" for front camera
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const imageUrl = URL.createObjectURL(file);
            console.log("Captured image:", file);
            // You can display it:
            document.getElementById("preview").src = imageUrl;
          }
        }}
      />

      <img id="preview" alt="Preview" /> */}
    </div>
  );
}
