# AI-Assisted Failure Analysis Example

This document shows how the offline failure analysis utility helps QA engineers interpret Playwright failures without using paid external AI services.

## Example failed test

Test name: `SauceDemo UI automation suite > successful login`

Error message:

```text
Error: expect(locator).toBeVisible() failed
Locator: getByRole('heading', { name: 'Products' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found
```

## Generated structured summary

```json
{
  "testName": "SauceDemo UI automation suite successful login",
  "errorMessage": "expect(locator).toBeVisible() failed",
  "failedStep": "getByRole('heading', { name: 'Products' })",
  "possibleRootCause": "A selector is stale, not stable, or the element is not present in the current DOM state. This often happens after a UI change or when a wait condition is insufficient.",
  "suggestedFix": "Use a stable selector such as data-test attributes, wait for the target state before asserting, and validate that the page is in the expected workflow state before interacting with the element.",
  "debuggingRecommendation": "Review the Playwright trace, screenshot, and browser console for SauceDemo UI automation suite successful login. Check whether the app state changed, the selector became unstable, or the target endpoint returned an unexpected payload. Re-run the scenario in isolation to confirm the root cause before changing test assertions.",
  "severity": "high"
}
```

## Interpretation

The failure pattern indicates a likely UI selector issue or a timing problem after login. A broad root cause analysis would focus on the following:

1. Confirm the page reached the inventory page successfully.
2. Check whether the page uses a different heading or a delayed render.
3. Validate whether the locator is still valid on the current application version.
4. Review the Playwright trace for the exact state of the DOM at failure time.

## Recommended debugging workflow

- Inspect the failure screenshot
- Open the Playwright trace
- Verify if the browser landed on the expected URL
- Validate whether the app uses a conditional loader or a dynamic DOM
- Replace fragile selectors with stable `data-test` attributes when possible

## Why this approach is useful

This utility does not require external APIs or paid tools. It uses local failure artifacts and heuristics to provide a structured QA summary that is helpful for debugging, test triage, and portfolio documentation.
