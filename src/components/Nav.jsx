import { NavLink } from 'react-router';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">

      {/* LEFT - BRAND NAME */}

      <NavLink to="/" className="navbar-brand">
        PRADAGRAPH
      </NavLink>

      {/* CENTER - NAVIGATION LINKS */}

      <div className="navbar-links">

        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/portfolio">
          Portfolio
        </NavLink>

        <NavLink to="/about">
          About
        </NavLink>

      </div>

      {/* RIGHT - CTA BUTTON */}

      <NavLink to="/contact" className="navbar-cta">
        Get in Touch
      </NavLink>

    </nav>
  );
}

export default Navbar;