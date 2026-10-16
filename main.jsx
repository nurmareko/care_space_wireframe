import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "wired-elements";
import {
  HomeIcon,
  FileListIcon,
  HeartIcon,
  CalendarIcon,
  UserIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LocationIcon,
  StarIcon,
  GiftIcon,
  ClockIcon,
  InfoIcon,
  GlobeIcon,
  PhoneIcon,
  MailIcon,
  ShopIcon,
  SearchIcon,
  TagIcon,
  HeadphoneIcon,
} from "react-doodle-icons";
import "./style.css";
import "./prototype-shell.css";
import PrototypeSidebar from "./prototype-sidebar.jsx";

const money = (n) => "Rp" + n.toLocaleString("id-ID");
const shops = [
  {
    id: "kemang",
    name: "Di Bawah Pohon",
    branch: "Barber & Shop Kemang",
    address: "Jl. Kemang Raya No.88A, Mampang Prapatan, Jakarta Selatan",
    category: "Barber",
    distance: "50 km",
  },
  {
    id: "vax",
    name: "Vax Wijaya",
    branch: "Mekarwangi",
    address: "Jl. Mekar Utama No. 111, Bandung",
    category: "Barber",
    distance: "1.2 km",
  },
  {
    id: "rekka",
    name: "Rekka Barber",
    branch: "Palasari",
    address: "Palasari, Bandung",
    category: "Barber",
    distance: "2.4 km",
  },
  ...[
    "GS Aniva",
    "Menteng",
    "SCBD",
    "GS Goldfinch",
    "Puri 1",
    "Alam Sutera",
    "Bintaro",
  ].map((branch, i) => ({
    id: "dbp" + i,
    name: "Di Bawah Pohon",
    branch: "Barber & Shop " + branch,
    address: [
      "Ruko Aniva Junction Blok E/26, Gading Serpong",
      "Jl. H. Agus Salim No.60",
      "Fairgrounds SCBD Lot, Jl. Jend. Sudirman",
      "Ruko South Goldfinch Blok SGE No.7",
      "Jl. Pesanggrahan No.35A, Meruya Utara",
      "Ruko Victoria Lane No.8, Alam Sutera",
      "Bintaro, Tangerang Selatan",
    ][i],
    category: "Barber",
    distance: "50 km",
  })),
  ...["PIM", "PIK", "BG4", "QCM"].map((branch, i) => ({
    id: "beauty" + i,
    name: "Beauty Bar",
    branch,
    address: [
      "Pondok Indah Mall, Lantai 2, Jakarta Selatan",
      "Jl. Pantai Indah Kapuk Boulevard",
      "Trans Studio Mall Bandung, Jl. Gatot Subroto",
      "Queen City Mall, Semarang",
    ][i],
    category: "Beauty",
    distance: "50 km",
  })),
];
const services = [
  {
    name: "Haircut by Certified Barber",
    duration: 50,
    price: 230000,
    description:
      "Consultation, haircut, and styling by a Korean-certified barber.",
  },
  {
    name: "Haircut + Down Perm by Certified Barber",
    duration: 120,
    price: 420000,
    description:
      "A precision haircut and down perm for more manageable hair.",
  },
  {
    name: "Haircut + Wash",
    duration: 60,
    price: 200000,
    description:
      "A haircut, wash, and styling for a fresh look.",
  },
];
const beautyServices = [
  {
    name: "Beauty Care",
    duration: 60,
    price: 200000,
    description:
      "A personal care session.",
  },
];
function Icon({ as: Component = ArrowRightIcon, size = 20 }) {
  return <Component size={size} color="currentColor" />;
}
function Button({
  children,
  onClick,
  secondary = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`${secondary ? "btn-secondary" : "btn-primary"} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
function Panel({ children, className = "" }) {
  return (
    <wired-card class={className} style={{ background: "white" }}>
      {children}
    </wired-card>
  );
}
function Field({ label, value, onChange, area = false, ...props }) {
  const Tag = area ? "wired-textarea" : "wired-input";
  return (
    <label className="field">
      <span>{label}</span>
      <Tag
        aria-label={label}
        value={value}
        onInput={(e) => onChange(e.target.value)}
        {...props}
      />
    </label>
  );
}
function Placeholder({ label = "Outlet photo", small = false }) {
  return (
    <wired-card
      class={small ? "placeholder small" : "placeholder"}
      style={{ background: "white" }}
    >
      <span className="cross" />
      <span>{label}</span>
    </wired-card>
  );
}

function App() {
  const [screen, setScreen] = useState("home");
  const [history, setHistory] = useState([]);
  const scroll = useRef(null);
  const [signed, setSigned] = useState(false);
  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);
  const [shop, setShop] = useState(shops[0]);
  const [tab, setTab] = useState("Services");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState(["kemang"]);
  const [service, setService] = useState(services[0]);
  const [bookingShop, setBookingShop] = useState(null);
  const [stylist, setStylist] = useState("Esta");

  const [day, setDay] = useState(0);
  const [time, setTime] = useState("20:00");
  const [note, setNote] = useState("");
  const [bookings, setBookings] = useState([]);
  const [current, setCurrent] = useState(null);
  const [appointmentTab, setAppointmentTab] = useState("Upcoming");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [afterLogin, setAfterLogin] = useState("home");
  const [profile, setProfile] = useState({
    first: "Drestayumna",
    last: "Nurmareko",
    email: "d.nurmareko@gmail.com",
  });
  const [draft, setDraft] = useState(profile);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });
  const dateLabel = (i) =>
    dates[i].toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const go = (s) => {
    setHistory((h) => [...h, screen]);
    setScreen(s);
    setError("");
  };
  const back = () => {
    setScreen(history.at(-1) || "home");
    setHistory((h) => h.slice(0, -1));
    setError("");
  };
  useEffect(() => {
    scroll.current?.scrollTo(0, 0);
  }, [screen, tab]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  useEffect(() => {
    const escape = (e) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  function openShop(s) {
    setShop(s);
    setTab("Services");
    go("outlet");
  }
  function toggleFavorite(id) {
    setFavorites((f) =>
      f.includes(id) ? f.filter((x) => x !== id) : [...f, id],
    );
  }
  function notify(text) {
    setToast(text);
  }
  function chooseService(s) {
    setBookingShop(shop.id);
    setService(s);
    setStylist("Esta");
    go("stylist");
  }
  function confirmBooking() {
    if (!signed) {
      setAfterLogin("review");
      go("phone");
      return;
    }
    const b = {
      id: "CS" + String(bookings.length + 1).padStart(4, "0"),
      shop,
      service,
      stylist,
      date: dateLabel(day),
      time,
      note,
      status: "Saved",
    };
    setBookings((bk) => [b, ...bk]);
    setCurrent(b);
    go("success");
  }
  const title = {
    home: "Care Space",
    welcome: "Care Space",
    phone: "Sign in with your phone",
    otp: "Verify your phone number",
    search: category === "Beauty" ? "Beauty Bar" : "Search results",
    outlet: "Care Space",
    stylist: "Choose a stylist",
    schedule: "Choose date & time",
    review: "Booking summary",
    success: "Appointment saved",
    favorites: "Favorites",
    appointments: "Appointments",
    detail: "Appointment details",
    rewards: "Rewards",
    profile: "Profile",
    edit: "Edit profile",
    language: "Language",
    support: "Contact us",
  }[screen];
  const filtered = shops.filter(
    (s) =>
      (category === "All" || s.category === category) &&
      `${s.name} ${s.branch} ${s.address}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const fullShop = shop.name + " " + shop.branch;
  const shopServices = shop.category === "Beauty" ? beautyServices : services;
  function ShopCard({ item, compact = false }) {
    return (
      <article className={"shop-card " + (compact ? "compact" : "")}>
        <div className="photo-wrap">
          <button
            className="photo-button"
            aria-label={"View " + item.name + " " + item.branch}
            onClick={() => openShop(item)}
          >
            <Placeholder
              label={
                item.category === "Beauty" ? "Beauty studio" : "Barber studio"
              }
              small={compact}
            />
          </button>
          <button
            className={
              "favorite " + (favorites.includes(item.id) ? "saved" : "")
            }
            onClick={() => toggleFavorite(item.id)}
            aria-label={
              (favorites.includes(item.id)
                ? "Remove from favorites: "
                : "Add to favorites: ") +
              item.name +
              " " +
              item.branch
            }
            aria-pressed={favorites.includes(item.id)}
          >
            <Icon as={HeartIcon} />
          </button>
          {!compact && (
            <span className="rating">
              <Icon as={StarIcon} size={15} /> 5.0
            </span>
          )}
        </div>
        <div className="shop-copy">
          <button className="text-button" onClick={() => openShop(item)}>
            <h3>
              {item.name}
              <br />
              {item.branch}
            </h3>
          </button>
          <p className="muted text-xs">{item.address}</p>
          {!compact && (
            <div className="between">
              <span className="text-xs inline">
                <Icon as={LocationIcon} size={16} />
                {item.distance}
              </span>
              <Button onClick={() => openShop(item)}>
                Book <Icon />
              </Button>
            </div>
          )}
        </div>
      </article>
    );
  }
  function Nav() {
    return (
      <nav className="bottom-nav" aria-label="Main navigation">
        {[
          ["home", "Home", HomeIcon],
          ["favorites", "Favorites", HeartIcon],
          ["appointments", "Appointments", CalendarIcon],
          ["profile", "Profile", UserIcon],
        ].map(([s, label, ic]) => (
          <button
            key={s}
            aria-current={screen === s ? "page" : undefined}
            className={screen === s ? "active" : ""}
            onClick={() => go(s)}
          >
            <Icon as={ic} size={23} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    );
  }
  const summary = (b) => (
    <Panel>
      <h3>
        {b.shop.name}
        <br />
        {b.shop.branch}
      </h3>
      <p className="inline">
        <Icon as={CalendarIcon} />
        {b.date}
      </p>
      <p className="inline">
        <Icon as={ClockIcon} />
        Starts at {b.time}
      </p>
      <wired-divider />
      <h3>{b.service.name}</h3>
      <p className="muted">
        {b.stylist} · {b.service.duration} min
      </p>
      <strong>{money(b.service.price)}</strong>
      {b.note && <p>Note: {b.note}</p>}
    </Panel>
  );
  const draftBooking = {
    shop,
    service,
    stylist,
    date: dateLabel(day),
    time,
    note,
  };
  const rewards = () => (
    <>
      <Panel>
        <div className="between">
          <Icon as={GiftIcon} size={32} />
          <span className="badge">Membership card</span>
        </div>
        <h3>
          {signed
            ? profile.first + " " + profile.last
            : "Sign in to view points"}
        </h3>
        <div className="points">
          {signed ? "300" : "—"} <span>Points balance</span>
        </div>
        {!signed && (
          <Button
            onClick={() => {
              setAfterLogin("rewards");
              go("phone");
            }}
          >
            Sign in or register <Icon />
          </Button>
        )}
      </Panel>
      {["Haircut Only 95K", "Haircut By Certified Barber Only 120K"].map(
        (name) => (
          <Panel key={name}>
            <h3>{name}</h3>
            <p className="muted">
              50 min · Redeem points for a special price.
            </p>
            <div className="between">
              <strong>1,000 points</strong>
              <Button
                secondary
                onClick={() =>
                  setModal({
                    title: "Not enough points",
                    body: "Your balance is 300 points. Earn 700 more to redeem this reward.",
                  })
                }
              >
                Redeem <Icon as={GiftIcon} />
              </Button>
            </div>
          </Panel>
        ),
      )}
    </>
  );
  let content;
  switch (screen) {
    case "welcome":
      content = (
        <>
          <Placeholder label="Self-care hero photo" />
          <div className="welcome-copy">
            <span className="eyebrow">A little time, just for you</span>
            <h1>
              A space for
              <br />
              self-care.
            </h1>
            <p>Find your favorite barbers, salons, and self-care services.</p>
          </div>

          <Button
            secondary
            onClick={() => {
              setAfterLogin("home");
              go("phone");
            }}
          >
            <Icon as={PhoneIcon} /> Continue with phone number
          </Button>
          <button
            className="link center"
            onClick={() => {
              setSigned(false);
              go("home");
            }}
          >
            Browse as a guest <Icon />
          </button>
          <p className="text-xs center muted">
            Before continuing, read our{" "}
            <button
              className="link"
              onClick={() =>
                setModal({
                  title: "Terms & Conditions",
                  body: "Your entries stay in this session. No payments are collected or reservations sent to outlets.",
                })
              }
            >
              Terms & Conditions
            </button>{" "}
            and Privacy Policy.
          </p>
        </>
      );
      break;
    case "home":
      content = (
        <>
          <div className="between home-intro">
            <span className="inline text-xs">
              <Icon as={LocationIcon} size={16} /> Bandung, Indonesia
            </span>
            <span className="badge">
              {signed ? "Hi, " + profile.first : "Guest mode"}
            </span>
          </div>
          <button
            className="search-trigger"
            onClick={() => {
              setQuery("");
              setCategory("All");
              go("search");
            }}
          >
            <Icon as={SearchIcon} />
            Search barbers, salons, services...
            <Icon />
          </button>
          <h2>{"Choose a service"}</h2>
          <div className="categories">
            {[
              ["Barber", ShopIcon],
              ["Beauty", StarIcon],
              ["Reflexology", HeartIcon],
              ["Salon", UserIcon],
            ].map(([c, ic], i) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  setQuery("");
                  go("search");
                }}
              >
                <span className={"category-shape shape-" + i}>
                  <Icon as={ic} size={30} />
                </span>
                {c}
              </button>
            ))}
          </div>
          <div className="section-heading">
            <h2>{"Near you"}</h2>
            <button
              className="link text-xs"
              onClick={() => {
                setQuery("");
                setCategory("All");
                go("search");
              }}
            >
              View all <Icon size={16} />
            </button>
          </div>
          <div className="two-col">
            {shops.slice(1, 3).map((s) => (
              <ShopCard key={s.id} item={s} compact />
            ))}
          </div>
          <h2>{"Care Space picks"}</h2>
          <ShopCard item={shops[0]} />
        </>
      );
      break;
    case "search":
      content = (
        <>
          <wired-search-input
            aria-label="Search outlets"
            placeholder="Search barbers, salons, services..."
            value={query}
            onInput={(e) => setQuery(e.target.value)}
          />
          <div className="chips">
            {["All", "Barber", "Beauty", "Reflexology", "Salon"].map((c) => (
              <button
                key={c}
                className={category === c ? "selected" : ""}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="muted text-xs">
            {filtered.length} outlets · Places offering this service
          </p>
          {filtered.length ? (
            filtered.map((s) => (
              <div className="result" key={s.id}>
                <button onClick={() => openShop(s)}>
                  <Placeholder label="Outlet" small />
                  <span>
                    <h3>
                      {s.name} {s.branch}
                    </h3>
                    <span className="text-xs muted">{s.address}</span>
                  </span>
                  <Icon />
                </button>
              </div>
            ))
          ) : (
            <div className="empty">
              <Icon as={SearchIcon} size={48} />
              <h2>No outlets found</h2>
              <p>
                Try another keyword or category.
              </p>
              <Button
                secondary
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                View all outlets
              </Button>
            </div>
          )}
        </>
      );
      break;
    case "outlet":
      content = (
        <>
          <div className="photo-wrap">
            <Placeholder label="Outlet interior · 1 / 3" />
            <button
              className={
                "favorite " + (favorites.includes(shop.id) ? "saved" : "")
              }
              aria-label="Save outlet"
              aria-pressed={favorites.includes(shop.id)}
              onClick={() => toggleFavorite(shop.id)}
            >
              <Icon as={HeartIcon} />
            </button>
          </div>
          <h1 className="outlet-name">{fullShop}</h1>
          <p className="inline text-xs">
            <span className="badge">Open</span>13:00 – 21:00{" "}
            <span className="inline">
              <Icon as={StarIcon} size={16} />
              4.9 (359)
            </span>
          </p>
          <p className="inline muted text-xs">
            <Icon as={LocationIcon} />
            {shop.address}
          </p>
          <div className="tabs">
            {["Services", "Rewards", "Offers", "Info"].map((x) => (
              <button
                key={x}
                className={tab === x ? "active" : ""}
                onClick={() => setTab(x)}
              >
                {x}
              </button>
            ))}
          </div>
          {tab === "Services" && (
            <>
              <h2>Packages & offers</h2>
              {shopServices.map((s) => (
                <Panel key={s.name}>
                  <div className="inline">
                    <Icon as={TagIcon} />
                    <h3>{s.name}</h3>
                  </div>
                  <p className="text-xs muted">{s.duration} min</p>
                  <p>{s.description}</p>
                  <div className="between">
                    <strong>{money(s.price)}</strong>
                    <Button onClick={() => chooseService(s)}>Book +</Button>
                  </div>
                </Panel>
              ))}
            </>
          )}
          {tab === "Rewards" && rewards()}
          {tab === "Offers" && (
            <Panel>
              <Icon as={TagIcon} size={32} />
              <h2>Care packages</h2>
              <p>
                Find a care package for your next visit.
              </p>

              <Button onClick={() => chooseService(shopServices.at(-1))}>
                View package · {money(shopServices.at(-1).price)} <Icon />
              </Button>
            </Panel>
          )}
          {tab === "Info" && (
            <>
              <h2>About this outlet</h2>
              <p>
                A space for self-care, with a personal consultation before your service.
              </p>
              <div className="two-col">
                <Button
                  secondary
                  onClick={() =>
                    setModal({
                      title: "Contact outlet",
                      body: "Phone contact is not available here.",
                    })
                  }
                >
                  <Icon as={PhoneIcon} /> Contact
                </Button>
                <Button
                  secondary
                  onClick={() =>
                    setModal({
                      title: "Outlet location",
                      body:
                        shop.address +
                        ". Use this address in your preferred maps app.",
                    })
                  }
                >
                  <Icon as={LocationIcon} /> View address
                </Button>
              </div>
              <h2>Ratings & reviews</h2>
              <Panel>
                <div className="points">
                  4.9 <Icon as={StarIcon} size={32} />
                </div>
                <p>359 reviews · Average rating</p>
              </Panel>
              {[
                [
                  "Nelsen",
                  "14 Jan 2026",
                  "5",
                  "Dee was helpful and skilled, with great advice.",
                ],
                [
                  "Filal",
                  "10 Feb 2026",
                  "1",
                  "The result differed from the reference. Please confirm before cutting.",
                ],
              ].map(([name, date, rating, body]) => (
                <Panel key={name}>
                  <div className="between">
                    <h3>{name}</h3>
                    <span className="inline">
                      <Icon as={StarIcon} />
                      {rating}
                    </span>
                  </div>
                  <span className="text-xs muted">{date}</span>
                  <p>{body}</p>
                </Panel>
              ))}
            </>
          )}
        </>
      );
      break;
    case "stylist":
      content = (
        <>
          <p className="eyebrow">Booking · 1 of 3</p>
          <Panel>
            <span className="text-xs muted">Selected service</span>
            <h3>{service.name}</h3>
            <p>{fullShop}</p>
          </Panel>

          {["Esta", "Dee", "Adi", "Digul", "Arya"].map((name) => (
            <button
              className={"stylist-row " + (stylist === name ? "selected" : "")}
              key={name}

              onClick={() => {
                setStylist(name);
                go("schedule");
              }}
            >
              <span className="avatar">
                <Icon as={UserIcon} size={32} />
              </span>
              <span>
                <h3>{name}</h3>
                <span>{money(service.price)}</span>
                <span className="stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Icon key={i} as={StarIcon} size={14} />
                  ))}
                </span>
              </span>
              <span className="text-xs">
                Choose <Icon />
              </span>
            </button>
          ))}
        </>
      );
      break;
    case "schedule":
      content = (
        <>
          <p className="eyebrow">Booking · 2 of 3</p>
          <Panel>
            <h3>{service.name}</h3>
            <p className="inline">
              <Icon as={UserIcon} />
              {stylist} · {money(service.price)}
            </p>
          </Panel>
          <h2>
            <Icon as={CalendarIcon} /> Choose a date
          </h2>
          <div className="date-grid">
            {dates.map((d, i) => (
              <button
                key={i}
                className={day === i ? "selected" : ""}
                aria-pressed={day === i}
                onClick={() => {
                  setDay(i);
                  setTime("");
                }}
              >
                <span>
                  {d.toLocaleDateString("en-GB", { weekday: "short" })}
                </span>
                <strong>{d.getDate()}</strong>
                <span>{d.toLocaleDateString("en-GB", { month: "short" })}</span>
              </button>
            ))}
          </div>
          <h2>
            <Icon as={ClockIcon} /> Available times
          </h2>
          <div className="time-grid">
            {[
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
              "20:00",
            ].map((h) => (
              <button
                key={h}
                disabled={
                  h === "15:00" || (service.duration === 120 && h === "20:00")
                }
                aria-pressed={time === h}
                className={time === h ? "selected" : ""}
                onClick={() => setTime(h)}
              >
                {h}
              </button>
            ))}
          </div>
          <p className="text-xs muted">
            Outlet local time · Duration: {service.duration} min
          </p>
          <div className="bottom-action">
            <div className="between">
              <span>
                {dates[day].toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                · {time || "Choose a time"}
              </span>
              <strong>{money(service.price)}</strong>
            </div>
            <Button
              disabled={!time || (service.duration === 120 && time === "20:00")}
              onClick={() => go("review")}
            >
              Add to booking <Icon />
            </Button>
          </div>
        </>
      );
      break;
    case "review":
      content = (
        <>
          <p className="eyebrow">Booking · 3 of 3</p>
          {summary(draftBooking)}
          <div className="two-col">
            <Button secondary onClick={() => go("stylist")}>
              Change service
            </Button>
            <Button
              secondary
              onClick={() =>
                setModal({
                  title: "Clear your selection?",
                  body: "This service has not been booked. Return to the outlet to choose again.",
                  action: () => go("outlet"),
                  actionLabel: "Clear selection",
                })
              }
            >
              Cancel
            </Button>
          </div>
          <Field
            area
            label="Special requests (optional)"
            placeholder="Add a note or special request"
            value={note}
            onChange={setNote}
          />
          <Panel>
            <h3 className="inline">
              <Icon as={InfoIcon} />
              Cancellation policy
            </h3>
            <p className="text-xs muted">
              Please cancel at least 1 hour before your appointment. Arrive 5 minutes early.
            </p>
          </Panel>
          <div className="bottom-action">
            <div className="between">
              <span>1 service · Pay at the outlet</span>
              <strong>{money(service.price)}</strong>
            </div>
            <Button onClick={confirmBooking}>
              {signed ? "Save appointment" : "Sign in & save"} <Icon />
            </Button>
            <span className="text-xs muted center">
              Saved in this session only. No reservation is sent or payment taken.
            </span>
          </div>
        </>
      );
      break;
    case "success":
      content = current ? (
        <>
          <div className="success-mark">
            <Icon as={CalendarIcon} size={48} />
          </div>
          <p className="center">Your appointment details are saved for this session.</p>
          {summary(current)}
          <Panel>
            <div className="between">
              <span>Booking reference</span>
              <strong className="booking-code">{current.id}</strong>
            </div>
            <wired-divider />
            <h3>Check in before {current.time}</h3>
            <p>
              Arrive at least 5 minutes early. Appointments may be canceled if you are more than 5 minutes late.
            </p>
          </Panel>
          <Button onClick={() => go("detail")}>
            View appointment details <Icon />
          </Button>
          <Button secondary onClick={() => go("home")}>
            Back to Home
          </Button>
        </>
      ) : (
        <div className="empty">
          <Icon as={CalendarIcon} size={48} />
          <h2>No bookings yet</h2>
          <p>Choose a service and time to save an appointment.</p>
          <Button onClick={() => openShop(shops[0])}>
            Start booking <Icon />
          </Button>
        </div>
      );
      break;
    case "favorites":
      content = (
        <>
          {favorites.length ? (
            shops
              .filter((s) => favorites.includes(s.id))
              .map((s) => <ShopCard item={s} key={s.id} />)
          ) : (
            <div className="empty">
              <Icon as={HeartIcon} size={48} />
              <h2>Save your favorite places</h2>
              <p>Tap the heart on an outlet to find it here.</p>
              <Button onClick={() => go("home")}>
                Browse outlets <Icon />
              </Button>
            </div>
          )}
        </>
      );
      break;
    case "appointments":
      content = (
        <>
          <div className="tabs">
            {["Upcoming", "Completed"].map((v) => (
              <button
                key={v}
                className={appointmentTab === v ? "active" : ""}
                onClick={() => setAppointmentTab(v)}
              >
                {v}
              </button>
            ))}
          </div>
          {appointmentTab === "Upcoming" ? (
            bookings.length ? (
              bookings.map((b) => (
                <Panel key={b.id}>
                  <div className="between">
                    <span className="badge">{b.status}</span>
                    <span className="text-xs">{b.id}</span>
                  </div>
                  <h3>
                    {b.shop.name} {b.shop.branch}
                  </h3>
                  <p>{b.service.name}</p>
                  <p className="text-xs inline">
                    <Icon as={CalendarIcon} />
                    {b.date} · {b.time}
                  </p>
                  <Button
                    secondary
                    onClick={() => {
                      setCurrent(b);
                      go("detail");
                    }}
                  >
                    View details <Icon />
                  </Button>
                </Panel>
              ))
            ) : (
              <div className="empty">
                <Icon as={CalendarIcon} size={48} />
                <h2>Time for yourself</h2>
                <p>
                  No appointments yet. Find your favorite service and choose a time.
                </p>
                <Button onClick={() => go("home")}>
                  Find a service <Icon />
                </Button>
              </div>
            )
          ) : (
            <div className="empty">
              <Icon as={CalendarIcon} size={48} />
              <h2>No completed appointments</h2>
              <p>Your completed appointments will appear here.</p>
            </div>
          )}
        </>
      );
      break;
    case "detail":
      content = current ? (
        <>
          <span className="badge">
            {current.status} · {current.id}
          </span>
          {summary(current)}
          <p className="inline">
            <Icon as={LocationIcon} />
            {current.shop.address}
          </p>
          {current.status !== "Canceled" && (
            <Button
              secondary
              onClick={() =>
                setModal({
                  title: "Cancel this appointment?",
                  body: "This appointment will be marked as canceled in this session.",
                  action: () => {
                    const next = { ...current, status: "Canceled" };
                    setCurrent(next);
                    setBookings((bs) =>
                      bs.map((b) => (b.id === next.id ? next : b)),
                    );
                  },
                  actionLabel: "Yes, cancel",
                })
              }
            >
              Cancel appointment
            </Button>
          )}
          <Button onClick={() => go("appointments")}>
            All appointments <Icon />
          </Button>
        </>
      ) : (
        <p>Choose an appointment from the list.</p>
      );
      break;
    case "rewards":
      content = rewards();
      break;
    case "profile":
      content = (
        <>
          <div className="profile-hero">
            <span className="avatar large">
              {signed ? (
                (profile.first[0] || "") + (profile.last[0] || "")
              ) : (
                <Icon as={UserIcon} size={40} />
              )}
            </span>
            <h2>
              {signed
                ? profile.first + " " + profile.last
                : "You are browsing as a guest"}
            </h2>
            {signed ? (
              <>
                <p>{profile.email}</p>
                <p>+62 {phone || "821 1077 8883"}</p>
                <Button
                  secondary
                  onClick={() => {
                    setDraft({ ...profile });
                    go("edit");
                  }}
                >
                  {"Edit profile"} <Icon />
                </Button>
              </>
            ) : (
              <>
                <p className="muted">
                  Sign in to manage your profile, appointments, and favorites.
                </p>
                <Button
                  onClick={() => {
                    setAfterLogin("profile");
                    go("phone");
                  }}
                >
                  Sign in or register <Icon />
                </Button>
              </>
            )}
          </div>
          <h3 className="section-label">Preferences</h3>
          <button className="menu-row" onClick={() => go("language")}>
            <Icon as={GlobeIcon} />
            {"Language"}
            <span>English</span>
            <Icon />
          </button>
          <button className="menu-row" onClick={() => go("rewards")}>
            <Icon as={GiftIcon} />
            Rewards<span>{signed ? "300 points" : "Sign in"}</span>
            <Icon />
          </button>
          <h3 className="section-label">Information & help</h3>
          {["Terms & Conditions", "Privacy Policy"].map((x) => (
            <button
              className="menu-row"
              key={x}
              onClick={() =>
                setModal({
                  title: x,
                  body: "Your entries are kept only while this page is open. No data is sent to outlets, and no payments are processed.",
                })
              }
            >
              <Icon as={InfoIcon} />
              {x}
              <Icon />
            </button>
          ))}
          <button
            className="menu-row"
            onClick={() => {
              setSent(false);
              go("support");
            }}
          >
            <Icon as={HeadphoneIcon} />
            {"Contact us"}
            <Icon />
          </button>
          {signed && (
            <>
              <h3 className="section-label">Account</h3>
              <button
                className="menu-row"
                onClick={() =>
                  setModal({
                    title: "Reset your data?",
                    body: "Your profile, favorites, and appointments in this session will be reset.",
                    action: () => {
                      setSigned(false);
                      setBookings([]);
                      setCurrent(null);
                      setFavorites([]);
                      setProfile({
                        first: "Drestayumna",
                        last: "Nurmareko",
                        email: "d.nurmareko@gmail.com",
                      });
                      setPhone("");
                      setNote("");
                      setMessage("");
                      setReason("");
                      setOtp("");
                      go("profile");
                    },
                    actionLabel: "Reset",
                  })
                }
              >
                <Icon as={UserIcon} />
                Reset my data
                <Icon />
              </button>
              <button
                className="menu-row"
                onClick={() => {
                  setSigned(false);
                  go("welcome");
                }}
              >
                <Icon as={ArrowLeftIcon} />
                Sign out
                <Icon />
              </button>
            </>
          )}
        </>
      );
      break;
    case "phone":
      content = (
        <>
          <div className="intro-icon">
            <Icon as={PhoneIcon} size={40} />
          </div>

          <div className="phone-field">
            <span>+62</span>
            <Field
              label="Phone number"
              placeholder="821 1077 8883"
              type="tel"
              value={phone}
              onChange={(v) => {
                setPhone(v.replace(/[^0-9 ]/g, ""));
                setError("");
              }}
            />
          </div>
          <p className="text-xs muted">
            Enter 9–13 digits after +62. No SMS will be sent.
          </p>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <Button
            disabled={!phone.trim()}
            onClick={() => {
              if (!/^[1-9][0-9]{8,12}$/.test(phone.replace(/\s/g, ""))) {
                setError(
                  "Enter a valid phone number without a leading 0 or +62.",
                );
                return;
              }
              setOtp("");
              go("otp");
            }}
          >
            Continue <Icon />
          </Button>
          <div className="step-lines">
            <b />
            <i />
            <i />
          </div>
        </>
      );
      break;
    case "otp":
      content = (
        <>
          <div className="intro-icon">
            <Icon as={MailIcon} size={40} />
          </div>
          <p>Enter the code for +62 {phone || "821 1077 8883"}.</p>
          <Panel>
            <h3>Verification code</h3>
            <p>
              Use code <strong>123456</strong> to continue. No SMS is sent.
            </p>
          </Panel>
          <Field
            label="Verification code"
            placeholder="6 digits"
            value={otp}
            onChange={(v) => setOtp(v.replace(/\D/g, "").slice(0, 6))}
          />
          {error && <p role="alert">{error}</p>}
          <Button
            disabled={otp.length !== 6}
            onClick={() => {
              if (otp !== "123456") {
                setError("Incorrect code. Use 123456.");
                return;
              }
              setSigned(true);
              go(afterLogin);
              notify("Signed in.");
            }}
          >
            Verify & continue <Icon />
          </Button>
          <button
            className="link"
            onClick={() => notify("Use verification code 123456. No SMS is sent.")}
          >
            Show code
          </button>
          <button className="link" onClick={() => go("phone")}>
            Change phone number
          </button>
        </>
      );
      break;
    case "edit":
      content = (
        <>
          <span className="avatar large">
            <Icon as={UserIcon} size={40} />
          </span>

          <Field
            label="First name"
            value={draft.first}
            onChange={(v) => setDraft({ ...draft, first: v })}
          />
          <Field
            label="Last name"
            value={draft.last}
            onChange={(v) => setDraft({ ...draft, last: v })}
          />
          <Field
            label="Email"
            type="email"
            value={draft.email}
            onChange={(v) => setDraft({ ...draft, email: v })}
          />
          <div className="between">
            <span>+62 {phone || "821 1077 8883"}</span>
            <button
              className="link"
              onClick={() => {
                setAfterLogin("edit");
                go("phone");
              }}
            >
              Change phone number
            </button>
          </div>
          {error && <p role="alert">{error}</p>}
          <Button
            onClick={() => {
              if (
                !draft.first.trim() ||
                !draft.last.trim() ||
                !/^\S+@\S+\.\S+$/.test(draft.email)
              ) {
                setError("Enter your full name and a valid email address.");
                return;
              }
              setProfile(draft);
              go("profile");
              notify("Profile changes saved.");
            }}
          >
            Save changes <Icon />
          </Button>
        </>
      );
      break;
    case "language":
      content = (
        <>
          <p>The app is currently available in English.</p>
          <div className="language-row selected">
            <span className="avatar">EN</span>
            <h3>English</h3>
            <span aria-label="Current language">✓</span>
          </div>
        </>
      );
      break;
    case "support":
      content = sent ? (
        <div className="empty">
          <Icon as={MailIcon} size={48} />
          <h2>Request saved</h2>
          <p>
            Request CS-SUPPORT-001 is saved in this session only. It has not been sent to support.
          </p>
          <Button onClick={() => go("profile")}>
            Back to Profile <Icon />
          </Button>
        </div>
      ) : (
        <>
          <p>What do you need help with?</p>
          <wired-radio-group
            aria-label="Reason for contacting us"
            selected={reason}
            onselected={(e) => setReason(e.detail.selected)}
          >
            {[
              "Verification code issue",
              "App will not open",
              "Points balance is missing",
              "Missing reservation",
              "Stuck on “Please wait” when choosing a service",
              "Blank screen when choosing a time",
              "Other",
            ].map((r) => (
              <wired-radio key={r} name={r}>
                {r}
              </wired-radio>
            ))}
          </wired-radio-group>
          <Field
            area
            label="Additional details (optional)"
            placeholder="Describe the issue"
            value={message}
            onChange={setMessage}
          />
          <Button disabled={!reason} onClick={() => setSent(true)}>
            Save request <Icon />
          </Button>
        </>
      );
      break;
    default:
      content = null;
  }
  const navScreens = [
    "home",
    "favorites",
    "appointments",
    "profile",
    "language",
    "support",
    "rewards",
  ];

  const screenItems = [
    ["home", "Home", HomeIcon],
    ["welcome", "Welcome", ShopIcon],
    ["phone", "Phone sign-in", PhoneIcon],
    ["otp", "Phone verification", MailIcon, !/^[1-9][0-9]{8,12}$/.test(phone.replace(/\s/g, "")), "Enter a valid phone number first"],
    ["search", "Search outlets", SearchIcon],
    ["outlet", "Outlet details", ShopIcon],
    ["stylist", "Choose a stylist", UserIcon, bookingShop !== shop.id, "Choose a service at this outlet first"],
    ["schedule", "Date & time", CalendarIcon, bookingShop !== shop.id || !stylist, "Choose a service and stylist first"],
    ["review", "Booking summary", FileListIcon, bookingShop !== shop.id || !time || (!history.includes("schedule") && screen !== "schedule"), "Choose a service, date and time first"],
    ["success", "Appointment saved", CalendarIcon, !current, "Save an appointment first"],
    ["favorites", "Favorites", HeartIcon],
    ["appointments", "Appointments", CalendarIcon],
    ["detail", "Appointment details", InfoIcon, !current, "Open or save an appointment first"],
    ["rewards", "Rewards", GiftIcon],
    ["profile", "Profile", UserIcon],
    ["edit", "Edit profile", UserIcon, !signed, "Sign in first"],
    ["language", "Language", GlobeIcon],
    ["support", "Contact us", HeadphoneIcon],
  ].map(([id, label, icon, disabled, hint]) => ({
    id, label, icon, disabled, hint,
    onSelect: () => {
      if (id === "edit") setDraft({ ...profile });
      if (id === "phone") setAfterLogin("home");
      go(id);
    },
  }));

  return (
    <div className="workspace">
      <PrototypeSidebar items={screenItems} active={screen} />
      <main className="canvas">
        <header className="canvas-header">
          <a className="prototype-return" href="/">All apps</a>
          <div>
            <h1>Care Space</h1>
          </div>
          <button
            className="btn-secondary restart"
            onClick={() =>
              setModal({
                title: "Reset?",
                body: "Clear the current session and return to the initial home screen?",
                action: () => window.location.reload(),
                actionLabel: "Reset",
              })
            }
          >
            Reset <Icon as={ArrowLeftIcon} />
          </button>
        </header>
        <div className="stage">
          <div className="phone">
            <div className="status-bar">
              <span>9:41</span>
              <span className="notch" />
              <span aria-hidden="true" />
            </div>
            <header className="app-header">
              {screen !== "home" && (
                <button className="back" aria-label="Back" onClick={back}>
                  <Icon as={ArrowLeftIcon} size={25} />
                </button>
              )}
              <h1
                className={
                  ["home", "welcome", "outlet"].includes(screen)
                    ? "app-brand"
                    : ""
                }
              >
                {title}
              </h1>
              {screen === "home" && (
                <button
                  className="header-profile"
                  aria-label="Open profile"
                  onClick={() => go("profile")}
                >
                  <Icon as={UserIcon} />
                </button>
              )}
            </header>
            <div
              className="screen"
              id={"screen-" + screen}
              tabIndex={-1}
              ref={scroll}
            >
              {content}
            </div>
            {navScreens.includes(screen) && <Nav />}
            <div className="home-indicator" />
            {toast && (
              <div className="toast" role="status">
                <Icon as={InfoIcon} />
                {toast}
              </div>
            )}
          </div>
        </div>
      </main>
      {modal && <Modal modal={modal} close={() => setModal(null)} />}
    </div>
  );
}
function Modal({ modal, close }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    return () => previous?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      aria-labelledby="modal-title"
    >
      <Icon as={InfoIcon} size={32} />
      <h2 id="modal-title">{modal.title}</h2>
      <p>{modal.body}</p>
      {modal.action && (
        <Button
          onClick={() => {
            modal.action();
            close();
          }}
        >
          {modal.actionLabel}
          <Icon />
        </Button>
      )}
      <Button secondary onClick={close}>
        {modal.action ? "Back" : "Got it"}
      </Button>
    </dialog>
  );
}
const root = createRoot(document.getElementById("root"));
function renderPrototype(Component) {
  root.render(
    <>
      <a
        className="skip-link"
        href="#prototype-content"
        onClick={(event) => {
          event.preventDefault();
          document.querySelector(".screen")?.focus();
        }}
      >
        Skip to app
      </a>
      <Component />
    </>,
  );
}
if (new URLSearchParams(window.location.search).get("app") === "manager") {
  import("./manager.jsx").then(({ default: ManagerApp }) =>
    renderPrototype(ManagerApp),
  );
} else if (new URLSearchParams(window.location.search).get("app") === "staff") {
  import("./staff.jsx").then(({ default: StaffApp }) =>
    renderPrototype(StaffApp),
  );
} else if (
  new URLSearchParams(window.location.search).get("app") === "customer"
) {
  renderPrototype(App);
} else {
  import("./chooser.jsx").then(({ default: AppChooser }) =>
    root.render(<AppChooser />),
  );
}
