# API Notes

- `PlayerModel.attackPlayer` must always deduct the requested `attackTurns` for any completed attack. Victory only changes gold transfer and attacker XP.
- Persist attacker and defender state before returning the attack result so the web app's follow-up `/auth/current-user` refresh sees the updated snapshot immediately.
