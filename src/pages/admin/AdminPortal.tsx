import { useCallback, useEffect, useState, type FormEvent } from "react";
import bonotechLogo from "@/assets/bonotech-logo-white.svg";
import {
  adminLogin,
  clearAdminToken,
  fetchAnalyticsOverview,
  getAdminToken,
  type AnalyticsOverview,
} from "@/lib/analytics";
import "./admin-portal.css";

const RANGES = [
  { key: "1d", label: "24h" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
] as const;

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function RankList({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: Array<{ name: string; count: number }>;
  empty: string;
}) {
  return (
    <section className="admin-panel">
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p className="admin-empty">{empty}</p>
      ) : (
        <ul className="admin-rank">
          {rows.map((row) => (
            <li key={row.name}>
              <span title={row.name}>{row.name}</span>
              <strong>{formatNumber(row.count)}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function MiniBars({
  data,
}: {
  data: Array<{ date: string; visitors: number; pageViews: number }>;
}) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.visitors, d.pageViews)));

  return (
    <section className="admin-panel admin-panel-wide">
      <h2>Traffic by day</h2>
      {data.every((d) => d.visitors === 0 && d.pageViews === 0) ? (
        <p className="admin-empty">No traffic in this range yet.</p>
      ) : (
        <div className="admin-bars" role="img" aria-label="Visitors and page views by day">
          {data.map((day) => (
            <div key={day.date} className="admin-bar-col" title={`${day.date}: ${day.visitors} visitors, ${day.pageViews} views`}>
              <div className="admin-bar-stack">
                <div
                  className="admin-bar admin-bar-views"
                  style={{ height: `${(day.pageViews / max) * 100}%` }}
                />
                <div
                  className="admin-bar admin-bar-visitors"
                  style={{ height: `${(day.visitors / max) * 100}%` }}
                />
              </div>
              <span>{day.date.slice(5)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="admin-legend">
        <span>
          <i className="admin-swatch admin-swatch-visitors" /> Visitors
        </span>
        <span>
          <i className="admin-swatch admin-swatch-views" /> Page views
        </span>
      </div>
    </section>
  );
}

export function AdminPortal() {
  const [authed, setAuthed] = useState(() => Boolean(getAdminToken()));
  const [email, setEmail] = useState("ekram@edutechs.app");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("7d");
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadOverview = useCallback(async (selectedRange: string) => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await fetchAnalyticsOverview(selectedRange);
      setOverview(data);
      setAuthed(true);
    } catch (error) {
      clearAdminToken();
      setAuthed(false);
      setOverview(null);
      setLoadError(
        error instanceof Error ? error.message : "Could not load analytics.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    void loadOverview(range);
  }, [authed, range, loadOverview]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      await adminLogin(email.trim(), password);
      setPassword("");
      setAuthed(true);
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Invalid email or password.",
      );
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setAuthed(false);
    setOverview(null);
  };

  if (!authed) {
    return (
      <div className="admin-shell admin-login-shell">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <img src={bonotechLogo} alt="Bonotech" className="admin-logo" />
          <h1>Admin portal</h1>
          <p>Sign in to review visitor analytics and KPI progress.</p>
          <label>
            Email
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {loginError ? <p className="admin-error">{loginError}</p> : null}
          <button type="submit" disabled={loggingIn}>
            {loggingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  const kpis = overview?.kpis;

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div className="admin-brand">
          <img src={bonotechLogo} alt="" className="admin-logo-sm" />
          <div>
            <p className="admin-kicker">Bonotech</p>
            <h1>Analytics</h1>
          </div>
        </div>
        <div className="admin-top-actions">
          <div className="admin-range" role="tablist" aria-label="Date range">
            {RANGES.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={range === item.key}
                className={range === item.key ? "is-active" : undefined}
                onClick={() => setRange(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button type="button" className="admin-ghost" onClick={() => void loadOverview(range)}>
            Refresh
          </button>
          <button type="button" className="admin-ghost" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      {loadError ? <p className="admin-error admin-banner">{loadError}</p> : null}
      {loading && !overview ? <p className="admin-muted">Loading analytics…</p> : null}

      {kpis ? (
        <>
          <section className="admin-kpi-grid" aria-label="Key metrics">
            <article>
              <span>Visitors</span>
              <strong>{formatNumber(kpis.visitors)}</strong>
            </article>
            <article>
              <span>Page views</span>
              <strong>{formatNumber(kpis.pageViews)}</strong>
            </article>
            <article>
              <span>Bounce rate</span>
              <strong>{kpis.bounceRate}%</strong>
            </article>
            <article>
              <span>CTA clicks</span>
              <strong>{formatNumber(kpis.ctaClicks)}</strong>
            </article>
            <article>
              <span>Discovery calls</span>
              <strong>{formatNumber(kpis.discoverySubmits)}</strong>
            </article>
            <article>
              <span>Newsletter</span>
              <strong>{formatNumber(kpis.newsletterSubscribes)}</strong>
            </article>
          </section>

          <div className="admin-grid">
            <MiniBars data={overview.byDay} />
            <RankList
              title="Top pages"
              rows={overview.topPages}
              empty="No page views yet."
            />
            <RankList
              title="Top sections"
              rows={overview.topSections}
              empty="No section views yet."
            />
            <RankList
              title="Top CTAs"
              rows={overview.topCtas}
              empty="No CTA clicks yet."
            />
            <RankList
              title="Devices"
              rows={overview.devices}
              empty="No device data yet."
            />
            <RankList
              title="Referrers"
              rows={overview.referrers}
              empty="No referrers captured yet."
            />
          </div>

          <section className="admin-panel admin-panel-wide">
            <h2>Recent activity</h2>
            {overview.recentEvents.length === 0 ? (
              <p className="admin-empty">Waiting for the first visitor events.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>When</th>
                      <th>Event</th>
                      <th>Detail</th>
                      <th>Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.recentEvents.map((event, index) => (
                      <tr key={`${event.ts}-${event.type}-${index}`}>
                        <td>{formatWhen(event.ts)}</td>
                        <td>{event.type}</td>
                        <td>
                          {event.label ||
                            event.section ||
                            event.path ||
                            "—"}
                        </td>
                        <td>{event.viewport || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {overview.generatedAt ? (
              <p className="admin-muted">
                Updated {formatWhen(overview.generatedAt)}
              </p>
            ) : null}
          </section>
        </>
      ) : null}
    </div>
  );
}
