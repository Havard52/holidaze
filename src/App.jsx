import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage" ;
import RegisterPage from "./pages/RegisterPage";
import VenuePage from "./pages/VenuePage";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/venues/:id" element={<VenuePage />} />
      </Routes>
    </>
  );
}

export default App;