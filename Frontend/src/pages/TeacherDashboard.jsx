import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, Clock, Users, Calendar, MapPin, User, X, ChevronRight } from "lucide-react";

const TeacherDashboard = () => {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [todaysClasses, setTodaysClasses] = useState([]);
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'schedule', or 'student'
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Form states
  const [newClass, setNewClass] = useState({
    name: "",
    time: "",
    location: "",
    date: "",
    duration: "90",
    type: "lecture"
  });
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTeacherData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockTeacherInfo = {
        name: "Dr. Sarah Verma",
        department: "Computer Science",
        employeeId: "EMP001"
      };

      const mockStudentList = [
        { id: "CS001", name: "Priya Sharma", department: "Computer Science", year: "3rd Year", attendance: "92%" },
        { id: "CS002", name: "Rohan Mehra", department: "Computer Science", year: "3rd Year", attendance: "88%" },
        { id: "CS003", name: "Anjali Singh", department: "Computer Science", year: "2nd Year", attendance: "95%" },
        { id: "CS004", name: "Vikram Rathod", department: "Computer Science", year: "3rd Year", attendance: "76%" },
        { id: "CS005", name: "Sneha Reddy", department: "Computer Science", year: "2nd Year", attendance: "91%" },
        { id: "CS006", name: "Amit Kumar", department: "Computer Science", year: "3rd Year", attendance: "84%" }
      ];
      
      const mockTodaysClasses = [
        { id: 1, name: "Data Structures", time: "09:00", location: "Room 301", status: "completed", students: 28 },
        { id: 2, name: "Web Development Lab", time: "11:00", location: "Lab 5B", status: "active", students: 24 },
        { id: 3, name: "AI Fundamentals", time: "14:00", location: "Hall A", status: "upcoming", students: 32 }
      ];

      const mockScheduledClasses = [
        { id: 4, name: "Database Management", date: "2025-09-26", time: "10:00", location: "Room 205", students: 30 },
        { id: 5, name: "Software Engineering", date: "2025-09-27", time: "13:00", location: "Room 301", students: 25 },
        { id: 6, name: "Computer Networks", date: "2025-09-28", time: "09:00", location: "Lab 3A", students: 28 }
      ];

      setTeacherInfo(mockTeacherInfo);
      setStudents(mockStudentList);
      setTodaysClasses(mockTodaysClasses);
      setScheduledClasses(mockScheduledClasses);
      setLoading(false);
    };

    fetchTeacherData();
  }, []);

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClass.name.trim()) return;

    const newId = todaysClasses.length + scheduledClasses.length + 1;
    const isToday = newClass.date === new Date().toISOString().split('T')[0];
    
    const classData = {
      id: newId,
      name: newClass.name,
      time: newClass.time,
      location: newClass.location,
      date: newClass.date,
      status: "upcoming",
      students: Math.floor(Math.random() * 15) + 20 // Mock student count
    };

    if (isToday) {
      setTodaysClasses([...todaysClasses, classData]);
    } else {
      setScheduledClasses([...scheduledClasses, classData]);
    }

    // Reset form
    setNewClass({
      name: "",
      time: "",
      location: "",
      date: "",
      duration: "90",
      type: "lecture"
    });
    setIsModalOpen(false);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-gray-500 bg-gray-100';
      case 'active': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'upcoming': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
            <div>
              <h1 className="text-2xl font-medium text-gray-900 mb-2">
                Welcome back, {teacherInfo?.name}
              </h1>
              <p className="text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" />
                {teacherInfo?.department} Department
              </p>
            </div>
            
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => openModal('schedule')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Schedule Class
              </button>
              <button
                onClick={() => openModal('create')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Session
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Today's Classes */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Today's Classes</h2>
              
              <div className="space-y-3">
                {todaysClasses.length > 0 ? todaysClasses.map((cls) => (
                  <div key={cls.id} className={`bg-white rounded-lg border p-5 transition-all duration-200 hover:shadow-sm ${
                    cls.status === 'active' ? 'ring-1 ring-blue-200 shadow-sm' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{cls.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(cls.status)}`}>
                        {cls.status === 'active' ? 'In Progress' : 
                         cls.status === 'completed' ? 'Completed' : 'Upcoming'}
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
                    
                    {cls.status !== 'completed' && (
                      <button className="w-full text-sm font-medium text-blue-600 bg-blue-50 py-2 rounded-md hover:bg-blue-100 transition-colors">
                        {cls.status === 'active' ? 'Manage Attendance' : 'Start Session'}
                      </button>
                    )}
                  </div>
                )) : (
                  <div className="bg-white rounded-lg border p-8 text-center">
                    <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No classes scheduled for today</p>
                  </div>
                )}
              </div>

              {/* Upcoming Classes */}
              {scheduledClasses.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Upcoming Classes</h2>
                  <div className="space-y-2">
                    {scheduledClasses.slice(0, 3).map((cls) => (
                      <div key={cls.id} className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm">{cls.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(cls.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {cls.time} • {cls.location}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Student Roster */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Student Roster</h2>
                <span className="text-sm text-gray-500">{students.length} students</span>
              </div>
              
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Student List */}
              <div className="bg-white rounded-lg border divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                  <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>{student.id}</span>
                          <span>•</span>
                          <span>{student.year}</span>
                          <span>•</span>
                          <span className={`font-medium ${
                            parseInt(student.attendance) >= 90 ? 'text-green-600' : 
                            parseInt(student.attendance) >= 75 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {student.attendance} attendance
                          </span>
                        </div>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No students found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Schedule Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/15 bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {modalType === 'create' ? 'Create New Session' : 'Schedule Class'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Name *
                </label>
                <input
                  type="text"
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  placeholder="e.g., Data Structures - Lecture 5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newClass.date}
                    onChange={(e) => setNewClass({...newClass, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={newClass.time}
                    onChange={(e) => setNewClass({...newClass, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={newClass.location}
                  onChange={(e) => setNewClass({...newClass, location: e.target.value})}
                  placeholder="e.g., Room 301, Lab 5B"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <select
                    value={newClass.duration}
                    onChange={(e) => setNewClass({...newClass, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                    <option value="180">180 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newClass.type}
                    onChange={(e) => setNewClass({...newClass, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="lecture">Lecture</option>
                    <option value="lab">Lab Session</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="seminar">Seminar</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleCreateClass}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {modalType === 'create' ? 'Create Session' : 'Schedule Class'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherDashboard;