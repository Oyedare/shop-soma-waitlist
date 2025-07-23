import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./App.css";
import Arrow from "./assets/arrow";
import Bg1 from "./assets/bg-1.webp";
import Bg2 from "./assets/bg-2.webp";
import Bg3 from "./assets/bg-3.webp";
import MobileBg1 from "./assets/mobile-bg-1.webp";
import MobileBg2 from "./assets/mobile-bg-2.webp";
import MobileBg3 from "./assets/mobile-bg-3.webp";
import Logo from "./assets/shopsoma-logo.svg";
import TablerIconX from "./assets/tabler-icon-x";
import Spinner from "./assets/spinner";

// Add grecaptcha to the Window interface for TypeScript
declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

function App() {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMailSent, setIsMailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const hiddenFormRef = useRef<HTMLFormElement>(null);

  const handleFormDisplay = () => {
    setIsFormDisplayed(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    if (!window.grecaptcha) {
      setIsLoading(false);
      setErrorMsg("reCAPTCHA not loaded. Please try again.");
      return;
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute("6LfGb4srAAAAAJ3WmmRWa-rLrlnklOJkw00eBw5j", {
          action: "submit",
        })
        .then((token: string) => {
          setCaptchaToken(token);

          // Give React a moment to update form inputs
          setTimeout(() => {
            hiddenFormRef.current?.submit();

            // UI state
            setIsMailSent(true);
            setIsFormDisplayed(false);
            setFormValues({ firstName: "", lastName: "", email: "" });
            setIsLoading(false);
            setErrorMsg("");

            setTimeout(() => {
              setIsMailSent(false);
            }, 3000);
          }, 100);
        });
    });
  };

  const bgImages = [
    {
      src: Bg1,
      MobileSrc: MobileBg1,
      heroText: "African Fashion Has a New Home",
      ctaText: "Join the waitlist",
      alt: "Background Image 1",
    },
    {
      src: Bg2,
      MobileSrc: MobileBg2,
      heroText: "African Designers you’ll love",
      ctaText: "Count me in, I shop African",
      alt: "Background Image 2",
    },
    {
      src: Bg3,
      MobileSrc: MobileBg3,
      heroText: "Made in Africa. Worn with intention.",
      ctaText: "Sign me up",
      alt: "Background Image 3",
    },
  ];
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isFormDisplayed) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bgImages.length);
    }, 4000);
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
  const bgSrc = isMobile ? currentBg.MobileSrc : currentBg.src;

  return (
    <main
      className="container app-bg"
      style={{ backgroundImage: `url(${bgSrc})` }}
    >
      <div className="logo">
        <img src={Logo} alt="Shop Soma Logo" />
      </div>

      <div className="hero-text-container">
        <h1 className="hero-big-text" ref={heroRef}>
          {currentBg.heroText}
        </h1>
        <button onClick={handleFormDisplay} className="cta" ref={ctaRef}>
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
        onSubmit={handleSubmit}
      >
        <div className="form-top">
          <div className="form-text">
            <h3>Welcome to the front row</h3>
            <p>You will be the first to know when we drop</p>
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
              name="FIRSTNAME"
              placeholder="First Name"
              className="form-input"
              required
              value={formValues.firstName}
              onChange={(e) =>
                setFormValues((v) => ({ ...v, firstName: e.target.value }))
              }
            />
            <input
              type="text"
              name="LASTNAME"
              placeholder="Last Name"
              className="form-input"
              required
              value={formValues.lastName}
              onChange={(e) =>
                setFormValues((v) => ({ ...v, lastName: e.target.value }))
              }
            />
          </div>
          <div className="bottom-inputs">
            <input
              type="email"
              name="EMAIL"
              placeholder="Email Address"
              className="form-input"
              required
              value={formValues.email}
              onChange={(e) =>
                setFormValues((v) => ({ ...v, email: e.target.value }))
              }
            />

            <input
              type="text"
              name="email_address_check"
              value=""
              className="none"
            />
            <input className="none" type="hidden" name="locale" value="en" />
            <input
              className="none"
              type="hidden"
              name="html_type"
              value="simple"
            />

            <p className="warning-text">This field is required</p>
          </div>
        </div>

        <button className="subscribe-btn" disabled={isLoading}>
          {isLoading ? <Spinner /> : "Subscribe"}
        </button>
      </form>

      {isMailSent && (
        <div className={`confirmation-message${errorMsg ? " danger" : ""}`}>
          <p>{errorMsg ? errorMsg : "Welcome to the inner circle."}</p>
          <button
            onClick={() => {
              setIsMailSent(false);
              setErrorMsg("");
            }}
          >
            <TablerIconX />
          </button>
        </div>
      )}

      <div className="gradient-overlay"></div>

      <form
        ref={hiddenFormRef}
        action="https://0fc5180e.sibforms.com/serve/MUIFAAkTXNSnxSMVINcph_7c-yv8X1w_VyfpCqu-1ciY199sIkXcGGy8IupuBv-myaky8kaWcLj4mVI4ZZZAJsgeewC7_yhNdemgErNK1mRVac21ddNudyxbtGlx3nCqO4EPc3_XIqgzxFp_Q5YK2RhKf3ebdHeSXvF_irbqPSS80B_kQszMVj7X5Setuqg2fJCmRY03Na0fyppA"
        method="POST"
        target="hidden_iframe"
        style={{ display: "none" }}
      >
        <input name="FIRSTNAME" value={formValues.firstName} readOnly />
        <input name="LASTNAME" value={formValues.lastName} readOnly />
        <input name="EMAIL" value={formValues.email} readOnly />
        <input name="email_address_check" value="" readOnly />
        <input name="locale" value="en" readOnly />
        <input name="html_type" value="simple" readOnly />
        <input name="recaptcha_token" value={captchaToken} readOnly />
      </form>
      <iframe name="hidden_iframe" style={{ display: "none" }}></iframe>
    </main>
  );
}

export default App;
