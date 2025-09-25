import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/signup/:role" element={<Signup />} />

        <Route path="/student-dashboard" element={<StudentDashboard/>} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      </Routes>
    </>
  );
}

export default App;
