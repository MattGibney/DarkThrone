import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

type WorktreeUrls = {
  web?: string;
  api?: string;
  website?: string;
};

type WorktreePorts = {
  api?: number;
  web?: number;
  website?: number;
  postgres?: number;
};

type WorktreeDatabase = {
  postgres?: string;
};

type WorktreeEntry = {
  id: string;
  branch?: string;
  status?: 'up' | 'down' | 'partial';
  updatedAt?: string;
  urls?: WorktreeUrls;
  database?: WorktreeDatabase;
  ports?: WorktreePorts;
  services?: Record<string, string>;
};

type WorktreePayload = WorktreeEntry[] | { worktrees: WorktreeEntry[] };

const apiUrl = '/worktrees';

const statusStyles: Record<string, string> = {
  up: 'border-emerald-500/35 bg-emerald-500/12 text-emerald-200',
  down: 'border-slate-500/30 bg-slate-500/12 text-slate-200',
  partial: 'border-amber-500/35 bg-amber-500/14 text-amber-100',
  unknown: 'border-slate-500/30 bg-slate-500/12 text-slate-200',
};

const linkLabels: Array<[keyof WorktreeUrls, string]> = [
  ['web', 'Game'],
  ['api', 'API'],
  ['website', 'Website'],
];

const portLabels: Array<[keyof WorktreePorts, string]> = [
  ['api', 'API'],
  ['web', 'Game'],
  ['website', 'Website'],
  ['postgres', 'Postgres'],
];

export default function App() {
  const [worktrees, setWorktrees] = useState<WorktreeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = (await response.json()) as WorktreePayload;
        const data = Array.isArray(payload) ? payload : payload.worktrees;
        if (!cancelled) {
          setWorktrees(data ?? []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Unable to load worktree data',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    const interval = window.setInterval(load, 10_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const summary = useMemo(() => {
    const total = worktrees.length;
    const running = worktrees.filter((item) => item.status === 'up').length;
    const partial = worktrees.filter(
      (item) => item.status === 'partial',
    ).length;

    return { total, running, partial };
  }, [worktrees]);

  const handleCopy = async (value?: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Ignore clipboard failures in restricted environments.
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.14),_transparent_30%),linear-gradient(180deg,_#0d1117,_#141923_45%,_#090c12)] text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="rounded-[2rem] border border-amber-200/15 bg-black/30 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-200/65">
            DarkThrone Ops
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl text-amber-50">
                Worktree Manager
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Live view of local DarkThrone environments, including routed
                URLs, allocated ports, and whether each worktree is fully up.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <SummaryTile label="Worktrees" value={summary.total} />
              <SummaryTile label="Running" value={summary.running} />
              <SummaryTile label="Partial" value={summary.partial} />
            </div>
          </div>
        </header>

        <section className="mt-8">
          {loading && (
            <Panel>
              <p>Loading worktrees...</p>
            </Panel>
          )}

          {!loading && error && (
            <Panel tone="danger">
              <p>
                Could not load worktree data ({error}). Ensure the manager API
                is running.
              </p>
            </Panel>
          )}

          {!loading && !error && worktrees.length === 0 && (
            <Panel>
              <p>
                No environments detected. Bootstrap one with{' '}
                <span className="mono">./tools/dev up [work-id]</span>.
              </p>
            </Panel>
          )}

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {worktrees.map((worktree) => {
              const status = worktree.status ?? 'unknown';

              return (
                <article
                  key={worktree.id}
                  className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.18)] backdrop-blur"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-amber-50">
                        {worktree.id}
                      </h2>
                      {worktree.branch && (
                        <p className="mono mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                          {worktree.branch}
                        </p>
                      )}
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                        statusStyles[status] ?? statusStyles.unknown
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  {worktree.updatedAt && (
                    <p className="mt-3 text-xs text-slate-400">
                      Updated {new Date(worktree.updatedAt).toLocaleString()}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {linkLabels.map(([key, label]) => {
                      const url = worktree.urls?.[key];
                      if (!url) return null;

                      return (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-amber-200/20 bg-amber-100/8 px-3 py-1 text-xs font-medium text-amber-50 transition hover:border-amber-200/35 hover:bg-amber-100/12"
                        >
                          {label}
                        </a>
                      );
                    })}
                  </div>

                  {worktree.database?.postgres && (
                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                        Postgres
                      </p>
                      <p className="mono mt-3 break-all text-xs text-slate-200">
                        {worktree.database.postgres}
                      </p>
                      <button
                        type="button"
                        className="mt-3 rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/30"
                        onClick={() => handleCopy(worktree.database?.postgres)}
                      >
                        Copy URL
                      </button>
                    </div>
                  )}

                  <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                        Ports
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {portLabels.map(([key, label]) => {
                          const value = worktree.ports?.[key];
                          if (!value) return null;

                          return (
                            <span
                              key={key}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                            >
                              {label}: {value}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                        Services
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(worktree.services ?? {}).map(
                          ([key, value]) => (
                            <span
                              key={key}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs capitalize text-slate-200"
                            >
                              {key}: {value}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryTile(props: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
        {props.label}
      </p>
      <p className="mt-2 font-display text-3xl text-amber-50">{props.value}</p>
    </div>
  );
}

function Panel(props: { children: ReactNode; tone?: 'default' | 'danger' }) {
  const toneClass =
    props.tone === 'danger'
      ? 'border-rose-400/30 bg-rose-500/10 text-rose-100'
      : 'border-white/10 bg-white/6 text-slate-200';

  return (
    <div
      className={`rounded-[1.5rem] border p-6 shadow-[0_16px_30px_rgba(0,0,0,0.18)] ${toneClass}`}
    >
      {props.children}
    </div>
  );
}
