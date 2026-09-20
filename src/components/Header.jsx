import { Link } from "react-router-dom";



function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Holidaze</Link>

        <div>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;