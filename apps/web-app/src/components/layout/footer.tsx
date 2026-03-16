import environment from '../../environments/environment';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mt-8 md:mt-0 flex flex-col items-center gap-2 text-xs text-foreground/30">
        <p>&copy; 2025 DarkThrone Reborn</p>
        {environment.releaseTag ? (
          <p>Release {environment.releaseTag}</p>
        ) : null}
      </div>
    </footer>
  );
}
