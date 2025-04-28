import { describe, expect, it, vi } from 'vitest';
import {
  arrayBufferToBase64String,
  base64StringToArrayBuffer,
  decryptRc4Data,
  encryptRc4Data,
  generateNonce,
  hashPassword,
} from '../crypto-utils';

// Mock crypto.getRandomValues and crypto.subtle.digest
vi.stubGlobal('crypto', {
  getRandomValues: (array: Uint8Array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = i % 256;
    }
    return array;
  },
});

describe('Crypto Utilities', () => {
  describe('hashPassword', () => {
    it('should generate MD5 hash for password (Base64)', () => {
      const hash = hashPassword('test-password');
      expect(hash).toBe('DFB450EFDDBB5387197C84460623675B');
    });
  });

  describe('arrayBufferToBase64String', () => {
    it('should convert ArrayBuffer to Base64 string correctly', () => {
      const input = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
      const base64 = arrayBufferToBase64String(input);
      /** cspell:disable-next-line */
      expect(base64).toBe('SGVsbG8=');
    });

    it('should handle empty array', () => {
      const input = new Uint8Array([]);
      const base64 = arrayBufferToBase64String(input);
      expect(base64).toBe('');
    });
  });

  describe('base64StringToArrayBuffer', () => {
    it('should convert Base64 string to ArrayBuffer correctly', () => {
      /** cspell:disable-next-line */
      const base64 = 'SGVsbG8='; // "Hello" in base64
      const buffer = base64StringToArrayBuffer(base64);
      const result = new Uint8Array(buffer);
      expect(Array.from(result)).toEqual([72, 101, 108, 108, 111]);
    });

    it('should handle empty string', () => {
      const buffer = base64StringToArrayBuffer('');
      expect(buffer.byteLength).toBe(0);
    });
  });

  describe('generateNonce', () => {
    it('should generate a Base64 string with fixed length using crypto.getRandomValues', () => {
      const nonce = generateNonce();
      // Our mocked getRandomValues fills with sequential bytes, so we can predict the result
      /** cspell:disable-next-line */
      expect(nonce).toBe('AAECAwQFBgcICQoL');
      expect(atob(nonce).length).toBe(12); // Should be 12 bytes long
    });
  });

  describe('encryptRc4Data and decryptRc4Data', () => {
    it('should encrypt and decrypt data correctly', () => {
      /** cspell:disable-next-line */
      const password = 'dGVzdC1rZXk='; // "test-key" in base64
      const originalData = 'Hello, World!';

      // Encrypt the data
      const encrypted = encryptRc4Data(password, originalData);
      expect(encrypted).not.toBe(originalData);

      // Decrypt the encrypted data
      const decrypted = decryptRc4Data(password, encrypted);
      expect(decrypted).toBe(originalData);
    });

    it('should produce different ciphertexts for the same data with different passwords', () => {
      const data = 'Same data, different keys';
      /** cspell:disable-next-line */
      const password1 = 'a2V5LW9uZQ=='; // "key-one" in base64
      /** cspell:disable-next-line */
      const password2 = 'a2V5LXR3bw=='; // "key-two" in base64

      const encrypted1 = encryptRc4Data(password1, data);
      const encrypted2 = encryptRc4Data(password2, data);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should produce different decrypted output with wrong password', () => {
      /** cspell:disable-next-line */
      const originalPassword = 'Y29ycmVjdC1rZXk='; // "correct-key" in base64
      /** cspell:disable-next-line */
      const wrongPassword = 'd3Jvbmcta2V5'; // "wrong-key" in base64
      const originalData = 'Secret message';

      const encrypted = encryptRc4Data(originalPassword, originalData);
      const decrypted = decryptRc4Data(wrongPassword, encrypted);

      // The data will be decrypted, but will be garbled due to wrong key
      expect(decrypted).not.toBe(originalData);
    });
  });
});
