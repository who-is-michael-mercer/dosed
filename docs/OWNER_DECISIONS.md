# Phase 2 owner decisions and external actions

Decision owner: Michael Mercer. Last updated: 2026-09-07.

This file contains choices that implementation must not guess. Record a decision, owner,
and date under each item. Until then, Codex should use the stated conservative behavior
and continue all independent work.

## Decisions to make now

### D1. Initial launch market

**Choose:** one country/locale for the first public release, or explicitly choose an
internal-only build with no public launch market yet.

**Recommendation:** select one market first. Do not build a worldwide emergency-number
directory in Phase 2.

**Conservative behavior until decided:** show offline emergency guidance, but treat
direct calling as unreleased configuration and do not claim it is locale-correct.

**Decision:** The initial launch market is the United States (`en-US`). The next release
channel is internal alpha; public release remains gated by the approvals in this file.
**Owner:** Michael Mercer
**Date:** 2026-09-07

### D2. Emergency calling and fallback

**Choose:** the approved emergency number for D1, whether tapping the action should open
the dialer or require confirmation, and the fallback when calling is unavailable.

**Recommendation:** capability-check before opening the dialer; if unavailable or the
open fails, keep urgent instructions visible and present the configured number as text.
Never require substance identification before showing help.

**Decision:** Configure `911` for the USA build. An explicit user tap may open the system
dialer without an additional app-authored confirmation. Check dialer capability first. If
the dialer is unavailable or opening fails, keep urgent instructions visible and present
`911` as text. Never require substance identification.
**Owner:** Michael Mercer
**Date:** 2026-09-07

### D3. Review roles and approval states

**Choose named people or roles for:** product ownership, content authorship, evidence
assessment, clinical approval, urgent corrections, and release approval. Decide whether
critical content requires two-person review.

**Recommendation:** use distinct lifecycle states and dates:

1. `draft` — authored date and author/editor;
2. `evidence_assessed` — assessment date and assessor;
3. `clinically_approved` — approval date, qualified approver, and review due date;
4. `withdrawn` — reason and effective date.

Only `clinically_approved` may be described to users as clinically reviewed. Require two
people for critical emergency or dose-content approval.

**Decision:** Michael Mercer is product owner, editorial owner, urgent-correction owner,
and release approver. Evidence assessment and clinical approval are performed by the
arranged reviewers named in their dated approval artifacts. Use the four lifecycle states
above. Critical emergency and dose content requires approval from Michael Mercer and a
qualified clinical approver.
**Owner:** Michael Mercer
**Date:** 2026-09-07

### D4. Public-release content policy

**Choose:** which content states can appear in local development, internal alpha, beta,
and public release.

**Recommendation:** allow clearly labeled draft content in development/internal alpha;
require clinical approval for all safety, dose, testing, warning-sign, and emergency copy
before public beta or store release.

**Decision:** Draft and evidence-assessed content may appear only in development and
internal-alpha builds with an honest state label. Public beta and public store releases
require clinical approval for all safety, dose, testing, warning-sign, pharmacology, and
emergency copy. Withdrawn content must not ship.
**Owner:** Michael Mercer
**Date:** 2026-09-07

### D5. Evidence presentation and required metadata

**Choose:** the user-facing evidence labels, where evidence details appear, and which
metadata fields are mandatory by claim type.

**Recommendation:** avoid numeric evidence scores. Show plain source type, applicability,
limitations/conflicts, last assessment date, and source details behind progressive
disclosure. Require references for every substantive safety, dose, timeline, testing, and
pharmacology claim; require limitations and applicability when evidence is indirect.

**Decision:** Do not show numeric evidence scores. Show plain source type, applicability,
limitations or conflicts, last assessment date, and offline source details behind
progressive disclosure. Require references for every substantive safety, dose, timeline,
testing, and pharmacology claim. Require applicability and limitations when evidence is
indirect.
**Owner:** Michael Mercer
**Date:** 2026-09-07

