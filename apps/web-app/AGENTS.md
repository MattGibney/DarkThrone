# Web App Notes

- Authenticated player state in `DarkThroneClient` is a snapshot loaded from `/auth/current-user`; turn-based resources like `gold` and `attackTurns` will look stale unless the app re-fetches after the half-hour turn boundary or when the window regains focus.
- Shared turn countdown and turn-refresh math lives in `apps/web-app/src/libs/turnTiming.ts`. Reuse it instead of duplicating half-hour calculations in components.
- `App` owns global player refresh behavior. Prefer emitting `playerUpdate` after player-mutating actions and let the app shell re-fetch the canonical player snapshot.
- `apps/web-app/src/pages/playerSelect/list.tsx` is expected to render explicit loading, error, and empty states. Keep the page shell visible on fetch failures, offer an in-page retry, and disable repeated assume-player clicks while an assume request is pending.
- Overview XP progress should be calculated within the current level band. Reuse `apps/web-app/src/libs/experienceProgress.ts` instead of dividing lifetime XP by the next threshold in UI components.
- API mutations in player-facing forms should catch structured `{ errors: [...] }` responses and render them inline. Reuse `apps/web-app/src/libs/apiErrors.ts` and `apps/web-app/src/components/inlineErrorAlert.tsx` instead of re-implementing ad hoc parsing/UI per screen.
- Attacks mutate the authenticated player even on defeat, so `apps/web-app/src/pages/main/battle/attack/attackPlayer.tsx` should emit `playerUpdate` after any successful `/attack` response, not only victories.
- Create-player name validation must stay tied to the exact string that was validated. When the input changes, stale validation results must not keep the submit button enabled or suppress inline create errors for the current value.
