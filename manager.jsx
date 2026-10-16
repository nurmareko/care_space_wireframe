import React, { useEffect, useRef, useState } from "react";
import PrototypeSidebar from "./prototype-sidebar.jsx";
import {
  ShopIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  InfoIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CutIcon,
  SettingIcon as SettingsIcon,
  TickIcon,
  SearchIcon,
  PencilIcon as EditIcon,
} from "react-doodle-icons";
import "wired-elements";
import "./manager.css";

const DATE = "2026-10-09";
const dateText = (value) =>
  new Date(value + "T12:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const money = (n) => "Rp" + Number(n).toLocaleString("en-GB");
const initialBusiness = {
  name: "Di Bawah Pohon Barber & Shop Kemang",
  description:
    "Expert men’s grooming focused on quality cuts and personal care.",
  address: "Jl. Kemang Raya No. 88A, Mampang Prapatan, Jakarta Selatan",
  phone: "",
  zone: "Asia/Jakarta",
};
const initialServices = [
  {
    id: 1,
    name: "Haircut by Certified Barber",
    description: "Consultation, haircut, and styling.",
    duration: 45,
    price: 230000,
    staff: ["Esta", "Dee", "Adi"],
    active: true,
  },
  {
    id: 2,
    name: "Beard Trim",
    description: "Beard trimming and shaping to suit your preferences.",
    duration: 30,
    price: 75000,
    staff: ["Esta", "Adi"],
    active: true,
  },
];
const people = [
  ["CS-1041", "Nadia Putri", "Dee", "09:00", "09:45", "In service", 1],
  [
    "CS-1043",
    "Drestayumna Nurmareko",
    "Esta",
    "09:30",
    "10:15",
    "Arrived",
    1,
  ],
  ["CS-1045", "Raka Pradana", "Adi", "09:45", "10:30", "Scheduled", 1],
  ["CS-1047", "Bima Pratama", "Esta", "11:00", "11:30", "Scheduled", 2],
  ["CS-1049", "Arif Rahman", "Esta", "14:00", "14:45", "Scheduled", 1],
];
const initialReservations = people.map(
  ([id, name, staff, start, end, status, serviceId]) => ({
    id,
    name,
    staff,
    start,
    end,
    status,
    date: DATE,
    service: { ...initialServices.find((s) => s.id === serviceId) },
    activity: [
      { title: "Reservation created", actor: name, time: "8 Oct 2026, 19:20" },
      ...(status !== "Scheduled"
        ? [
            {
              title: "Arrival confirmed",
              actor: "Maya (Manager)",
              time: "9 Oct 2026, 08:55",
            },
          ]
        : []),
      ...(status === "In service"
        ? [
            {
              title: "Service started",
              actor: staff + " (Barber)",
              time: "9 Oct 2026, 09:02",
            },
          ]
        : []),
    ],
  }),
);
const initialHours = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
].map((day) => ({ day, open: day !== "Monday", start: "09:00", end: "21:00" }));
const pages = [
  ["welcome", "Welcome", ShopIcon],
  ["frontdesk", "Front Desk", UserIcon],
  ["reservations", "Reservations", CalendarIcon],
  ["detail", "Reservation details", InfoIcon],
  ["manage", "Manage business", SettingsIcon],
  ["business", "Business profile", ShopIcon],
  ["services", "Services", CutIcon],
  ["service", "Edit service", EditIcon],
  ["hours", "Business hours", ClockIcon],
  ["staff", "Staff", UserIcon],
  ["schedule", "Staff schedule", CalendarIcon],
  ["activity", "Activity history", ClockIcon],
];

