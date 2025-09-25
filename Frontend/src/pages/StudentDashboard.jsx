import React, { useState, useEffect } from "react";
import { Clock, MapPin, Calendar, CheckCircle2, XCircle } from "lucide-react";

const getFormattedDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const StudentDashboard = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockStudentInfo = {
        name: "Priya Sharma",
        studentId: "CS2024001",
        department: "Computer Science"
      };
      
      const mockTodaysSchedule = [
        { id: 1, course: "Data Structures", time: "09:00", duration: "90 min", location: "Room 301", status: "completed" },
        { id: 2, course: "Web Development", time: "11:00", duration: "90 min", location: "Lab 5B", status: "active" },
        { id: 3, course: "Artificial Intelligence", time: "14:00", duration: "90 min", location: "Hall A", status: "upcoming" }
      ];

      const mockAttendanceRecords = [
        { id: 1, course: "Data Structures", date: "Today", status: "present" },
        { id: 2, course: "Operating Systems", date: "Yesterday", status: "present" },
        { id: 3, course: "Database Management", date: "2 days ago", status: "absent" },
        { id: 4, course: "Computer Networks", date: "3 days ago", status: "present" }
      ];
      
      setStudentInfo(mockStudentInfo);
      setSchedule(mockTodaysSchedule);
      setAttendance(mockAttendanceRecords);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-gray-500 bg-gray-100';
      case 'active': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'upcoming': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Good morning, {studentInfo?.name}
          </h1>
          <p className="text-gray-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {getFormattedDate()}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Today's Classes */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Today's Classes</h2>
            
            <div className="space-y-3">
              {schedule.map((item) => (
                <div key={item.id} className={`bg-white rounded-lg border p-5 transition-all duration-200 hover:shadow-sm ${
                  item.status === 'active' ? 'ring-1 ring-blue-200 shadow-sm' : ''
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{item.course}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(item.status)}`}>
                          {item.status === 'active' ? 'In Progress' : 
                           item.status === 'completed' ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.time} ({item.duration})
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {item.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Summary */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Recent Attendance</h2>
            
            <div className="bg-white rounded-lg border p-1">
              {attendance.map((item, index) => (
                <div key={item.id} className={`p-4 ${index !== attendance.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm mb-1 truncate">{item.course}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                    <div className="ml-3">
                      {item.status === 'present' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg border p-5">
              <h3 className="font-medium text-gray-900 mb-4">This Week</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-semibold text-green-600 mb-1">85%</div>
                  <div className="text-xs text-gray-500">Attendance</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-blue-600 mb-1">12</div>
                  <div className="text-xs text-gray-500">Classes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;