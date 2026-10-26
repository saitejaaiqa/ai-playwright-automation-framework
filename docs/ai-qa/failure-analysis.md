# AI-Based Failure Analysis Example

## Scenario
A Playwright test fails because the selector for the product title no longer matches the application DOM.

## AI Analysis Workflow

1. Capture screenshot, trace, and error context.
2. Compare expected state with actual DOM state.
3. Look for UI changes such as renamed CSS classes or changed test IDs.
4. Check whether the failure is caused by a product change or an environment issue.
5. Recommend a stable selector strategy using data-test attributes.

## Example Prompt

> Analyze this Playwright failure and explain the most probable root cause. Identify whether the issue is due to a selector mismatch, timing issue, or environment problem. Provide a fix recommendation and a concise regression test suggestion.

## Expected Outcome
The AI model should identify whether the application is unchanged but the test locator is brittle, and suggest moving toward stable selectors such as attribute-based selectors or explicit data-test values.
