import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import { motion } from "framer-motion";
// Reduced size for better visual balance
import { ChevronLeft, ChevronRight, ChevronDown, Heart, Eye } from "lucide-react"; 
import UniversalModal from "./UniversalModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuroraBackground = () => (
  <div className="aurora-background">
    <div className="aurora-blob blob-1" />
    <div className="aurora-blob blob-2" />
    <div className="aurora-blob blob-3" />
  </div>
);

const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1}px`,
    duration: `${Math.random() * 10 + 10}s`,
    delay: `${Math.random() * 10}s`,
  }));
  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="floating-particle"
          style={{
            "--top": p.top,
            "--left": p.left,
            "--size": p.size,
            "--duration": p.duration,
            "--delay": p.delay,
          }}
        />
      ))}
    </div>
  );
};

// Shayri Card Component for cleaner rendering
const ShayriCard = ({ shayri, onReadFull }) => {
    // Determine the text to display in the card (shortened)
    const cardText = shayri.shayri ? shayri.shayri.slice(0, 200) + "..." : "No content";

    // Format **bold** and \n line breaks
    const formatShayriText = (text) => {
        if (!text) return "";
        const withBold = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return withBold.replace(/\n/g, "<br/>");
    };

    return (
        <motion.div
            key={shayri._id || shayri.id}
            className="shayri-card theme-aware-card"
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ duration: 0.3 }}
        >
            <div className="shayri-card-content">
                <h3 className="shayri-card-category">
                    {shayri.category || "Uncategorized"}
                </h3>

                <p
                    className="shayri-text"
                    dangerouslySetInnerHTML={{
                        __html: formatShayriText(cardText),
                    }}
                />

                <div className="shayri-stats">
                    {/* Icons size is implicitly set by responsive font-size or fixed smaller size */}
                    <span><Heart size={16} style={{ color: 'var(--color-accent, #d63384)' }} /> {shayri.likes || 0}</span>
                    <span><Eye size={16} /> {shayri.views || 0}</span>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="shayri-read-btn"
                    onClick={() => onReadFull(shayri)}
                >
                    Read Full
                </motion.button>
            </div>
        </motion.div>
    );
};


export default function ShayriSection() {
  const { theme } = useTheme();
  const [shayris, setShayris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShayri, setSelectedShayri] = useState(null);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchShayris = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/jokes`, {
          params: { database: "shayri" },
        });
        setShayris(response.data || []);
      } catch (err) {
        console.error("Error fetching shayris:", err);
        // Fallback for demo/testing
        const dummyShayris = Array.from({ length: 15 }, (_, i) => ({
             id: i + 1, category: `Love Shayri ${i + 1}`, shayri: `**मोहब्बत** का सफ़र है, आहिस्ता **चल** मेरे दिल।\nवो **याद** आएगी, मगर **रोने** से क्या फ़ायदा।\nशायरी नंबर ${i + 1}`, likes: "12K", views: "300K"
        }));
        setShayris(dummyShayris); 
        setError("Failed to load shayaris from API. Showing fallback data.");
      } finally {
        setLoading(false);
      }
    };
    fetchShayris();
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.9;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };
  
  const handleReadFull = (shayri) => {
      setSelectedShayri(shayri);
  };

  return (
    <section className="story-section hero-grid-background">
      {/* ✨ Background Layer */}
      <div className="story-bg-layer">
        <FloatingParticles />
        {theme === "dark" && <AuroraBackground />}
      </div>

      {/* 💞 Heading - Uses responsive .section-title class */}
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          color: "var(--color-text)",
          textShadow:
            theme === "dark"
              ? "0 0 25px rgba(255,150,255,0.4)"
              : "0 0 8px rgba(0,0,0,0.2)",
        }}
      >
        💫 Dil Se Nikli Shayari
      </motion.h2>

      {/* 🚀 Loading/Error */}
      {loading && <p className="text-center opacity-70">Loading shayaris...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 💌 Shayari Carousel */}
      {!loading && shayris.length > 0 && (
        <div className="story-carousel-wrapper">
          <button className="scroll-btn left" onClick={() => scroll("left")}>
            <ChevronLeft size={24} /> {/* Reduced size */}
          </button>

          <div className="story-carousel" ref={scrollRef}>
            {shayris.slice(0, 10).map((shayri) => (
              <ShayriCard 
                  key={shayri._id || shayri.id} 
                  shayri={shayri} 
                  onReadFull={handleReadFull} 
              />
            ))}
          </div>

          <button className="scroll-btn right" onClick={() => scroll("right")}>
            <ChevronRight size={24} /> {/* Reduced size */}
          </button>
        </div>
      )}

      {/* 📜 View More Button */}
      {!loading && shayris.length > 10 && (
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            position: "relative",
            zIndex: 5,
          }}
        >
          <motion.button
            // Use the dedicated Shayri View More Button Class
            className="view-more-btn-shayri" 
            whileHover={{
              scale: 1.08,
              boxShadow: theme === "dark" ? "0 0 25px rgba(255,0,180,0.4)" : "0 0 15px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMoreModal(true)}
          >
            <ChevronDown size={20} /> {/* Reduced size for smaller button */}
            View More
          </motion.button>
        </div>
      )}

      {/* 💬 Universal Modal - Single Shayari */}
      <UniversalModal
        show={!!selectedShayri}
        onClose={() => setSelectedShayri(null)}
        title={selectedShayri?.category}
        content={selectedShayri}
        theme={theme}
        type="shayari"
      />

      {/* 💬 Universal Modal - More Shayaris */}
      <UniversalModal
        setSelectedShayri={setSelectedShayri}
        setShowMoreModal={setShowMoreModal}
        theme={theme}
        show={showMoreModal}
        onClose={() => setShowMoreModal(false)}
        items={shayris.slice(10)}
        // KEY FIX: Use a grid type for modal to display cards in columns
        type="shayari-grid" 
        onSelectItem={setSelectedShayri}
      />
    </section>
  );
}