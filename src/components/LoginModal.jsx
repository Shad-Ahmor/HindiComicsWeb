import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Lock } from "lucide-react";

export default function LoginModal({ isVisible, onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: {
      y: "0",
      opacity: 1,
      transition: { delay: 0.1, type: "spring", stiffness: 100 },
    },
    exit: { y: "100vh", opacity: 0 },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      isLogin ? "Login Attempted!" : "Signup Attempted!"
    );
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <motion.div
            className="modal-content"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            style={{
              background: "var(--color-background)",
              padding: "40px",
              borderRadius: "20px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 10px 50px rgba(0,0,0,0.5)",
              position: "relative",
              color: "var(--color-text)",
            }}
          >
            <motion.button
              onClick={onClose}
              whileHover={{ rotate: 90 }}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Close Modal"
            >
              <X size={24} color="var(--color-text)" />
            </motion.button>
            <h3
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                marginBottom: "20px",
                color: "var(--color-primary)",
                textAlign: "center",
              }}
            >
              {isLogin ? "Welcome Back!" : "Join Hindi Comics"}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--color-subtle-text)' }} />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--color-subtle-text)' }} />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  style={inputStyle}
                />
              </div>

              {!isLogin && (
                <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--color-subtle-text)' }} />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  style={inputStyle}
                />
              </div>
              )}

              <motion.button
                type="submit"
                className="login-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  ...inputStyle,
                  padding: "15px",
                  fontWeight: 700,
                  marginTop: "10px",
                  background: "var(--color-primary)",
                  color: "#fff",
                  boxShadow: "0 5px 20px var(--color-primary-glow)",
                  cursor: "pointer"
                }}
              >
                {isLogin ? "Login" : "Sign Up"}
              </motion.button>
            </form>

            <p style={{ textAlign: "center", marginTop: "20px" }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-secondary-highlight)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inputStyle = {
  padding: "12px 12px 12px 45px",
  borderRadius: "10px",
  border: "1px solid var(--color-glass-border)",
  background: "var(--color-glass-bg)",
  color: "var(--color-text)",
  width: "100%",
  boxSizing: "border-box",
  fontSize: "1rem"
};