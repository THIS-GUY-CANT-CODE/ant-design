// Case studies for the six flagship concepts. 'was' lists only issues observed in public search results and listings.
import type { Slug } from '@/brands';

export type Case = {
  slug: Slug;
  headline: string;
  was: string[];
  now: { t: string; d: string }[];
  brand: { idea: string; body: string; points: string[] };
  marketing: { idea: string; plays: { when: string; t: string; d: string }[] };
  tier: string;
  tierWhy: string;
};

export const CASES: Case[] = [
  {
    "slug": "biscuit-bunker",
    "headline": "A production company that finally looks like it makes the good stuff.",
    "was": [
      "The best story they have, that the studio started in a converted dog biscuit factory, sits on the About page instead of being the brand.",
      "Services are spread across separate keyword pages like \"Podcast production London\", which read like SEO filler.",
      "Search listings show a text-first site. For a video company, the work itself should be the first thing you see."
    ],
    "now": [
      {
        "t": "A live 3D hero",
        "d": "A real-time tennis ball, with felt shading and the true seam curve, rolls towards your cursor, bounces when you click it and rolls away as you scroll. Good content. Fetched."
      },
      {
        "t": "Work index with live previews",
        "d": "Huge project titles. Hover one and a live shader preview follows your cursor. Filter by commercial, animation or podcast."
      },
      {
        "t": "Read-along statement",
        "d": "The studio's story lights up word by word as you scroll through it."
      },
      {
        "t": "Services that fill",
        "d": "Each discipline wipes to chartreuse on hover."
      },
      {
        "t": "A brief form that respects your time",
        "d": "Chips instead of dropdowns: what you're making and the budget, in two taps."
      }
    ],
    "brand": {
      "idea": "Good content. Fetched.",
      "body": "The name was already brilliant, so we made the joke the brand. The mark is a tennis ball, the thing you fetch, and its chartreuse is the only colour on a black and off-white system. That one colour means play, click or act now. Geist does the talking, and Instrument Serif italic adds the wink.",
      "points": [
        "A tennis-ball mark: fetch, in one shape",
        "Chartreuse only for the ball and actions, never for decoration",
        "Voice: confident, a bit cheeky, never corporate. \"Got a brief? Throw us a bone.\"",
        "End cards: the ball, then \"Good content. Fetched.\""
      ]
    },
    "marketing": {
      "idea": "Make the studio's own channels the showreel.",
      "plays": [
        {
          "when": "Week 1",
          "t": "One case study per project",
          "d": "Turn every Vimeo project into its own page: the brief, the idea and the result. That ranks for \"brand film for [sector]\" searches in a way thin keyword pages rarely do."
        },
        {
          "when": "Month 1",
          "t": "\"From the Bunker\" on LinkedIn",
          "d": "A 60-second behind-the-scenes edit every month, cut in the new brand style. Agency producers hire people they've watched work."
        },
        {
          "when": "Month 2",
          "t": "The biscuit tin mailer",
          "d": "A tin of dog biscuits sent to 30 target agency producers, with a QR code to the showreel on the lid. It's memorable, cheap and on brand."
        },
        {
          "when": "Ongoing",
          "t": "Podcast clip engine",
          "d": "Every podcast they produce gives three vertical clips for the client, which is also a free advert for Bunker's podcast service."
        },
        {
          "when": "Local",
          "t": "Google Business Profile",
          "d": "Claim \"video production Shoreditch\" with the showreel as the cover video and a project photo every week."
        }
      ]
    },
    "tier": "Rebrand",
    "tierWhy": "Creative agencies judge suppliers on taste. A full identity plus a multi-page site with case studies is the version that wins pitches."
  },
  {
    "slug": "green-papaya",
    "headline": "Two cities, one kitchen, and a brand as loud as the food.",
    "was": [
      "Their real edge, Northern Vietnamese and Xi'an cooking under one roof, isn't the headline in search listings.",
      "Listings disagree on the address: an old Kingsland Road listing is still out there, which confuses Google and customers.",
      "Dish names turn up in reviews, not on pages of their own, so \"banana leaf tilapia Hackney\" finds reviewers instead of the restaurant.",
      "More than twenty years in Hackney and a review from The Infatuation, and that trust isn't doing any work."
    ],
    "now": [
      {
        "t": "HANOI × XI'AN",
        "d": "Giant condensed city names part as you scroll, with papaya seeds drifting against your cursor."
      },
      {
        "t": "Two kitchens, one table",
        "d": "Mint for Hanoi, chilli for Xi'an. Hover one and it opens up."
      },
      {
        "t": "Pick for me",
        "d": "Can't decide? The menu rolls and lands on a dish for you."
      },
      {
        "t": "Open now, for real",
        "d": "Live open or closed status from their actual hours, in London time."
      },
      {
        "t": "Built for 6:30pm on a phone",
        "d": "A sticky Call and Menu bar, hours at a glance, directions in one tap."
      }
    ],
    "brand": {
      "idea": "Two roads. One table.",
      "body": "A papaya cut in half is the mark, with its seeds as the pattern for everything. The whole brand runs on papaya orange with ink, and each city gets its own colour, mint for Hanoi and chilli for Xi'an, so every dish carries its origin. Bricolage Grotesque, set condensed and heavy, gives it the energy of a busy kitchen.",
      "points": [
        "Papaya half as the mark, seeds as the pattern",
        "Two city colours on menus, bags and social",
        "Voice: warm, specific and proud. Name the dish, not the adjective",
        "Condensed type that fits Vietnamese and Chinese names at full size"
      ]
    },
    "marketing": {
      "idea": "Win the \"where do we eat tonight\" search on Mare Street.",
      "plays": [
        {
          "when": "Week 1",
          "t": "Fix Google first",
          "d": "One address everywhere, the Kingsland Road listing marked closed, hours checked, and the menu added as text with photos of each signature dish."
        },
        {
          "when": "Month 1",
          "t": "\"Which city are you?\"",
          "d": "An Instagram series that pairs one Hanoi dish with one Xi'an dish each week. Diners vote, and the winner becomes a weekend special."
        },
        {
          "when": "Month 1",
          "t": "Reviews at the till",
          "d": "A small QR card with the bill: \"Enjoyed the concubine noodles? Tell Hackney.\" Fresh reviews are what keep them in the local map pack."
        },
        {
          "when": "Seasonal",
          "t": "Tết and Lunar New Year",
          "d": "The one festival both cuisines share. A set menu and a short film of the kitchen cooking it."
        },
        {
          "when": "Local",
          "t": "Hackney food writers' night",
          "d": "Invite five local food Instagrammers to taste across both menus, with the spin-the-table site as the follow-up link."
        }
      ]
    },
    "tier": "Refresh + Care",
    "tierWhy": "The identity work is light. What matters is accurate hours, menus and Google listings every month, which is exactly what the Care plan covers."
  },
  {
    "slug": "rose-locksmith",
    "headline": "88 years, 684 five-star reviews, and a brand that finally shouts about it.",
    "was": [
      "Search results show page titles like \"About -\" and \"Contacts -\", meaning the site title was never set up.",
      "Their two strongest trust signals, since 1938 and 4.9★ from 684 Google reviews, appear in neither the titles nor the search snippets.",
      "The family story (same family since the shop sold car and cycle parts in 1938) isn't part of how they show up online."
    ],
    "now": [
      {
        "t": "A key blade that draws itself",
        "d": "The hero traces a key cut to the code for ROSE1938, like a cutting machine would."
      },
      {
        "t": "Your name, cut as a key",
        "d": "Type any name and the blade reshapes, with the cut code printed underneath."
      },
      {
        "t": "Why the right key turns",
        "d": "A precise cross-section of a pin-tumbler lock. Try the right key, then a bad copy."
      },
      {
        "t": "A paint room",
        "d": "Tap a colour and the whole section repaints itself."
      },
      {
        "t": "Two front doors",
        "d": "A rose emergency strip for lockouts, and a calm route for keys, remotes and paint."
      }
    ],
    "brand": {
      "idea": "Same family. Same street. Since 1938.",
      "body": "Hot rose is the name and the emergency line, so it always means \"now\". Ink, paper and steel do the rest. The mark is a keyhole punched out of a rose disc, and the key-cut profile becomes a graphic device for signage, vans and social. Host Grotesk is modern and hard-wearing, and Geist Mono carries the technical detail.",
      "points": [
        "A keyhole mark and a key-cut line as the pattern",
        "Rose means emergency, only ever",
        "Voice: straight-talking and helpful. \"If it opens, locks or needs fixing, start here.\"",
        "A window vinyl: Since 1938 · 4.9★ from 684 reviews"
      ]
    },
    "marketing": {
      "idea": "Own every \"locksmith near me\" search in E2, E1 and Hackney.",
      "plays": [
        {
          "when": "Week 1",
          "t": "Titles and snippets that sell",
          "d": "\"Rose Locksmith, Bethnal Green: Key Cutting since 1938 · 4.9★\". It's a one-hour fix that changes every search result they show up in."
        },
        {
          "when": "Month 1",
          "t": "Awkward key of the week",
          "d": "A 15-second Reel of the strangest key or remote they copied that week. It proves the \"we cut the ones others can't\" claim without saying it."
        },
        {
          "when": "Month 1",
          "t": "Emergency pages by area",
          "d": "Short, honest pages for Bethnal Green, Tower Hamlets and Hackney call-outs, each with the emergency number as the first thing you see."
        },
        {
          "when": "Seasonal",
          "t": "Spring paint season",
          "d": "The Dulux colour of the year in the window and on the wall-mixer page, with a \"bring a photo, we'll match it\" offer."
        },
        {
          "when": "2028",
          "t": "90 years on Bethnal Green Road",
          "d": "The anniversary is a local-press story with archive photos from the family, and the concept site's timeline is ready for it."
        }
      ]
    },
    "tier": "Refresh + Care",
    "tierWhy": "The brand already exists in the shop. They need a site that works hard in search, plus monthly updates to the reviews count and seasonal pages."
  },
  {
    "slug": "walthamstow-osteopaths",
    "headline": "A calm, modern practice, with a building that tells its story.",
    "was": [
      "Stale copy: the site says \"over 19 years\" for a practice that opened in 2000, so the text hasn't been touched since about 2019.",
      "A Gmail address as the main contact, which costs trust for a healthcare practice.",
      "The best story (a brewery, then a music shop, then a hairdresser, restored with its original quarry tiles) is split across three separate pages."
    ],
    "now": [
      {
        "t": "An arch window",
        "d": "The No.72 shopfront arch frames a slow, living gradient, with a spine that straightens as you scroll."
      },
      {
        "t": "Treatments, gently",
        "d": "An accordion that puts osteopathy first and everything else in support."
      },
      {
        "t": "Your first visit, in four steps",
        "d": "Listen, examine, explain, treat, answering the question that stops people booking."
      },
      {
        "t": "No.72's past lives",
        "d": "A brewery. A music shop. A hairdresser. Then us. Each line lights up as you read."
      },
      {
        "t": "A booking panel that breathes",
        "d": "A slow, breathing circle behind the call to book."
      }
    ],
    "brand": {
      "idea": "Hands-on care at No.72.",
      "body": "The building is the brand. The mark is the restored shopfront arch with four spine points inside it. Bone, forest, sage and clay feel like a calm treatment room, not a hospital. Instrument Serif brings warmth and Instrument Sans keeps the practical details clear. It's designed to lower the heart rate.",
      "points": [
        "An arch-and-spine mark taken from the shopfront",
        "Soft, natural colour; no clinical blue",
        "Voice: reassuring and plain English. Describe the treatment, never promise an outcome (CAP code)",
        "A domain email to replace Gmail, included in the Refresh"
      ]
    },
    "marketing": {
      "idea": "Be the obvious, trustworthy choice for Walthamstow Village. Compliant by design.",
      "plays": [
        {
          "when": "Week 1",
          "t": "Trust fixes",
          "d": "A domain email, updated years, and a Google Business Profile with each treatment and photos of the tiled entrance."
        },
        {
          "when": "Month 1",
          "t": "\"First visit\" explainer",
          "d": "A 60-second film of the four steps, walking through the restored shopfront. It answers the question that stops new patients booking."
        },
        {
          "when": "Month 2",
          "t": "The story of No.72",
          "d": "A short history piece with archive photos, offered to Waltham Forest Echo and village community groups. It's local heritage, not advertising."
        },
        {
          "when": "Ongoing",
          "t": "Gentle review requests",
          "d": "A follow-up email after a patient's third appointment asking for a Google review, with no incentives, in line with guidance."
        },
        {
          "when": "2028",
          "t": "25 years at No.72",
          "d": "August 2028 marks a quarter-century in the building. An open-evening tour of the restored shop is the story."
        }
      ]
    },
    "tier": "Rebrand",
    "tierWhy": "A health practice lives on trust. A consistent identity from the sign to the appointment card, plus a proper multi-page site, is worth it."
  },
  {
    "slug": "wj-meade",
    "headline": "Seventy years of East London, sold with total confidence.",
    "was": [
      "The latest award on the site is from 2018. Stale trust signals suggest nobody is looking after it.",
      "Standard portal-template pages (\"Register With Us\", \"Valuation\", \"Contact Us\") that look like every other agent in E3.",
      "\"Since 1953\", the one thing no chain can copy, isn't how they show up in search."
    ],
    "now": [
      {
        "t": "A skyline that draws itself",
        "d": "A single cobalt line traces an East London roofline, then the windows light up."
      },
      {
        "t": "Valuation above the fold",
        "d": "Sell or let, a bedroom stepper, postcode and contact, in one clean card."
      },
      {
        "t": "Count-up proof",
        "d": "1953, 70+ years, 5 offices, and only 3 owners in its whole history."
      },
      {
        "t": "Offices on a real map",
        "d": "All five branches and the original 1953 office, placed from their actual coordinates."
      },
      {
        "t": "Hover-invert services",
        "d": "Sell, let, buy and rent cards that flip to cobalt."
      }
    ],
    "brand": {
      "idea": "The independent. Since 1953.",
      "body": "Chains own navy and purple. W J Meade gets electric cobalt on clean white, so every sold board on the street is unmistakably theirs. The mark is a single-line roofline that forms an M. Schibsted Grotesk, a newspaper-bred grotesque, gives it confident, neighbourly authority.",
      "points": [
        "A roofline M that works on a sold board, a lanyard or an app icon",
        "Cobalt boards: the most visible brand on any street in E3",
        "Voice: knowledgeable and neighbourly. \"Someone who actually knows your street\"",
        "A 75th-anniversary system ready for 2028"
      ]
    },
    "marketing": {
      "idea": "One extra valuation a month pays for all of this many times over.",
      "plays": [
        {
          "when": "Week 1",
          "t": "A valuation page per office",
          "d": "Bow, Stratford, Wood Green, Highams Park and Enfield each get their own \"What's my home worth in [area]?\" page. That's five local search entry points instead of one."
        },
        {
          "when": "Month 1",
          "t": "New boards and windows",
          "d": "The new identity on every For Sale and To Let board. Boards are an estate agent's biggest free media."
        },
        {
          "when": "Month 2",
          "t": "\"70 years of your street\"",
          "d": "An Instagram and email series pairing archive photos with the same street today. Landlords and long-time owners share it, and they're the future instructions."
        },
        {
          "when": "Quarterly",
          "t": "Area market notes",
          "d": "A short, honest market update per branch area, sent to past clients. It keeps W J Meade top of mind for when they decide to sell."
        },
        {
          "when": "2028",
          "t": "75 years",
          "d": "A diamond-anniversary campaign across all five offices, with a free valuation event in each."
        }
      ]
    },
    "tier": "Rebrand + Care across 5 branches",
    "tierWhy": "It's the highest-value prospect in the portfolio. Commission on a single sale covers the full rebrand, and five branches means five times the local search footprint."
  },
  {
    "slug": "clapton-beauty-parlour",
    "headline": "The best story in Hackney hairdressing, cut sharp.",
    "was": [
      "The homepage title is keyword-stuffed with the phone number: \"Beauty Salon/ unisex Hairdressers Clapton Beauty Parlour 0208 985 4329 | LONDON\".",
      "A salon open since 1930, where a teenage Vidal Sassoon once worked, and none of that shows in how it appears on Google.",
      "Coverage in Spitalfields Life and the Hackney Gazette is free credibility that goes unused."
    ],
    "now": [
      {
        "t": "The cut",
        "d": "The headline is sliced on the diagonal, and its lower half slides as you move, like a precision haircut."
      },
      {
        "t": "An editorial price menu",
        "d": "Hair, beauty and body in three clean columns, with cherry on hover."
      },
      {
        "t": "The Sassoon story",
        "d": "The 1940s, set in big editorial type, with the family quote and press credits."
      },
      {
        "t": "Decades, sideways",
        "d": "Scroll down and the salon's years slide past, from 1930 to today."
      },
      {
        "t": "Book online, everywhere",
        "d": "A full-bleed cherry booking band and a sticky Book button on phones."
      }
    ],
    "brand": {
      "idea": "Clapton's salon since 1930.",
      "body": "Not a costume of 1930, but the precision of the salon's most famous former guest. The mark is a circle cut on the diagonal, its lower half slid across, and the cut runs through the whole identity. Cherry, ink, powder and blush feel like a fashion editorial. Gloock, a sharp modern serif, carries the glamour, and Inter keeps prices and hours clean.",
      "points": [
        "\"The cut\" as the mark and the graphic system",
        "Cherry for booking and actions only",
        "Voice: glamorous but warm and local. \"Pull up a chair.\"",
        "Press credits (Spitalfields Life, Hackney Gazette) always on show"
      ]
    },
    "marketing": {
      "idea": "The countdown to 100 years starts now.",
      "plays": [
        {
          "when": "Week 1",
          "t": "Fix the title and the booking path",
          "d": "\"Clapton Beauty Parlour: Hair & Beauty, Lower Clapton Road since 1930\", with Fresha booking on every page and in the Instagram bio."
        },
        {
          "when": "Month 1",
          "t": "The story, pitched properly",
          "d": "The Vidal Sassoon and Beverley Sisters history is a gift for local press and heritage accounts. Pitch it with the new site as the link."
        },
        {
          "when": "Month 1",
          "t": "Deco Instagram templates",
          "d": "A branded grid for before-and-after hair and new colour work, so every post looks like part of the same salon."
        },
        {
          "when": "Seasonal",
          "t": "Wedding season landing page",
          "d": "Their wedding packages get their own page and a spring campaign aimed at Hackney couples."
        },
        {
          "when": "2030",
          "t": "The centenary",
          "d": "Clapton Beauty Parlour turns 100 in 2030. A \"Countdown to 100\" series, with one decade of hairstyles a month, builds to the biggest local story they'll ever have."
        }
      ]
    },
    "tier": "Rebrand",
    "tierWhy": "The story is the asset. An identity worth putting on a window, a booking-first site and templates they can reuse all the way to the centenary."
  }
];
