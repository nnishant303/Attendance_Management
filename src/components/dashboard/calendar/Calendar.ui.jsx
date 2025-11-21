import React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LegendBar from "../../../components/common/LegendBar";
import AttendanceCellUI from "./AttendanceCell.ui";
import StudentProfileUI from "./StudentProfile.ui";
import { EditButton } from "../../../components/common/calendarcom";

const CalendarUI = ({
  selectedStudents,
  attendance,
  currentWeekStart,
  daysOfWeek,
  formattedStudents,
  handleToggleSelect,
  handleCellClick,
  handlePreviousWeek,
  handleNextWeek,
  handleToday,
  handleOpenCalendarModal,
  attendanceStatuses,
  isNextWeekDisabled,  
}) => {

  const navigate = useNavigate();

  const handleNameClick = (studentId) => {
    navigate(`/employee-calendarcom?employeeId=${studentId}`);
  };
  const gridColsClass = "grid grid-cols-[300px_repeat(5,minmax(0,1fr))]";
  
  
  const StudentRowSkeleton = () => (
    <div className={`${gridColsClass} hover:bg-red-50/20 py-4`}>
   
      <div className="flex items-center p-4 border-r border-gray-200">
        <div className="rounded-full bg-gray-200 animate-pulse w-10 h-10 mr-3"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
      
    
      {[...Array(5)].map((_, index) => (
        <div key={index} className="p-4 border-r border-gray-200 last:border-r-0 flex items-center justify-center">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );


  if (!attendanceStatuses || !daysOfWeek || !formattedStudents) {
    console.warn("CalendarUI: Missing required props", { attendanceStatuses, daysOfWeek, formattedStudents });
    return (
      <div className="p-8 md:p-0 min-h-screen bg-gray-100 font-sans">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
          <div className="flex items-center justify-center p-4 bg-gray-50 border-b border-gray-200">
            <div className="text-red-500 font-medium">Error: Missing required data for calendar display</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-0 min-h-screen bg-gray-100 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCalendarModal}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
            >
              Show Calendar
            </button>
         
            {/* <EditButton /> */}
         
          </div>

          



          <div className="flex items-center gap-4">
            <button
              onClick={handlePreviousWeek}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors"
              title="Previous Week"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="text-sm font-semibold text-gray-700">
              {daysOfWeek[0] ? new Date(daysOfWeek[0].fullDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''} -{" "}
              {daysOfWeek[4] ? new Date(daysOfWeek[4].fullDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
            </div>

            <button
              onClick={handleNextWeek}
              disabled={isNextWeekDisabled} 
              className={`p-2 rounded-md transition-colors ${
                isNextWeekDisabled
                  ? "cursor-not-allowed text-gray-300"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Next Week"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <LegendBar attendanceData={attendance} />
        </div>

        <div
          className={`${gridColsClass} border-b border-gray-200 text-gray-800 font-semibold text-center`}
        >
          <div className="flex items-center justify-start p-4 text-sm font-bold border-r border-gray-200">
            <span className="mr-1">Employee Profile</span>
            <ChevronDown className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>

          {daysOfWeek.map((day, index) => {
            const isToday =
              new Date().toISOString().split("T")[0] === day.fullDate;
            return (
              <div
                key={day.fullDate}
                className={`p-3 border-r border-gray-200 text-sm flex flex-col justify-center transition-colors
                  ${
                    day.special === "Holiday"
                      ? "bg-gray-100 text-gray-500"
                      : "text-gray-500"
                  }
                  ${isToday ? "bg-blue-50" : ""}
                  ${index === 4 ? "border-r-0" : ""}
                `}
              >
                <span
                  className={`text-lg font-bold ${
                    isToday ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {day.date}
                </span>
                <span
                  className={`text-xs font-medium uppercase mt-0.5 ${
                    isToday ? "text-blue-600" : ""
                  }`}
                >
                  {day.day.substring(0, 3)}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {day.month}
                </span>
              </div>
            );
          })}
        </div>

        <div className="divide-y divide-gray-100 flex-grow overflow-y-auto">
        
          {(!formattedStudents || formattedStudents.length === 0) ? (
            [...Array(8)].map((_, index) => (
              <StudentRowSkeleton key={index} />
            ))
          ) : (
            formattedStudents.map((student) => (
              <div key={student.id} className={`${gridColsClass} hover:bg-red-50/20`}>
                <StudentProfileUI
                  student={student}
                  isSelected={!!selectedStudents?.[student.id]}
                  onToggle={handleToggleSelect}
                  onNameClick={handleNameClick}
                />

                {daysOfWeek.map((day) => {
                 
                  let statusKey = "absent"; 
                  
                  try {
                  
                    if (attendance && typeof attendance === 'object') {
                      const studentAttendance = attendance[student.id];
                      if (studentAttendance && typeof studentAttendance === 'object') {
                        if (studentAttendance[day.fullDate] !== undefined) {
                          statusKey = studentAttendance[day.fullDate];
                        }
                      }
                    }
                  } catch (error) {
                    console.warn("Error accessing attendance data:", error);
                    statusKey = "absent"; 
                  }
                  
                  const isHoliday = day.special === "Holiday";
                  const holidayDetail = day.detail || null;

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const cellDate = new Date(day.fullDate);
                  cellDate.setHours(0, 0, 0, 0);
                  const isFuture = cellDate > today;

                  return (
                    <AttendanceCellUI
                      key={`${student.id}-${day.fullDate}`} 
                      studentId={student.id}
                      date={day.fullDate}
                      statusKey={statusKey}
                      isHoliday={isHoliday}
                      isFuture={isFuture}
                      holidayDetail={holidayDetail}
                      onClick={handleCellClick}
                      attendanceStatuses={attendanceStatuses}
                    />
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarUI;