### D6. Testing-preview boundary

**Choose:** whether Phase 2 includes only explanatory preview content or also a disabled
future-workflow handoff.

**Recommendation:** include limitation-first copy, high-level reagent reactions using
“consistent with” language, and a context object that can later preselect a substance.
Do not add procedural testing instructions, result interpretation, kit inventory, or a
full testing route in Phase 2.

**Decision:** Phase 2 includes limitation-first preview copy, high-level reagent reactions
using “consistent with” language, and a context object for future substance preselection.
It excludes procedural instructions, result interpretation, kit inventory, and a full
testing route.
**Owner:** Michael Mercer
**Date:** 2026-09-07

### D7. Device matrix and performance budgets

**Choose:** representative small/large iOS devices, a mid/low-range Android device,
minimum supported OS versions, and measurable budgets.

**Recommended initial budgets:**

- offline cold launch to usable Library: at most 2 seconds on the slowest target device;
- profile open from Library: at most 500 milliseconds;
- emergency screen visible after tap: at most 300 milliseconds with no network;
- no horizontal clipping at 200% text;
- no lost urgent action under screen-reader focus or reduced-motion settings.

Treat these numbers as proposed until measured on your actual target devices.

**Decision:** Accept the proposed budgets above. Use the arranged representative small
and large iOS devices and low- and mid-range Android devices. Record exact models, OS
versions, assistive technologies, and results in the dated acceptance artifact before
claiming device acceptance.
**Owner:** Michael Mercer
**Date:** 2026-09-07

## External work to arrange

The owner reports that reviewers and devices are arranged. The resources are available;
the gates remain pending until dated evidence is attached.

### E1. Clinical reviewer

- Identify a qualified reviewer willing to approve safety, dose-reference, testing,
  warning-sign, pharmacology, and emergency content.
- Agree on scope, turnaround, review cadence, and how approval is recorded in the repo.
- Do not send material externally until the owner approves that outreach.

**Status:** E1 record imported for build 118 / unresolved commit `31d2abc`; current
checkout revalidation and its referenced supporting PDF remain pending.

### E2. Editorial and source policy

- Name the person responsible for source selection and corrections.
- Approve acceptable source categories and treatment of community reports.
- Decide the urgent correction and content-withdrawal workflow.

**Status:** Satisfied. E2 records Michael Mercer's approved source, correction, and
withdrawal policy. Current claim-corpus assessment remains part of E1 revalidation.

### E3. Legal, privacy, and store review

- Obtain review of safety disclaimers, emergency-call behavior, privacy disclosure, and
  intended app-store positioning before public release.
- Confirm whether any jurisdiction-specific language or age gating is required.

**Status:** E3 approves USA adult internal alpha for build 118 only. The named privacy
policy and supporting PDF are absent, and the current checkout remains pending review.

### E4. Device and accessibility access

- Identify the physical iOS and Android devices available for acceptance testing.
- Identify who will run VoiceOver and TalkBack checks, or arrange an accessibility
  reviewer.
- Preserve results as dated artifacts; a checklist tick without evidence is insufficient.

**Status:** E4 records physical-device and assistive-technology results for build 118.
Its attachments, low-range Android coverage, performance thresholds, and current-checkout
revalidation remain pending.

### E5. Release channel

- Choose development-only, internal alpha, closed beta, or public store release as the
  next milestone.
- Name the person authorized to approve each promotion.

**Status:** E5 authorizes build 118 at unresolved commit `31d2abc` for internal alpha.
It does not authorize this changed checkout or public promotion.

## Fast reply template

The owner can resolve the blocking set with one response:

```text
D1 launch market:
D2 emergency number / dialer confirmation / fallback:
D3 named roles and two-person rule:
D4 allowed content states by release channel:
D5 evidence labels and required metadata:
D6 testing preview boundary:
D7 devices, minimum OS versions, and approved budgets:
Next release channel:
Available clinical/editorial/legal/accessibility reviewers:
```
