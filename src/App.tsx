import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
// import gsap from "gsap";
import "./App.css";
import Arrow from "./assets/arrow";
import Bg1 from "./assets/bg-1.svg";
import Bg2 from "./assets/bg-2.svg";
import Bg3 from "./assets/bg-3.svg";
import Logo from "./assets/shopsoma-logo.svg";
import TablerIconX from "./assets/tabler-icon-x";
function App() {
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormDisplay = () => {
    setIsFormDisplayed(true);
    document.body.style.overflow = "hidden";
  };

  const bgImages = [
    {
      src: Bg1,
      heroText: "African Fashion Has a New Home",
      ctaText: "Join the waitlist",
      alt: "Background Image 1",
    },
    {
      src: Bg2,
      heroText: "African Designers you’ll love",
      ctaText: "Count Me In — I Shop African",
      alt: "Background Image 2",
    },
    {
      src: Bg3,
      heroText: "Made in Africa. Worn with intention.",
      ctaText: "Sign me up",
      alt: "Background Image 3",
    },
  ];
  useEffect(() => {
    if (isFormDisplayed) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bgImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [bgImages.length, isFormDisplayed]);

  // Animate form drawer in/out
  useEffect(() => {
    if (formRef.current) {
      if (isFormDisplayed) {
        gsap.fromTo(
          formRef.current,
          { y: "100%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.7, ease: "power3.out" }
        );
      } else {
        gsap.to(formRef.current, {
          y: "100%",
          opacity: 0,
          duration: 0.6,
          ease: "power3.in",
        });
      }
    }
  }, [isFormDisplayed]);

  useEffect(() => {
    if (heroRef.current && ctaRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
      );
    }
  }, [currentIndex]);

  const currentBg = bgImages[currentIndex];

  return (
    <main
      className="container"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${currentBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-image 0.8s cubic-bezier(0.77,0,0.175,1)",
      }}
    >
      <div className="logo">
        <img src={Logo} alt="Shop Soma Logo" />
      </div>

      <div onClick={handleFormDisplay} className="hero-text-container">
        <h1 className="hero-big-text" ref={heroRef}>
          {currentBg.heroText}
        </h1>
        <button className="cta" ref={ctaRef}>
          <p>{currentBg.ctaText}</p>
          <Arrow />
        </button>
      </div>

      <form
        className="form-container"
        action=""
        ref={formRef}
        style={{
          display: isFormDisplayed ? "flex" : "none",
          zIndex: 100,
        }}
      >
        <div className="form-top">
          <div className="form-text">
            <h3>You’re officially on the list</h3>
            <p>
              We’ll be in your inbox soon with early access, exclusive drops,
              and designer edits.
            </p>
          </div>
          <button
            className="close-button"
            type="button"
            onClick={() => setIsFormDisplayed(false)}
          >
            <TablerIconX />
          </button>
        </div>

        <div className="form-input-container">
          <div className="top-inputs">
            <input
              type="text"
              placeholder="First Name"
              className="form-input"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="form-input"
              required
            />
          </div>
          <div className="bottom-inputs">
            <input
              type="email"
              placeholder="Email Address"
              className="form-input"
              required
            />

            <p className="warning-text">This field is required</p>
          </div>
        </div>

        <button className="subscribe-btn">Subscribe</button>
      </form>
    </main>
  );
}

export default App;
