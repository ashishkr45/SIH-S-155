import React, { useState, useEffect, useMemo, useRef } from "react";
import * as faceapi from "face-api.js";
import { Search, Plus, Clock, Users, Calendar, MapPin, User, X, Camera, CheckCircle } from "lucide-react";

const TeacherDashboard = () => {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [todaysClasses, setTodaysClasses] = useState([]);
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // Face recognition states
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [attendanceResults, setAttendanceResults] = useState([]);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceApiIntervalRef = useRef(null);

  // Form states
  const [newClass, setNewClass] = useState({
    name: "",
    time: "",
    location: "",
    date: "",
    duration: "90",
    type: "lecture",
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  /*** LOAD FACE-API MODELS ***/
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        // await Promise.all([
        //   faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        //   faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        //   faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        //   faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        // ]);

        setFaceApiLoaded(true);
        console.log("Skipping actual model load, using mock descriptors");
        // setFaceApiLoaded(true);
        // console.log("Face-api models loaded successfully");
      } catch (error) {
        console.error("Error loading face-api models:", error);
      }
    };
    loadModels();
  }, []);

  /*** MOCK DATA FETCHING ***/
  useEffect(() => {
    const fetchTeacherData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockTeacherInfo = {
        name: "Dr. Sarah Verma",
        department: "Computer Science",
        employeeId: "EMP001",
      };

      const mockStudentList = [
        {
          id: "CS001",
          name: "Priya Sharma",
          department: "Computer Science",
          year: "3rd Year",
          attendance: "92%",
          email: "priya.sharma@example.com",
          phone: "+91 9876543210",
          enrollmentDate: "2022-08-15",
          gpa: "8.7",
          totalClasses: 45,
          presentClasses: 41,
          absentClasses: 4,
          recentActivity: [{ date: "2025-09-25", class: "Data Structures", status: "present" }],
        },
        {
          id: "CS002",
          name: "Rohan Mehra",
          department: "Computer Science",
          year: "3rd Year",
          attendance: "88%",
          email: "rohan.mehra@example.com",
          phone: "+91 9876543211",
          enrollmentDate: "2022-08-15",
          gpa: "8.2",
          totalClasses: 45,
          presentClasses: 40,
          absentClasses: 5,
          recentActivity: [{ date: "2025-09-25", class: "Data Structures", status: "present" }],
        },
        {
          id: "CS003",
          name: "Anjali Singh",
          department: "Computer Science",
          year: "2nd Year",
          attendance: "95%",
          email: "anjali.singh@example.com",
          phone: "+91 9876543212",
          enrollmentDate: "2023-08-15",
          gpa: "9.1",
          totalClasses: 38,
          presentClasses: 36,
          absentClasses: 2,
          recentActivity: [{ date: "2025-09-25", class: "Data Structures", status: "absent" }],
        },
      ];

      const mockTodaysClasses = [
        { id: 1, name: "Data Structures", time: "09:00", location: "Room 301", status: "completed", students: 28 },
        { id: 2, name: "Web Development Lab", time: "11:00", location: "Lab 5B", status: "active", students: 24 },
        { id: 3, name: "AI Fundamentals", time: "14:00", location: "Hall A", status: "upcoming", students: 32 },
      ];

      const mockScheduledClasses = [
        { id: 4, name: "Database Management", date: "2025-09-26", time: "10:00", location: "Room 205", students: 30 },
        { id: 5, name: "Software Engineering", date: "2025-09-27", time: "13:00", location: "Room 301", students: 25 },
      ];

      setTeacherInfo(mockTeacherInfo);
      setStudents(mockStudentList);
      setTodaysClasses(mockTodaysClasses);
      setScheduledClasses(mockScheduledClasses);
      setLoading(false);
    };

    fetchTeacherData();
  }, []);

  /*** MOCK LABELED FACE DESCRIPTORS ***/
  useEffect(() => {
    const getLabeledFaceDescriptors = async () => {
      if (!students.length) return;
      const descriptors = students.map((student) => {
        const mockDescriptor = new Float32Array(128).fill(Math.random());
        return new faceapi.LabeledFaceDescriptors(student.name, [mockDescriptor]);
      });
      setLabeledFaceDescriptors(descriptors);
    };
    getLabeledFaceDescriptors();
  }, [students]);

  /*** FILTERED STUDENTS ***/
  const filteredStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.id.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [students, searchTerm]
  );

  /*** MODAL FUNCTIONS ***/
  const openModal = (type, data = null) => {
    setModalType(type);
    if (type === "student") setSelectedStudent(data);
    else if (type === "attendance") {
      setSelectedClass(data);
      setAttendanceResults([]);
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    if (isScanning) stopFaceRecognition();
    setIsModalOpen(false);
    setSelectedClass(null);
    setSelectedStudent(null);
  };

  /*** CREATE CLASS ***/
  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClass.name.trim()) return;
    const newId = todaysClasses.length + scheduledClasses.length + 1;
    const isToday = newClass.date === new Date().toISOString().split("T")[0];
    const classData = {
      id: newId,
      name: newClass.name,
      time: newClass.time,
      location: newClass.location,
      date: newClass.date,
      status: "upcoming",
      students: Math.floor(Math.random() * 15) + 20,
    };

    if (isToday) {
      setTodaysClasses([...todaysClasses, classData].sort((a, b) => a.time.localeCompare(b.time)));
    } else {
      setScheduledClasses([...scheduledClasses, classData].sort((a, b) => new Date(a.date) - new Date(b.date)));
    }

    setNewClass({ name: "", time: "", location: "", date: "", duration: "90", type: "lecture" });
    setIsModalOpen(false);
  };

  /*** FACE RECOGNITION FUNCTIONS ***/
  const startFaceRecognition = async () => {
    if (!faceApiLoaded || !labeledFaceDescriptors) {
      alert("Face recognition models not loaded yet.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsScanning(true);
    } catch (err) {
      console.error("Webcam error:", err);
      alert("Unable to access webcam. Check permissions.");
      setIsScanning(false);
    }
  };

  const handleVideoPlay = () => {
    if (!labeledFaceDescriptors || !videoRef.current) return;
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    if (faceApiIntervalRef.current) clearInterval(faceApiIntervalRef.current);

    faceApiIntervalRef.current = setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (!canvasRef.current) return;

      canvasRef.current.innerHTML = "";
      const canvas = faceapi.createCanvasFromMedia(videoRef.current);
      canvasRef.current.appendChild(canvas);

      const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
      faceapi.matchDimensions(canvas, displaySize);

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      faceapi.draw.drawDetections(canvas, resizedDetections);

      resizedDetections.forEach((detection) => {
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
        if (bestMatch.label !== "unknown" && !attendanceResults.some((s) => s.name === bestMatch.label)) {
          const student = students.find((s) => s.name === bestMatch.label);
          setAttendanceResults((prev) => [
            ...prev,
            { ...student, timestamp: new Date().toLocaleTimeString(), confidence: 1 - bestMatch.distance },
          ]);
        }
      });
    }, 3000);
  };

  const stopFaceRecognition = () => {
    clearInterval(faceApiIntervalRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsScanning(false);
  };

  const saveAttendance = () => {
    console.log("Saving Attendance:", attendanceResults);
    alert(`Attendance for ${attendanceResults.length} students saved.`);
    closeModal();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-gray-500 bg-gray-100";
      case "active":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "upcoming":
        return "text-amber-600 bg-amber-50 border-amber-200";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /*** JSX STARTS HERE ***/
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
            <div>
              <h1 className="text-2xl font-medium text-gray-900 mb-2">Welcome back, {teacherInfo?.name}</h1>
              <p className="text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" />
                {teacherInfo?.department} Department
              </p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => openModal("schedule")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Calendar className="w-4 h-4" /> Schedule Class
              </button>
              <button
                onClick={() => openModal("create")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" /> Create Session
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Today's Classes */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Today's Classes</h2>
              <div className="space-y-3">
                {todaysClasses.length > 0 ? (
                  todaysClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className={`bg-white rounded-lg border p-5 transition-all hover:shadow-sm ${
                        cls.status === "active" ? "ring-1 ring-blue-200 shadow-sm" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{cls.name}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(cls.status)}`}
                        >
                          {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {cls.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {cls.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {cls.students}
                        </div>
                      </div>
                      {cls.status !== "completed" && (
                        <button
                          onClick={() => openModal("attendance", cls)}
                          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 py-2 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                          {cls.status === "active" ? "Manage Attendance" : "Start Session"}
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg border p-8 text-center">
                    <p className="text-gray-500">No classes for today.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Student Roster */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Student Roster</h2>
                <span className="text-sm text-gray-500">{students.length} students</span>
              </div>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
              <div className="bg-white rounded-lg border divide-y divide-gray-100 max-h-[28rem] overflow-y-auto">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{student.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{student.id}</span>•<span>{student.year}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => openModal("student", student)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {modalType === "create" && "Create New Session"}
                {modalType === "schedule" && "Schedule Class"}
                {modalType === "student" && "Student Details"}
                {modalType === "attendance" && `Facial Recognition: ${selectedClass?.name}`}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {modalType === "create" && (
                <form onSubmit={handleCreateClass} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Class Name"
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    className="w-full border rounded-md p-2"
                  />
                  <input
                    type="time"
                    placeholder="Time"
                    value={newClass.time}
                    onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                    className="w-full border rounded-md p-2"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={newClass.location}
                    onChange={(e) => setNewClass({ ...newClass, location: e.target.value })}
                    className="w-full border rounded-md p-2"
                  />
                  <input
                    type="date"
                    placeholder="Date"
                    value={newClass.date}
                    onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
                    className="w-full border rounded-md p-2"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                  >
                    Create
                  </button>
                </form>
              )}

              {modalType === "student" && selectedStudent && (
                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-medium">Name:</span> {selectedStudent.name}
                  </p>
                  <p>
                    <span className="font-medium">ID:</span> {selectedStudent.id}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {selectedStudent.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {selectedStudent.phone}
                  </p>
                  <p>
                    <span className="font-medium">Attendance:</span> {selectedStudent.attendance}
                  </p>
                  <p>
                    <span className="font-medium">GPA:</span> {selectedStudent.gpa}
                  </p>
                </div>
              )}

              {modalType === "attendance" && (
                <div className="flex flex-col gap-4">
                  {!isScanning && (
                    <button
                      onClick={startFaceRecognition}
                      className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                      Start Facial Recognition
                    </button>
                  )}

                  {isScanning && (
                    <>
                      <div className="relative w-full h-80 bg-gray-200 rounded-md overflow-hidden">
                        <video
                          ref={videoRef}
                          className={`w-full h-full object-cover`}
                          autoPlay
                          muted
                          onPlay={handleVideoPlay}
                        />
                        <div
                          ref={canvasRef}
                          className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        />
                      </div>
                      <div className="flex justify-between mt-3">
                        <button
                          onClick={stopFaceRecognition}
                          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                        >
                          Stop
                        </button>
                        <button
                          onClick={saveAttendance}
                          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                        >
                          Save Attendance
                        </button>
                      </div>
                      <div className="mt-4 max-h-40 overflow-y-auto">
                        <h3 className="font-medium text-gray-900 mb-2">Detected Students:</h3>
                        {attendanceResults.map((res) => (
                          <div key={res.id} className="flex items-center justify-between text-gray-700 mb-1">
                            <span>{res.name}</span>
                            <span className="text-sm text-gray-500">{res.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherDashboard;
