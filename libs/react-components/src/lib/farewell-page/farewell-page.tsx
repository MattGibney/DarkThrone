const GITHUB_URL = 'https://github.com/MattGibney/DarkThrone';
const DARKTHRONE_GAME_URL = 'https://darkthronegame.com/';

const lifetimeStats = [
  { value: '1,640', label: 'accounts' },
  { value: '2,073', label: 'characters' },
  { value: '15,656', label: 'login sessions' },
  { value: '78,615', label: 'battles fought' },
  { value: '247.7B', label: 'gold stolen' },
  { value: '36', label: 'players active in the final 30 days' },
];

const overallRanking = [
  { rank: 1, player: 'nessuno', race: 'Undead', playerClass: 'Fighter' },
  { rank: 2, player: 'Whitecat', race: 'Undead', playerClass: 'Thief' },
  { rank: 3, player: '6sicSIX', race: 'Elf', playerClass: 'Cleric' },
  { rank: 4, player: 'Mowgli', race: 'Goblin', playerClass: 'Assassin' },
  {
    rank: 5,
    player: 'MARIAN_ELVES_D',
    race: 'Elf',
    playerClass: 'Cleric',
  },
  { rank: 6, player: 'kinkkin', race: 'Undead', playerClass: 'Fighter' },
  {
    rank: 7,
    player: 'Steinhardtt',
    race: 'Human',
    playerClass: 'Fighter',
  },
  { rank: 8, player: 'Absftl', race: 'Goblin', playerClass: 'Thief' },
  {
    rank: 9,
    player: 'Lich_King',
    race: 'Undead',
    playerClass: 'Fighter',
  },
  { rank: 10, player: 'kinkkinV2', race: 'Human', playerClass: 'Fighter' },
];

const categoryChampions = [
  { title: 'Experience', player: 'Whitecat', result: '1,022,136 XP' },
  { title: 'Wealth', player: 'Whitecat', result: '7,313,868,464 gold' },
  { title: 'Attack wins', player: 'Homer', result: '1,632 victories' },
  { title: 'Defense wins', player: 'Xtrifor', result: '184 victories' },
  { title: 'Gold stolen', player: 'Xullios', result: '8,742,766,701 gold' },
];

const rankStyles: Record<number, string> = {
  1: 'border-amber-300/50 bg-amber-400/10 text-amber-200',
  2: 'border-slate-300/40 bg-slate-300/10 text-slate-100',
  3: 'border-orange-400/40 bg-orange-500/10 text-orange-200',
};

