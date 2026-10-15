# Care Space — interactive customer, manager, and staff wireframes

Three grayscale React prototypes based on the customer, manager, and staff references in `design/`. Built with Vite, wired-elements, and react-doodle-icons. App screens use Patrick Hand; the review controls use IBM Plex Sans.

The main page is an app chooser with previews of the actual wireframes. Each app has one **All apps** link back to the chooser and a reset control. Screen directories, cross-app links, and screen-note panels are removed; use each app's own tabs, menus, and back buttons. Keyboard users can use **Skip to prototype** to reach the active screen. On the staff agenda, **Pilih tanggal lain** expands the date input; the week strip remains directly available.

## Run

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`) and choose **Customer**, **Manager**, or **Staff**. Hovering or focusing a choice changes its preview; selecting it opens the app. All three links work on mobile. Direct links remain available at `/?app=customer`, `/?app=manager`, and `/?app=staff`. Missing or unknown app parameters show the chooser.

The customer app starts at Home. Welcome is accessible by signing out of the demo account. Returning to the chooser or switching apps resets the current in-memory session.

```sh
npm run build
npm run preview
```

## Staff prototype

Choose **Staff** on the main page, or open `http://localhost:5173/?app=staff` (use the port printed by Vite).

Based on the four images in `design/staff_app/`:

- **Agenda:** Esta's three appointments, selectable dates, a reference-week strip, read-only working hours and break, and empty-date states.
- **Detail layanan:** open **Drestayumna Nurmareko / CS-1042**, already checked in at 09:28. Start the service, then complete it with confirmation; the agenda reflects each status. Scheduled appointments cannot start before check-in, and only one service can be in progress.
- **Ketersediaan:** toggle acceptance of new bookings and save. Existing reservations remain unchanged. Leaving with unsaved edits prompts for confirmation.
- **Profil staf:** read-only staff ID **STF-004**, active account status, merchant, and assigned services; demo sign-out and sign-in.

**Staff boundaries:** uses the reference date **9 October 2026** and Esta's **09:00–17:00** shift with **12:00–13:00** break. Other dates intentionally have no demo schedule or appointments. “Hari ini” returns to the reference date. Service completion, confirmation dialogs, and a clearly labeled Front Desk check-in simulator are prototype extensions. The simulator is not a staff permission. Customer, manager, and staff sessions are independent; switching prototypes/reloading resets in-memory data. Staff sign-out alone retains the current demo data for re-entry. No real authentication or scheduling changes occur.

## Manager prototype

Choose **Manager** on the main page, or open `http://localhost:5173/?app=manager` (use the port printed by Vite).

The manager prototype follows the six images in `design/manager_app/`:

- **Front Desk:** search booking codes, confirm arrival, and switch between pending and arrived customers. Try `CS-1045` for Raka Pradana.
- **Reservations:** filter by date, staff, and status; open details and inspect the activity timeline.
- **Reservation detail:** confirm arrival, start/complete service, or cancel an eligible reservation with confirmation. Status changes update the shared lists and session audit trail.
- **Operations hub:** navigate to business, service, hours, team, schedule, and activity screens.
- **Business editor:** save name, description, address, optional phone, and timezone.
- **Service editor:** edit name, description, duration, price, assigned staff, and active status. Existing reservations retain their original service snapshots.

Weekly hours, staff access toggles, shift editing, and session activity are inferred supplementary screens for the hub links; the supplied references do not show their detailed layouts. The additional reservation lifecycle controls are also prototype extensions.

**Manager boundaries:** the scenario date is fixed to **9 October 2026**, matching the references. State resets on reload and is not shared with the customer app. No real accounts, check-ins, permissions, or business settings are changed. Timezone is saved as a demo setting, without converting the example appointment times. Hours, staff access, and shifts are editable examples, not a booking-availability engine. The Beard Trim price is illustrative.

## Try a complete booking

1. Choose **Pesan** on the recommended Kemang outlet.
2. Choose a service, stylist, date, and available time.
3. Add an optional note and select **Masuk & konfirmasi**.
4. Enter a phone number with 9–13 digits after +62, without a leading zero. Example: `82110778883`.
5. Enter demo verification code **123456**.
6. Confirm the booking, then view or cancel it from appointment details.

## Included interactions

- Welcome, simulated Google sign-in, phone validation, and demo OTP verification.
- Search by outlet name/address, service-category filtering, and empty results.
- Outlet services and deals, favorites, reviews, reward eligibility, and location/contact dialogs.
- Stylist selection with a fully-booked-state toggle, available dates/times, booking review, special notes, confirmation, appointment history, and cancellation.
- Guest and signed-in profiles, profile editing, account reset, and sign-out.
- Indonesian/English primary navigation and heading selection.
- Support reason selection and simulated submission.
- Responsive app chooser, keyboard-accessible previews, and app-native navigation at all widths.

## Prototype boundaries

- No backend, real authentication, SMS, Google account access, payments, reservations, or support delivery.
- State is held in memory and resets on reload. Google sign-in uses a sample account after confirmation.
- Future dates are generated relative to the current date. Availability is simulated; the reference's all-stylists-full state can be tested with the toggle.
- Language selection translates primary navigation/headings, not all service content.
- Beauty Care is illustrative demo content. Refleksologi and Salon show deliberate empty states because their outlet data is not in the supplied references.
- Booking supports one service at a time. The review screen allows changing the selection rather than a multi-service cart.
- Google Fonts requires an internet connection; the application libraries are bundled locally.
- The reference images are preserved unchanged. Image areas are sketch placeholders, not production photography.

## Validation

```sh
npx playwright install chromium
npm test
```

The 28 Playwright tests cover app selection and return navigation, chooser layouts at 1440/768/390px, reduced motion, unknown app fallback, keyboard skip navigation, the expandable staff date picker, staff service progression, check-in gating, availability persistence and unsaved edits, empty dates, read-only profile and sign-out, plus customer booking/sign-in/cancellation, search and favorites, support, profile edits, language navigation, manager check-in and service completion, reservation filters, editor validation, service snapshot preservation, shift persistence, screen rendering, and mobile navigation. Tests start and stop their own Vite server on port 4173. Desktop and mobile screenshots for all three apps are written to ignored `test-results/`.

## Files

- `main.jsx` — customer screens and query-parameter entry selection; lazy-loads the chooser, manager, and staff apps.
- `chooser.jsx` and `chooser.css` — app selection page and live screenshot preview.
- `prototype-shell.css` — minimal outer controls shared by all apps.
- `public/previews/` — screenshots captured from this project's apps; no stock imagery.
- `tests/chooser.spec.js` — chooser navigation and responsive tests.
- `staff.jsx` and `staff.css` — staff prototype and scoped styling.
- `tests/staff.spec.js` — staff browser regression tests.
- `manager.jsx` — manager screens, reference scenario, and session interactions.
- `manager.css` — scoped manager styles that reuse the customer presentation shell.
- `tests/manager.spec.js` — manager browser regression tests.
- `style.css` — sketch-style components, mobile frame, and responsive presentation layout.
- `tests/prototype.spec.js` — browser regression tests.
- `agents.md` — persistent wireframe design rules.
