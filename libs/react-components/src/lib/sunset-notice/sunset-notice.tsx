const GITHUB_URL = 'https://github.com/MattGibney/DarkThrone';
const DARKTHRONE_GAME_URL = 'https://darkthronegame.com/';

export interface SunsetNoticeProps {
  className?: string;
}

export function SunsetNotice({ className = '' }: SunsetNoticeProps) {
  return (
    <aside
      className={`border border-amber-500/40 bg-amber-500/10 px-4 py-4 text-foreground shadow-sm sm:px-6 ${className}`}
      aria-labelledby="sunset-notice-title"
    >
      <div className="mx-auto max-w-5xl space-y-2">
        <h2 id="sunset-notice-title" className="font-display text-xl">
          DarkThrone Reborn will close on 1 October 2026
        </h2>
        <p className="text-sm text-foreground/80">
          New registrations are closed. Existing players can continue playing
          until the shutdown date.
        </p>
        <p className="text-sm text-foreground/80">
          DarkThrone Reborn has always been open source. You can{' '}
          <a
            className="font-semibold text-amber-600 underline underline-offset-4 hover:text-amber-500"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            explore or continue the project on GitHub
          </a>
          . To keep playing with an active community, visit{' '}
          <a
            className="font-semibold text-amber-600 underline underline-offset-4 hover:text-amber-500"
            href={DARKTHRONE_GAME_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            DarkThrone Game
          </a>
          .
        </p>
      </div>
    </aside>
  );
}
