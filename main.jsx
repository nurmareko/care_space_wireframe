import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "wired-elements";
import {
  HomeIcon,
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
    distance: "1,2 km",
  },
  {
    id: "rekka",
    name: "Rekka Barber",
    branch: "Palasari",
    address: "Palasari, Bandung",
    category: "Barber",
    distance: "2,4 km",
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
      "Konsultasi, potong rambut, dan styling oleh barber bersertifikat Korea.",
  },
  {
    name: "Haircut + Down Perm by Certified Barber",
    duration: 120,
    price: 420000,
    description:
      "Potongan presisi dan down perm untuk rambut yang lebih mudah diatur.",
  },
  {
    name: "Haircut + Wash",
    duration: 60,
    price: 200000,
    description:
      "Potong rambut, keramas, dan styling untuk tampilan yang segar.",
  },
];
const beautyServices = [
  {
    name: "Beauty Care",
    duration: 60,
    price: 200000,
    description:
      "Contoh layanan perawatan untuk mencoba alur pemesanan. Harga simulasi.",
  },
];
const screenGroups = [
  [
    "01",
    "Start here",
    [
      ["welcome", "Welcome"],
      ["phone", "Phone sign-in"],
      ["otp", "Verification"],
    ],
  ],
  [
    "02",
    "Discover & book",
    [
      ["home", "Home"],
      ["search", "Search & outlets"],
      ["outlet", "Services & deals"],
      ["stylist", "Choose stylist"],
      ["schedule", "Date & time"],
      ["review", "Review booking"],
      ["success", "Booking confirmed"],
    ],
  ],
  [
    "03",
    "Your care space",
    [
      ["favorites", "Favorites"],
      ["appointments", "Appointments"],
      ["rewards", "Rewards"],
      ["profile", "Profile"],
      ["edit", "Edit profile"],
      ["language", "Language"],
      ["support", "Contact support"],
    ],
  ],
];
const en = {
  Beranda: "Home",
  Favorit: "Favorites",
  "Janji Temu": "Appointments",
  Profil: "Profile",
  "Pilih layanan": "Choose a service",
  "Di dekatmu": "Near you",
  "Pilihan Care Space": "Care Space picks",
  "Hasil pencarian": "Search results",
  Bahasa: "Language",
  "Kontak Kami": "Contact us",
  "Ubah profil": "Edit profile",
  Layanan: "Services",
  Reward: "Rewards",
  Promo: "Offers",
  Info: "Info",
  "Pilih stylist": "Choose a stylist",
  "Pilih tanggal & waktu": "Choose date & time",
  "Ringkasan pemesanan": "Booking summary",
};
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
  const [language, setLanguage] = useState("id");
  const t = (text) => (language === "en" ? en[text] || text : text);
  const [shop, setShop] = useState(shops[0]);
  const [tab, setTab] = useState("Layanan");
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState(["kemang"]);
  const [service, setService] = useState(services[0]);
  const [stylist, setStylist] = useState("Esta");
  const [full, setFull] = useState(false);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("20:00");
  const [note, setNote] = useState("");
  const [bookings, setBookings] = useState([]);
  const [current, setCurrent] = useState(null);
  const [appointmentTab, setAppointmentTab] = useState("Berjalan");
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
    dates[i].toLocaleDateString("id-ID", {
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
    setTab("Layanan");
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
      status: "Dikonfirmasi",
    };
    setBookings((bk) => [b, ...bk]);
    setCurrent(b);
    go("success");
  }
  const title = {
    home: "Care Space",
    welcome: "Care Space",
    phone: "Masuk dengan nomor HP",
    otp: "Verifikasi nomor HP",
    search: category === "Beauty" ? "Beauty Bar" : "Hasil pencarian",
    outlet: "Care Space",
    stylist: "Pilih stylist",
    schedule: "Pilih tanggal & waktu",
    review: "Ringkasan pemesanan",
    success: "Janji temu berhasil dibuat.",
    favorites: "Favorit",
    appointments: "Janji Temu",
    detail: "Detail janji temu",
    rewards: "Reward",
    profile: "Profil",
    edit: "Ubah profil",
    language: "Bahasa",
    support: "Kontak Kami",
  }[screen];
  const filtered = shops.filter(
    (s) =>
      (category === "Semua" || s.category === category) &&
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
            aria-label={"Lihat " + item.name + " " + item.branch}
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
                ? "Hapus favorit "
                : "Simpan favorit ") +
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
                Pesan <Icon />
              </Button>
            </div>
          )}
        </div>
      </article>
    );
  }
  function Nav() {
    return (
      <nav className="bottom-nav" aria-label="Navigasi utama">
        {[
          ["home", "Beranda", HomeIcon],
          ["favorites", "Favorit", HeartIcon],
          ["appointments", "Janji Temu", CalendarIcon],
          ["profile", "Profil", UserIcon],
        ].map(([s, label, ic]) => (
          <button
            key={s}
            aria-current={screen === s ? "page" : undefined}
            className={screen === s ? "active" : ""}
            onClick={() => go(s)}
          >
            <Icon as={ic} size={23} />
            <span>{t(label)}</span>
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
        Mulai pukul {b.time}
      </p>
      <wired-divider />
      <h3>{b.service.name}</h3>
      <p className="muted">
        {b.stylist} · {b.service.duration} menit
      </p>
      <strong>{money(b.service.price)}</strong>
      {b.note && <p>Catatan: {b.note}</p>}
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
          <span className="badge">Kartu anggota</span>
        </div>
        <h3>
          {signed
            ? profile.first + " " + profile.last
            : "Masuk untuk lihat poin"}
        </h3>
        <div className="points">
          {signed ? "300" : "—"} <span>Saldo poin</span>
        </div>
        {!signed && (
          <Button
            onClick={() => {
              setAfterLogin("rewards");
              go("phone");
            }}
          >
            Masuk atau daftar <Icon />
          </Button>
        )}
      </Panel>
      {["Haircut Only 95K", "Haircut By Certified Barber Only 120K"].map(
        (name) => (
          <Panel key={name}>
            <h3>{name}</h3>
            <p className="muted">
              50 menit · Tukarkan poin untuk harga spesial.
            </p>
            <div className="between">
              <strong>1.000 poin</strong>
              <Button
                secondary
                onClick={() =>
                  setModal({
                    title: "Poin belum cukup",
                    body: "Saldo demo kamu 300 poin. Kumpulkan 700 poin lagi untuk menukarkan reward ini.",
                  })
                }
              >
                Tukarkan <Icon as={GiftIcon} />
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
              Ruang untuk
              <br />
              merawat diri.
            </h1>
            <p>Temukan barber, salon, dan layanan perawatan favoritmu.</p>
          </div>
          <Button
            onClick={() =>
              setModal({
                title: "Google sign-in · Demo",
                body: "Tidak ada akun Google yang dihubungkan. Lanjutkan sebagai Drestayumna untuk mencoba profil yang sudah masuk.",
                action: () => {
                  setSigned(true);
                  go("home");
                },
                actionLabel: "Lanjutkan akun demo",
              })
            }
          >
            <Icon as={GlobeIcon} /> Lanjut dengan Google
          </Button>
          <Button
            secondary
            onClick={() => {
              setAfterLogin("home");
              go("phone");
            }}
          >
            <Icon as={PhoneIcon} /> Lanjut dengan nomor HP
          </Button>
          <button
            className="link center"
            onClick={() => {
              setSigned(false);
              go("home");
            }}
          >
            Jelajahi sebagai tamu <Icon />
          </button>
          <p className="text-xs center muted">
            Dengan melanjutkan, kamu menyetujui{" "}
            <button
              className="link"
              onClick={() =>
                setModal({
                  title: "Syarat & Ketentuan",
                  body: "Ini prototipe interaktif. Tidak ada pembayaran, reservasi nyata, atau pengiriman data.",
                })
              }
            >
              Syarat & Ketentuan
            </button>{" "}
            dan Kebijakan Privasi.
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
              {signed ? "Halo, " + profile.first : "Guest mode"}
            </span>
          </div>
          <button
            className="search-trigger"
            onClick={() => {
              setQuery("");
              setCategory("Semua");
              go("search");
            }}
          >
            <Icon as={SearchIcon} />
            Cari barber, salon, layanan...
            <Icon />
          </button>
          <h2>{t("Pilih layanan")}</h2>
          <div className="categories">
            {[
              ["Barber", ShopIcon],
              ["Beauty", StarIcon],
              ["Refleksologi", HeartIcon],
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
            <h2>{t("Di dekatmu")}</h2>
            <button
              className="link text-xs"
              onClick={() => {
                setQuery("");
                setCategory("Semua");
                go("search");
              }}
            >
              Lihat semua <Icon size={16} />
            </button>
          </div>
          <div className="two-col">
            {shops.slice(1, 3).map((s) => (
              <ShopCard key={s.id} item={s} compact />
            ))}
          </div>
          <h2>{t("Pilihan Care Space")}</h2>
          <ShopCard item={shops[0]} />
        </>
      );
      break;
    case "search":
      content = (
        <>
          <wired-search-input
            aria-label="Cari outlet"
            placeholder="Cari barber, salon, layanan..."
            value={query}
            onInput={(e) => setQuery(e.target.value)}
          />
          <div className="chips">
            {["Semua", "Barber", "Beauty", "Refleksologi", "Salon"].map((c) => (
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
            {filtered.length} outlet · Pilihan tempat untuk layanan ini
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
              <h2>Belum ada outlet</h2>
              <p>
                Coba kata kunci atau kategori lain. Data outlet pada prototype
                ini terbatas.
              </p>
              <Button
                secondary
                onClick={() => {
                  setQuery("");
                  setCategory("Semua");
                }}
              >
                Lihat semua outlet
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
              aria-label="Simpan outlet"
              aria-pressed={favorites.includes(shop.id)}
              onClick={() => toggleFavorite(shop.id)}
            >
              <Icon as={HeartIcon} />
            </button>
          </div>
          <h1 className="outlet-name">{fullShop}</h1>
          <p className="inline text-xs">
            <span className="badge">Buka</span>13:00 – 21:00{" "}
            <span className="inline">
              <Icon as={StarIcon} size={16} />
              4,9 (359)
            </span>
          </p>
          <p className="inline muted text-xs">
            <Icon as={LocationIcon} />
            {shop.address}
          </p>
          <div className="tabs">
            {["Layanan", "Reward", "Promo", "Info"].map((x) => (
              <button
                key={x}
                className={tab === x ? "active" : ""}
                onClick={() => setTab(x)}
              >
                {t(x)}
              </button>
            ))}
          </div>
          {tab === "Layanan" && (
            <>
              <h2>Paket & penawaran</h2>
              {shopServices.map((s) => (
                <Panel key={s.name}>
                  <div className="inline">
                    <Icon as={TagIcon} />
                    <h3>{s.name}</h3>
                  </div>
                  <p className="text-xs muted">{s.duration} menit</p>
                  <p>{s.description}</p>
                  <div className="between">
                    <strong>{money(s.price)}</strong>
                    <Button onClick={() => chooseService(s)}>Pesan +</Button>
                  </div>
                </Panel>
              ))}
            </>
          )}
          {tab === "Reward" && rewards()}
          {tab === "Promo" && (
            <Panel>
              <Icon as={TagIcon} size={32} />
              <h2>Paket lebih hemat</h2>
              <p>
                Haircut + Wash · 60 menit. Pilihan perawatan lengkap dalam satu
                kunjungan.
              </p>
              <p className="text-xs muted">
                Contoh penawaran prototype, bukan promo aktif.
              </p>
              <Button onClick={() => chooseService(shopServices.at(-1))}>
                Lihat paket · {money(shopServices.at(-1).price)} <Icon />
              </Button>
            </Panel>
          )}
          {tab === "Info" && (
            <>
              <h2>Tentang outlet</h2>
              <p>
                Ruang untuk merawat diri, dengan konsultasi personal sebelum
                layanan dimulai.
              </p>
              <div className="two-col">
                <Button
                  secondary
                  onClick={() =>
                    setModal({
                      title: "Hubungi outlet",
                      body: "Kontak outlet disimulasikan. Tidak ada panggilan telepon yang dibuat.",
                    })
                  }
                >
                  <Icon as={PhoneIcon} /> Hubungi
                </Button>
                <Button
                  secondary
                  onClick={() =>
                    setModal({
                      title: "Lokasi outlet",
                      body:
                        shop.address +
                        ". Petunjuk arah disimulasikan pada prototype.",
                    })
                  }
                >
                  <Icon as={LocationIcon} /> Lihat arah
                </Button>
              </div>
              <h2>Rating & ulasan</h2>
              <Panel>
                <div className="points">
                  4,9 <Icon as={StarIcon} size={32} />
                </div>
                <p>359 ulasan · Rata-rata penilaian</p>
              </Panel>
              {[
                [
                  "Nelsen",
                  "14 Jan 2026",
                  "5",
                  "Kak Dee sangat membantu, skillful, dan memberi saran yang cocok.",
                ],
                [
                  "Filal",
                  "10 Feb 2026",
                  "1",
                  "Hasil berbeda dari referensi. Mohon konfirmasi sebelum mulai memotong.",
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
            <span className="text-xs muted">Layanan terpilih</span>
            <h3>{service.name}</h3>
            <p>{fullShop}</p>
          </Panel>
          <label className="demo-toggle">
            <wired-toggle
              aria-label="Simulasikan jadwal penuh"
              checked={full}
              onChange={(e) => setFull(e.target.checked)}
            />{" "}
            Simulasikan jadwal penuh
          </label>
          <p className="text-xs muted">
            Ketersediaan demo. Referensi asli menampilkan semua jadwal penuh.
          </p>
          {["Esta", "Dee", "Adi", "Digul", "Arya"].map((name) => (
            <button
              className={"stylist-row " + (stylist === name ? "selected" : "")}
              key={name}
              disabled={full}
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
                {full ? "Jadwal penuh" : "Pilih"} {!full && <Icon />}
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
            <Icon as={CalendarIcon} /> Pilih tanggal
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
                  {d.toLocaleDateString("id-ID", { weekday: "short" })}
                </span>
                <strong>{d.getDate()}</strong>
                <span>{d.toLocaleDateString("id-ID", { month: "short" })}</span>
              </button>
            ))}
          </div>
          <h2>
            <Icon as={ClockIcon} /> Waktu tersedia
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
            Waktu lokal outlet · Durasi {service.duration} menit
          </p>
          <div className="bottom-action">
            <div className="between">
              <span>
                {dates[day].toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                · {time || "Pilih waktu"}
              </span>
              <strong>{money(service.price)}</strong>
            </div>
            <Button
              disabled={!time || (service.duration === 120 && time === "20:00")}
              onClick={() => go("review")}
            >
              Tambahkan ke keranjang <Icon />
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
              Ubah layanan
            </Button>
            <Button
              secondary
              onClick={() =>
                setModal({
                  title: "Batalkan pilihan?",
                  body: "Pilihan layanan belum dipesan. Kembali ke outlet untuk memilih ulang.",
                  action: () => go("outlet"),
                  actionLabel: "Batalkan pilihan",
                })
              }
            >
              Batalkan
            </Button>
          </div>
          <Field
            area
            label="Catatan khusus (opsional)"
            placeholder="Tulis catatan atau permintaan khusus"
            value={note}
            onChange={setNote}
          />
          <Panel>
            <h3 className="inline">
              <Icon as={InfoIcon} />
              Kebijakan pembatalan
            </h3>
            <p className="text-xs muted">
              Mohon tidak membatalkan janji temu dalam 1 jam sebelum jadwal.
              Datang 5 menit lebih awal.
            </p>
          </Panel>
          <div className="bottom-action">
            <div className="between">
              <span>1 layanan · Bayar di outlet</span>
              <strong>{money(service.price)}</strong>
            </div>
            <Button onClick={confirmBooking}>
              {signed ? "Konfirmasi pemesanan" : "Masuk & konfirmasi"} <Icon />
            </Button>
            <span className="text-xs muted center">
              Simulasi saja. Tidak ada tagihan atau reservasi nyata.
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
          <p className="center">Waktunya merawat diri. Sampai bertemu!</p>
          {summary(current)}
          <Panel>
            <div className="between">
              <span>Kode booking</span>
              <strong className="booking-code">{current.id}</strong>
            </div>
            <wired-divider />
            <h3>Check-in sebelum {current.time}</h3>
            <p>
              Datang setidaknya 5 menit lebih awal. Janji temu dapat dibatalkan
              jika terlambat lebih dari 5 menit.
            </p>
          </Panel>
          <Button onClick={() => go("detail")}>
            Lihat detail janji temu <Icon />
          </Button>
          <Button secondary onClick={() => go("home")}>
            Kembali ke Beranda
          </Button>
        </>
      ) : (
        <div className="empty">
          <Icon as={CalendarIcon} size={48} />
          <h2>Belum ada pemesanan</h2>
          <p>Selesaikan alur booking untuk melihat konfirmasi.</p>
          <Button onClick={() => openShop(shops[0])}>
            Mulai pemesanan <Icon />
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
              <h2>Simpan tempat favoritmu</h2>
              <p>Ketuk ikon hati pada outlet untuk menemukannya di sini.</p>
              <Button onClick={() => go("home")}>
                Jelajahi outlet <Icon />
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
            {["Berjalan", "Selesai"].map((v) => (
              <button
                key={v}
                className={appointmentTab === v ? "active" : ""}
                onClick={() => setAppointmentTab(v)}
              >
                {v}
              </button>
            ))}
          </div>
          {appointmentTab === "Berjalan" ? (
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
                    Lihat detail <Icon />
                  </Button>
                </Panel>
              ))
            ) : (
              <div className="empty">
                <Icon as={CalendarIcon} size={48} />
                <h2>Waktu untuk dirimu</h2>
                <p>
                  Belum ada janji temu. Temukan perawatan favoritmu dan pilih
                  jadwal.
                </p>
                <Button onClick={() => go("home")}>
                  Cari layanan <Icon />
                </Button>
              </div>
            )
          ) : (
            [
              "Minggu, 13 September 2026 · 16:00–16:50",
              "Kamis, 19 Februari 2026 · 11:00–12:00",
            ].map((date) => (
              <Panel key={date}>
                <span className="badge">Selesai · contoh riwayat</span>
                <h3>Di Bawah Pohon Barber & Shop Kemang</h3>
                <p>Standard Haircut</p>
                <p className="text-xs inline">
                  <Icon as={CalendarIcon} />
                  {date}
                </p>
                <Button secondary onClick={() => openShop(shops[0])}>
                  Pesan lagi <Icon />
                </Button>
              </Panel>
            ))
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
          {current.status !== "Dibatalkan" && (
            <Button
              secondary
              onClick={() =>
                setModal({
                  title: "Batalkan janji temu?",
                  body: "Janji temu demo ini akan ditandai dibatalkan. Tidak ada biaya pembatalan pada prototype.",
                  action: () => {
                    const next = { ...current, status: "Dibatalkan" };
                    setCurrent(next);
                    setBookings((bs) =>
                      bs.map((b) => (b.id === next.id ? next : b)),
                    );
                  },
                  actionLabel: "Ya, batalkan",
                })
              }
            >
              Batalkan janji temu
            </Button>
          )}
          <Button onClick={() => go("appointments")}>
            Semua janji temu <Icon />
          </Button>
        </>
      ) : (
        <p>Pilih janji temu dari daftar.</p>
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
                : "Kamu masuk sebagai tamu"}
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
                  {t("Ubah profil")} <Icon />
                </Button>
              </>
            ) : (
              <>
                <p className="muted">
                  Masuk untuk mengelola profil, janji temu, dan favoritmu.
                </p>
                <Button
                  onClick={() => {
                    setAfterLogin("profile");
                    go("phone");
                  }}
                >
                  Masuk atau daftar <Icon />
                </Button>
              </>
            )}
          </div>
          <h3 className="section-label">Preferensi</h3>
          <button className="menu-row" onClick={() => go("language")}>
            <Icon as={GlobeIcon} />
            {t("Bahasa")}
            <span>{language === "id" ? "Bahasa Indonesia" : "English"}</span>
            <Icon />
          </button>
          <button className="menu-row" onClick={() => go("rewards")}>
            <Icon as={GiftIcon} />
            Reward<span>{signed ? "300 poin" : "Masuk"}</span>
            <Icon />
          </button>
          <h3 className="section-label">Informasi & bantuan</h3>
          {["Syarat dan Ketentuan", "Kebijakan Privasi"].map((x) => (
            <button
              className="menu-row"
              key={x}
              onClick={() =>
                setModal({
                  title: x,
                  body: "Care Space interactive wireframe. Semua data adalah contoh dan hanya disimpan selama halaman terbuka. Tidak ada layanan backend atau transaksi nyata.",
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
            {t("Kontak Kami")}
            <Icon />
          </button>
          {signed && (
            <>
              <h3 className="section-label">Akun</h3>
              <button
                className="menu-row"
                onClick={() =>
                  setModal({
                    title: "Hapus data demo?",
                    body: "Profil, favorit, dan janji temu sesi ini akan direset.",
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
                    actionLabel: "Hapus data demo",
                  })
                }
              >
                <Icon as={UserIcon} />
                Hapus Data Saya
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
                Keluar
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
              label="Nomor HP"
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
            Demo: masukkan 9–13 digit setelah +62. Tidak ada SMS yang dikirim.
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
                  "Masukkan nomor HP yang valid tanpa awalan 0 atau +62.",
                );
                return;
              }
              setOtp("");
              go("otp");
            }}
          >
            Lanjutkan <Icon />
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
          <p>Masukkan kode untuk +62 {phone || "821 1077 8883"}.</p>
          <Panel>
            <h3>Verifikasi simulasi</h3>
            <p>
              Gunakan kode <strong>123456</strong>. Tidak ada pesan yang
              dikirim.
            </p>
          </Panel>
          <Field
            label="Kode verifikasi"
            placeholder="6 digit"
            value={otp}
            onChange={(v) => setOtp(v.replace(/\D/g, "").slice(0, 6))}
          />
          {error && <p role="alert">{error}</p>}
          <Button
            disabled={otp.length !== 6}
            onClick={() => {
              if (otp !== "123456") {
                setError("Kode tidak cocok. Gunakan kode demo 123456.");
                return;
              }
              setSigned(true);
              go(afterLogin);
              notify("Berhasil masuk ke akun demo.");
            }}
          >
            Verifikasi & lanjutkan <Icon />
          </Button>
          <button
            className="link"
            onClick={() => notify("Kode demo dikirim ulang: 123456")}
          >
            Kirim ulang kode
          </button>
          <button className="link" onClick={() => go("phone")}>
            Ubah nomor HP
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
            label="Nama depan"
            value={draft.first}
            onChange={(v) => setDraft({ ...draft, first: v })}
          />
          <Field
            label="Nama belakang"
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
              Ubah nomor HP
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
                setError("Isi nama lengkap dan email yang valid.");
                return;
              }
              setProfile(draft);
              go("profile");
              notify("Perubahan profil disimpan.");
            }}
          >
            Simpan perubahan <Icon />
          </Button>
        </>
      );
      break;
    case "language":
      content = (
        <>
          <p>Pilih bahasa yang ingin kamu gunakan.</p>
          {[
            ["id", "ID", "Bahasa Indonesia"],
            ["en", "EN", "English"],
          ].map(([code, short, name]) => (
            <button
              className={
                "language-row " + (language === code ? "selected" : "")
              }
              aria-pressed={language === code}
              key={code}
              onClick={() => setLanguage(code)}
            >
              <span className="avatar">{short}</span>
              <h3>{name}</h3>
              <span>{language === code ? "✓" : ""}</span>
            </button>
          ))}
          <p className="text-xs muted">
            Bahasa berlaku untuk navigasi dan judul.
          </p>
        </>
      );
      break;
    case "support":
      content = sent ? (
        <div className="empty">
          <Icon as={MailIcon} size={48} />
          <h2>Pesan diterima</h2>
          <p>
            Permintaan demo CS-SUPPORT-001 telah dicatat di sesi ini. Tidak ada
            pesan yang dikirim ke tim support.
          </p>
          <Button onClick={() => go("profile")}>
            Kembali ke Profil <Icon />
          </Button>
        </div>
      ) : (
        <>
          <p>Pilih alasan kamu menghubungi kami.</p>
          <wired-radio-group
            aria-label="Alasan menghubungi"
            selected={reason}
            onselected={(e) => setReason(e.detail.selected)}
          >
            {[
              "Masalah OTP",
              "Aplikasi tidak dapat dibuka",
              "Saldo poin pada aplikasi dan dashboard tidak terlihat",
              "Reservasi hilang",
              "Terjebak saat memilih layanan dengan pesan ‘Mohon Tunggu’",
              "Tampilan kosong saat memilih jadwal",
              "Lainnya",
            ].map((r) => (
              <wired-radio key={r} name={r}>
                {r}
              </wired-radio>
            ))}
          </wired-radio-group>
          <Field
            area
            label="Detail tambahan (opsional)"
            placeholder="Ceritakan kendala yang kamu alami"
            value={message}
            onChange={setMessage}
          />
          <Button disabled={!reason} onClick={() => setSent(true)}>
            Kirim <Icon />
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

  return (
    <div className="workspace">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Icon as={ShopIcon} size={26} />
          </span>
          <div>
            care space<span>customer experience</span>
          </div>
        </div>

        <nav aria-label="Prototype screens">
          {screenGroups.map(([num, label, items]) => (
            <section className="nav-group" key={num}>
              <h3>
                <span>{num}</span>
                {label}
              </h3>
              {items.map(([s, label]) => (
                <button
                  key={s}
                  className={screen === s ? "active" : ""}
                  onClick={() => {
                    if (s === "edit") setDraft({ ...profile });
                    go(s);
                  }}
                >
                  <span>{label}</span>
                  {screen === s ? (
                    <Icon size={16} />
                  ) : (
                    <span className="nav-dot" />
                  )}
                </button>
              ))}
            </section>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Icon as={InfoIcon} />
          <span>
            Demo data only.
            <br />
            Resets on reload.
          </span>
        </div>
      </aside>
      <main className="canvas">
        <header className="canvas-header">
          <div>
            <h1>Customer prototype</h1>
            <a className="link text-xs" href="?app=manager">
              Manager
            </a>
            {" · "}
            <a className="link text-xs" href="?app=staff">
              Staff
            </a>
          </div>
          <button
            className="btn-secondary restart"
            onClick={() =>
              setModal({
                title: "Reset prototype?",
                body: "Clear the current session and return to the initial home screen?",
                action: () => window.location.reload(),
                actionLabel: "Reset prototype",
              })
            }
          >
            Reset demo <Icon as={ArrowLeftIcon} />
          </button>
        </header>
        <div className="stage">
          <div className="phone">
            <div className="status-bar">
              <span>9:41</span>
              <span className="notch" />
              <span>Demo</span>
            </div>
            <header className="app-header">
              {screen !== "home" && (
                <button className="back" aria-label="Kembali" onClick={back}>
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
                {t(title)}
              </h1>
              {screen === "home" && (
                <button
                  className="header-profile"
                  aria-label="Buka profil"
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
        {modal.action ? "Kembali" : "Mengerti"}
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
        Skip to prototype
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
} else {
  renderPrototype(App);
}
