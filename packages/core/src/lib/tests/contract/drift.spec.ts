import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..', '..', '..', '..', '..');
const CLI = resolve(REPO_ROOT, 'scripts', 'types-sync', 'cli.mjs');

/**
 * Contract drift regression test.
 *
 * Runs the types-sync CLI against the committed wc-10.7.0.json snapshot and
 * asserts that no `error`-severity schema drifts exist. Route-coverage is
 * intentionally skipped here (--no-coverage-check) — coverage gaps are tracked
 * separately in the types-sync allowlist; this test guards against schema-level
 * regressions (type mismatches, missing fields, introspection failures).
 *
 * If this test fails, run:
 *   node scripts/types-sync/cli.mjs check --no-coverage-check
 * to see the full human-readable diff report.
 */
describe('Contract drift — schema regression', () => {
  it('has zero error-severity schema drifts against wc-10.7.0.json', () => {
    const result = spawnSync(
      'node',
      [CLI, 'check', '--json', '--no-coverage-check'],
      {
        cwd: REPO_ROOT,
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024,
      }
    );

    const stdout = result.stdout ?? '';
    const stderr = result.stderr ?? '';

    // The CLI mixes diagnostic console.log lines with the JSON output on stdout.
    // The JSON blob always starts with '{', so slice from the first '{' to isolate it.
    const jsonStart = stdout.indexOf('{');
    if (jsonStart === -1) {
      throw new Error(
        `CLI stdout contained no JSON object.\nstdout: ${stdout.slice(
          0,
          500
        )}\nstderr: ${stderr.slice(0, 500)}`
      );
    }
    const rawJson = stdout.slice(jsonStart);

    // The CLI writes diagnostic lines to stderr; stdout should be pure JSON
    let report: {
      drifts: Array<{
        severity: string;
        driftKind: string;
        route: string;
        field: string;
        id?: string;
      }>;
    };
    try {
      report = JSON.parse(rawJson);
    } catch {
      throw new Error(
        `CLI output was not valid JSON.\nrawJson: ${rawJson.slice(
          0,
          500
        )}\nstderr: ${stderr.slice(0, 500)}`
      );
    }

    const errors = report.drifts.filter((d) => d.severity === 'error');

    if (errors.length > 0) {
      const summary = errors
        .map((e) => `  [${e.id ?? e.driftKind}] ${e.route} — field: ${e.field}`)
        .join('\n');
      expect.fail(
        `${errors.length} error-severity schema drift(s) detected:\n${summary}\n\nRun: node scripts/types-sync/cli.mjs check --no-coverage-check`
      );
    }

    expect(errors).toHaveLength(0);
  }, 30_000); // spawnSync blocks; allow 30 s for the CLI to complete under coverage mode
});
