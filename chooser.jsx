import React, { useEffect } from "react";
import { ArrowRightIcon, CalendarIcon, DashboardIcon, UserIcon } from "react-doodle-icons";
import "wired-elements";
import "./chooser.css";

const apps = [
  {
    id: "customer",
    name: "Customer",
    description: "Find a service and book an appointment.",
    icon: UserIcon,
  },
  {
    id: "manager",
    name: "Manager",
    description: "Manage arrivals, bookings, and your team.",
    icon: DashboardIcon,
  },
  {
    id: "staff",
    name: "Staff",
    description: "View your schedule and availability.",
    icon: CalendarIcon,
  },
];

export default function AppChooser() {
  useEffect(() => {
    document.title = "Care Space — Choose an app";
  }, []);

  return (
    <main className="app-chooser">
      <section className="chooser-content" aria-labelledby="chooser-title">
        <header className="chooser-brand">Care Space</header>
        <div className="chooser-intro">
          <h1 id="chooser-title">Choose your app.</h1>
        </div>
        <nav className="chooser-options" aria-label="Choose an app">
          {apps.map(({ id, name, description, icon: Icon }) => (
            <a
              key={id}
              href={`?app=${id}`}
              aria-label={name}
              aria-describedby={`chooser-${id}-description`}
              className="chooser-option"
            >
              <wired-card class="chooser-card" elevation="1" style={{ background: "white" }}>
                <span className="chooser-card-content">
                  <span className="chooser-icon" aria-hidden="true">
                    <Icon size={32} color="currentColor" />
                  </span>
                  <span className="chooser-copy">
                    <strong>{name}</strong>
                    <span className="chooser-description" id={`chooser-${id}-description`}>
                      {description}
                    </span>
                  </span>
                  <span className="chooser-arrow" aria-hidden="true">
                    <ArrowRightIcon size={24} color="currentColor" />
                  </span>
                </span>
              </wired-card>
            </a>
          ))}
        </nav>
      </section>
    </main>
  );
}
