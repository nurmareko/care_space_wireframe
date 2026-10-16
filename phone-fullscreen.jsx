import React from "react";
import { ArrowNeIcon, ArrowSwIcon } from "react-doodle-icons";

// Zen mode is a shell layout, not browser fullscreen.
export default function PhoneFullscreen({ expanded, onClick, buttonRef }) {
  const Icon = expanded ? ArrowSwIcon : ArrowNeIcon;
  return (
    <button
      ref={buttonRef}
      type="button"
      className={expanded ? "zen-control zen-exit" : "zen-control zen-entry"}
      aria-pressed={expanded}
      onClick={onClick}
    >
      <Icon size={18} color="currentColor" aria-hidden="true" />
      {expanded ? "Exit Zen mode" : "Zen mode"}
    </button>
  );
}
