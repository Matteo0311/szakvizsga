// Navbar komponens
import { Link } from 'react-router-dom';
import './NavbarStyles.css';

const Navbar = () => {
  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">HigherLower</Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/OrszagModosit">Országmódosítás</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
