import React, { useEffect, useRef, useState } from "react";
import PrototypeSidebar from "./prototype-sidebar.jsx";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ShopIcon,
  CutIcon,
  LockIcon,
  TickIcon,
  InfoIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "react-doodle-icons";
import "wired-elements";
import "./staff.css";

const TODAY = "2026-10-09";
const OUTLET = "Di Bawah Pohon Barber & Shop Kemang";
const initialAppointments = [
  {
    id: "CS-1042",
    name: "Drestayumna Nurmareko",
    start: "09:30",
    end: "10:15",
    duration: 45,
    service: "Haircut by Certified Barber",
    status: "Arrived",
    events: ["Arrival confirmed by Front Desk at 09:28."],
  },
  {
    id: "CS-1047",
    name: "Bima Pratama",
    start: "11:00",
    end: "11:30",
    duration: 30,
    service: "Beard Trim",
    status: "Scheduled",
    events: [],
  },
  {
    id: "CS-1049",
    name: "Arif Rahman",
    start: "14:00",
    end: "14:45",
    duration: 45,
    service: "Haircut by Certified Barber",
    status: "Scheduled",
    events: [],
  },
];
const pages = [
  ["agenda", "Agenda", CalendarIcon],
  ["detail", "Service details", CutIcon],
  ["availability", "Availability", ClockIcon],
  ["profile", "Staff profile", UserIcon],
];

