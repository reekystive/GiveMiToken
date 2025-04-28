import { describe, expect, it } from 'vitest';
import { RC4 } from '../rc4';

describe('RC4 Encryption Algorithm', () => {
  // Create a helper function to convert string to Uint8Array
  const stringToUint8Array = (str: string): Uint8Array => {
    return new TextEncoder().encode(str);
  };

  // Create a helper function to convert Uint8Array to hex string for result checking
  const uint8ArrayToHex = (data: Uint8Array): string => {
    return Array.from(data)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  };

  // Create a helper function to convert Uint8Array to string
  const uint8ArrayToString = (data: Uint8Array): string => {
    return new TextDecoder().decode(data);
  };

  it('should correctly encrypt string data to expected hex value', () => {
    const key = stringToUint8Array('test-key');
    const plaintext = 'Hello, RC4!';

    // Create an RC4 instance
    const rc4Encryptor = new RC4(key);

    // Encrypt data
    const encrypted = rc4Encryptor.crypt(plaintext);

    // Check that the encryption result matches the expected hex value
    expect(uint8ArrayToHex(encrypted)).toBe('87693b28717c6343fd81ef');
  });

  it('should correctly decrypt hex value to original string', () => {
    const key = stringToUint8Array('test-key');
    // The expected hex value from encryption
    const encryptedHex = '87693b28717c6343fd81ef';

    // Convert hex string to Uint8Array
    const hexChunks = encryptedHex.match(/.{1,2}/g);
    if (!hexChunks) {
      throw new Error('Invalid hex string');
    }
    const encryptedBytes = new Uint8Array(hexChunks.map((byte) => parseInt(byte, 16)));

    // Create RC4 instance for decryption
    const rc4Decryptor = new RC4(key);
    const decrypted = rc4Decryptor.crypt(encryptedBytes);

    // After decryption, should get the original string
    expect(uint8ArrayToString(decrypted)).toBe('Hello, RC4!');
  });

  it('should correctly handle binary data', () => {
    const key = stringToUint8Array('binary-key');

    // Create some binary data
    const binaryData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    // Create RC4 instance and encrypt
    const rc4Encryptor = new RC4(key);
    const encrypted = rc4Encryptor.crypt(binaryData);

    // Ciphertext should be different from the original data
    expect(encrypted).not.toEqual(binaryData);

    // Create a new RC4 instance for decryption
    const rc4Decryptor = new RC4(key);
    const decrypted = rc4Decryptor.crypt(encrypted);

    // After decryption, should get the original data
    expect(decrypted).toEqual(binaryData);
  });

  it('should produce the same ciphertext when using the same key', () => {
    const key = stringToUint8Array('same-key');
    const plaintext = 'Test deterministic behavior';

    // Create two RC4 instances using the same key
    const rc4First = new RC4(key);
    const rc4Second = new RC4(key);

    // Encrypt the same plaintext
    const encryptedFirst = rc4First.crypt(plaintext);
    const encryptedSecond = rc4Second.crypt(plaintext);

    // The two ciphertexts should be the same
    expect(uint8ArrayToHex(encryptedFirst)).toBe(uint8ArrayToHex(encryptedSecond));
  });

  it('should produce different ciphertexts when using different keys', () => {
    const key1 = stringToUint8Array('key-one');
    const key2 = stringToUint8Array('key-two');
    const plaintext = 'Same plaintext, different keys';

    // Create two RC4 instances using different keys
    const rc4First = new RC4(key1);
    const rc4Second = new RC4(key2);

    // Encrypt the same plaintext
    const encryptedFirst = rc4First.crypt(plaintext);
    const encryptedSecond = rc4Second.crypt(plaintext);

    // The two ciphertexts should be different
    expect(uint8ArrayToHex(encryptedFirst)).not.toBe(uint8ArrayToHex(encryptedSecond));
  });

  it('should correctly use init1024 method to discard the first 1024 bytes', () => {
    const key = stringToUint8Array('init-test-key');
    const plaintext = 'Testing init1024 method';

    // Create two RC4 instances with the same key, one using init1024, one not
    const rc4WithInit = new RC4(key).init1024();
    const rc4WithoutInit = new RC4(key);

    // Encrypt the same plaintext
    const encryptedWithInit = rc4WithInit.crypt(plaintext);
    const encryptedWithoutInit = rc4WithoutInit.crypt(plaintext);

    // Should produce different ciphertexts
    expect(uint8ArrayToHex(encryptedWithInit)).not.toBe(uint8ArrayToHex(encryptedWithoutInit));

    // But should get the original plaintext after decryption with the corresponding method
    const rc4DecryptWithInit = new RC4(key).init1024();
    const decryptedWithInit = rc4DecryptWithInit.crypt(encryptedWithInit);

    expect(uint8ArrayToString(decryptedWithInit)).toBe(plaintext);
  });

  it('should throw an error when the key is empty', () => {
    const emptyKey = new Uint8Array(0);

    // Trying to create an RC4 instance with an empty key should throw an error
    expect(() => new RC4(emptyKey)).toThrow('Key cannot be empty');
  });

  it('should throw an error when the data is empty', () => {
    const key = stringToUint8Array('test-key');
    const rc4 = new RC4(key);

    // Trying to encrypt empty data should throw an error
    expect(() => rc4.crypt('')).toThrow('Data cannot be empty');
    expect(() => rc4.crypt(new Uint8Array(0))).toThrow('Data cannot be empty');
  });

  it('should be able to encrypt long text', () => {
    const key = stringToUint8Array('long-text-key');
    const longText = 'a'.repeat(1000);

    const rc4Encryptor = new RC4(key);
    const encrypted = rc4Encryptor.crypt(longText);

    const rc4Decryptor = new RC4(key);
    const decrypted = rc4Decryptor.crypt(encrypted);

    expect(uint8ArrayToString(decrypted)).toBe(longText);
  });
});
