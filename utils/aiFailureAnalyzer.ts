import fs from 'fs';
import path from 'path';

export interface FailureAnalysisInput {
  testName: string;
  errorMessage: string;
  failedStep?: string;
  rawContext?: string;
}

export interface FailureSummary {
  testName: string;
  errorMessage: string;
  failedStep: string;
  possibleRootCause: string;
  suggestedFix: string;
  debuggingRecommendation: string;
  severity: 'low' | 'medium' | 'high';
}

const rootCausePatterns: Array<{ pattern: RegExp; rootCause: string; fix: string; severity: 'low' | 'medium' | 'high' }> = [
  {
    pattern: /(locator|element\(s\) not found|toBeVisible\(\) failed|getByRole|getByText)/i,
    rootCause: 'A selector is stale, not stable, or the element is not present in the current DOM state. This often happens after a UI change or when a wait condition is insufficient.',
    fix: 'Use a stable selector such as data-test attributes, wait for the target state before asserting, and validate that the page is in the expected workflow state before interacting with the element.',
    severity: 'high',
  },
  {
    pattern: /(timeout|waiting for|timed out|navigation timeout|toHaveURL)/i,
    rootCause: 'The page transition or element render took longer than expected, indicating a timing issue or a slow application response.',
    fix: 'Add explicit waits for the target page state, verify the app is ready, and avoid assertions before async UI transitions finish.',
    severity: 'medium',
  },
  {
    pattern: /(not valid JSON|Unexpected token|status.*(401|403|500)|response.*JSON)/i,
    rootCause: 'The application or API is returning an unexpected payload type or an error response instead of the expected JSON structure.',
    fix: 'Validate the API contract, inspect the response content type, and confirm that the request is hitting the correct endpoint and environment.',
    severity: 'high',
  },
  {
    pattern: /(net::ERR|Failed to fetch|ERR_CONNECTION|ERR_NAME_NOT_RESOLVED|ECONNREFUSED)/i,
    rootCause: 'The test is affected by a browser or network issue, including a connectivity problem or environment misconfiguration.',
    fix: 'Check connectivity, confirm the target application is running, verify the environment configuration, and review browser console logs or network traces.',
    severity: 'high',
  },
  {
    pattern: /(username and password|unauthorized|forbidden|401|403)/i,
    rootCause: 'Authentication or authorization state is not aligned with the expected test data or app state.',
    fix: 'Verify the credentials, sign-in workflow, and session lifecycle. Ensure the user is logged in before the protected action is executed.',
    severity: 'high',
  },
];

export function sanitizeText(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  return value
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractFailedStep(rawContext: string | undefined): string {
  const source = sanitizeText(rawContext, '');

  if (!source) {
    return 'Unknown step';
  }

  const candidates = [
    ...source.matchAll(/(?:\b(?:await|return|page\.|locator\(|expect\()([^\n]{0,180})\b)/gi),
    ...source.matchAll(/(?:Error:\s*)([^\n]{1,180})/gi),
    ...source.matchAll(/(?:Locator:\s*)([^\n]{1,180})/gi),
  ];

  const firstMatch = candidates[0]?.[1];
  if (firstMatch) {
    return sanitizeText(firstMatch, 'Unknown step');
  }

  const lines = source.split(/\n|\r\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    if (/(expect|locator|page\.|click\(|fill\(|goto\(|waitFor|login|checkout|addToCart|logout)/i.test(trimmed)) {
      return trimmed;
    }
  }

  return 'Unknown step';
}

export function inferRootCause(errorMessage: string, rawContext?: string): { rootCause: string; fix: string; severity: 'low' | 'medium' | 'high' } {
  const combinedText = `${errorMessage}\n${rawContext ?? ''}`;

  for (const item of rootCausePatterns) {
    if (item.pattern.test(combinedText)) {
      return {
        rootCause: item.rootCause,
        fix: item.fix,
        severity: item.severity,
      };
    }
  }

  return {
    rootCause: 'The root cause is likely tied to a regression, stale UI state, or an unexpected runtime condition. Additional evidence should be reviewed from the test trace and screenshot.',
    fix: 'Inspect the screenshot, trace, and console logs to verify the exact DOM state and confirm whether the application behavior changed.',
    severity: 'medium',
  };
}

export function buildFailureSummary(input: FailureAnalysisInput): FailureSummary {
  const testName = sanitizeText(input.testName, 'Unnamed test');
  const errorMessage = sanitizeText(input.errorMessage, 'Unknown error');
  const failedStep = extractFailedStep(input.rawContext ?? errorMessage);
  const { rootCause, fix, severity } = inferRootCause(errorMessage, input.rawContext);

  return {
    testName,
    errorMessage,
    failedStep,
    possibleRootCause: rootCause,
    suggestedFix: fix,
    debuggingRecommendation: `Review the Playwright trace, screenshot, and browser console for ${testName}. Check whether the app state changed, the selector became unstable, or the target endpoint returned an unexpected payload. Re-run the scenario in isolation to confirm the root cause before changing test assertions.`,
    severity,
  };
}

export function readErrorContextFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    return '';
  }

  return fs.readFileSync(filePath, 'utf-8');
}

export function findFailedTestFiles(baseDir: string): string[] {
  if (!fs.existsSync(baseDir)) {
    return [];
  }

  const files: string[] = [];

  const walk = (currentDir: string): void => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }

      if (entry.name === 'error-context.md' || entry.name.endsWith('.json')) {
        files.push(entryPath);
      }
    }
  };

  walk(baseDir);
  return files;
}

export function analyzeFailedTests(baseDir = 'reports/test-results'): FailureSummary[] {
  const failureFiles = findFailedTestFiles(baseDir);
  const summaries: FailureSummary[] = [];

  for (const filePath of failureFiles) {
    const rawContent = readErrorContextFile(filePath);
    if (!rawContent) {
      continue;
    }

    const lines = rawContent.split(/\r?\n/);
    const errorMessage = lines
      .find((line) => /Error:|Expected:|Received:|Failed|Assertion|Timeout|TypeError|SyntaxError|ReferenceError/i.test(line))
      ?.trim();

    const testName = path.basename(path.dirname(filePath))
      .replace(/(-retry\d+|chromium|firefox|webkit)/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim() || 'Unnamed failed test';

    if (!errorMessage) {
      continue;
    }

    const summary = buildFailureSummary({
      testName,
      errorMessage,
      failedStep: extractFailedStep(rawContent),
      rawContext: rawContent,
    });

    summaries.push(summary);
  }

  return summaries;
}

export function printFailureSummary(summary: FailureSummary): string {
  return [
    `Test: ${summary.testName}`,
    `Error: ${summary.errorMessage}`,
    `Failed step: ${summary.failedStep}`,
    `Possible root cause: ${summary.possibleRootCause}`,
    `Suggested fix: ${summary.suggestedFix}`,
    `Debugging recommendation: ${summary.debuggingRecommendation}`,
    `Severity: ${summary.severity}`,
    '',
  ].join('\n');
}
