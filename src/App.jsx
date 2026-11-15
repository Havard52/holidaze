import EditVenuePage from "./pages/EditVenuePage";
import ProfilePage from "./pages/ProfilePage";
import MyBookingsPage from "./pages/MyBookingsPage" ;
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage" ;
import RegisterPage from "./pages/RegisterPage";
import VenuePage from "./pages/VenuePage";
import ManagerPage from "./pages/ManagerPage";
import CreateVenuePage from "./pages/CreateVenuePage";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/manager/edit/:id" element={<EditVenuePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/venues/:id" element={<VenuePage />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/manager/create" element={<CreateVenuePage />} />   
      </Routes>
    </>
  );
}

export default App;