const dateLabel = (value) =>
  value
    ? new Date(value + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Choose a date";
function Icon({ as: Component = ArrowRightIcon, size = 20 }) {
  return (
    <span className="staff-icon" aria-hidden="true">
      <Component size={size} color="currentColor" />
    </span>
  );
}
function Button({ secondary = false, children, ...props }) {
  return (
    <button className={secondary ? "btn-secondary" : "btn-primary"} {...props}>
      {children}
    </button>
  );
}
function Panel({ children }) {
  return <wired-card style={{ background: "white" }}>{children}</wired-card>;
}
function Modal({ value, close }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    return () => previous?.focus();
  }, []);
  return (
    <dialog
      className="modal"
      ref={ref}
      aria-labelledby="staff-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <Icon as={InfoIcon} size={32} />
      <h2 id="staff-dialog-title">{value.title}</h2>
      <p>{value.body}</p>
      <Button
        onClick={() => {
          value.action();
          close();
        }}
      >
        {value.label}
        <Icon as={TickIcon} />
      </Button>
      <Button secondary onClick={close}>
        Back
      </Button>
    </dialog>
  );
}
export default function StaffApp() {
  const [screen, setScreen] = useState("agenda"),
    [selected, setSelected] = useState("CS-1042"),
    [date, setDate] = useState(TODAY),
    [appointments, setAppointments] = useState(initialAppointments),
    [available, setAvailable] = useState(true),
    [draft, setDraft] = useState(true),
    [signed, setSigned] = useState(true),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState("");
  const scroll = useRef(null);
  const dirty = draft !== available;
  const active = appointments.find((a) => a.id === selected);
  const hasSchedule = date === TODAY;
  const dayAppointments = hasSchedule ? appointments : [];
  useEffect(() => {
    document.title = "Care Space — Staff";
    document.documentElement.lang = "en";
  }, []);
  useEffect(() => {
    scroll.current?.scrollTo(0, 0);
  }, [screen, signed, selected]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  function navigate(target) {
    const move = () => {
      setDraft(available);
      setScreen(target);
    };
    if (screen === "availability" && dirty) {
      setModal({
        title: "Discard changes?",
        body: "Your availability changes have not been saved. Saved availability will stay unchanged.",
        label: "Discard & continue",
        action: move,
      });
    } else move();
  }
  function changeDate(next) {
    const move = () => {
      setDraft(available);
      setDate(next);
    };
    if (dirty) {
      setModal({
        title: "Discard changes?",
        body: "Save or discard your changes before choosing another date.",
        label: "Discard & change date",
        action: move,
      });
    } else move();
  }
  function openAppointment(a) {
    setSelected(a.id);
    navigate("detail");
  }
  function updateStatus(next) {
    const event =
      next === "In progress"
        ? "Service started by Esta."
        : "Service completed by Esta.";
    setAppointments((all) =>
      all.map((a) =>
        a.id === selected
          ? {
              ...a,
              status: next,
              events: [...a.events, event],
            }
          : a,
      ),
    );
    setToast(event);
  }
  const canStart =
    active.status === "Arrived" &&
    !appointments.some((a) => a.status === "In progress");
  function DateField() {
    return (
      <label className="staff-date">
        <span className="inline">
          <Icon as={CalendarIcon} />
          Date
        </span>
        <wired-input
          type="date"
          aria-label="Date"
          value={date}
          onInput={(e) => changeDate(e.target.value)}
        />
      </label>
    );
  }
  function Shift({ locked = false }) {
    return (
      <Panel>
        {hasSchedule ? (
          <div className={locked ? "staff-shift locked" : "staff-shift"}>
            {[
              ["Working hours", "09:00–17:00"],
              ["Break", "12:00–13:00"],
            ].map(([label, time]) => (
              <div key={label}>
                <Icon as={ClockIcon} size={24} />
                <span>
                  <span className="text-xs muted">{label}</span>
                  <strong>{time}</strong>
                </span>
                {locked && <Icon as={LockIcon} />}
              </div>
            ))}
          </div>
        ) : (
          <div className="inline">
            <Icon as={InfoIcon} />
            <p>No schedule for this date.</p>
          </div>
        )}
      </Panel>
    );
  }
  let content;
  if (!signed) {
    content = (
      <div className="staff-empty" id="staff-signedout">
        <span className="avatar large">E</span>
        <h1>See you, Esta.</h1>
        <p>You have signed out.</p>
        <Button
          onClick={() => {
            setSigned(true);
            setScreen("agenda");
          }}
        >
          Sign in as Esta
          <Icon />
        </Button>
      </div>
    );
  } else
    switch (screen) {
      case "agenda":
        content = (
          <>
            <div className="between">
              <h2>
                {date
                  ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "Choose a date"}
              </h2>
              <button
                className="btn-secondary staff-today"
                onClick={() => changeDate(TODAY)}
              >
                Today
              </button>
            </div>
            <div className="staff-week" aria-label="Week view">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (label, i) => {
                  const value = "2026-10-" + String(i + 5).padStart(2, "0");
                  return (
                    <button
                      key={value}
                      aria-label={`${label}, ${i + 5} October`}
                      aria-pressed={date === value}
                      className={date === value ? "selected" : ""}
                      onClick={() => changeDate(value)}
                    >
                      <span>{label}</span>
                      <strong>{i + 5}</strong>
                    </button>
                  );
                },
              )}
            </div>
            <details className="staff-date-picker">
              <summary>Choose another date</summary>
              <DateField />
            </details>
            <Shift />
            <div className="between">
              <h2>{hasSchedule ? "Today’s appointments" : "Appointments"}</h2>
              <span className="badge">{dayAppointments.length}</span>
            </div>
            <div className="staff-agenda">
              {dayAppointments.map((a) => (
                <button
                  className={
                    "staff-appointment " +
                    (a.status === "Arrived" ? "highlighted" : "")
                  }
                  key={a.id}
                  onClick={() => openAppointment(a)}
                >
                  <span className="staff-time">
                    {a.start}
                    <br />
                    {a.end}
                  </span>
                  <span className="staff-appointment-copy">
                    <h3>{a.name}</h3>
                    <span className="staff-status">
                      <Icon
                        as={a.status === "Scheduled" ? ClockIcon : TickIcon}
                        size={15}
                      />
                      {a.status}
                    </span>
                    <p>{a.service}</p>
                    <span className="text-xs muted">{a.duration} min</span>
                  </span>
                  <Icon />
                </button>
              ))}
            </div>
            {!dayAppointments.length && (
              <div className="staff-empty">
                <Icon as={CalendarIcon} size={40} />
                <h2>No appointments</h2>

                <Button secondary onClick={() => changeDate(TODAY)}>
                  Back to today
                  <Icon />
                </Button>
              </div>
            )}
          </>
        );
        break;
      case "detail":
        content = (
          <>
            <div className="between">
              <span>Appointment {active.id}</span>
              <span className="staff-status">
                <Icon
                  as={active.status === "Scheduled" ? ClockIcon : TickIcon}
                  size={16}
                />
                {active.status}
              </span>
            </div>
            {active.events.length > 0 && (
              <p className="text-xs muted">{active.events[0]}</p>
            )}
            <div className="staff-section">
              <p className="text-xs muted">Customer</p>
              <div className="inline">
                <span className="avatar">
                  {active.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <h2>{active.name}</h2>
              </div>
            </div>
            <wired-divider />
            <h2>Service schedule</h2>
            <p className="inline">
              <Icon as={CalendarIcon} />
              {dateLabel(TODAY)}
            </p>
            <p className="inline staff-time-large">
              <Icon as={ClockIcon} size={27} />
              {active.start}–{active.end}
            </p>
            <span className="text-xs muted">{active.duration} min</span>
            <wired-divider />
            <h2>Services</h2>
            <h3 className="inline">
              <Icon as={CutIcon} size={28} />
              {active.service}
            </h3>
            <wired-divider />
            <h2>Assignment</h2>
            <div className="staff-assignment">
              <Icon as={UserIcon} />
              <span className="muted">Barber</span>
              <span>Esta</span>
              <Icon as={ShopIcon} />
              <span className="muted">Merchant</span>
              <span>{OUTLET}</span>
            </div>
            <div className="staff-notice">
              <Icon as={ClockIcon} />
              <p>
                {
                  {
                    Scheduled:
                      "Waiting for Front Desk to confirm arrival.",
                    "Arrived": "Service has not started.",
                    "In progress": "Service is in progress.",
                    Completed: "Service is complete. Thank you, Esta.",
                  }[active.status]
                }
              </p>
            </div>
            {["Scheduled", "Arrived"].includes(active.status) && (
              <Button
                disabled={!canStart}
                onClick={() =>
                  setModal({
                    title: "Start service?",
                    body:
                      active.name +
                      " · " +
                      active.service +
                      ". The agenda status will be updated.",
                    label: "Yes, start service",
                    action: () => updateStatus("In progress"),
                  })
                }
              >
                Start service
                <Icon />
              </Button>
            )}
            {active.status === "Arrived" && !canStart && (
              <p className="text-xs muted">
                Complete the current service first.
              </p>
            )}
            {active.status === "In progress" && (
              <Button
                onClick={() =>
                  setModal({
                    title: "Complete service?",
                    body:
                      "Confirm that service for " +
                      active.name +
                      " is complete.",
                    label: "Yes, complete service",
                    action: () => updateStatus("Completed"),
                  })
                }
              >
                Complete service
                <Icon as={TickIcon} />
              </Button>
            )}
            {active.status === "Completed" && (
              <Panel>
                <h3>Service history</h3>
                {active.events.map((event) => (
                  <p className="text-xs muted" key={event}>
                    {event}
                  </p>
                ))}
              </Panel>
            )}
            <Button
              secondary
              onClick={() => {
                setDate(TODAY);
                navigate("agenda");
              }}
            >
              Back to agenda
              <Icon as={CalendarIcon} />
            </Button>

          </>
        );
        break;
      case "availability":
        content = (
          <>
            <DateField />
            <h2>Work schedule</h2>
            <p className="text-xs muted">Set by your manager</p>
            <Shift locked />
            <h2>My availability</h2>
            <Panel>
              <div className="between">
                <div>
                  <h3>Accept new appointments</h3>
                  <p>
                    {hasSchedule
                      ? draft
                        ? "Available"
                        : "Unavailable"
                      : "No schedule"}
                  </p>
                </div>
                <wired-toggle
                  aria-label="Accept new appointments"
                  disabled={!hasSchedule}
                  checked={hasSchedule && draft}
                  onChange={(e) => setDraft(e.target.checked)}
                />
              </div>
              <p className="text-xs muted">
                Applies to open slots in today’s schedule.
              </p>
            </Panel>
            <div className="staff-notice">
              <Icon as={CalendarIcon} size={26} />
              <div>
                <h3>
                  {dayAppointments.length} appointments{" "}
                  {hasSchedule ? "today" : "on this date"}
                </h3>
                <p>
                  Availability changes do not cancel confirmed appointments.
                </p>
              </div>
            </div>
            <button
              className="staff-link-row"
              onClick={() => navigate("agenda")}
            >
              View agenda
              <Icon />
            </button>
            <Button
              disabled={!dirty || !hasSchedule}
              onClick={() => {
                setAvailable(draft);
                setToast("Availability saved.");
              }}
            >
              Save changes
              <Icon as={TickIcon} />
            </Button>
            {dirty && (
              <p className="text-xs muted">
                You have unsaved changes.
              </p>
            )}
          </>
        );
        break;
      case "profile":
        content = (
          <>
            <div className="staff-profile-person">
              <span className="avatar large">E</span>
              <div>
                <h1>Esta</h1>
                <p className="muted">Barber</p>
              </div>
            </div>
            <h2>Assignment</h2>
            <div className="inline">
              <span className="avatar">
                <Icon as={ShopIcon} size={30} />
              </span>
              <div>
                <p className="text-xs muted">Business</p>
                <h3>{OUTLET}</h3>
              </div>
            </div>
            <h2>Account information</h2>
            <Panel>
              <div className="staff-info-row">
                <Icon as={UserIcon} />
                <span>Staff ID</span>
                <strong>STF-004</strong>
              </div>
              <wired-divider />
              <div className="staff-info-row">
                <Icon as={LockIcon} />
                <span>Account status</span>
                <span className="staff-status">
                  <Icon as={TickIcon} size={16} />
                  Active
                </span>
              </div>
            </Panel>
            <h2>Services</h2>
            <p className="text-xs muted">Services assigned by your manager</p>
            <Panel>
              <p className="inline">
                <Icon as={CutIcon} />
                Haircut by Certified Barber
              </p>
              <wired-divider />
              <p className="inline">
                <Icon as={CutIcon} />
                Beard Trim
              </p>
            </Panel>
            <p className="text-xs muted">
              Your manager handles assignment changes.
            </p>
            <Button
              secondary
              onClick={() =>
                setModal({
                  title: "Sign out?",
                  body: "You will be signed out of Esta’s account.",
                  label: "Yes, sign out",
                  action: () => {
                    setSigned(false);
                    setDraft(available);
                  },
                })
              }
            >
              <Icon as={ArrowLeftIcon} />
              Sign out
            </Button>
          </>
        );
        break;
    }
  const page = pages.find((p) => p[0] === screen);
  return (
    <div className="workspace staff-workspace">
      <PrototypeSidebar
        active={signed ? screen : "signedout"}
        items={[
          ...pages.map(([id, label, icon]) => ({
            id, label, icon,
            disabled: !signed || (id === "detail" && (!active || !hasSchedule)),
            hint: !signed ? "Sign in first" : id === "detail" && !hasSchedule ? "Choose a scheduled date first" : undefined,
            onSelect: () => id === "detail" ? openAppointment(active) : navigate(id),
          })),
          ...(!signed ? [{ id: "signedout", label: "Signed out", icon: UserIcon, onSelect: () => {} }] : []),
        ]}
      />
      <main className="canvas">
        <header className="canvas-header">
          <a className="prototype-return" href="/">
            All apps
          </a>
          <div>
            <h1>Staff</h1>
          </div>
          <div className="staff-toolbar">
            <Button
              secondary
              onClick={() =>
                setModal({
                  title: "Reset session?",
                  body: "All service statuses and availability changes in this session will return to their initial values.",
                  label: "Reset session",
                  action: () => window.location.reload(),
                })
              }
            >
              Reset session
            </Button>
          </div>
        </header>
        <div className="stage">
          <div className="phone">
            <div className="status-bar">
              <span>9:41</span>
              <span className="notch" />
              <span aria-hidden="true" />
            </div>
            <header className="app-header">
              {screen === "detail" && signed && (
                <button
                  className="back"
                  aria-label="Back"
                  onClick={() => navigate("agenda")}
                >
                  <Icon as={ArrowLeftIcon} />
                </button>
              )}
              <h1 className="app-brand">Care Space</h1>
              <span className="badge">Staff</span>
            </header>
            <div
              className="screen"
              id="prototype-content"
              tabIndex={-1}
              ref={scroll}
            >
              {signed && (
                <section className="staff-hero" id={"staff-" + screen}>
                  <div>
                    <h1>{page[1]}</h1>
                    {screen === "agenda" && (
                      <>
                        <p>Good morning, Esta</p>
                        <h3>{OUTLET}</h3>
                      </>
                    )}
                    {screen === "availability" && <p>Esta · Barber</p>}
                  </div>
                  {screen !== "profile" && (
                    <span className="staff-emblem">
                      {screen === "detail" ? (
                        <Icon as={CutIcon} size={32} />
                      ) : (
                        "E"
                      )}
                    </span>
                  )}
                </section>
              )}
              {content}
            </div>
            {signed && (
              <nav className="bottom-nav" aria-label="Staff navigation">
                {[
                  ["agenda", "Agenda", CalendarIcon],
                  ["availability", "Availability", ClockIcon],
                  ["profile", "Profile", UserIcon],
                ].map(([id, label, icon]) => (
                  <button
                    key={id}
                    aria-current={
                      screen === id || (screen === "detail" && id === "agenda")
                        ? "page"
                        : undefined
                    }
                    className={
                      screen === id || (screen === "detail" && id === "agenda")
                        ? "active"
                        : ""
                    }
                    onClick={() => navigate(id)}
                  >
                    <Icon as={icon} size={24} />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            )}
            <div className="home-indicator" />
            {toast && (
              <div className="toast" role="status">
                <Icon as={TickIcon} />
                {toast}
              </div>
            )}
          </div>
        </div>
      </main>
      {modal && <Modal value={modal} close={() => setModal(null)} />}
    </div>
  );
}
