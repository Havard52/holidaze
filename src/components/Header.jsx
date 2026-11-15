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
    <header className="site-header">
      <nav className="header-container">
        <Link to="/" className="header-logo">
          Holidaze
        </Link>

        <div className="header-navigation">
          {isAuthenticated ? (
            <>
              <div className="header-user">
                {user.avatar?.url && (
                  <img
                    className="header-avatar"
                    src={user.avatar.url}
                    alt={user.avatar.alt || "Profile picture"}
                  />
                )}

                <span>Welcome, {user.name}</span>
              </div>

              <Link to="/profile">My profile</Link>

              {user.venueManager && (
                <Link to="/manager">Manage venues</Link>
              )}

              <Link to="/my-bookings">My bookings</Link>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
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
  );
}

export default Header;
