import React, { useEffect, useId, useRef, useState } from "react";
import { FileListIcon, ArrowRightIcon } from "react-doodle-icons";
import PhoneFullscreen from "./phone-fullscreen.jsx";

export default function PrototypeSidebar({ items, active }) {
  const [open, setOpen] = useState(false);
  const [zen, setZen] = useState(false);
  const container = useRef(null);
  const toggle = useRef(null);
  const entry = useRef(null);

  const menuId = useId();

  useEffect(() => {
    const workspace = container.current.closest(".workspace");
    workspace.classList.toggle("zen-mode", zen);
    if (zen) entry.current?.focus();
    return () => workspace.classList.remove("zen-mode");
  }, [zen]);

  function leaveZen() {
    setZen(false);
    requestAnimationFrame(() => {
      entry.current?.focus();
    });
  }

  useEffect(() => {
    const escape = (event) => {
      // Observe dialogs before their cancel handler can unmount them.
      if (event.key !== "Escape" || event.defaultPrevented || document.querySelector("dialog[open]")) return;
      if (zen) {
        event.preventDefault();
        leaveZen();
      } else if (open) {
        event.preventDefault();
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", escape, true);
    return () => document.removeEventListener("keydown", escape, true);
  }, [zen, open]);

  return (
    <>
      <aside ref={container} className="prototype-sidebar" hidden={zen}>
        <button
          ref={toggle}
          type="button"
          className="screen-menu-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(!open)}
        >
          <FileListIcon size={20} color="currentColor" aria-hidden="true" />
          {open ? "Close screen menu" : "Screen menu"}
        </button>
        <div id={menuId} className={`screen-menu${open ? " is-open" : ""}`}>
          <a className="prototype-return" href="/">All apps</a>
          <h2>Screens</h2>
          <nav aria-label="Screen navigation">
            {items.map(({ id, label, icon: Icon = ArrowRightIcon, onSelect, disabled, hint }) => (
              <button
                key={id}
                type="button"
                data-screen={id}
                aria-current={active === id ? "page" : undefined}
                disabled={disabled}
                title={hint}
                onClick={() => {
                  if (active !== id) onSelect();
                  setOpen(false);
                  requestAnimationFrame(() => {
                    if (!document.querySelector("dialog[open]")) {
                      container.current.closest(".workspace").querySelector(".screen")?.focus();
                    }
                  });
                }}
              >
                <Icon size={18} color="currentColor" aria-hidden="true" />
                <span>{label}{disabled && hint && <small>{hint}</small>}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
      <PhoneFullscreen expanded={zen} buttonRef={entry} onClick={() => {
        if (zen) leaveZen();
        else { setOpen(false); setZen(true); }
      }} />
    </>
  );
}
