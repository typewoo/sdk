/**
 * Unit tests for snapshots.mjs.
 */

import { describe, expect, it } from 'vitest';

// @ts-expect-error -- .mjs module without types
import { pickLatestSnapshot, snapshotVersion } from '../snapshots.mjs';

describe('snapshotVersion', () => {
  it('parses released-version filenames', () => {
    expect(snapshotVersion('wc-10.7.0.json')).toEqual([10, 7, 0]);
  });

  it('returns null for ad-hoc and non-snapshot files', () => {
    for (const f of [
      'wc-local.json',
      'wc-unknown.json',
      'wc-10.8.0-beta.1.json',
      '.gitkeep',
    ]) {
      expect(snapshotVersion(f)).toBeNull();
    }
  });
});

describe('pickLatestSnapshot', () => {
  it('ignores ad-hoc captures regardless of directory order', () => {
    const files = [
      'wc-local.json',
      'wc-9.9.0.json',
      'wc-unknown.json',
      'wc-10.7.0.json',
      '.gitkeep',
    ];
    expect(pickLatestSnapshot(files)).toBe('wc-10.7.0.json');
    expect(pickLatestSnapshot([...files].reverse())).toBe('wc-10.7.0.json');
  });

  it('compares versions numerically, not lexically', () => {
    expect(pickLatestSnapshot(['wc-9.10.0.json', 'wc-10.2.0.json'])).toBe(
      'wc-10.2.0.json'
    );
    expect(pickLatestSnapshot(['wc-10.10.0.json', 'wc-10.9.0.json'])).toBe(
      'wc-10.10.0.json'
    );
  });

  it('returns null when there is no released snapshot', () => {
    expect(pickLatestSnapshot(['wc-local.json', '.gitkeep'])).toBeNull();
  });
});
