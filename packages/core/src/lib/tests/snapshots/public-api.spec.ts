import { describe, it, expect } from 'vitest';
import * as publicApi from '../../../index.js';

describe('Public API surface', () => {
  it('exports the expected named symbols', () => {
    const exportNames = Object.keys(publicApi).sort();
    expect(exportNames).toMatchSnapshot();
  });
});
