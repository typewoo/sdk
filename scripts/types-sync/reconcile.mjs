/**
 * Cross-version reconciliation. Takes per-version drift records (one diff
 * per supported WC version) and produces a single, support-window-aware
 * drift list.
 *
 * Core idea: WC's `latest` version is the comparison anchor. Older versions
 * in the window provide back-compat cover — a field that's `extra-in-sdk`
 * against latest but still present in some older version is downgraded from
 * `error` to `info` because removing it would break older clients.
 *
 * The single-version path (window size 1) short-circuits this whole module
 * and returns the latest-only drifts unchanged. See `cli.mjs runCheck`.
 */

/**
 * @typedef {Object} DriftRecord
 * @property {string} surface
 * @property {string} route
 * @property {string} kind        // 'response' | 'request' | 'query'
 * @property {string} field
 * @property {string} driftKind
 * @property {'error'|'warn'|'info'} severity
 * @property {*} sdk
 * @property {*} upstream
 * @property {Object} [provenance]
 */

/**
 * @typedef {Object} ReconcileInput
 * @property {Map<string, DriftRecord[]>} perVersionDrifts   // version → drifts vs that version
 * @property {{ versions: string[], latest: string }} window
 * @property {{ deprecated?: { fields: string[], sinceVersion?: string, note?: string } }} [registryEntry]
 */

/**
 * @param {ReconcileInput} input
 * @returns {DriftRecord[]}
 */
export function reconcileAcrossVersions({ perVersionDrifts, window, registryEntry }) {
  const latest = window.latest;
  const olderVersions = window.versions.filter((v) => v !== latest);
  const latestDrifts = perVersionDrifts.get(latest) ?? [];
  const out = [];

  // Build a quick lookup: for each (kind, field) what drift kind fired in
  // each older version. Used to decide whether an `extra-in-sdk` against
  // latest is covered by an older version (i.e. that version still has the
  // field, so it does NOT report extra-in-sdk for it).
  /** @type {Map<string, Map<string, string>>} */
  const fieldStatusByVersion = new Map();
  for (const v of olderVersions) {
    const map = new Map();
    for (const d of perVersionDrifts.get(v) ?? []) {
      map.set(`${d.kind}|${d.field}`, d.driftKind);
    }
    fieldStatusByVersion.set(v, map);
  }

  const deprecatedFields = new Set(registryEntry?.deprecated?.fields ?? []);

  const hasOlderVersions = olderVersions.length > 0;

  for (const d of latestDrifts) {
    const key = `${d.kind}|${d.field}`;
    const reconciled = { ...d };

    if (hasOlderVersions && d.driftKind === 'extra-in-sdk') {
      // The field is in our SDK but not in latest WC. Check older versions:
      // if any of them does NOT report extra-in-sdk for the same key, that
      // version still has the field — we're covering a legitimate older
      // client.
      const stillIn = olderVersions.filter((v) => {
        const status = fieldStatusByVersion.get(v).get(key);
        return status !== 'extra-in-sdk' && status !== 'route-missing-upstream';
      });
      if (stillIn.length > 0) {
        reconciled.severity = 'info';
        reconciled.driftKind = 'removed-in-window';
        reconciled.provenance = {
          ...(reconciled.provenance ?? {}),
          lastSeenIn: pickLatestSemver(stillIn),
          stillSupportedIn: stillIn,
        };
      } else {
        reconciled.provenance = {
          ...(reconciled.provenance ?? {}),
          safeToRemove: true,
        };
      }
    }

    if (hasOlderVersions && d.driftKind === 'missing-in-sdk') {
      // Annotate with the oldest version that already had this field, so
      // the team knows when to mark it `@since` in the SDK.
      const presentSince = olderVersions
        .filter((v) => {
          const status = fieldStatusByVersion.get(v).get(key);
          return status === 'missing-in-sdk';
        })
        .sort(semverCompare);
      reconciled.provenance = {
        ...(reconciled.provenance ?? {}),
        addedIn: presentSince.length > 0 ? presentSince[0] : latest,
      };
    }

    if (
      hasOlderVersions &&
      (d.driftKind === 'type-mismatch' || d.driftKind === 'enum-drift')
    ) {
      // If the SDK matches an older window version's type/enum, the SDK is
      // stale rather than wrong — downgrade to warn with provenance.
      const matchedIn = olderVersions.find((v) => {
        const status = fieldStatusByVersion.get(v).get(key);
        return status === undefined; // no drift recorded against this version → SDK matches it
      });
      if (matchedIn) {
        reconciled.severity = 'warn';
        reconciled.provenance = {
          ...(reconciled.provenance ?? {}),
          matchedIn,
        };
      }
    }

    // Honour deprecation acks regardless of window size — if this field is
    // on the deprecated list of its registry entry, downgrade to info with
    // `acked: true`. Works even in single-version mode so the SDK can ack a
    // field for reasons unrelated to the window (legacy client policy etc.).
    if (deprecatedFields.has(d.field)) {
      reconciled.severity = 'info';
      reconciled.provenance = {
        ...(reconciled.provenance ?? {}),
        acked: true,
        deprecatedSince: registryEntry?.deprecated?.sinceVersion,
        deprecationNote: registryEntry?.deprecated?.note,
      };
    }

    out.push(reconciled);
  }

  // Detect fields removed mid-window that aren't already an `extra-in-sdk`
  // against latest. This happens when an older version had a field that
  // latest does not, but the SDK didn't declare it either — so latest
  // reports nothing and the fact that it was once there would be invisible.
  // We only emit these for diagnostic awareness if the registry entry
  // explicitly declares deprecation (otherwise the SDK already chose to
  // ignore the older field, no signal needed).
  // Implementation deferred — see plan §4 row "removed-in-window". Currently
  // covered by the `extra-in-sdk` → `removed-in-window` rewrite above.

  return out;
}

/** Pick the highest semver from a list of version strings. */
function pickLatestSemver(versions) {
  return [...versions].sort(semverCompare).pop();
}

/** Numeric semver compare: '10.7.0' > '9.5.1'. */
function semverCompare(a, b) {
  const pa = a.split('.').map((n) => parseInt(n, 10));
  const pb = b.split('.').map((n) => parseInt(n, 10));
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) return x - y;
  }
  return 0;
}
