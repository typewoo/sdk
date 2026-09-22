/**
 * Snapshot file selection. Only released WC versions (`wc-X.Y.Z.json`) take
 * part in "latest" selection; ad-hoc captures such as `wc-local.json`
 * (from `types:sync:local`) or `wc-unknown.json` (a capture without a
 * version) are ignored so they can never shadow a real release.
 */

const VERSIONED_SNAPSHOT = /^wc-(\d+)\.(\d+)\.(\d+)\.json$/;

/**
 * @param {string} file
 * @returns {number[] | null} `[major, minor, patch]`, or null for
 *   non-versioned snapshot files.
 */
export function snapshotVersion(file) {
  const m = VERSIONED_SNAPSHOT.exec(file);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

/**
 * Picks the highest-versioned snapshot filename.
 *
 * @param {string[]} files - filenames in the snapshots directory
 * @returns {string | null}
 */
export function pickLatestSnapshot(files) {
  let best = null;
  let bestVersion = null;
  for (const file of files) {
    const version = snapshotVersion(file);
    if (!version) continue;
    if (!bestVersion || compareVersions(version, bestVersion) > 0) {
      best = file;
      bestVersion = version;
    }
  }
  return best;
}

function compareVersions(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}
