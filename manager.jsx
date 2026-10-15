import React, { useEffect, useRef, useState } from "react";
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
  new Date(value + "T12:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const money = (n) => "Rp" + Number(n).toLocaleString("id-ID");
const initialBusiness = {
  name: "Di Bawah Pohon Barber & Shop Kemang",
  description:
    "Spesialis grooming pria yang mengutamakan kualitas potongan dan pengalaman perawatan.",
  address: "Jl. Kemang Raya No. 88A, Mampang Prapatan, Jakarta Selatan",
  phone: "",
  zone: "Asia/Jakarta",
};
const initialServices = [
  {
    id: 1,
    name: "Haircut by Certified Barber",
    description: "Konsultasi, potong rambut, dan styling.",
    duration: 45,
    price: 230000,
    staff: ["Esta", "Dee", "Adi"],
    active: true,
  },
  {
    id: 2,
    name: "Beard Trim",
    description: "Rapikan dan bentuk janggut sesuai preferensi pelanggan.",
    duration: 30,
    price: 75000,
    staff: ["Esta", "Adi"],
    active: true,
  },
];
const people = [
  ["CS-1041", "Nadia Putri", "Dee", "09:00", "09:45", "Sedang dilayani", 1],
  [
    "CS-1043",
    "Drestayumna Nurmareko",
    "Esta",
    "09:30",
    "10:15",
    "Sudah datang",
    1,
  ],
  ["CS-1045", "Raka Pradana", "Adi", "09:45", "10:30", "Terjadwal", 1],
  ["CS-1047", "Bima Pratama", "Esta", "11:00", "11:30", "Terjadwal", 2],
  ["CS-1049", "Arif Rahman", "Esta", "14:00", "14:45", "Terjadwal", 1],
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
      { title: "Reservasi dibuat", actor: name, time: "8 Okt 2026, 19:20" },
      ...(status !== "Terjadwal"
        ? [
            {
              title: "Kedatangan dikonfirmasi",
              actor: "Maya (Manajer)",
              time: "9 Okt 2026, 08:55",
            },
          ]
        : []),
      ...(status === "Sedang dilayani"
        ? [
            {
              title: "Pelayanan dimulai",
              actor: staff + " (Barber)",
              time: "9 Okt 2026, 09:02",
            },
          ]
        : []),
    ],
  }),
);
const initialHours = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
].map((day) => ({ day, open: day !== "Senin", start: "09:00", end: "21:00" }));
const pages = [
  ["frontdesk", "Front Desk", UserIcon],
  ["reservations", "Reservasi", CalendarIcon],
  ["detail", "Detail reservasi", InfoIcon],
  ["manage", "Kelola usaha", SettingsIcon],
  ["business", "Profil usaha", ShopIcon],
  ["services", "Layanan", CutIcon],
  ["service", "Ubah layanan", EditIcon],
  ["hours", "Jam operasional", ClockIcon],
  ["staff", "Staf", UserIcon],
  ["schedule", "Jadwal staf", CalendarIcon],
  ["activity", "Riwayat aktivitas", ClockIcon],
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
        {value.label || "Konfirmasi"}
        <Icon as={TickIcon} />
      </Button>
      <Button secondary onClick={close}>
        Kembali
      </Button>
    </dialog>
  );
}
export default function ManagerApp() {
  const [screen, setScreen] = useState("frontdesk"),
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
    [shiftDay, setShiftDay] = useState("Jumat");
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
    document.title = "Care Space — Manager Wireframe";
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
        time: new Date().toLocaleTimeString("id-ID", {
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
    scheduled = reservations.filter((r) => r.status === "Terjadwal"),
    arrived = reservations.filter((r) =>
      ["Sudah datang", "Sedang dilayani", "Selesai"].includes(r.status),
    );
  const openDetail = (r) => {
    setSelected(r.id);
    go("detail");
  };
  function transition(r, status) {
    const title = {
      "Sudah datang": "Kedatangan dikonfirmasi",
      "Sedang dilayani": "Pelayanan dimulai",
      Selesai: "Pelayanan diselesaikan",
      Dibatalkan: "Reservasi dibatalkan",
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
                  actor: "Maya (Manajer)",
                  time:
                    "Sesi demo · " +
                    new Date().toLocaleTimeString("id-ID", {
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
      title: "Konfirmasi kedatangan?",
      body:
        r.name + " · " + r.id + ". Pastikan pelanggan sudah berada di tempat.",
      label: "Ya, sudah datang",
      action: () => transition(r, "Sudah datang"),
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
            {r.staff} · {r.service.duration} menit
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
    Terjadwal: "Sudah datang",
    "Sudah datang": "Sedang dilayani",
    "Sedang dilayani": "Selesai",
  };
  let content;
  switch (screen) {
    case "frontdesk":
      content = (
        <>
          <p className="manager-date inline">
            <Icon as={CalendarIcon} />
            {dateText(DATE)}
          </p>
          <p className="text-xs muted">Tanggal skenario: 9 Oktober 2026</p>
          <div className="manager-field">
            <span>Kode pemesanan</span>
            <div className="manager-search">
              <wired-input
                aria-label="Kode pemesanan"
                value={query}
                placeholder="Contoh: CS-1045"
                onInput={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    setSearched(query.trim().toUpperCase());
                }}
              />
              <Button onClick={() => setSearched(query.trim().toUpperCase())}>
                Cari
                <Icon as={SearchIcon} />
              </Button>
            </div>
          </div>
          {found ? (
            <Panel>
              <div className="between">
                <span className="text-xs muted">Reservasi ditemukan</span>
                <span className="manager-status">{found.status}</span>
              </div>
              <h2>{found.name}</h2>
              <p>{found.service.name}</p>
              <p className="text-xs muted">
                {dateText(found.date)} · {found.start}–{found.end}
                <br />
                Barber: {found.staff} · {found.service.duration} menit
              </p>
              <wired-divider />
              {found.status === "Terjadwal" ? (
                <>
                  <p className="text-xs muted">
                    Pastikan pelanggan sudah berada di tempat.
                  </p>
                  <Button onClick={() => confirmArrival(found)}>
                    <Icon as={TickIcon} />
                    Konfirmasi kedatangan
                  </Button>
                </>
              ) : (
                <Button secondary onClick={() => openDetail(found)}>
                  Lihat detail reservasi
                  <Icon />
                </Button>
              )}
            </Panel>
          ) : (
            <div className="manager-empty">
              <Icon as={SearchIcon} size={32} />
              <h3>Reservasi tidak ditemukan</h3>
              <p>Coba CS-1045, CS-1041, atau cari di daftar reservasi.</p>
              <Button secondary onClick={() => go("reservations")}>
                Lihat reservasi
                <Icon />
              </Button>
            </div>
          )}
          <h2>Kedatangan hari ini</h2>
          <div className="tabs">
            {[
              ["pending", "Belum datang", scheduled.length],
              ["arrived", "Sudah datang", arrived.length],
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
              Tidak ada pelanggan dalam daftar ini.
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
            label="Tanggal reservasi"
            type="date"
            value={filterDate}
            onChange={setFilterDate}
          />
          <div className="manager-filter-grid">
            <Select
              label="Staf"
              value={filterStaff}
              onChange={setFilterStaff}
              options={["all", "Esta", "Dee", "Adi"].map((x) => [
                x,
                x === "all" ? "Semua staf" : x,
              ])}
            />
            <Select
              label="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                "all",
                "Terjadwal",
                "Sudah datang",
                "Sedang dilayani",
                "Selesai",
                "Dibatalkan",
              ].map((x) => [x, x === "all" ? "Semua status" : x])}
            />
          </div>
          <div className="between">
            <span className="text-xs muted">{filtered.length} reservasi</span>
            <button
              className="link text-xs"
              onClick={() => {
                setFilterDate(DATE);
                setFilterStaff("all");
                setFilterStatus("all");
              }}
            >
              Reset filter
            </button>
          </div>
          {filtered.map((r) => (
            <Reservation key={r.id} r={r} />
          ))}
          {!filtered.length && (
            <div className="manager-empty">
              <Icon as={CalendarIcon} size={36} />
              <h2>Tidak ada reservasi</h2>
              <p>Ubah filter untuk melihat reservasi.</p>
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
          <h2>Pelanggan</h2>
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
          <h2>Jadwal reservasi</h2>
          <p className="inline">
            <Icon as={CalendarIcon} />
            {dateText(item.date)}
          </p>
          <p className="inline">
            <Icon as={ClockIcon} />
            {item.start}–{item.end} · {item.service.duration} menit
          </p>
          <wired-divider />
          <h2>Layanan</h2>
          <h3 className="inline">
            <Icon as={CutIcon} />
            {item.service.name}
          </h3>
          <div className="between">
            <span className="muted text-xs">Perkiraan biaya layanan</span>
            <strong>{money(item.service.price)}</strong>
          </div>
          <wired-divider />
          <h2>Aktivitas</h2>
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
              {item.status === "Sedang dilayani"
                ? "Pelayanan sedang ditangani oleh " + item.staff + "."
                : "Status saat ini: " + item.status + "."}
            </p>
          </div>
          {nextStatus[item.status] && (
            <Button
              onClick={() =>
                item.status === "Terjadwal"
                  ? confirmArrival(item)
                  : setModal({
                      title:
                        nextStatus[item.status] === "Selesai"
                          ? "Selesaikan pelayanan?"
                          : "Mulai pelayanan?",
                      body:
                        "Perbarui status " + item.name + " pada sesi demo ini.",
                      action: () => transition(item, nextStatus[item.status]),
                    })
              }
            >
              {item.status === "Terjadwal"
                ? "Konfirmasi kedatangan"
                : item.status === "Sudah datang"
                  ? "Mulai pelayanan"
                  : "Selesaikan pelayanan"}
              <Icon as={TickIcon} />
            </Button>
          )}
          {["Terjadwal", "Sudah datang"].includes(item.status) && (
            <Button
              secondary
              onClick={() =>
                setModal({
                  title: "Batalkan reservasi?",
                  body:
                    item.name +
                    " · " +
                    item.id +
                    ". Tindakan ini hanya memengaruhi data demo.",
                  label: "Ya, batalkan",
                  action: () => transition(item, "Dibatalkan"),
                })
              }
            >
              Batalkan reservasi
            </Button>
          )}
        </>
      );
      break;
    case "manage":
      content = (
        <>
          <h2>Tempat usaha</h2>
          <Menu
            target="business"
            title="Profil tempat usaha"
            description="Nama, alamat, dan kontak"
            icon={ShopIcon}
          />
          <Menu
            target="services"
            title="Layanan"
            description="Harga, durasi, dan staf layanan"
            icon={CutIcon}
          />
          <Menu
            target="hours"
            title="Jam operasional"
            description="Jam buka dan hari libur"
            icon={ClockIcon}
          />
          <h2>Tim</h2>
          <Menu
            target="staff"
            title="Staf"
            description="Profil, akses, dan penugasan"
            icon={UserIcon}
          />
          <Menu
            target="schedule"
            title="Jadwal staf"
            description="Jam kerja dan istirahat"
            icon={CalendarIcon}
          />
          <h2>Pemantauan</h2>
          <Menu
            target="activity"
            title="Riwayat aktivitas"
            description="Perubahan reservasi dan pelayanan"
            icon={ClockIcon}
          />
        </>
      );
      break;
    case "business":
      content = (
        <div className="manager-form">
          <p className="muted">Informasi yang dilihat pelanggan.</p>
          <Field
            label="Nama tempat usaha"
            value={businessDraft.name}
            onChange={(name) => setBusinessDraft({ ...businessDraft, name })}
          />
          <Field
            area
            label="Deskripsi"
            value={businessDraft.description}
            onChange={(description) =>
              setBusinessDraft({ ...businessDraft, description })
            }
          />
          <Field
            area
            label="Alamat"
            value={businessDraft.address}
            onChange={(address) =>
              setBusinessDraft({ ...businessDraft, address })
            }
          />
          <Field
            label="Nomor kontak usaha"
            type="tel"
            placeholder="Masukkan nomor telepon"
            value={businessDraft.phone}
            onChange={(phone) => setBusinessDraft({ ...businessDraft, phone })}
          />
          <Select
            label="Zona waktu"
            value={businessDraft.zone}
            onChange={(zone) => setBusinessDraft({ ...businessDraft, zone })}
            options={["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"].map(
              (z, i) => [z, ["WIB", "WITA", "WIT"][i] + " · " + z],
            )}
          />
          <p className="text-xs muted">
            Zona waktu disimpan sebagai pengaturan demo; jadwal contoh tidak
            dikonversi.
          </p>
          {error && <p role="alert">{error}</p>}
          <Button
            onClick={() => {
              if (
                !businessDraft.name.trim() ||
                !businessDraft.description.trim() ||
                !businessDraft.address.trim()
              ) {
                setError("Isi nama usaha, deskripsi, dan alamat.");
                return;
              }
              if (
                businessDraft.phone &&
                !/^\+?[0-9 ()-]{9,20}$/.test(businessDraft.phone)
              ) {
                setError("Masukkan nomor kontak yang valid.");
                return;
              }
              setBusiness({ ...businessDraft });
              log("Profil usaha diperbarui", businessDraft.name);
              saveNotice("Profil usaha disimpan.");
              go("manage");
            }}
          >
            Simpan perubahan
            <Icon as={TickIcon} />
          </Button>
        </div>
      );
      break;
    case "services":
      content = (
        <>
          <p className="text-xs muted">
            {services.length} layanan · Pilih untuk mengubah detail
          </p>
          {services.map((s) => (
            <Panel key={s.id}>
              <div className="between">
                <Icon as={CutIcon} size={28} />
                <span className="badge">{s.active ? "Aktif" : "Nonaktif"}</span>
              </div>
              <h3>{s.name}</h3>
              <p>
                {s.duration} menit · {money(s.price)}
              </p>
              <p className="text-xs muted">Staf: {s.staff.join(", ")}</p>
              <Button
                secondary
                onClick={() => {
                  setServiceDraft({ ...s, staff: [...s.staff] });
                  setHistory((h) => [...h, screen]);
                  setScreen("service");
                  setError("");
                }}
              >
                Ubah layanan
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
            label="Nama layanan"
            value={serviceDraft.name}
            onChange={(name) => setServiceDraft({ ...serviceDraft, name })}
          />
          <Field
            area
            label="Deskripsi layanan"
            value={serviceDraft.description}
            onChange={(description) =>
              setServiceDraft({ ...serviceDraft, description })
            }
          />
          <div className="two-col">
            <Field
              label="Durasi (menit)"
              type="number"
              min="1"
              value={serviceDraft.duration}
              onChange={(duration) =>
                setServiceDraft({ ...serviceDraft, duration })
              }
            />
            <Field
              label="Harga layanan (Rp)"
              type="number"
              min="0"
              value={serviceDraft.price}
              onChange={(price) => setServiceDraft({ ...serviceDraft, price })}
            />
          </div>
          <h3>Staf yang dapat melayani</h3>
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
            {serviceDraft.staff.length} staf dipilih
          </p>
          <Panel>
            <div className="between">
              <div>
                <h3>Layanan aktif</h3>
                <p className="text-xs muted">
                  Ditawarkan untuk reservasi baru.
                </p>
              </div>
              <wired-toggle
                aria-label="Layanan aktif"
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
              Perubahan layanan tidak mengubah detail reservasi yang sudah
              dibuat.
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
                  "Isi nama, deskripsi, durasi positif, harga valid, dan pilih minimal satu staf.",
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
              log("Layanan diperbarui", updated.name);
              saveNotice("Perubahan layanan disimpan.");
              go("services");
            }}
          >
            Simpan perubahan
            <Icon as={TickIcon} />
          </Button>
        </div>
      );
      break;
    case "hours":
      content = (
        <>
          <p className="text-xs muted">Jadwal mingguan {business.zone}</p>
          {hoursDraft.map((h, i) => (
            <div className="manager-hours-row" key={h.day}>
              <div className="between">
                <h3>{h.day}</h3>
                <label className="inline">
                  <span>{h.open ? "Buka" : "Tutup"}</span>
                  <wired-toggle
                    aria-label={"Buka " + h.day}
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
                    label={"Buka " + h.day}
                    type="time"
                    value={h.start}
                    onChange={(start) =>
                      setHoursDraft((all) =>
                        all.map((x, j) => (j === i ? { ...x, start } : x)),
                      )
                    }
                  />
                  <Field
                    label={"Tutup " + h.day}
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
                  "Jam tutup harus setelah jam buka pada hari yang sama.",
                );
                return;
              }
              setHours(hoursDraft.map((h) => ({ ...h })));
              log("Jam operasional diperbarui", "Jadwal mingguan");
              saveNotice("Jam operasional disimpan.");
              go("manage");
            }}
          >
            Simpan jam operasional
            <Icon as={TickIcon} />
          </Button>
        </>
      );
      break;
    case "staff":
      content = (
        <>
          <p className="text-xs muted">Akses tidak terhubung ke akun nyata</p>
          {staff.map((s) => (
            <Panel key={s.name}>
              <div className="manager-staff-row">
                <span className="avatar">
                  <Icon as={UserIcon} size={28} />
                </span>
                <div>
                  <h3>{s.name}</h3>
                  <p className="text-xs muted">
                    Barber · {s.active ? "Akses aktif" : "Akses nonaktif"}
                  </p>
                </div>
                <wired-toggle
                  aria-label={"Akses " + s.name}
                  checked={s.active}
                  onChange={(e) => {
                    const active = e.target.checked;
                    setStaff((all) =>
                      all.map((x) =>
                        x.name === s.name ? { ...x, active } : x,
                      ),
                    );
                    log(
                      "Akses staf diperbarui",
                      s.name + " · " + (active ? "aktif" : "nonaktif"),
                    );
                  }}
                />
              </div>
              <p className="text-xs muted">
                {services
                  .filter((service) => service.staff.includes(s.name))
                  .map((service) => service.name)
                  .join(" · ") || "Belum ada penugasan layanan"}
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
                Lihat jadwal
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
            Tidak mengubah reservasi yang sudah ada
          </p>
          <Select
            label="Staf terpilih"
            value={shiftStaff}
            onChange={(name) => {
              setShiftStaff(name);
              loadShift(name, shiftDay);
            }}
            options={staff.map((s) => [s.name, s.name])}
          />
          <Select
            label="Hari kerja"
            value={shiftDay}
            onChange={(day) => {
              setShiftDay(day);
              loadShift(shiftStaff, day);
            }}
            options={initialHours.map((h) => [h.day, h.day])}
          />
          <h2>Jam kerja</h2>
          <div className="two-col">
            <Field
              label="Mulai kerja"
              type="time"
              value={shift.start}
              onChange={(start) => setShift({ ...shift, start })}
            />
            <Field
              label="Selesai kerja"
              type="time"
              value={shift.end}
              onChange={(end) => setShift({ ...shift, end })}
            />
          </div>
          <h2>Istirahat</h2>
          <div className="two-col">
            <Field
              label="Mulai istirahat"
              type="time"
              value={shift.breakStart}
              onChange={(breakStart) => setShift({ ...shift, breakStart })}
            />
            <Field
              label="Selesai istirahat"
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
                  "Pastikan jam kerja valid dan waktu istirahat berada di dalam jam kerja.",
                );
                return;
              }
              setShifts((all) => ({
                ...all,
                [shiftStaff + "|" + shiftDay]: { ...shift },
              }));
              log("Jadwal staf diperbarui", shiftStaff + " · " + shiftDay);
              saveNotice("Jadwal staf disimpan.");
            }}
          >
            Simpan jadwal
            <Icon as={TickIcon} />
          </Button>
        </div>
      );
      break;
    }
    case "activity":
      content = (
        <>
          <p className="text-xs muted">Perubahan pada sesi demo ini</p>
          {audit.length ? (
            <ol className="manager-timeline">
              {audit.map((a) => (
                <li key={a.id}>
                  <h3>{a.title}</h3>
                  <p>{a.detail}</p>
                  <p>Maya (Manajer) · {a.time}</p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="manager-empty">
              <Icon as={ClockIcon} size={36} />
              <h2>Belum ada perubahan</h2>
              <p>
                Konfirmasi kedatangan atau simpan perubahan usaha untuk melihat
                aktivitas di sini.
              </p>
              <Button onClick={() => go("frontdesk")}>
                Ke Front Desk
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
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Icon as={ShopIcon} size={26} />
          </span>
          <div>
            care space<span>manager experience</span>
          </div>
        </div>

        <nav aria-label="Manager prototype screens">
          {[
            ["01", "Daily operations", pages.slice(0, 3)],
            ["02", "Business & team", pages.slice(3)],
          ].map(([num, title, list]) => (
            <section className="nav-group" key={num}>
              <h3>
                <span>{num}</span>
                {title}
              </h3>
              {list.map(([id, label]) => (
                <button
                  key={id}
                  className={screen === id ? "active" : ""}
                  onClick={() => go(id)}
                >
                  <span>{label}</span>
                  {screen === id ? (
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
            Maya · Demo manager
            <br />
            No live business data.
          </span>
        </div>
      </aside>
      <main className="canvas">
        <header className="canvas-header">
          <div>
            <h1>Manager prototype</h1>
          </div>
          <div className="manager-toolbar">
            <a className="link" href="?app=staff">
              Staff app
            </a>
            <a className="link" href="?app=customer">
              Customer app
              <Icon size={16} />
            </a>
            <Button
              secondary
              onClick={() =>
                setModal({
                  title: "Reset manager demo?",
                  body: "Semua perubahan sesi ini akan dihapus. Data contoh akan dikembalikan.",
                  label: "Reset demo",
                  action: () => window.location.reload(),
                })
              }
            >
              Reset demo
            </Button>
          </div>
        </header>
        <div className="stage">
          <div className="phone">
            <div className="status-bar">
              <span>9:41</span>
              <span className="notch" />
              <span>Demo</span>
            </div>
            <header className="app-header">
              {!["frontdesk", "reservations", "manage"].includes(screen) && (
                <button className="back" aria-label="Kembali" onClick={back}>
                  <Icon as={ArrowLeftIcon} />
                </button>
              )}
              <h1 className="app-brand">Care Space</h1>
              <span className="badge">Manajer</span>
            </header>
            <div
              className="screen"
              id="prototype-content"
              tabIndex={-1}
              ref={scroll}
            >
              <section className="manager-hero" id={"manager-" + screen}>
                <span className="manager-hero-icon">
                  <Icon as={activePage[2]} size={34} />
                </span>
                <h1>{activePage[1]}</h1>
                <p>{business.name}</p>
              </section>
              {content}

            </div>
            <nav className="bottom-nav" aria-label="Navigasi manajer">
              {[
                ["frontdesk", "Front Desk", UserIcon],
                ["reservations", "Reservasi", CalendarIcon],
                ["manage", "Kelola", SettingsIcon],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  className={
                    screen === id ||
                    (id === "manage" &&
                      pages.slice(3).some((p) => p[0] === screen)) ||
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
