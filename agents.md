# Wireframe Prototype Rules

- Build a lightweight interactive SPA; use component state for navigation, not a routing library.
- `/` is the app chooser. Keep `?app=customer|manager|staff` as direct entry points. Each prototype has one All apps return link plus reset; navigate within apps using their native tabs, menus, and back controls, not debug sidebars or cross-app links.
- The chooser uses IBM Plex Sans, flat grayscale fields, concise role links, and actual app screenshots. The hand-drawn component rules below apply inside the wireframes, not to the chooser.
- Use a strict grayscale palette, white surfaces, dotted graph-paper backgrounds, and irregular hand-drawn borders.
- Use Patrick Hand inside the app wireframes and IBM Plex Sans for the surrounding prototype navigation and headers. Default app text is 18px; no text is smaller than 13px.
- Keep the presentation shell utilitarian: screen names, controls, and one concise demo notice. Do not add screen-note panels, reference footers, or repeated explanations of obvious controls. Avoid slogans, decorative handwritten callouts, static journey lists, and repeated prototype badges.
- Use wired-elements for interactive inputs, checkboxes, selects, and sketchy panels. Use native sketch-bordered buttons for primary and secondary actions, not wired-button.
- In React, use react-doodle-icons for icons; never use emoji. Consult the wireframer skill's ICONS.md for exported names.
- Use realistic product copy and make navigation and key workflows functional. Clearly label simulated data and actions.