export function FarewellPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#09080b] text-stone-100">
      <section className="relative isolate flex min-h-[44rem] items-center px-5 py-24 sm:px-8 lg:px-12">
        <div
          className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_15%,rgba(180,83,9,0.3),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(127,29,29,0.2),transparent_30%),linear-gradient(160deg,#171117_0%,#09080b_62%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
          aria-hidden="true"
        />

        <div className="mx-auto w-full max-w-5xl text-center">
          <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            The gates closed on 1 October 2026
          </p>

          <p className="font-display text-sm uppercase tracking-[0.38em] text-stone-400">
            DarkThrone Reborn
          </p>
          <h1 className="mx-auto mt-5 max-w-4xl font-display text-5xl leading-[1.05] sm:text-7xl lg:text-8xl">
            Thank you for playing
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-stone-300 sm:text-xl">
            The battles are over and the servers are quiet. Thank you to every
            player who built a character, fought a war, shared feedback, or
            simply stopped by to see what we were making.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-amber-500 px-6 py-3 font-semibold text-stone-950 transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300 sm:w-auto"
              href={DARKTHRONE_GAME_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Continue at DarkThrone Game
              <span className="ml-2" aria-hidden="true">
                ↗
              </span>
            </a>
            <a
              className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-stone-500/60 bg-stone-900/40 px-6 py-3 font-semibold text-stone-100 transition hover:border-stone-300 hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-300 sm:w-auto"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore the source on GitHub
              <span className="ml-2" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
              Our story in numbers
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              A small world with a lasting history
            </h2>
            <p className="mt-4 leading-7 text-stone-400">
              These figures are from the final production snapshot taken on
              shutdown day.
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 lg:grid-cols-3">
            {lifetimeStats.map((stat) => (
              <div className="bg-[#100e12] px-5 py-7 sm:px-8" key={stat.label}>
                <dt className="text-sm leading-5 text-stone-400">
                  {stat.label}
                </dt>
                <dd className="mt-2 font-display text-3xl text-stone-100 sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
                Final standings
              </p>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl">
                The last official top ten
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-stone-400 md:text-right">
              Preserved from the game&apos;s official overall ranking at the
              shutdown-day snapshot.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.025]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left">
                <caption className="sr-only">
                  DarkThrone Reborn official final top ten players
                </caption>
                <thead className="border-b border-white/10 bg-white/[0.035] text-xs uppercase tracking-[0.18em] text-stone-500">
                  <tr>
                    <th className="px-5 py-4 font-medium sm:px-7">Rank</th>
                    <th className="px-5 py-4 font-medium sm:px-7">Player</th>
                    <th className="px-5 py-4 font-medium sm:px-7">Race</th>
                    <th className="px-5 py-4 font-medium sm:px-7">Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {overallRanking.map((player) => (
                    <tr
                      className="transition hover:bg-white/[0.035]"
                      key={player.rank}
                    >
                      <td className="px-5 py-4 sm:px-7">
                        <span
                          className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-sm font-bold ${rankStyles[player.rank] ?? 'border-white/10 bg-white/5 text-stone-400'}`}
                        >
                          {player.rank}
                        </span>
                      </td>
                      <th className="px-5 py-4 font-display text-lg font-normal text-stone-100 sm:px-7">
                        {player.player}
                      </th>
                      <td className="px-5 py-4 text-stone-400 sm:px-7">
                        {player.race}
                      </td>
                      <td className="px-5 py-4 text-stone-400 sm:px-7">
                        {player.playerClass}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
              Hall of fame
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              Category champions
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categoryChampions.map((champion) => (
              <article
                className="rounded-xl border border-white/10 bg-[#100e12] p-5"
                key={champion.title}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  {champion.title}
                </p>
                <h3 className="mt-5 break-words font-display text-xl text-amber-200">
                  {champion.player}
                </h3>
                <p className="mt-2 text-sm leading-5 text-stone-400">
                  {champion.result}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-amber-400/20 bg-[linear-gradient(135deg,rgba(146,64,14,0.2),rgba(24,24,27,0.9))] lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-8 sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
              The code lives on
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              Open source from the beginning
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-stone-300">
              DarkThrone Reborn has always been open source. Its code and
              development history remain available for anyone who wants to learn
              from it, run it, or carry the project forward.
            </p>
            <a
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md border border-amber-300/40 px-5 py-3 font-semibold text-amber-100 transition hover:border-amber-200 hover:bg-amber-300/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View DarkThrone Reborn on GitHub
              <span className="ml-2" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>

          <div className="flex flex-col justify-center border-t border-white/10 bg-black/20 p-8 sm:p-12 lg:border-l lg:border-t-0">
            <p className="font-display text-2xl text-stone-100">
              Want to keep playing?
            </p>
            <p className="mt-4 leading-7 text-stone-400">
              Continue your journey with the wider Dark Throne community at
              DarkThrone Game.
            </p>
            <a
              className="mt-7 font-semibold text-amber-300 underline decoration-amber-300/40 underline-offset-4 hover:text-amber-200"
              href={DARKTHRONE_GAME_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit darkthronegame.com
              <span className="ml-1" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 text-center text-sm leading-6 text-stone-500 sm:px-8">
        <p>DarkThrone Reborn · 2024–2026</p>
        <p className="mt-1">
          Inspired by the original Dark Throne from Lazarus Software.
        </p>
      </footer>
    </main>
  );
}

export default FarewellPage;
