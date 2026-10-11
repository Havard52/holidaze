import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }


  return (
    <header>
      <nav>
        <Link to="/">Holidaze</Link>

        <div>
          {isAuthenticated ? (
            <>
              <span>Welcome, {user.name}</span>

              <button type="button" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );}

export default Header;