function Icon({ as: Component = ArrowRightIcon, size = 20 }) {
  return <Component size={size} color="currentColor" />;
}
function Button({ children, secondary = false, ...props }) {
  return (
    <button className={secondary ? "btn-secondary" : "btn-primary"} {...props}>
      {children}
    </button>
  );
}
function Panel({ children }) {
  return <wired-card style={{ background: "white" }}>{children}</wired-card>;
}
function Field({ label, value, onChange, area = false, ...props }) {
  const Tag = area ? "wired-textarea" : "wired-input";
  return (
    <label className="manager-field">
      <span>{label}</span>
      <Tag
        aria-label={label}
        value={String(value)}
        onInput={(e) => onChange(e.target.value)}
        {...props}
      />
    </label>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <label className="manager-field">
      <span>{label}</span>
      <wired-combo
        aria-label={label}
        selected={value}
        onselected={(e) => onChange(e.detail.selected)}
      >
        {options.map(([key, text]) => (
          <wired-item key={key} value={key}>
            {text}
          </wired-item>
        ))}
      </wired-combo>
    </label>
  );
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
      aria-labelledby="manager-modal-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <Icon as={InfoIcon} size={32} />
      <h2 id="manager-modal-title">{value.title}</h2>
      <p>{value.body}</p>
      <Button
        onClick={() => {
          value.action();
          close();
        }}
      >
        {value.label || "Confirm"}
        <Icon as={TickIcon} />
      </Button>
      <Button secondary onClick={close}>
        Back
      </Button>
    </dialog>
  );
}
export default function ManagerApp() {
  const [screen, setScreen] = useState("welcome"),
    [history, setHistory] = useState([]),
    [business, setBusiness] = useState(initialBusiness),
    [businessDraft, setBusinessDraft] = useState(initialBusiness),
    [services, setServices] = useState(initialServices),
    [serviceDraft, setServiceDraft] = useState({ ...initialServices[0] }),
    [reservations, setReservations] = useState(initialReservations),
    [selected, setSelected] = useState("CS-1041");
  const [query, setQuery] = useState("CS-1045"),
    [searched, setSearched] = useState("CS-1045"),
    [arrivalTab, setArrivalTab] = useState("arrived"),
    [filterDate, setFilterDate] = useState(DATE),
    [filterStaff, setFilterStaff] = useState("all"),
    [filterStatus, setFilterStatus] = useState("all"),
    [error, setError] = useState(""),
    [toast, setToast] = useState(""),
    [modal, setModal] = useState(null),
    [audit, setAudit] = useState([]);
  const [hours, setHours] = useState(initialHours),
    [hoursDraft, setHoursDraft] = useState(initialHours),
    [staff, setStaff] = useState(
      ["Esta", "Dee", "Adi"].map((name) => ({ name, active: true })),
    ),
    [shiftStaff, setShiftStaff] = useState("Esta"),
    [shifts, setShifts] = useState({}),
    [shift, setShift] = useState({
      start: "09:00",
      end: "18:00",
      breakStart: "12:00",
      breakEnd: "13:00",
    }),
    [shiftDay, setShiftDay] = useState("Friday");
  const scroll = useRef(null);
  const go = (target) => {
    setHistory((h) => [...h, screen]);
    setError("");
    if (target === "business") setBusinessDraft({ ...business });
    if (target === "hours") setHoursDraft(hours.map((h) => ({ ...h })));
    if (target === "service")
      setServiceDraft({ ...services[0], staff: [...services[0].staff] });
    setScreen(target);
  };
  const back = () => {
    setScreen(history.at(-1) || "frontdesk");
    setHistory((h) => h.slice(0, -1));
    setError("");
  };
  useEffect(() => {
    scroll.current?.scrollTo(0, 0);
  }, [screen]);
  useEffect(() => {
    document.title = "Care Space — Manager";
    document.documentElement.lang = "en";
  }, []);
  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(""), 3500);
      return () => clearTimeout(id);
    }
  }, [toast]);
  const log = (title, detail) =>
    setAudit((a) => [
      {
        title,
        detail,
        time: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        id: crypto.randomUUID(),
      },
      ...a,
    ]);
  const saveNotice = (text) => {
    setError("");
    setToast(text);
  };
  const item = reservations.find((r) => r.id === selected),
    found = reservations.find((r) => r.id === searched),
    scheduled = reservations.filter((r) => r.status === "Scheduled"),
    arrived = reservations.filter((r) =>
      ["Arrived", "In service", "Completed"].includes(r.status),
    );
  const openDetail = (r) => {
    setSelected(r.id);
    go("detail");
  };
  function transition(r, status) {
    const title = {
      "Arrived": "Arrival confirmed",
      "In service": "Service started",
      Completed: "Service completed",
      Cancelled: "Reservation cancelled",
    }[status];
    setReservations((all) =>
      all.map((x) =>
        x.id === r.id
          ? {
              ...x,
              status,
              activity: [
                ...x.activity,
                {
                  title,
                  actor: "Maya (Manager)",
                  time:
                    "Session · " +
                    new Date().toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                },
              ],
            }
          : x,
      ),
    );
    log(title, r.id + " · " + r.name);
    saveNotice(title + " · " + r.name);
  }
  function confirmArrival(r) {
    setModal({
      title: "Confirm arrival?",
      body:
        r.name + " · " + r.id + ". Make sure the customer is here.",
      label: "Yes, confirm arrival",
      action: () => transition(r, "Arrived"),
    });
  }
  function Reservation({ r }) {
    return (
      <button className="manager-reservation" onClick={() => openDetail(r)}>
        <span className="reservation-time">
          {r.start}
          <br />–<br />
          {r.end}
        </span>
        <span className="reservation-person">
          <h3>{r.name}</h3>
          <p>{r.service.name}</p>
          <p>
            {r.staff} · {r.service.duration} min
          </p>
          <span className="manager-status">{r.status}</span>
        </span>
        <Icon />
      </button>
    );
  }
  function Menu({ target, title, description, icon }) {
    return (
      <button className="manager-menu" onClick={() => go(target)}>
        <span className="avatar">
          <Icon as={icon} size={25} />
        </span>
        <span>
          <h3>{title}</h3>
          <p>{description}</p>
        </span>
        <Icon />
      </button>
    );
  }
  const nextStatus = {
    Scheduled: "Arrived",
    "Arrived": "In service",
    "In service": "Completed",
  };
  let content;
  switch (screen) {
    case "welcome":
      content = (
        <>
          <wired-card class="placeholder" style={{ background: "white" }}>
            <span className="cross" />
            <span>Salon welcome photo</span>
          </wired-card>
          <div className="welcome-copy" id="manager-welcome">
            <span className="eyebrow">Your business, in one place</span>
            <h1>
              Welcome to<br />
              your workspace.
            </h1>
            <p>Welcome customers, manage reservations, and support your team.</p>
          </div>
          <Button onClick={() => go("frontdesk")}>
            <Icon as={UserIcon} /> Open Front Desk <Icon />
          </Button>
        </>
      );
      break;
    case "frontdesk":
      content = (
        <>
          <p className="manager-date inline">
            <Icon as={CalendarIcon} />
            {dateText(DATE)}
          </p>
          <p className="text-xs muted">Date: 9 October 2026</p>
          <div className="manager-field">
            <span>Booking code</span>
            <div className="manager-search">
              <wired-input
                aria-label="Booking code"
                value={query}
                placeholder="e.g. CS-1045"
                onInput={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    setSearched(query.trim().toUpperCase());
                }}
              />
              <Button onClick={() => setSearched(query.trim().toUpperCase())}>
                Search
                <Icon as={SearchIcon} />
              </Button>
            </div>
          </div>
          {found ? (
            <Panel>
              <div className="between">
                <span className="text-xs muted">Reservation found</span>
                <span className="manager-status">{found.status}</span>
              </div>
              <h2>{found.name}</h2>
              <p>{found.service.name}</p>
              <p className="text-xs muted">
                {dateText(found.date)} · {found.start}–{found.end}
                <br />
                Barber: {found.staff} · {found.service.duration} min
              </p>
              <wired-divider />
              {found.status === "Scheduled" ? (
                <>
                  <p className="text-xs muted">
                    Make sure the customer is here.
                  </p>
                  <Button onClick={() => confirmArrival(found)}>
                    <Icon as={TickIcon} />
                    Confirm arrival
                  </Button>
                </>
              ) : (
                <Button secondary onClick={() => openDetail(found)}>
                  View reservation details
                  <Icon />
                </Button>
              )}
            </Panel>
          ) : (
            <div className="manager-empty">
              <Icon as={SearchIcon} size={32} />
              <h3>Reservation not found</h3>
              <p>Try CS-1045, CS-1041, or search the reservation list.</p>
              <Button secondary onClick={() => go("reservations")}>
                View reservations
                <Icon />
              </Button>
            </div>
          )}
          <h2>Today’s arrivals</h2>
          <div className="tabs">
            {[
              ["pending", "Not arrived", scheduled.length],
              ["arrived", "Arrived", arrived.length],
            ].map(([key, label, count]) => (
              <button
                key={key}
                className={arrivalTab === key ? "active" : ""}
                onClick={() => setArrivalTab(key)}
              >
                {label} <span className="badge">{count}</span>
              </button>
            ))}
          </div>
          {(arrivalTab === "pending" ? scheduled : arrived).map((r) => (
            <Reservation key={r.id} r={r} />
          ))}
          {!(arrivalTab === "pending" ? scheduled : arrived).length && (
            <p className="manager-empty">
              No customers in this list.
            </p>
          )}
        </>
      );
      break;
    case "reservations": {
      const filtered = reservations.filter(
        (r) =>
          r.date === filterDate &&
          (filterStaff === "all" || r.staff === filterStaff) &&
          (filterStatus === "all" || r.status === filterStatus),
      );
      content = (
        <>
          <Field
            label="Reservation date"
            type="date"
            value={filterDate}
            onChange={setFilterDate}
          />
          <div className="manager-filter-grid">
            <Select
              label="Staff"
              value={filterStaff}
              onChange={setFilterStaff}
              options={["all", "Esta", "Dee", "Adi"].map((x) => [
                x,
                x === "all" ? "All staff" : x,
              ])}
            />
            <Select
              label="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                "all",
                "Scheduled",
                "Arrived",
                "In service",
                "Completed",
                "Cancelled",
              ].map((x) => [x, x === "all" ? "All statuses" : x])}
            />
          </div>
          <div className="between">
            <span className="text-xs muted">{filtered.length} reservations</span>
            <button
              className="link text-xs"
              onClick={() => {
                setFilterDate(DATE);
                setFilterStaff("all");
                setFilterStatus("all");
              }}
            >
              Reset filters
            </button>
          </div>
          {filtered.map((r) => (
            <Reservation key={r.id} r={r} />
          ))}
          {!filtered.length && (
            <div className="manager-empty">
              <Icon as={CalendarIcon} size={36} />
              <h2>No reservations</h2>
              <p>Change the filters to see reservations.</p>
            </div>
          )}
        </>
      );
      break;
    }
    case "detail":
      content = (
        <>
          <div className="between">
            <span>{item.id}</span>
            <span className="manager-status">{item.status}</span>
          </div>
          <h2>Customer</h2>
          <div className="inline">
            <span className="avatar">
              {item.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div>
              <h2>{item.name}</h2>
              <p className="muted">Barber: {item.staff}</p>
            </div>
          </div>
          <wired-divider />
          <h2>Reservation schedule</h2>
          <p className="inline">
            <Icon as={CalendarIcon} />
            {dateText(item.date)}
          </p>
          <p className="inline">
            <Icon as={ClockIcon} />
            {item.start}–{item.end} · {item.service.duration} min
          </p>
          <wired-divider />
          <h2>Services</h2>
          <h3 className="inline">
            <Icon as={CutIcon} />
            {item.service.name}
          </h3>
          <div className="between">
            <span className="muted text-xs">Estimated service cost</span>
            <strong>{money(item.service.price)}</strong>
          </div>
          <wired-divider />
          <h2>Activity</h2>
          <ol className="manager-timeline">
            {item.activity.map((a, i) => (
              <li key={i}>
                <h3>{a.title}</h3>
                <p>
                  {a.actor} · {a.time}
                </p>
              </li>
            ))}
          </ol>
          <div className="manager-notice">
            <Icon as={ClockIcon} />
            <p>
              {item.status === "In service"
                ? "Service is being provided by " + item.staff + "."
                : "Current status: " + item.status + "."}
            </p>
          </div>
          {nextStatus[item.status] && (
            <Button
              onClick={() =>
                item.status === "Scheduled"
                  ? confirmArrival(item)
                  : setModal({
                      title:
                        nextStatus[item.status] === "Completed"
                          ? "Complete service?"
                          : "Start service?",
                      body:
                        "Update the status for " + item.name + ".",
                      action: () => transition(item, nextStatus[item.status]),
                    })
              }
            >
              {item.status === "Scheduled"
                ? "Confirm arrival"
                : item.status === "Arrived"
                  ? "Start service"
                  : "Complete service"}
              <Icon as={TickIcon} />
            </Button>
          )}
          {["Scheduled", "Arrived"].includes(item.status) && (
            <Button
              secondary
              onClick={() =>
                setModal({
                  title: "Cancel reservation?",
                  body:
                    item.name +
                    " · " +
                    item.id +
                    ". This will cancel the reservation.",
                  label: "Yes, cancel",
                  action: () => transition(item, "Cancelled"),
                })
              }
            >
              Cancel reservation
            </Button>
          )}
        </>
      );
      break;
    case "manage":
      content = (
        <>
          <h2>Business</h2>
          <Menu
            target="business"
            title="Business profile"
            description="Name, address, and contact details"
            icon={ShopIcon}
          />
          <Menu
            target="services"
            title="Services"
            description="Prices, durations, and assigned staff"
            icon={CutIcon}
          />
          <Menu
            target="hours"
            title="Business hours"
            description="Opening hours and days off"
            icon={ClockIcon}
          />
          <h2>Team</h2>
          <Menu
            target="staff"
            title="Staff"
            description="Profiles, access, and assignments"
            icon={UserIcon}
          />
          <Menu
            target="schedule"
            title="Staff schedule"
            description="Working hours and breaks"
            icon={CalendarIcon}
          />
          <h2>Monitoring</h2>
          <Menu
            target="activity"
            title="Activity history"
            description="Reservation and service changes"
            icon={ClockIcon}
          />
        </>
      );
      break;
    case "business":
      content = (
        <div className="manager-form">
          <p className="muted">Information visible to customers.</p>
          <Field
            label="Business name"
            value={businessDraft.name}
            onChange={(name) => setBusinessDraft({ ...businessDraft, name })}
          />
          <Field
            area
            label="Description"
            value={businessDraft.description}
            onChange={(description) =>
              setBusinessDraft({ ...businessDraft, description })
            }
          />
          <Field
            area
            label="Address"
            value={businessDraft.address}
            onChange={(address) =>
              setBusinessDraft({ ...businessDraft, address })
            }
          />
          <Field
            label="Business phone number"
            type="tel"
            placeholder="Enter a phone number"
            value={businessDraft.phone}
            onChange={(phone) => setBusinessDraft({ ...businessDraft, phone })}
          />
          <Select
            label="Time zone"
            value={businessDraft.zone}
            onChange={(zone) => setBusinessDraft({ ...businessDraft, zone })}
            options={["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"].map(
              (z, i) => [z, ["WIB", "WITA", "WIT"][i] + " · " + z],
            )}
          />
          <p className="text-xs muted">
            The time zone is saved as a setting; schedules are not
            converted.
          </p>
          {error && <p role="alert">{error}</p>}
          <Button
            onClick={() => {
              if (
                !businessDraft.name.trim() ||
                !businessDraft.description.trim() ||
                !businessDraft.address.trim()
              ) {
                setError("Enter the business name, description, and address.");
                return;
              }
              if (
                businessDraft.phone &&
                !/^\+?[0-9 ()-]{9,20}$/.test(businessDraft.phone)
              ) {
                setError("Enter a valid phone number.");
                return;
              }
              setBusiness({ ...businessDraft });
              log("Business profile updated", businessDraft.name);
              saveNotice("Business profile saved.");
              go("manage");
            }}
          >
            Save changes
            <Icon as={TickIcon} />
          </Button>
        </div>
      );
      break;
    case "services":
      content = (
        <>
          <p className="text-xs muted">
            {services.length} services · Select to edit details
          </p>
          {services.map((s) => (
            <Panel key={s.id}>
              <div className="between">
                <Icon as={CutIcon} size={28} />
                <span className="badge">{s.active ? "Active" : "Inactive"}</span>
              </div>
              <h3>{s.name}</h3>
              <p>
                {s.duration} min · {money(s.price)}
              </p>
              <p className="text-xs muted">Staff: {s.staff.join(", ")}</p>
              <Button
                secondary
                onClick={() => {
                  setServiceDraft({ ...s, staff: [...s.staff] });
                  setHistory((h) => [...h, screen]);
                  setScreen("service");
                  setError("");
                }}
              >
                Edit service
                <Icon as={EditIcon} />
              </Button>
            </Panel>
          ))}
        </>
      );
      break;
    case "service":
      content = (
        <div className="manager-form">
          <Field
            label="Service name"
            value={serviceDraft.name}
            onChange={(name) => setServiceDraft({ ...serviceDraft, name })}
          />
          <Field
            area
            label="Service description"
            value={serviceDraft.description}
            onChange={(description) =>
              setServiceDraft({ ...serviceDraft, description })
            }
          />
          <div className="two-col">
            <Field
              label="Duration (min)"
              type="number"
              min="1"
              value={serviceDraft.duration}
              onChange={(duration) =>
                setServiceDraft({ ...serviceDraft, duration })
              }
            />
            <Field
              label="Service price (Rp)"
              type="number"
              min="0"
              value={serviceDraft.price}
              onChange={(price) => setServiceDraft({ ...serviceDraft, price })}
            />
          </div>
          <h3>Assigned staff</h3>
          {staff.map((s) => (
            <wired-checkbox
              key={s.name}
              checked={serviceDraft.staff.includes(s.name)}
              onChange={(e) =>
                setServiceDraft({
                  ...serviceDraft,
                  staff: e.target.checked
                    ? [...serviceDraft.staff, s.name]
                    : serviceDraft.staff.filter((n) => n !== s.name),
                })
              }
            >
              {s.name}
            </wired-checkbox>
          ))}
          <p className="text-xs muted">
            {serviceDraft.staff.length} staff selected
          </p>
          <Panel>
            <div className="between">
              <div>
                <h3>Service active</h3>
                <p className="text-xs muted">
                  Available for new reservations.
                </p>
              </div>
              <wired-toggle
                aria-label="Service active"
                checked={serviceDraft.active}
                onChange={(e) =>
                  setServiceDraft({ ...serviceDraft, active: e.target.checked })
                }
              />
            </div>
          </Panel>
          <div className="manager-notice">
            <Icon as={InfoIcon} />
            <p>
              Service changes do not affect existing
              reservations.
            </p>
          </div>
          {error && <p role="alert">{error}</p>}
          <Button
            onClick={() => {
              if (
                !serviceDraft.name.trim() ||
                !serviceDraft.description.trim() ||
                !Number.isInteger(Number(serviceDraft.duration)) ||
                Number(serviceDraft.duration) <= 0 ||
                !String(serviceDraft.price).trim() ||
                !Number.isFinite(Number(serviceDraft.price)) ||
                Number(serviceDraft.price) < 0 ||
                !serviceDraft.staff.length
              ) {
                setError(
                  "Enter a name, description, positive duration, valid price, and select at least one staff member.",
                );
                return;
              }
              const updated = {
                ...serviceDraft,
                duration: Number(serviceDraft.duration),
                price: Number(serviceDraft.price),
              };
              setServices((all) =>
                all.map((s) => (s.id === updated.id ? updated : s)),
              );
              log("Service updated", updated.name);
              saveNotice("Service changes saved.");
              go("services");
            }}
          >
            Save changes
            <Icon as={TickIcon} />
          </Button>
        </div>
      );
      break;
    case "hours":
      content = (
        <>
          <p className="text-xs muted">Weekly schedule {business.zone}</p>
          {hoursDraft.map((h, i) => (
            <div className="manager-hours-row" key={h.day}>
              <div className="between">
                <h3>{h.day}</h3>
                <label className="inline">
                  <span>{h.open ? "Open" : "Closed"}</span>
                  <wired-toggle
                    aria-label={"Open: " + h.day}
                    checked={h.open}
                    onChange={(e) =>
                      setHoursDraft((all) =>
                        all.map((x, j) =>
                          j === i ? { ...x, open: e.target.checked } : x,
                        ),
                      )
                    }
                  />
                </label>
              </div>
              {h.open && (
                <div className="two-col">
                  <Field
                    label={"Open: " + h.day}
                    type="time"
                    value={h.start}
                    onChange={(start) =>
                      setHoursDraft((all) =>
                        all.map((x, j) => (j === i ? { ...x, start } : x)),
                      )
                    }
                  />
                  <Field
                    label={"Close: " + h.day}
                    type="time"
                    value={h.end}
                    onChange={(end) =>
                      setHoursDraft((all) =>
                        all.map((x, j) => (j === i ? { ...x, end } : x)),
                      )
                    }
                  />
                </div>
              )}
            </div>
          ))}
          {error && <p role="alert">{error}</p>}
          <Button
            onClick={() => {
              if (
                hoursDraft.some(
                  (h) => h.open && (!h.start || !h.end || h.start >= h.end),
                )
              ) {
                setError(
                  "Closing time must be after opening time on the same day.",
                );
                return;
              }
              setHours(hoursDraft.map((h) => ({ ...h })));
              log("Business hours updated", "Weekly schedule");
              saveNotice("Business hours saved.");
              go("manage");
            }}
          >
            Save business hours
            <Icon as={TickIcon} />
          </Button>
        </>
      );
      break;
    case "staff":
      content = (
        <>
          <p className="text-xs muted">Access settings are not linked to accounts</p>
          {staff.map((s) => (
            <Panel key={s.name}>
              <div className="manager-staff-row">
                <span className="avatar">
                  <Icon as={UserIcon} size={28} />
                </span>
                <div>
                  <h3>{s.name}</h3>
                  <p className="text-xs muted">
                    Barber · {s.active ? "Access enabled" : "Access disabled"}
                  </p>
                </div>
                <wired-toggle
                  aria-label={"Access: " + s.name}
                  checked={s.active}
                  onChange={(e) => {
                    const active = e.target.checked;
                    setStaff((all) =>
                      all.map((x) =>
                        x.name === s.name ? { ...x, active } : x,
                      ),
                    );
                    log(
                      "Staff access updated",
                      s.name + " · " + (active ? "active" : "inactive"),
                    );
                  }}
                />
              </div>
              <p className="text-xs muted">
                {services
                  .filter((service) => service.staff.includes(s.name))
                  .map((service) => service.name)
                  .join(" · ") || "No services assigned"}
              </p>
              <Button
                secondary
                onClick={() => {
                  setShiftStaff(s.name);
                  setShift(
                    shifts[s.name + "|" + shiftDay] || {
                      start: "09:00",
                      end: "18:00",
                      breakStart: "12:00",
                      breakEnd: "13:00",
                    },
                  );
                  go("schedule");
                }}
              >
                View schedule
                <Icon as={CalendarIcon} />
              </Button>
            </Panel>
          ))}
        </>
      );
      break;
    case "schedule": {
      const loadShift = (name, day) =>
        setShift(
          shifts[name + "|" + day] || {
            start: "09:00",
            end: "18:00",
            breakStart: "12:00",
            breakEnd: "13:00",
          },
        );
      content = (
        <div className="manager-form">
          <p className="text-xs muted">
            Existing reservations are not affected
          </p>
          <Select
            label="Selected staff"
            value={shiftStaff}
            onChange={(name) => {
              setShiftStaff(name);
              loadShift(name, shiftDay);
            }}
            options={staff.map((s) => [s.name, s.name])}
          />
          <Select
            label="Workday"
            value={shiftDay}
            onChange={(day) => {
              setShiftDay(day);
              loadShift(shiftStaff, day);
            }}
            options={initialHours.map((h) => [h.day, h.day])}
          />
          <h2>Working hours</h2>
          <div className="two-col">
            <Field
              label="Shift start"
              type="time"
              value={shift.start}
              onChange={(start) => setShift({ ...shift, start })}
            />
            <Field
              label="Shift end"
              type="time"
              value={shift.end}
              onChange={(end) => setShift({ ...shift, end })}
            />
          </div>
          <h2>Break</h2>
          <div className="two-col">
            <Field
              label="Break start"
              type="time"
              value={shift.breakStart}
              onChange={(breakStart) => setShift({ ...shift, breakStart })}
            />
            <Field
              label="Break end"
              type="time"
              value={shift.breakEnd}
              onChange={(breakEnd) => setShift({ ...shift, breakEnd })}
            />
          </div>
          {error && <p role="alert">{error}</p>}
          <Button
            onClick={() => {
              if (
                Object.values(shift).some((v) => !v) ||
                !(
                  shift.start < shift.end &&
                  shift.breakStart >= shift.start &&
                  shift.breakStart < shift.breakEnd &&
                  shift.breakEnd <= shift.end
                )
              ) {
                setError(
                  "Enter valid working hours and keep the break within the shift.",
                );
                return;
              }
              setShifts((all) => ({
                ...all,
                [shiftStaff + "|" + shiftDay]: { ...shift },
              }));
              log("Staff schedule updated", shiftStaff + " · " + shiftDay);
              saveNotice("Staff schedule saved.");
            }}
          >
            Save schedule
            <Icon as={TickIcon} />
          </Button>
        </div>
      );
      break;
    }
    case "activity":
      content = (
        <>
          <p className="text-xs muted">Changes in this session</p>
          {audit.length ? (
            <ol className="manager-timeline">
              {audit.map((a) => (
                <li key={a.id}>
                  <h3>{a.title}</h3>
                  <p>{a.detail}</p>
                  <p>Maya (Manager) · {a.time}</p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="manager-empty">
              <Icon as={ClockIcon} size={36} />
              <h2>No changes yet</h2>
              <p>
                Confirm an arrival or save business changes to see
                activity here.
              </p>
              <Button onClick={() => go("frontdesk")}>
                Go to Front Desk
                <Icon />
              </Button>
            </div>
          )}
        </>
      );
      break;
  }
  const activePage = pages.find((p) => p[0] === screen);
  return (
    <div className="workspace manager-workspace">
      <PrototypeSidebar
        active={screen}
        items={pages.map(([id, label, icon]) => ({
          id, label, icon,
          disabled: id === "detail" ? !item : id === "service" ? !services.length : false,
          hint: id === "detail" ? "Select a reservation first" : undefined,
          onSelect: () => id === "detail" ? openDetail(item) : go(id),
        }))}
      />
      <main className="canvas">

        <div className="stage">
          <div className="phone">
            <div className="status-bar">
              <span>9:41</span>
              <span className="notch" />
              <span aria-hidden="true" />
            </div>
            <header className="app-header">
              {!["welcome", "frontdesk", "reservations", "manage"].includes(screen) && (
                <button className="back" aria-label="Back" onClick={back}>
                  <Icon as={ArrowLeftIcon} />
                </button>
              )}
              <h1 className="app-brand">Care Space</h1>
              <span className="badge">Manager</span>
            </header>
            <div
              className="screen"
              id="prototype-content"
              tabIndex={-1}
              ref={scroll}
            >
              {screen !== "welcome" && (
              <section className="manager-hero" id={"manager-" + screen}>
                <span className="manager-hero-icon">
                  <Icon as={activePage[2]} size={34} />
                </span>
                <h1>{activePage[1]}</h1>
                <p>{business.name}</p>
              </section>
              )}
              {content}
            </div>
            {screen !== "welcome" && (
            <nav className="bottom-nav" aria-label="Manager navigation">
              {[
                ["frontdesk", "Front Desk", UserIcon],
                ["reservations", "Reservations", CalendarIcon],
                ["manage", "Manage", SettingsIcon],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  className={
                    screen === id ||
                    (id === "manage" &&
                      pages.slice(4).some((p) => p[0] === screen)) ||
                    (id === "reservations" && screen === "detail")
                      ? "active"
                      : ""
                  }
                  onClick={() => go(id)}
                >
                  <Icon as={icon} size={23} />
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
