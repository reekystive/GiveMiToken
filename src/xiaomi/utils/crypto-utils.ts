import { MD5, enc } from 'crypto-js';
import { RC4 } from './rc4.ts';

/**
 * Cryptographic utility functions for Xiaomi authentication
 */

/**
 * Calculate password MD5 hash
 */
export function hashPassword(password: string): string {
  return MD5(password).toString(enc.Hex).toUpperCase();
}

/**
 * Convert ArrayBuffer to Base64 string
 */
export function arrayBufferToBase64String(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 */
export function base64StringToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (const [i, char] of binaryString.split('').entries()) {
    bytes[i] = char.charCodeAt(0);
  }
  return bytes.buffer;
}

/**
 * Generate random nonce value (12 bytes)
 */
export function generateNonce(): string {
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  return arrayBufferToBase64String(array);
}

/**
 * Encrypt data using RC4 algorithm
 */
export function encryptRc4Data(pwd: string, data: string): string {
  const keyBuffer = base64StringToArrayBuffer(pwd);
  const rc4 = new RC4(new Uint8Array(keyBuffer)).init1024();
  const encrypted = rc4.crypt(data);
  return arrayBufferToBase64String(encrypted);
}

/**
 * Decrypt data using RC4 algorithm
 */
export function decryptRc4Data(pwd: string, data: string): string {
  const keyBuffer = base64StringToArrayBuffer(pwd);
  const dataBuffer = base64StringToArrayBuffer(data);
  const rc4 = new RC4(new Uint8Array(keyBuffer)).init1024();
  const decrypted = rc4.crypt(new Uint8Array(dataBuffer));
  return new TextDecoder().decode(decrypted);
}
