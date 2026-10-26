# AI Prompts for Debugging Failed Tests

## Prompt 1: Root cause analysis

> Review this Playwright failure log and identify the most probable root cause. Tell me whether the issue is due to a locator problem, page timing, network issue, or environment instability.

## Prompt 2: Selector stabilization

> Suggest alternative selectors for this page object to make the test more stable and resilient to UI changes while preserving readability.

## Prompt 3: Test improvement

> Propose a better Playwright assertion strategy for this scenario, including waits, explicit verifications, and failure messages.

## Prompt 4: Regression prevention

> Recommend additional regression tests that would have caught the issue earlier and explain why these tests provide better coverage.

## Prompt 5: CI troubleshooting

> Diagnose likely reasons for this Playwright test failing in GitHub Actions but passing locally. Consider browser install issues, timing, and environment configuration.
