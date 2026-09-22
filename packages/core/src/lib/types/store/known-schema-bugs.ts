/**
 * Store API request fields where WooCommerce's published schema is stricter
 * than the live API. WC marks every address field `required: true`, but a
 * partial address (e.g. just `country`) is accepted and the rest keep their
 * current values, so the SDK leaves them optional. Checked against WC 10.7.0.
 */
export const PARTIAL_ADDRESS_SCHEMA_BUGS = [
  'billing_address',
  'shipping_address',
].map((field) => ({
  field,
  reason:
    'WC marks every address field required, but the Store API accepts partial addresses.',
  driftKinds: ['optional-mismatch'],
}));

/**
 * WC fills an empty order-attribution bucket server-side when `extensions`
 * is omitted; that's not a value callers should send by default.
 */
export const EXTENSIONS_DEFAULT_SCHEMA_BUG = {
  field: 'extensions',
  reason:
    'WC fills an empty order-attribution bucket server-side when extensions is omitted; the SDK should not send it by default.',
  driftKinds: ['default-mismatch'],
};
