import { useState } from "react";
import { supabase } from "../supabase";

function StudentPortal() {
  const [rollNo, setRollNo] = useState("");
  const [records, setRecords] = useState([]);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!rollNo) {
      alert("Please enter your USN / Roll Number");
      return;
    }

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("roll_no", rollNo.trim());

    if (error) {
      console.error(error);
      alert("Error retrieving records");
    } else {
      setRecords(data);
      setSearched(true);
    }
  }

  // Calculate percentage summary
  const totalClasses = records.length;
  const presentClasses = records.filter((r) => r.status === "Present").length;
  const percentage = totalClasses > ((presentClasses / totalClasses) * 100).toFixed(2) ? 0 : ((presentClasses / totalClasses) * 100).toFixed(1);

  return (
    <main className="portal-page">
      <h1>Student Portal - View Attendance</h1>
      <form onSubmit={handleSearch} className="filter-section">
        <input
          type="text"
          placeholder="Enter your USN (e.g., 4RA24CS055)"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />
        <button type="submit" className="submit-btn">Check Attendance</button>
      </form>

      {searched && (
        <div className="student-summary">
          <h3>Attendance Summary</h3>
          <p>Total Classes Held: <strong>{totalClasses}</strong></p>
          <p>Classes Attended: <strong style={{color: "green"}}>{presentClasses}</strong></p>
          <p>Attendance Percentage: <strong>{totalClasses === 0 ? "0%" : `${((presentClasses / totalClasses) * 100).toFixed(1)}%`}</strong></p>
        </div>
      )}

      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.subject}</td>
                <td style={{ color: item.status === "Present" ? "green" : "red", fontWeight: "bold" }}>
                  {item.status}
                </td>
              </tr>
            ))}
            {searched && records.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>No records found for this USN.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default StudentPortal;
