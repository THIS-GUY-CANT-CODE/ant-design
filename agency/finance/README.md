# Financial model

`model.xlsx` has three tabs: **Summary**, **Assumptions** (edit the blue and yellow cells) and **Model** (a 12-month projection, all formulas). Rebuild it with `python3 build_model.py` (needs `openpyxl`). The file recalculates when it's opened in Excel, Google Sheets or Numbers.

Formulas were checked with the pycel formula engine: 276 formulas, 0 errors. The figures below are pycel's results.

## What the model says (28 Sep 2026, assumptions in the file)

| Scenario | 12-month profit | £ per hour | Care income/month at month 12 | Hours per month |
| --- | ---: | ---: | ---: | ---: |
| Base plan: 4 demos/week, 1 in 8 convert, £500 | £25,956 | £28 | £731 | 76 |
| Warm leads: 1 in 4 convert | £52,391 | £46 | £1,461 | 95 |
| Warm leads, and half take the £1,200 Rebrand | £64,271 | £51 | £1,461 | 104 |
| Warm leads, and Refresh at £750 | £65,120 | £57 | £1,461 | 95 |
| 8 demos/week, cold (just working harder) | £52,391 | **£29** | £1,461 | 153 |
| Warm, 8/week, £750, half Rebrand | £145,995 | £58 | £2,923 | 208 |

## The three decisions this points to
1. **Conversion is the biggest lever, not volume.** Doubling the demos doubles the hours and leaves the hourly rate flat (about £29). Going from 1 in 8 to 1 in 4 (warm intros from the Trades Guild, grants and referrals, see `sales/partners.md`) takes the hourly rate from £28 to £46.
2. **Test a higher price.** At £500 the Refresh is cheap for what's delivered (a brand, a site and Google setup). Pitch the next 10 at £750 and track the win rate in `pipeline.csv`.
3. **Care plans compound.** Each one is only £49, but they stack: about £1.5k a month by month 12 in the warm scenario, with no new sales needed. Always offer Care at handover.

**Replace the guesses with real numbers after the first 20 pitches.** Conversion, Rebrand mix and Care uptake are all assumptions until then.
