import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import UniversalModal from "./UniversalModal";

// NOTE: Story Card Stats के लिए icons यहाँ import करें
import { ThumbsUp, ThumbsDown, Eye, Star } from "lucide-react"; 

// ------------------------------------------------------------------
// 1. HELPER COMPONENTS & DUMMY DATA
// ------------------------------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// 🌈 Aurora Gradient Background
const AuroraBackground = () => (
  <div className="aurora-background">
    <div className="aurora-blob blob-1" />
    <div className="aurora-blob blob-2" />
    <div className="aurora-blob blob-3" />
  </div>
);

// ✨ Floating background particles
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

// 📚 DUMMY DATA (API failure के लिए Fallback)
const dummyStories = [
    { id: 1, title: "शौर्य: द लेजेंड बिगिन्स", category: "Action", writername: "Unknown", story: "एक साधारण लड़का जो भारत का सबसे बड़ा सुपरहीरो बनता है। यह डेटा डमी है।", image: "/images/superhero.png", likes: "15K", dislikes: "200", views: "500K", rating: 4.8, _id: 'd1' },
    { id: 2, title: "कालचक्र: समय का रहस्य", category: "Sci-Fi", writername: "Unknown", story: "एक प्राचीन घड़ी का रहस्य जो समय को नियंत्रित करता है। यह डेटा डमी है।", image: "/images/superhero.png", likes: "12K", dislikes: "150", views: "450K", rating: 4.7, _id: 'd2' },
    { id: 3, title: "मायावी: अदृश्य शक्तियां", category: "Mystery", writername: "Unknown", story: "जादुई शक्तियों वाली एक लड़की जो शहर को बचाती है। यह डेटा डमी है।", image: "/images/superhero.png", likes: "18K", dislikes: "100", views: "600K", rating: 4.9, _id: 'd3' },
    { id: 4, title: "गड़गड़ाहट: थोर का वारिस", category: "Mythology", writername: "Unknown", story: "प्राचीन भारतीय देवताओं के वारिस की महागाथा। यह डेटा डमी है।", image: "/images/superhero.png", likes: "20K", dislikes: "80", views: "750K", rating: 4.9, _id: 'd4' },
    { id: 5, title: "नकाबपोश: बदला", category: "Thriller", writername: "Unknown", story: "एक नकाबपोश जो शहर में न्याय लाता है। यह डेटा डमी है।", image: "/images/superhero.png", likes: "10K", dislikes: "50", views: "300K", rating: 4.5, _id: 'd5' },
    { id: 6, title: "अंतरिक्ष यात्री", category: "Sci-Fi", writername: "Unknown", story: "पृथ्वी से दूर एक नए ग्रह की खोज। यह डेटा डमी है।", image: "/images/superhero.png", likes: "9K", dislikes: "40", views: "250K", rating: 4.4, _id: 'd6' },
    { id: 7, title: "जलपरी की दुनिया", category: "Fantasy", writername: "Unknown", story: "समुद्र के नीचे एक अद्भुत प्रेम कहानी। यह डेटा डमी है।", image: "/images/superhero.png", likes: "13K", dislikes: "60", views: "400K", rating: 4.6, _id: 'd7' },
    { id: 8, title: "अदृश्य योद्धा", category: "Action", writername: "Unknown", story: "एक योद्धा जो अदृश्य होकर दुश्मनों से लड़ता है। यह डेटा डमी है।", image: "/images/superhero.png", likes: "16K", dislikes: "70", views: "550K", rating: 4.7, _id: 'd8' },
    { id: 9, title: "जादूगर", category: "Magic", writername: "Unknown", story: "एक युवा जादूगर की रहस्यमय कहानी। यह डेटा डमी है।", image: "/images/superhero.png", likes: "11K", dislikes: "30", views: "350K", rating: 4.5, _id: 'd9' },
    { id: 10, title: "विरासत का रहस्य", category: "Mystery", writername: "Unknown", story: "एक प्राचीन विरासत का पता लगाते हुए। यह डेटा डमी है।", image: "/images/superhero.png", likes: "14K", dislikes: "50", views: "480K", rating: 4.6, _id: 'd10' },
    // 11 से 15 तक (View More modal के लिए)
    { id: 11, title: "अतिरिक्त कहानी 1", category: "Extra", writername: "Dummy", story: "यह View More सेक्शन के लिए है।", image: "/images/superhero.png", likes: "1K", dislikes: "10", views: "30K", rating: 4.0, _id: 'd11' },
    { id: 12, title: "अतिरिक्त कहानी 2", category: "Extra", writername: "Dummy", story: "यह View More सेक्शन के लिए है।", image: "/images/superhero.png", likes: "1K", dislikes: "10", views: "30K", rating: 4.0, _id: 'd12' },
    { id: 13, title: "अतिरिक्त कहानी 3", category: "Extra", writername: "Dummy", story: "यह View More सेक्शन के लिए है।", image: "/images/superhero.png", likes: "1K", dislikes: "10", views: "30K", rating: 4.0, _id: 'd13' },
    { id: 14, title: "अतिरिक्त कहानी 4", category: "Extra", writername: "Dummy", story: "यह View More सेक्शन के लिए है।", image: "/images/superhero.png", likes: "1K", dislikes: "10", views: "30K", rating: 4.0, _id: 'd14' },
    { id: 15, title: "अतिरिक्त कहानी 5", category: "Extra", writername: "Dummy", story: "यह View More सेक्शन के लिए है।", image: "/images/superhero.png", likes: "1K", dislikes: "10", views: "30K", rating: 4.0, _id: 'd15' },
];

