import React, { useState } from "react";
import HeroSection from "./components/HeroSection";
import LoginModal from "./components/LoginModal";
import { ThemeProvider } from "./components/ThemeContext";

// Ensure you import the styles, even if they're named differently
import "./css/HeroSection.css";
// import "./css/StorySection.css"; 

export default function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <ThemeProvider>
      {/* HeroSection is now the main layout component. 
        It contains Hero, Story, Jokes, Shayri, and Footer.
      */}
      <HeroSection setShowLogin={setShowLogin} />

      {/* Login Modal for the login button */}
      <LoginModal isVisible={showLogin} onClose={() => setShowLogin(false)} />
    </ThemeProvider>
  );
}