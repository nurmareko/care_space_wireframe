import React, { useEffect, useRef, useState } from "react";
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
    status: "Sudah datang",
    events: ["Kedatangan dikonfirmasi Front Desk pukul 09:28."],
  },
  {
    id: "CS-1047",
    name: "Bima Pratama",
    start: "11:00",
    end: "11:30",
    duration: 30,
    service: "Beard Trim",
    status: "Terjadwal",
    events: [],
  },
  {
    id: "CS-1049",
    name: "Arif Rahman",
    start: "14:00",
    end: "14:45",
    duration: 45,
    service: "Haircut by Certified Barber",
    status: "Terjadwal",
    events: [],
  },
];
const pages = [
  ["agenda", "Agenda", CalendarIcon],
  ["detail", "Detail layanan", CutIcon],
  ["availability", "Ketersediaan", ClockIcon],
  ["profile", "Profil staf", UserIcon],
];

const dateLabel = (value) =>
  value
    ? new Date(value + "T12:00:00").toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Pilih tanggal";
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
        Kembali
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
    document.title = "Care Space — Staff Wireframe";
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
        title: "Abaikan perubahan?",
        body: "Perubahan ketersediaan belum disimpan. Ketersediaan yang tersimpan tidak akan berubah.",
        label: "Abaikan & lanjutkan",
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
        title: "Abaikan perubahan?",
        body: "Simpan perubahan terlebih dahulu atau abaikan sebelum memilih tanggal lain.",
        label: "Abaikan & ganti tanggal",
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
      next === "Sedang dilayani"
        ? "Pelayanan dimulai oleh Esta."
        : "Pelayanan diselesaikan oleh Esta.";
    setAppointments((all) =>
      all.map((a) =>
        a.id === selected
          ? {
              ...a,
              status: next,
              events: [...a.events, event + " (Sesi demo)"],
            }
          : a,
      ),
    );
    setToast(event);
  }
  const canStart =
    active.status === "Sudah datang" &&
    !appointments.some((a) => a.status === "Sedang dilayani");
  function DateField() {
    return (
      <label className="staff-date">
        <span className="inline">
          <Icon as={CalendarIcon} />
          Tanggal
        </span>
        <wired-input
          type="date"
          aria-label="Tanggal"
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
              ["Jam kerja", "09:00–17:00"],
              ["Istirahat", "12:00–13:00"],
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
            <p>Belum ada jadwal demo untuk tanggal ini.</p>
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
        <h1>Sampai jumpa, Esta.</h1>
        <p>Kamu sudah keluar dari sesi staf.</p>
        <Button
          onClick={() => {
            setSigned(true);
            setScreen("agenda");
          }}
        >
          Masuk sebagai Esta
          <Icon />
        </Button>
        <p className="text-xs muted">
          Masuk untuk melanjutkan sesi. Reset demo mengembalikan data awal.
        </p>
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
                  ? new Date(date + "T12:00:00").toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })
                  : "Pilih tanggal"}
              </h2>
              <button
                className="btn-secondary staff-today"
                onClick={() => changeDate(TODAY)}
              >
                Hari ini
              </button>
            </div>
            <div className="staff-week" aria-label="Minggu referensi">
              {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
                (label, i) => {
                  const value = "2026-10-" + String(i + 5).padStart(2, "0");
                  return (
                    <button
                      key={value}
                      aria-label={`${label}, ${i + 5} Oktober`}
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
              <summary>Pilih tanggal lain</summary>
              <DateField />
            </details>
            <Shift />
            <div className="between">
              <h2>{hasSchedule ? "Reservasi hari ini" : "Reservasi"}</h2>
              <span className="badge">{dayAppointments.length}</span>
            </div>
            <div className="staff-agenda">
              {dayAppointments.map((a) => (
                <button
                  className={
                    "staff-appointment " +
                    (a.status === "Sudah datang" ? "highlighted" : "")
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
                        as={a.status === "Terjadwal" ? ClockIcon : TickIcon}
                        size={15}
                      />
                      {a.status}
                    </span>
                    <p>{a.service}</p>
                    <span className="text-xs muted">{a.duration} menit</span>
                  </span>
                  <Icon />
                </button>
              ))}
            </div>
            {!dayAppointments.length && (
              <div className="staff-empty">
                <Icon as={CalendarIcon} size={40} />
                <h2>Agenda masih kosong</h2>

                <Button secondary onClick={() => changeDate(TODAY)}>
                  Kembali ke hari demo
                  <Icon />
                </Button>
              </div>
            )}
            <p className="text-xs muted">
              Tanggal skenario: 9 Oktober 2026 · “Hari ini” kembali ke tanggal
              referensi.
            </p>
          </>
        );
        break;
      case "detail":
        content = (
          <>
            <div className="between">
              <span>Reservasi {active.id}</span>
              <span className="staff-status">
                <Icon
                  as={active.status === "Terjadwal" ? ClockIcon : TickIcon}
                  size={16}
                />
                {active.status}
              </span>
            </div>
            {active.events.length > 0 && (
              <p className="text-xs muted">{active.events[0]}</p>
            )}
            <div className="staff-section">
              <p className="text-xs muted">Pelanggan</p>
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
            <h2>Jadwal layanan</h2>
            <p className="inline">
              <Icon as={CalendarIcon} />
              {dateLabel(TODAY)}
            </p>
            <p className="inline staff-time-large">
              <Icon as={ClockIcon} size={27} />
              {active.start}–{active.end}
            </p>
            <span className="text-xs muted">{active.duration} menit</span>
            <wired-divider />
            <h2>Layanan</h2>
            <h3 className="inline">
              <Icon as={CutIcon} size={28} />
              {active.service}
            </h3>
            <wired-divider />
            <h2>Penugasan</h2>
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
                    Terjadwal:
                      "Menunggu konfirmasi kedatangan dari Front Desk.",
                    "Sudah datang": "Pelayanan belum dimulai.",
                    "Sedang dilayani": "Pelayanan sedang berlangsung.",
                    Selesai: "Pelayanan telah selesai. Terima kasih, Esta.",
                  }[active.status]
                }
              </p>
            </div>
            {["Terjadwal", "Sudah datang"].includes(active.status) && (
              <Button
                disabled={!canStart}
                onClick={() =>
                  setModal({
                    title: "Mulai layanan?",
                    body:
                      active.name +
                      " · " +
                      active.service +
                      ". Status pada agenda akan diperbarui.",
                    label: "Ya, mulai layanan",
                    action: () => updateStatus("Sedang dilayani"),
                  })
                }
              >
                Mulai layanan
                <Icon />
              </Button>
            )}
            {active.status === "Sudah datang" && !canStart && (
              <p className="text-xs muted">
                Selesaikan pelayanan yang sedang berlangsung terlebih dahulu.
              </p>
            )}
            {active.status === "Sedang dilayani" && (
              <Button
                onClick={() =>
                  setModal({
                    title: "Selesaikan layanan?",
                    body:
                      "Pastikan pelayanan untuk " +
                      active.name +
                      " sudah selesai. Tindakan ini hanya memperbarui sesi demo.",
                    label: "Ya, selesaikan layanan",
                    action: () => updateStatus("Selesai"),
                  })
                }
              >
                Selesaikan layanan
                <Icon as={TickIcon} />
              </Button>
            )}
            {active.status === "Selesai" && (
              <Panel>
                <h3>Riwayat pelayanan</h3>
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
              Kembali ke agenda
              <Icon as={CalendarIcon} />
            </Button>
            {active.status === "Terjadwal" && (
              <details className="staff-demo-controls">
                <summary>Kontrol skenario prototype</summary>
                <p className="text-xs muted">
                  Simulasi konfirmasi Front Desk · Bukan aksi staf.
                </p>
                <Button
                  secondary
                  onClick={() => {
                    setAppointments((all) =>
                      all.map((a) =>
                        a.id === selected
                          ? {
                              ...a,
                              status: "Sudah datang",
                              events: [
                                "Kedatangan dikonfirmasi Front Desk (simulasi).",
                              ],
                            }
                          : a,
                      ),
                    );
                    setToast("Kedatangan disimulasikan.");
                  }}
                >
                  Simulasikan kedatangan
                </Button>
              </details>
            )}
          </>
        );
        break;
      case "availability":
        content = (
          <>
            <DateField />
            <h2>Jadwal kerja</h2>
            <p className="text-xs muted">Ditetapkan oleh manajer</p>
            <Shift locked />
            <h2>Ketersediaan saya</h2>
            <Panel>
              <div className="between">
                <div>
                  <h3>Terima reservasi baru</h3>
                  <p>
                    {hasSchedule
                      ? draft
                        ? "Tersedia"
                        : "Tidak tersedia"
                      : "Tidak ada jadwal"}
                  </p>
                </div>
                <wired-toggle
                  aria-label="Terima reservasi baru"
                  disabled={!hasSchedule}
                  checked={hasSchedule && draft}
                  onChange={(e) => setDraft(e.target.checked)}
                />
              </div>
              <p className="text-xs muted">
                Untuk slot kosong dalam jadwal hari ini.
              </p>
            </Panel>
            <div className="staff-notice">
              <Icon as={CalendarIcon} size={26} />
              <div>
                <h3>
                  {dayAppointments.length} reservasi{" "}
                  {hasSchedule ? "hari ini" : "pada tanggal ini"}
                </h3>
                <p>
                  Perubahan ketersediaan tidak membatalkan reservasi yang sudah
                  dikonfirmasi.
                </p>
              </div>
            </div>
            <button
              className="staff-link-row"
              onClick={() => navigate("agenda")}
            >
              Lihat agenda
              <Icon />
            </button>
            <Button
              disabled={!dirty || !hasSchedule}
              onClick={() => {
                setAvailable(draft);
                setToast("Ketersediaan berhasil disimpan.");
              }}
            >
              Simpan perubahan
              <Icon as={TickIcon} />
            </Button>
            {dirty && (
              <p className="text-xs muted">
                Ada perubahan yang belum disimpan.
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
            <h2>Penugasan</h2>
            <div className="inline">
              <span className="avatar">
                <Icon as={ShopIcon} size={30} />
              </span>
              <div>
                <p className="text-xs muted">Tempat usaha</p>
                <h3>{OUTLET}</h3>
              </div>
            </div>
            <h2>Informasi akun</h2>
            <Panel>
              <div className="staff-info-row">
                <Icon as={UserIcon} />
                <span>ID staf</span>
                <strong>STF-004</strong>
              </div>
              <wired-divider />
              <div className="staff-info-row">
                <Icon as={LockIcon} />
                <span>Status akun</span>
                <span className="staff-status">
                  <Icon as={TickIcon} size={16} />
                  Aktif
                </span>
              </div>
            </Panel>
            <h2>Layanan</h2>
            <p className="text-xs muted">Layanan yang ditugaskan manajer</p>
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
              Perubahan penugasan dikelola oleh manajer.
            </p>
            <Button
              secondary
              onClick={() =>
                setModal({
                  title: "Keluar dari akun staf?",
                  body: "Kamu akan keluar dari akun demo Esta. Data sesi tetap tersedia sampai halaman dimuat ulang.",
                  label: "Ya, keluar",
                  action: () => {
                    setSigned(false);
                    setDraft(available);
                  },
                })
              }
            >
              <Icon as={ArrowLeftIcon} />
              Keluar
            </Button>
          </>
        );
        break;
    }
  const page = pages.find((p) => p[0] === screen);
  return (
    <div className="workspace staff-workspace">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Icon as={CutIcon} size={26} />
          </span>
          <div>
            care space<span>staff experience</span>
          </div>
        </div>

        <nav aria-label="Staff prototype screens">
          <section className="nav-group">
            <h3>
              <span>01</span>Your working day
            </h3>
            {pages.map(([id, title]) => (
              <button
                key={id}
                disabled={!signed}
                className={screen === id && signed ? "active" : ""}
                onClick={() => navigate(id)}
              >
                <span>{title}</span>
                {screen === id ? (
                  <Icon size={16} />
                ) : (
                  <span className="nav-dot" />
                )}
              </button>
            ))}
          </section>
        </nav>

        <div className="sidebar-footer">
          <Icon as={InfoIcon} />
          <span>
            Esta · STF-004
            <br />
            Session-only demo data.
          </span>
        </div>
      </aside>
      <main className="canvas">
        <header className="canvas-header">
          <div>
            <h1>Staff prototype</h1>
          </div>
          <div className="staff-toolbar">
            <a className="link text-xs" href="?app=customer">
              Customer
            </a>
            <a className="link text-xs" href="?app=manager">
              Manager
            </a>
            <Button
              secondary
              onClick={() =>
                setModal({
                  title: "Reset staff demo?",
                  body: "Semua status layanan dan perubahan ketersediaan sesi ini akan dikembalikan ke data referensi.",
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
              {screen === "detail" && signed && (
                <button
                  className="back"
                  aria-label="Kembali"
                  onClick={() => navigate("agenda")}
                >
                  <Icon as={ArrowLeftIcon} />
                </button>
              )}
              <h1 className="app-brand">Care Space</h1>
              <span className="badge">Staf</span>
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
                        <p>Selamat pagi, Esta</p>
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
              <nav className="bottom-nav" aria-label="Navigasi staf">
                {[
                  ["agenda", "Agenda", CalendarIcon],
                  ["availability", "Ketersediaan", ClockIcon],
                  ["profile", "Profil", UserIcon],
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
