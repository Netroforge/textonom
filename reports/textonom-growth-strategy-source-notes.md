# Textonom Growth Strategy Source Notes

Generated July 28, 2026.

## Current product

- Transformation registry reviewed at commit `194dd292a8b20e23871539a8ed20ba5583b07a4b`.
- Count: 100 transformation metadata entries with a top-level category.
- Count: 9 top-level categories, including Pipeline and Custom.
- Landing page source reviewed for product counts, privacy copy, download links, footer license, and the Impact affiliate tracker.
- `electron-builder.yml` reviewed for release targets and signing/notarization posture.

## Public reach

- GitHub repository state came from `GET /repos/Netroforge/textonom`.
- Releases came from `GET /repos/Netroforge/textonom/releases?per_page=100`.
- Binary asset downloads exclude filenames beginning with `latest`, `hashes`, or
  `Files-SHA256`, plus `.blockmap` files.
- The resulting 876 count is cumulative asset downloads, not unique users,
  successful installs, or active devices.

## Competitive review

- DevToys: https://devtoys.app/
- DevToys distribution: https://devtoys.app/download
- CyberChef: https://github.com/gchq/CyberChef
- DevUtils: https://devutils.com/
- IT-Tools: https://github.com/CorentinTh/it-tools
- GitHub stars were read from each repository's REST API on July 28, 2026.

## Install trust

- Microsoft SmartScreen:
  https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation
- Apple notarization:
  https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution
- electron-builder code signing:
  https://www.electron.build/docs/features/code-signing/

## Funding

- Overney et al., “How to Not Get Rich: An Empirical Study of Donations in Open
  Source,” ICSE 2020:
  https://www.cs.cmu.edu/~ckaestne/pdf/icse20-donations.pdf
- GitHub Sponsors goals:
  https://docs.github.com/en/enterprise-cloud@latest/sponsors/receiving-sponsorships-through-github-sponsors/managing-your-sponsorship-goal
- Open Collective money transparency:
  https://documentation.opencollective.com/collectives/managing-money

## Opportunity scoring

Priority score:

`20 × (30% adoption reach + 25% repeat-use potential + 20% trust/donation leverage + 15% external evidence + 10% implementation ease)`

Each component uses a 1–5 judgment scale. Implementation ease is inverse effort:
5 is easiest and 1 is hardest. Scores guide sequencing and are not forecasts of
growth, revenue, or donations.

| Initiative                            | Adoption | Habit | Trust | Evidence | Ease | Score |
| ------------------------------------- | -------: | ----: | ----: | -------: | ---: | ----: |
| Smart clipboard detection             |        4 |     5 |     4 |        5 |    3 |    86 |
| Signed builds + smart downloads       |        5 |     2 |     5 |        5 |    4 |    83 |
| System-wide quick window              |        4 |     5 |     3 |        5 |    3 |    82 |
| Named and shareable recipes           |        3 |     5 |     4 |        5 |    3 |    80 |
| Package-manager distribution          |        5 |     3 |     3 |        5 |    3 |    78 |
| Truthful landing page refresh         |        5 |     1 |     4 |        5 |    5 |    76 |
| Textonom CLI                          |        3 |     5 |     3 |        4 |    2 |    71 |
| Concrete funding goal + milestone ask |        2 |     2 |     5 |        4 |    5 |    64 |
| Extension ecosystem                   |        3 |     4 |     2 |        4 |    1 |    60 |
| More standalone transformations       |        2 |     2 |     2 |        3 |    3 |    45 |

## Chart map

- Section: opportunity prioritization.
- Question: which initiatives best combine adoption, habit, trust, evidence, and
  ease?
- Family: sorted comparison.
- Type: horizontal bar.
- Fields: initiative and score; phase and effort retained for tooltips.
- Claim: workflow and trust improvements rank above generic tool expansion.
- Palette: single-root sequential blue.

## Validation notes

- Scores were independently recomputed with Node.js from the stated weights.
- GitHub binary asset totals were recomputed from the current releases API with
  deterministic filename exclusions.
- No causal claim is made from competitor popularity.
- Firm retention and donation targets are deferred until Textonom has a
  four-week baseline.
