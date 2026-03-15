# Libraries Notes

- Shared interface error-code unions should only include codes the API actually emits. Keep client-only validation states local to the consuming UI.
- `DarkThroneClient` auth events are part of the contract surface. `userLogin` emits a `UserSessionObject`, while `playerChange` and `updateCurrentUser` emit the current user/player snapshot shape from the shared interfaces.
- Player-name validation should stay aligned end to end: if the UI needs an error code like `player.name.validation.empty`, the API model and shared interfaces must emit it too.
