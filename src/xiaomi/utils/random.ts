export const generateRandomHexString = (length: number) => {
  const paddedBytes = Math.ceil(length / 2);
  const array = new Uint8Array(paddedBytes);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
};

export const generateRandomNumberString = (length: number) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((byte) => byte.toString(10).padStart(2, '0'))
    .join('')
    .slice(0, length);
};

/**
 * Generate random string of specified length
 */
export function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
