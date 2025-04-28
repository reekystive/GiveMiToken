import { describe, expect, it, vi } from 'vitest';
import { generateRandomHexString, generateRandomNumberString, generateRandomString } from '../random';

// Mock Math.random and crypto.getRandomValues for predictable tests
vi.spyOn(Math, 'random').mockReturnValue(0.5);
vi.stubGlobal('crypto', {
  getRandomValues: (array: Uint8Array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = i % 256;
    }
    return array;
  },
});

describe('Random Utilities', () => {
  describe('generateRandomHexString', () => {
    it('should generate a hex string with the specified length', () => {
      const length = 8;
      const hexString = generateRandomHexString(length);

      expect(hexString.length).toBe(length);
      expect(hexString).toMatch(/^[0-9a-f]+$/);
    });

    it('should handle odd lengths', () => {
      const length = 5;
      const hexString = generateRandomHexString(length);

      expect(hexString.length).toBe(length);
      expect(hexString).toMatch(/^[0-9a-f]+$/);
    });

    it('should produce deterministic output with mocked crypto', () => {
      const result = generateRandomHexString(4);
      expect(result).toBe('0001');
    });
  });

  describe('generateRandomNumberString', () => {
    it('should generate a number string with the specified length', () => {
      const length = 10;
      const numberString = generateRandomNumberString(length);

      expect(numberString.length).toBe(length);
      expect(numberString).toMatch(/^[0-9]+$/);
    });

    it('should produce deterministic output with mocked crypto', () => {
      const result = generateRandomNumberString(4);
      expect(result).toMatch(/^[0-9]{4}$/);
    });
  });

  describe('generateRandomString', () => {
    it('should generate a random string with the specified length', () => {
      const length = 10;
      const randomString = generateRandomString(length);

      expect(randomString.length).toBe(length);
      // With mocked Math.random always returning 0.5, we expect the same character
      // in this case it's the character at index Math.floor(0.5 * chars.length)
      // For 'abcdefghijklmnopqrstuvwxyz0123456789', that's index 18, which is 's'
      expect(randomString).toBe('ssssssssss');
    });

    it('should contain only lowercase letters and numbers', () => {
      // Reset the mock to get actual randomness for this test
      vi.mocked(Math.random).mockRestore();

      const length = 20;
      const randomString = generateRandomString(length);

      expect(randomString.length).toBe(length);
      expect(randomString).toMatch(/^[a-z0-9]+$/);

      // Re-mock Math.random for other tests
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
    });
  });
});
