import React, { useEffect, useRef, useState } from "react";

export default function PhoneFullscreen() {
  const button = useRef(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const phone = button.current.closest(".phone");
    const sync = () => setExpanded(document.fullscreenElement === phone);
    const escape = (event) => {
      if (event.key === "Escape" && phone.classList.contains("phone-expanded")) {
        phone.classList.remove("phone-expanded");
        setExpanded(false);
        button.current?.focus();
      }
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("keydown", escape);
      phone.classList.remove("phone-expanded");
    };
  }, []);

  async function toggle() {
    const phone = button.current.closest(".phone");
    if (document.fullscreenElement === phone) {
      await document.exitFullscreen();
    } else if (expanded) {
      phone.classList.remove("phone-expanded");
      setExpanded(false);
    } else {
      try {
        await phone.requestFullscreen();
      } catch {
        // Mobile browsers may not support fullscreen for arbitrary elements.
        phone.classList.add("phone-expanded");
        setExpanded(true);
      }
    }
    button.current?.focus();
  }

  return (
    <button ref={button} className="phone-fullscreen" onClick={toggle} aria-pressed={expanded}>
      {expanded ? "Exit fullscreen" : "Fullscreen"}
    </button>
  );
}
