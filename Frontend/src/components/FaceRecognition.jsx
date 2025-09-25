import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import api from "../api";

const FaceRecognition = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [status, setStatus] = useState("");

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");

        setModelsLoaded(true);
        startVideo();
      } catch (err) {
        console.error("Error loading models:", err);
      }
    };

    loadModels();
  }, []);

  // Start webcam
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Webcam error:", err));
  };

  // Detect faces continuously
  useEffect(() => {
    if (!modelsLoaded) return;

    const detectFaces = async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
        faceapi.matchDimensions(canvasRef.current, {
          width: videoRef.current.width,
          height: videoRef.current.height,
        });

        const resized = faceapi.resizeResults(detections, {
          width: videoRef.current.width,
          height: videoRef.current.height,
        });

        faceapi.draw.drawDetections(canvasRef.current, resized);
      }

      // ✅ Example: If a face is detected, mark attendance
      if (detections.length > 0) {
        // For now, assume logged-in user is the student
        // In real case, compare with stored faceDescriptor in DB
        await markAttendance("STUDENT_OBJECT_ID_HERE");
      }
    };

    const interval = setInterval(detectFaces, 3000); // check every 3 seconds
    return () => clearInterval(interval);
  }, [modelsLoaded]);

  // Call backend API
  const markAttendance = async (studentId) => {
    try {
      const res = await api.post("/attendance/mark", { studentId });
      setStatus(res.data.message);
    } catch (err) {
      console.error(err);
      setStatus("Error marking attendance");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Face Recognition Attendance</h2>
      <video ref={videoRef} autoPlay muted width="640" height="480" className="rounded shadow" />
      <canvas ref={canvasRef} className="absolute" />
      <p className="mt-4 text-green-600">{status}</p>
    </div>
  );
};

export default FaceRecognition;
