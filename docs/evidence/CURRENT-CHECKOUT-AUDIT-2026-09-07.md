# Current-checkout evidence applicability audit

Audit date: 2026-09-07
Checkout base: `b96b5df8649be9a36f301ae07e4ddb04dd7d70ee` plus uncommitted Phase 2 changes
Package version: `0.1.0`

The imported E1, E3, E4, and E5 records identify application version `0.4.2`, build
`118`, and commit `31d2abc`. Git cannot resolve `31d2abc` in this repository. E1 names
reviewed paths such as `content/safety.md`; E3 names
`docs/legal/privacy-policy-v1.2.md`. Those paths are absent from this checkout. The
supporting PDFs, screenshots, recordings, and issue records named by the artifacts are
also absent. Consequently, the records are preserved as evidence for the build they
identify, but they do not prove approval or device acceptance for the current checkout.

Current authored content and the generated bundle use `review.status: draft`. No E1
approval metadata was copied into runtime content because equivalence to the reviewed
build cannot be established. E2 is a policy approval and may be treated as current
governance evidence; it does not assess the current claim corpus.

## Current review-scope hashes

These hashes give reviewers a stable target for a current-checkout revalidation record.

| SHA-256                                                            | Path                                           |
| ------------------------------------------------------------------ | ---------------------------------------------- |
| `327fed8442a4039353642ecaebcad466456830a053a43c8c72da5ad94638b01b` | `content/emergency/core.json`                  |
| `baf25340b6e362d94f1c0112af98aab25b85a0c3bc68176f2213aab5e9133f68` | `content/substances/2cb.json`                  |
| `d21b2a587067f26a7a5359c85a414fe42662da333fa80e438b6915ef8b5709e0` | `content/substances/ketamine.json`             |
| `3eb0c9d9dd32bd658d44b915d572e31b3133f3d884fe4ee54d8b2b20cc6f081a` | `content/substances/mdma.json`                 |
| `3c2ae8a07704cdc8b250af77814013875664e6162408e481f7e8a65141c3fbd8` | `content/substances/psilocybin-mushrooms.json` |
| `0ce7e64bd5990c9ceea8846fb5c86bcdc594998a9bae73b0dddde82ea67e79a8` | `config/emergency.json`                        |
| `64c541a2987f0fd3763bfdb091f162bab5cefc8c0b7755aed828fd2ea2a31365` | `config/release.json`                          |

## Required next evidence

The smallest sufficient next artifact is a dated revalidation that identifies this
checkout by committed SHA or the hashes above, confirms the exact reviewed paths, and
states which E1/E3/E4/E5 conclusions remain applicable. Performance evidence must record
observed launch, profile-open, and emergency-open timings against their thresholds.
Missing supporting attachments should be imported or explicitly waived by their owner.
