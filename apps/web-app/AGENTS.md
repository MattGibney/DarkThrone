# Web App Notes

- Authenticated player state in `DarkThroneClient` is a snapshot loaded from `/auth/current-user`; turn-based resources like `gold` and `attackTurns` will look stale unless the app re-fetches after the half-hour turn boundary or when the window regains focus.
- Shared turn countdown and turn-refresh math lives in `apps/web-app/src/libs/turnTiming.ts`. Reuse it instead of duplicating half-hour calculations in components.
- `App` owns global player refresh behavior. Prefer emitting `playerUpdate` after player-mutating actions and let the app shell re-fetch the canonical player snapshot.
- Attacks mutate the authenticated player even on defeat, so `apps/web-app/src/pages/main/battle/attack/attackPlayer.tsx` should emit `playerUpdate` after any successful `/attack` response, not only victories.
