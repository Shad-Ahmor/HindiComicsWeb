import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight ,ChevronDown} from "lucide-react";
import UniversalModal from "./UniversalModal";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// NOTE: Please ensure these Lucide icons are installed/available
import { Smile, Frown, Eye } from "lucide-react"; 

// ------------------------------------------------------------------
// 1. HELPER COMPONENTS
// ------------------------------------------------------------------

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

// ------------------------------------------------------------------
// 2. JOKES CARD COMPONENT (Improved Icons)
// ------------------------------------------------------------------

// A separate JokeCard component for clean rendering
const JokeCard = ({ joke, onReadFull }) => {
    return (
        <motion.div
            key={joke._id || joke.id}
            className="story-card glass-effect"
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ duration: 0.3 }}
        >
            <div className="story-card-content">
                <h3 className="story-card-title">
                    {joke.category || "General"}
                </h3>

                <p className="story-card-desc">
                    {joke.joke
                        ? joke.joke.slice(0, 150) + "..."
                        : "No joke content"}
                </p>

                {/* Using responsive story-card-info class from CSS */}
                <div className="story-card-info">
                    <div className="story-stats">
                        {/* Icons will scale based on the parent's responsive font-size (clamp) */}
                        <span className="likes"><Smile size={16} /> {joke.likes || 0}</span>
                        <span className="dislikes"><Frown size={16} /> {joke.dislikes || 0}</span>
                        <span className="views"><Eye size={16} /> {joke.views || 0}</span>
                    </div>
                </div>

                <button
                    className="story-card-btn"
                    onClick={() => onReadFull(joke)}
                >
                    Read Full
                </button>
            </div>
        </motion.div>
    );
};


// ------------------------------------------------------------------
// 3. MAIN COMPONENT (JokesSection)
// ------------------------------------------------------------------

export default function JokesSection() {
  const { theme } = useTheme();
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJoke, setSelectedJoke] = useState(null);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/content`, {
          params: { database: "jokes" },
        });
        setJokes(response.data || []);
      } catch (err) {
        console.error("Error fetching jokes:", err);
        // Fallback for demo/testing
        const dummyJokes = Array.from({ length: 15 }, (_, i) => ({
             id: i + 1, category: `Joke Category ${i + 1}`, joke: `This is a dummy joke content to ensure responsiveness works on API failure. Joke number ${i + 1}.`, likes: "5K", dislikes: "10", views: "100K"
        }));
        setJokes(dummyJokes); 
        setError("Failed to load jokes from API. Showing fallback data.");
      } finally {
        setLoading(false);
      }
    };
    fetchJokes();
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

  const handleReadFull = (joke) => {
      setSelectedJoke(joke);
  };
    
  return (
    <section className="story-section hero-grid-background">
      {/* 🪄 Background Layer */}
      <div className="story-bg-layer">
        <FloatingParticles />
        {theme === "dark" && <AuroraBackground />}
      </div>

      {/* ✨ Heading - Uses responsive .section-title class */}
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          color: "var(--color-text)",
          textShadow:
            theme === "dark"
              ? "0 0 25px rgba(0,234,255,0.4)"
              : "0 0 8px rgba(0,0,0,0.2)",
        }}
      >
        😂 Trending Jokes
      </motion.h2>

      {/* 🚀 Loading/Error */}
      {loading && <p className="text-center opacity-70">Loading jokes...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 🎭 Jokes Carousel */}
      {!loading && jokes.length > 0 && (
        <div className="story-carousel-wrapper">
          {/* Left Scroll Button - Uses responsive .scroll-btn class */}
          <button className="scroll-btn left" onClick={() => scroll("left")}>
            <ChevronLeft size={30} />
          </button>

          {/* Scrollable Container */}
          <div className="story-carousel" ref={scrollRef}>
            {jokes.slice(0, 10).map((joke) => (
              <JokeCard 
                  key={joke._id || joke.id} 
                  joke={joke} 
                  onReadFull={handleReadFull} 
              />
            ))}
          </div>

          {/* Right Scroll Button - Uses responsive .scroll-btn class */}
          <button className="scroll-btn right" onClick={() => scroll("right")}>
            <ChevronRight size={30} />
          </button>
        </div>
      )}

      {/* 📜 Read More Button (when jokes > 10) */}
      {!loading && jokes.length > 10 && (
        <div
            style={{
                textAlign: "center",
                marginTop: "5px",
                position: "relative",
                zIndex: 5,
            }}
        >
            <motion.button
                // Removed complex in-line styles and moved logic to CSS for responsiveness
                className="view-more-btn"
                whileHover={{
                    scale: 1.08,
                    // Keeping motion effects that look good
                    boxShadow: theme === "dark" ? "0 0 25px rgba(0,255,255,0.5)" : "0 0 15px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMoreModal(true)}
            >
                <ChevronDown size={20} /> View More
            </motion.button>
        </div>
      )}


      {/* 💬 Universal Modal - Single Joke */}
      <UniversalModal
        show={!!selectedJoke}
        onClose={() => setSelectedJoke(null)}
        title={selectedJoke?.category}
        content={selectedJoke}
        theme={theme}
        type="joke"
      />

      {/* 💬 Universal Modal - More Jokes */}
      <UniversalModal
        setSelectedJoke={setSelectedJoke}
        setShowMoreModal={setShowMoreModal}
        theme={theme}
        show={showMoreModal}
        onClose={() => setShowMoreModal(false)}
        items={jokes.slice(10)}
        // KEY FIX: Use a grid type for modal to display cards in columns
        type="joke-grid" 
        onSelectItem={setSelectedJoke} 
      />
    </section>
  );
}