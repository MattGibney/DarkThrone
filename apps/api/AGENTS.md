# API Notes

- `apps/api/src/app.ts` creates a fresh `ModelFactory` per request, so acceptance tests cannot inject model behavior through `makeApplication`.
- When an API acceptance test needs to verify model-layer calls from a controller, spy on the relevant model class static (for example `jest.spyOn(UserModel, 'fetchByEmail')`) and keep DAO stubs in `makeApplication` focused on lower-level data access.
- `PlayerModel.attackPlayer` must always deduct the requested `attackTurns` for any completed attack. Victory only changes gold transfer and attacker XP.
- Persist attacker and defender state before returning the attack result so the web app's follow-up `/auth/current-user` refresh sees the updated snapshot immediately.