// 📚 Story Card Component (Improved UI)
const StoryCard = ({ story, onReadFull }) => {
    const defaultImageUrl = "/images/superhero.png";
    return (
        <motion.div
            key={story._id || story.id} // Ensures a key exists
            className="story-card glass-effect"
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ duration: 0.3 }}
        >
           <img
                src={story.image || defaultImageUrl}
                alt={story.title}
                // यदि आप defaultImageUrl का उपयोग कर रहे हैं तो on Error हैंडलर आवश्यक नहीं है, 
                // लेकिन यह एक अतिरिक्त सुरक्षा परत प्रदान करता है।
                onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = defaultImageUrl;
                }}
            />
            <div className="story-card-content">
                <div>
                    <h3 className="story-card-title">{story.title || "Untitled Story"}</h3>
                    <div className="story-meta">
                        <span>✍️ {story.writername || "Unknown"}</span>
                        <span className="story-category">
                            📚 {story.category || "Uncategorized"}
                        </span>
                    </div>
                    <p className="story-card-desc">
                        {story.story
                            ? story.story.slice(0, 120) + "..."
                            : "No description available"}
                    </p>
                </div>
                <div className="story-card-info">
                    <div className="story-stats">
                        <span className="likes"><ThumbsUp size={16} /> {story.likes || 0}</span>
                        <span className="dislikes"><ThumbsDown size={16} /> {story.dislikes || 0}</span>
                        <span className="views"><Eye size={16} /> {story.views || 0}</span>
                    </div>
                    <span className="rating">
                        <Star size={16} fill="#ffc107" color="#ffc107" /> {story.rating || "N/A"}
                    </span>
                </div>
                <button
                    className="story-card-btn"
                    onClick={() => onReadFull(story)}
                >
                    Read Full
                </button>
            </div>
        </motion.div>
    );
};

// ------------------------------------------------------------------
// 2. MAIN COMPONENT (StorySection)
// ------------------------------------------------------------------

