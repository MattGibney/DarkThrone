import { NewsPost } from '@darkthrone/interfaces';

export const newsPosts: NewsPost[] = [
  {
    title: 'A Change in Direction for DarkThrone Reborn',
    content: `DarkThrone Reborn started life as an attempt to recreate something
that no longer exists.

For a long time, the goal was accuracy. To rebuild the game as it was remembered,
to preserve the mechanics and the feel as faithfully as possible. That made
sense at the beginning, but over time it's become clear that this approach has
limits that are hard to work around.

There is no definitive reference for the original game. What remains is memory,
nostalgia, and interpretation, all of which vary wildly from person to person.
Trying to recreate a system under those conditions leads to hesitation. Every
change feels risky, every decision feels like it might be “wrong”, even when
there is no single correct answer.

Because of that, I'm changing how I think about DarkThrone Reborn. Going forward,
this is no longer a strict recreation. It's a spiritual successor.

That doesn't mean abandoning what made the game what it was. DarkThrone Reborn
will remain text-based. It will remain a persistent world with long-term
progression, meaningful decisions, and consequences that carry weight. The pacing
will stay deliberate. The core feel is not being thrown away.

What is changing is the willingness to evolve.

This project is built and maintained by one person, in their own time. That
reality matters. If DarkThrone Reborn is going to continue to exist, it needs
to be sustainable to build, enjoyable to work on, and flexible enough to grow
without constantly second-guessing every decision through the lens of nostalgia.

Another part of this shift is a broader view of what progression in the game can
look like. Historically, DarkThrone has been almost entirely PvP-driven. PvP
will remain a core part of the game, but it won't be the only path forward. Not
every meaningful system needs to be adversarial, and not every reason to log in
needs to involve attacking another player.

The aim is to add depth and longevity without increasing pressure.

You'll see new systems introduced more deliberately, explained before they
arrive, and adjusted over time rather than dropped in all at once. Some ideas
will be experimental. Some won't work as intended. That's part of building
something that's alive rather than frozen in time.

Communication around the game will also change. There will be clearer direction,
a visible roadmap, and more written updates explaining not just what is changing,
but why. Feedback will always be welcome, but decisions won't be made by
consensus. The goal is coherence and longevity, not noise.

This direction won't be for everyone. DarkThrone remains a niche game by design.
It's slow, text-based, and unapologetically long-term. If you're looking for a
perfect snapshot of the past, this may no longer be the right fit, and that's
okay.

This change is about making DarkThrone Reborn something that can continue to
exist and evolve without being constrained by fear of getting it wrong.
Everything that comes next builds on that foundation.

More soon, promise.

-Moppler
`,
    date: new Date('2025-12-31'),
  },
  {
    title: 'Some Quality of life updates',
    content: `Hello everyone!
It's been a little while since the last update. This update is only a small one with some quality of life updates.

### Deposit Max Button
The banking page has been updated. We've split Depositing and Withdrawing into two separate tabs. This should make it easier to see what you can do with your gold. We've also added a "Deposit Max" button. This will deposit the maximum amount of gold you can at once. This should make it easier to deposit your gold quickly.

### Players with 0 attack strength can no longer attack
It is no longer possible to attack another player if you have 0 attack strength.

### Attack List Mobile View
There was a graphic bug causing the table for attack list to be too wide on mobile. This has been fixed, it should now render corrently always.

### Discord Invite Link
The Discord invite link wasn't working. This has been fixed. You can now join the Discord server from the game.
`,
    date: new Date('2024-06-7'),
  },
  {
    title: 'Introducing Banking',
    content: `It's finally here!
Banking has been added to the game. You can now deposit your gold into the bank to keep it safe from thieves.

## Depositing

We're following the lead of the original game here. It's only possible to deposit a maximum of 80% of your gold at a time. This keeps gold in circulation and the economy healthy. There is also a cap on the number of deposits you can make in a 24 hour period. You get 3 deposits every 24 hours. A deposit slot is reset 24 hours after it's made. This means that if you make a deposit at 12:00, it'll be reset at 12:00 the next day.

Keep this in mind when attacking other players, you don't want to be cought with your gold at risk! In a future update, we'll include the ability to increase the number of deposit slots available to you. This will be done in the form of structure upgrades.

## Withdrawing

Unlike the original game. It's possible to withdraw your gold. You can withdraw as much as you like, whenever you like. There is no limit to the number of withdrawals you can make.

It's currently not possible to spend gold that it deposited in the bank. If you want to use it (for example to train additional units) you'll need to withdraw it first. You'd better be quick though. You wouldn't want it to be stolen by another player!

---

I hope you enjoy this new feature. I'm looking forward to seeing how it changes the game. Development isn't too quick at the moment as I'm working on this in my spare time. I'm looking forward to working with the community to make this game the best it can be. Thank you all for your support!

-Moppler
`,
    date: new Date('2024-04-11'),
  },
  {
    title: 'fpopa - joining the development team',
    content: `Hey, everyone!

I am very happy to join Moppler in building this game. I won't promise to deliver stuff on a regular basis, but I do enjoy contributing to a game my brother and I used to play years ago.

I've been fixing and improving small stuff here and there in the past weeks. I think Moppler did a nice job with the current state of the game, so contributing shouldn't be too complicated for any other future joiners.

-fpopa
`,
    date: new Date('2024-03-09'),
  },
  {
    title: 'Pre-Alpha Launch',
    content: `Hello, Welcome to DarkThrone Reborn!

I am very excited to launch this project into a pre-alpha stage. This is a very early stage of the project and there is still a lot of work to be done. I am looking forward to working with the community to make this game the best it can be.

This isn't the first time I set out to recreate DarkThrone. When the original game shut down it's servers I immediately started on a project called Dark Curse. The goal was to create an open source version of the game that the community could collaborate on together. I made several design decisions that I ultimately killed my enjoyment and stopped me from developing the project. Mostly this was around the tech stack I chose. I went for the absolute bare minimum with the goal of making it as accessible for new developers as possible to join in. This choice was ultimately a bad one however, development was slow and more painful than it needed to be.

I never really intended to pick this back up again. I had moved on to start a new company and that consumed all of my time. As that started to grow however, and as I began to bring on employees, I found myself finally having free time again. I tried picking up the Dark Curse project again however I very quickly hit the same hurdles that stopped me the first time. I decided to start over from scratch and this time I would make the game for myself. I would make the game that I wanted to play. I would make the game that I wanted to make.

I've been working on this in secret over the last few months. I didn't want to announce anything until there was something that prople could actually play. I can understand that it must be frustrating to know that something is potentially coming and then for it to never materialise. I wanted to make sure that I had something to show before I announced anything.

And with that, here we are. I hope you enjoy the game and I look forward to working with you all to make it the best it can be!

-Moppler
`,
    date: new Date('2024-02-22'),
  },
];
