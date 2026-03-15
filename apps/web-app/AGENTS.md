# Web App Notes

- Authenticated player state in `DarkThroneClient` is a snapshot loaded from `/auth/current-user`; turn-based resources like `gold` and `attackTurns` will look stale unless the app re-fetches after the half-hour turn boundary or when the window regains focus.
- Shared turn countdown and turn-refresh math lives in `apps/web-app/src/libs/turnTiming.ts`. Reuse it instead of duplicating half-hour calculations in components.
- `App` owns global player refresh behavior. Prefer emitting `playerUpdate` after player-mutating actions and let the app shell re-fetch the canonical player snapshot.
- Client auth events are typed contracts now: `userLogin` emits a `UserSessionObject`, while `playerChange` emits the current `{ user, player? }` snapshot. Consume those shapes directly instead of casting event payloads from `unknown`.
