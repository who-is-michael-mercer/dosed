# Phase 2 manual acceptance record

Record owner: Michael Mercer. Created: 2026-09-07. Release channel: internal alpha.
No result below is inferred from automated tests. Replace each `Pending` with a dated
result, exact device model/OS, assistive technology, and tester initials before claiming
acceptance.

| Area                   | Target / condition                                                          | Result  | Evidence artifact                                                              |
| ---------------------- | --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------ |
| Offline launch         | iPhone SE (3rd gen), cold launch ≤2 s                                       | Pending | [E4 build 118](evidence/E4-device-accessibility-test-2026-09-07.md); no timing |
| Offline launch         | iPhone 15, cold launch ≤2 s                                                 | Pending | [E4 build 118](evidence/E4-device-accessibility-test-2026-09-07.md); no timing |
| Offline launch         | low-range Android device, cold launch ≤2 s                                  | Pending | E4 has no low-range Android                                                    |
| Offline launch         | Pixel 9 / Galaxy S24, cold launch ≤2 s                                      | Pending | [E4 build 118](evidence/E4-device-accessibility-test-2026-09-07.md); no timing |
| Profile open           | each target, Library → dense profile ≤500 ms                                | Pending | —                                                                              |
| Emergency open         | each target, offline tap → urgent action ≤300 ms                            | Pending | —                                                                              |
| VoiceOver              | current checkout, focus order, urgent action retained                       | Pending | [E4 passed build 118](evidence/E4-device-accessibility-test-2026-09-07.md)     |
| TalkBack               | current checkout, focus order, urgent action retained                       | Pending | [E4 passed build 118](evidence/E4-device-accessibility-test-2026-09-07.md)     |
| Large text             | current checkout at 200%, no horizontal clipping                            | Pending | E4 says large text passed for build 118; percentage absent                     |
| Reduced motion         | urgent path remains available                                               | Pending | —                                                                              |
| Contrast / semantics   | priority and emergency meaning without color alone                          | Pending | —                                                                              |
| Target size            | urgent and navigation controls ≥44×44 points                                | Pending | —                                                                              |
| Narrow / tablet        | current checkout profile reflow and long content                            | Pending | E4 covers phone display only                                                   |
| Back stack             | current checkout relationship/testing handoff preserves prior profile       | Pending | E4 build 118 predates current handoff evidence                                 |
| Dialer unavailable     | capability false and open failure retain instructions and configured number | Pending | —                                                                              |
| Large content / memory | emergency remains responsive with dense profile and low-memory drill        | Pending | —                                                                              |

Implementation and automated proof are present, but this record remains an external
proof gate until devices and reviewers attach dated results. Clinical, editorial/source,
legal/privacy, and store review artifacts are separate pending gates.
