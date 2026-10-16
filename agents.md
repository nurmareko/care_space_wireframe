# Wireframe Prototype Rules

- Build a lightweight interactive SPA; use component state for navigation, not a routing library.
- `/` is the app chooser. Keep `?app=customer|manager|staff` as direct entry points. Each app has an All apps link, reset, and a screen-navigation sidebar alongside native app navigation. Zen mode hides the sidebar and surrounding controls, keeps the phone centered and viewport-fitted, and exits with a small control or Escape. Do not use browser fullscreen.
- The chooser uses Patrick Hand, white wired-card surfaces, doodle icons, concise role links, and a dotted background. Keep it a simple hand-drawn app selector, not a marketing page or split-screen preview.
- Use a strict grayscale palette, white surfaces, dotted graph-paper backgrounds, and irregular hand-drawn borders.
- Use Patrick Hand inside the app wireframes and IBM Plex Sans for the surrounding prototype navigation and headers. Default app text is 18px; no text is smaller than 13px.
- Keep the presentation shell utilitarian: screen names and controls. Keep English as the default and omit demo labels and simulation shortcuts. Do not add screen-note panels, reference footers, or repeated explanations of obvious controls. Avoid slogans, decorative handwritten callouts, static journey lists, and repeated prototype badges.
- Use wired-elements for interactive inputs, checkboxes, selects, and sketchy panels. Use native sketch-bordered buttons for primary and secondary actions, not wired-button.
- In React, use react-doodle-icons for icons; never use emoji. Consult the wireframer skill's ICONS.md for exported names.
- Use realistic product copy and make navigation and key workflows functional. Clearly label simulated data and actions.
