import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Demo authorized email lists
  const teacherEmails = ["teacher@rit.edu", "prof.cse@rit.edu"];
  const studentEmails = ["student@rit.edu", "4ra24cs055@rit.edu"];

  function handleLogin(e) {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      alert("Please enter both email and password.");
      return;
    }

    if (teacherEmails.includes(cleanEmail)) {
      alert("Teacher login successful!");
      navigate("/teacher");
    } else if (studentEmails.includes(cleanEmail)) {
      alert("Student login successful!");
      navigate("/student");
    } else {
      alert("Invalid college email ID or password. Please use a valid demo ID.");
    }
  }

  return (
    <main className="home-page">
      <h1>Rajeev Institute of Technology - Attendance Portal</h1>
      <form className="login-card" onSubmit={handleLogin}>
        <label>College Email ID</label>
        <input
          type="email"
          placeholder="Enter college email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="submit-btn">Login</button>
      </form>
    </main>
  );
}

export default Home;
