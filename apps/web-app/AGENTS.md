# Web App Notes

- Authenticated player state in `DarkThroneClient` is a snapshot loaded from `/auth/current-user`; turn-based resources like `gold` and `attackTurns` will look stale unless the app re-fetches after the half-hour turn boundary or when the window regains focus.
- Shared turn countdown and turn-refresh math lives in `apps/web-app/src/libs/turnTiming.ts`. Reuse it instead of duplicating half-hour calculations in components.
- `App` owns global player refresh behavior. Prefer emitting `playerUpdate` after player-mutating actions and let the app shell re-fetch the canonical player snapshot.
- Fetch-driven battle pages should model explicit `loading`, `error`, and `notFound` UI states instead of returning `null` or logging request failures to the console. Reuse `apps/web-app/src/components/async-page-state.tsx` and `apps/web-app/src/libs/apiErrors.ts` when you need distinct 404 handling with retry actions.
