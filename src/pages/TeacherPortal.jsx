import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { SECTIONS_DATA } from "../data/students";

function TeacherPortal() {
  const [section, setSection] = useState("Section A");
  const [subject, setSubject] = useState("Data Structures");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  // Reset or initialize checkboxes when section changes
  useEffect(() => {
    const currentStudents = SECTIONS_DATA[section] || [];
    const initial = {};
    currentStudents.forEach((st) => {
      initial[st.usn] = "Present"; // Default all to Present
    });
    setAttendanceStatus(initial);
  }, [section]);

  const handleStatusChange = (usn, status) => {
    setAttendanceStatus((prev) => ({ ...prev, [usn]: status }));
  };

  async function handleSubmitBatch(e) {
    e.preventDefault();
    const currentStudents = SECTIONS_DATA[section];
    
    const recordsToInsert = currentStudents.map((st) => ({
      student_name: st.name,
      roll_no: st.usn,
      subject: subject,
      status: attendanceStatus[st.usn] || "Present",
      date: date,
    }));

    const { error } = await supabase.from("attendance").insert(recordsToInsert);

    if (error) {
      console.error(error);
      alert("Error saving attendance batch.");
    } else {
      alert(`Attendance successfully submitted for ${section}!`);
    }
  }

  return (
    <main className="portal-page wide-portal">
      <h1>Teacher Portal - Mark Attendance</h1>
      <form onSubmit={handleSubmitBatch} className="teacher-form-container">
        <div className="form-controls-row">
          <div>
            <label>Select Section</label>
            <select value={section} onChange={(e) => setSection(e.target.value)}>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
              <option value="Section C">Section C</option>
            </select>
          </div>
          <div>
            <label>Select Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="Data Structures">Data Structures</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Database Management">Database Management</option>
              <option value="Computer Networks">Computer Networks</option>
            </select>
          </div>
          <div>
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>SL NO</th>
                <th>USN / SRN</th>
                <th>Name of the Student</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(SECTIONS_DATA[section] || []).map((st, index) => (
                <tr key={st.usn}>
                  <td>{index + 1}</td>
                  <td><strong>{st.usn}</strong></td>
                  <td>{st.name}</td>
                  <td>
                    <button
                      type="button"
                      className={`status-toggle-btn ${attendanceStatus[st.usn] === "Present" ? "present" : "absent"}`}
                      onClick={() =>
                        handleStatusChange(
                          st.usn,
                          attendanceStatus[st.usn] === "Present" ? "Absent" : "Present"
                        )
                      }
                    >
                      {attendanceStatus[st.usn] || "Present"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" className="submit-btn final-submit">
          Save {section} Attendance to Database
        </button>
      </form>
    </main>
  );
}

export default TeacherPortal;