export default function StorySection() {
    const { theme } = useTheme();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedStory, setSelectedStory] = useState(null);
    const [showMoreModal, setShowMoreModal] = useState(false);
    const scrollRef = useRef(null);
    const [isApiFailed, setIsApiFailed] = useState(false); // New state to track API failure

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/jokes`, {
                    params: { database: "stories" },
                });
                
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                     setStories(response.data);
                     setError(""); // API success, clear any previous error
                } else {
                     // API called successfully, but data is empty or invalid
                     throw new Error("API returned no valid data.");
                }

            } catch (err) {
                console.error("Error fetching stories:", err);
                // API failed or returned bad data -> Use DUMMY DATA
                setStories(dummyStories); 
                setIsApiFailed(true);
                setError("Failed to load stories from API. Showing fallback data.");
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
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
    
    // API fail होने पर भी, stories state में data (या dummy data) होगा
    const displayStories = stories; 

    return (
        <section className="story-section hero-grid-background" id="stories">
            {/* Background */}
            <div className="story-bg-layer">
                <FloatingParticles />
                {theme === "dark" && <AuroraBackground />}
            </div>

            {/* Heading */}
            <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    color: "var(--color-text)",
                    textShadow:
                        theme === "dark"
                            ? "0 0 25px rgba(255,0,238,0.4)"
                            : "0 0 8px rgba(0,0,0,0.2)",
                }}
            >
                🔥 Trending Stories
            </motion.h2>

            {/* Loading/Error */}
            {loading && <p className="text-center opacity-70">Loading stories...</p>}
            {error && <p className="text-center text-red-500" style={{ fontWeight: 'bold' }}>{error}</p>}
            {isApiFailed && <p className="text-center text-gray-500">Please check the server at `${API_BASE_URL}/jokes`.</p>}

            {/* Story Carousel */}
            {!loading && displayStories.length > 0 && (
                <div className="story-carousel-wrapper">
                    <button className="scroll-btn left" onClick={() => scroll("left")}>
                        <ChevronLeft size={30} />
                    </button>

                    <div className="story-carousel" ref={scrollRef}>
                        {displayStories.slice(0, 10).map((story) => (
                            <StoryCard 
                                key={story._id || story.id} // API data में _id और dummy data में id
                                story={story} 
                                onReadFull={setSelectedStory} 
                            />
                        ))}
                    </div>

                    <button className="scroll-btn right" onClick={() => scroll("right")}>
                        <ChevronRight size={30} />
                    </button>
                </div>
            )}

            {/* Read More Button */}
            {!loading && displayStories.length > 10 && (
                <div style={{ textAlign: "center", marginTop: "50px", zIndex: 5 }}>
                    <motion.button
                        whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(255,0,238,0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowMoreModal(true)}
                        style={{
                            padding: "14px 40px",
                            fontSize: "1.2rem",
                            fontWeight: "700",
                            letterSpacing: "0.5px",
                            color: "#fff",
                            border: "2px solid transparent",
                            borderRadius: "12px",
                            background:
                                "linear-gradient(90deg, rgba(255,0,238,0.2), rgba(0,255,255,0.2))",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            cursor: "pointer",
                            transition: "all 0.4s ease",
                            boxShadow: "0 0 15px rgba(0,0,0,0.2)",
                            borderImage: "linear-gradient(90deg, #ff00cc, #00ffff) 1",
                        }}
                    >
                        <ChevronDown size={30} /> View More
                    </motion.button>
                </div>
            )}

            {/* Universal Modals */}
            <UniversalModal
                show={!!selectedStory}
                onClose={() => setSelectedStory(null)}
                title={selectedStory?.title}
                content={selectedStory}
                theme={theme}
                type="story"
            />

            <UniversalModal
                setSelectedStory={setSelectedStory}
                setShowMoreModal={setShowMoreModal}
                theme={theme}
                show={showMoreModal}
                onClose={() => setShowMoreModal(false)}
                // Show remaining items for View More
                items={displayStories.slice(10)} 
                type="story-grid" // Changed type for better modal handling
                onSelectItem={setSelectedStory} // Added prop for modal item click
            />
        </section>
    );
}