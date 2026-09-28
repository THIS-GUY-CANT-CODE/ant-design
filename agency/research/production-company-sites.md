# What the best production-company sites do (research notes, Sep 2026)

Used for the Biscuit Bunker flagship. Reuse for any film, video or creative-agency client.

**Method.** The build sandbox blocks direct page fetches, so this comes from search results and design write-ups, not first-hand teardown. Check the live sites before quoting any of it to a client.

## Companies looked at
London: [Somesuch](https://somesuch.co/film), [Riff Raff Films](https://www.riffrafffilms.tv/), [Stink Films](https://stinkfilms.com/about/), [Pulse Films](https://pulsefilms.com/), Academy Films, [Nexus Studios](https://en.wikipedia.org/wiki/Nexus_Studios), Rogue, Gorgeous.
Also [Caviar](https://caviar.tv/) (LA, London and others) and DVEIN (Barcelona), both often cited as design references.

## Patterns worth stealing
1. **The work is the hero.** A full-bleed reel, muted and autoplaying, with titles on top. Limit how much autoplays at once: Caviar caps it at two videos ([hostadvice](https://ca.hostadvice.com/blog/website-design/production-company-website/)).
2. **Restraint.** Black and white plus one accent colour for hovers, so the footage supplies all the colour.
3. **A context cursor.** The cursor turns into Play, Pause, Drag or View depending on what's underneath (DVEIN, [Awwwards](https://www.awwwards.com/sites/dvein)).
4. **Title-on-hover indexes.** A huge typographic list of projects or directors, where hovering a name shows a preview that follows the cursor.
5. **Atmosphere over spectacle.** Motion paced like a guided walk-through, not effects for their own sake ([2026 juror roundup](https://www.hontran.dev/blog/best-award-winning-websites-2026)).
6. **Common details.** A preloader counter, a fullscreen menu with oversized type, a velocity-reactive marquee, split-text reveals, a local clock in the footer, and film grain.

## How we used it without real footage
Generated "shots" (CSS/SVG scenes) that hard-cut in time stand in for the reel until the client's own clips drop in as `<video>`. Everything above is in `clients/biscuit-bunker/site/`. The reusable parts (cursor, split text, magnetic buttons, tilt, parallax) are in `kit/`.
