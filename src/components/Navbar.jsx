import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>Rajeev Institute of Technology</h2>
      <div className="navbar-links">
        <Link to="/">Home / Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
