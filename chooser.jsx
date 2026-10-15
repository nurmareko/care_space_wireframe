import React, { useEffect, useState } from "react";
import "./chooser.css";

const apps = [
  {
    id: "customer",
    name: "Customer",
    description: "Find a service and book an appointment.",
    preview: "Browse services and nearby outlets.",
  },
  {
    id: "manager",
    name: "Manager",
    description: "Manage arrivals, reservations, and the team.",
    preview: "Check in customers at the front desk.",
  },
  {
    id: "staff",
    name: "Staff",
    description: "View your agenda and manage availability.",
    preview: "See Esta’s appointments for the day.",
  },
];

export default function AppChooser() {
  const [active, setActive] = useState("customer");
  useEffect(() => {
    document.title = "Care Space — Choose an app";
  }, []);
  return (
    <main className="app-chooser">
      <section className="chooser-content" aria-labelledby="chooser-title">
        <header className="chooser-brand">Care Space</header>
        <div className="chooser-intro">
          <h1 id="chooser-title">Choose your app.</h1>
          <p>Explore booking, daily operations, or your workday.</p>
        </div>
        <nav className="chooser-options" aria-label="Choose an app">
          {apps.map((app) => (
            <a
              key={app.id}
              href={`?app=${app.id}`}
              aria-label={app.name}
              className={
                active === app.id
                  ? "chooser-option is-previewed"
                  : "chooser-option"
              }
              onMouseEnter={() => setActive(app.id)}
              onFocus={() => setActive(app.id)}
            >
              <span>
                <strong>{app.name}</strong>
                <span className="chooser-description">{app.description}</span>
              </span>
              <svg
                aria-hidden="true"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
              >
                <path
                  d="M5 14h17m-7-7 7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </a>
          ))}
        </nav>
        <p className="chooser-disclaimer">
          Interactive prototypes. Demo data only.
        </p>
      </section>
      <section className="chooser-stage" aria-label="App preview">
        <div className="chooser-preview" data-ui>
          {apps.map((app) => (
            <img
              key={app.id}
              src={`/previews/${app.id}.png`}
              width="780"
              height="1688"
              className={active === app.id ? "is-visible" : ""}
              alt={`${app.name} app: ${app.preview}`}
              aria-hidden={active !== app.id}
              decoding="async"
            />
          ))}
        </div>
        <p className="chooser-caption" aria-live="polite">
          {apps.find((app) => app.id === active).preview}
        </p>
      </section>
    </main>
  );
}
