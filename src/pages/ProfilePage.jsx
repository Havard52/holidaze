import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/profiles";

function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuth();

  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar?.url || ""
  );

  const [avatarAlt, setAvatarAlt] = useState(
    user?.avatar?.alt || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const url = new URL(avatarUrl.trim());

      if (!["https:", "http:"].includes(url.protocol)) {
        throw new Error("Please enter a valid image URL.");
      }

      const updatedProfile = await updateProfile(
        user.name,
        {
          avatar: {
            url: avatarUrl.trim(),
            alt: avatarAlt.trim(),
          },},
        user.accessToken,
        user.apiKey
      );

      updateUser({
        avatar: updatedProfile.avatar,
      });

      setSuccess("Your avatar was updated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }}

  if (!isAuthenticated || !user?.apiKey) {
    return (
      <main>
        <h1>My profile</h1>
        <p>Please log in to view your profile.</p>
        <Link to="/login">Log in</Link>
      </main>
    );}

  return (
    <main>
      <h1>My profile</h1>

      <section className="profile-card">
        {user.avatar?.url && (
          <img
            className="profile-avatar"
            src={user.avatar.url}
            alt={user.avatar.alt || `${user.name}'s avatar`}
          />
        )}

        <h2>{user.name}</h2>
        <p>{user.email}</p>

        <Link to="/my-bookings">My bookings</Link>
      </section>

      <section className="profile-form">
        <h2>Update avatar</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="avatar-url">Image URL</label>

            <input
              id="avatar-url"
              type="url"
              value={avatarUrl}
              onChange={(event) =>
                setAvatarUrl(event.target.value)
              }
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label htmlFor="avatar-alt">
              Image description
            </label>

            <input
              id="avatar-alt"
              type="text"
              value={avatarAlt}
              onChange={(event) =>
                setAvatarAlt(event.target.value)
              }
              maxLength={119}
              placeholder="Describe your profile picture"
            />
          </div>

          {error && <p role="alert">{error}</p>}
          {success && <p role="status">{success}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Update avatar"}
          </button>
        </form>
      </section>
    </main>
  );}

export default ProfilePage;
