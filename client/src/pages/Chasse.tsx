import { useEffect, useRef, useState } from "react";
import "./Chasse.css";

export default function Chasse() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Erreur d'accès à la caméra :", error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        for (const track of stream.getTracks()) {
          track.stop();
        }
      }
    };
  }, []);

  const savePhotoLocally = (photoData: string) => {
    const existingPhotos = JSON.parse(
      localStorage.getItem("userPhotos") || "[]",
    );
    existingPhotos.push({
      photo: photoData,
      date: new Date().toISOString(),
      user: "user_3", // Remplace par l'utilisateur connecté plus tard
    });
    localStorage.setItem("userPhotos", JSON.stringify(existingPhotos));
  };

  const capturePhoto = (): void => {
    if (!videoRef.current || !canvasRef.current) return;

    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    if (width === 0 || height === 0) return;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      const imageData = canvasRef.current.toDataURL("image/png");
      setPhoto(imageData);
      savePhotoLocally(imageData);
    }
  };

  return (
    <div className="chasse-page">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        tabIndex={-1}
        className="video-preview"
      >
        <track kind="captions" />
      </video>

      <button type="button" onClick={capturePhoto} className="capture-button">
        Prendre une photo
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {photo && (
        <div className="photo-preview">
          <img src={photo} alt="oeuvre capturée" className="captured-image" />
        </div>
      )}
    </div>
  );
}
