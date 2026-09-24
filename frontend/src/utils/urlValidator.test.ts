import { describe, it, expect } from 'vitest';
import { isValidHttpsUrl } from './urlValidator';

describe('isValidHttpsUrl', () => {
  it('returns true for valid https URLs', () => {
    expect(isValidHttpsUrl('https://example.com')).toBe(true);
    expect(isValidHttpsUrl('https://misa.lol/profile')).toBe(true);
    expect(isValidHttpsUrl('  https://sub.domain.org/path?query=1  ')).toBe(true);
  });

  it('returns false for http scheme', () => {
    expect(isValidHttpsUrl('http://example.com')).toBe(false);
  });

  it('returns false for javascript scheme', () => {
    expect(isValidHttpsUrl('javascript:alert(1)')).toBe(false);
  });

  it('returns false for data scheme', () => {
    expect(isValidHttpsUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
  });

  it('returns false for missing or malformed URLs', () => {
    expect(isValidHttpsUrl('')).toBe(false);
    expect(isValidHttpsUrl('   ')).toBe(false);
    expect(isValidHttpsUrl('not-a-url')).toBe(false);
    expect(isValidHttpsUrl('https://')).toBe(false);
  });
});
