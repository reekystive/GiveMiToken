export class RC4 {
  // Internal state array
  private state: Uint8Array;
  // Current x index
  private x = 0;
  // Current y index
  private y = 0;

  /**
   * Creates a new RC4 cipher instance
   * @param key - The encryption/decryption key
   */
  constructor(key: Uint8Array) {
    if (key.length === 0) {
      throw new Error('Key cannot be empty');
    }

    // Initialize state array with values 0-255
    this.state = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      this.state[i] = i;
    }

    // Key scheduling algorithm (KSA)
    let j = 0;
    for (let i = 0; i < 256; i++) {
      // Using modulo to ensure we never go out of bounds
      const keyByte = key[i % key.length];
      // Since we initialized state with values 0-255, we know these are numbers
      const stateI = this.state[i];

      // TypeScript needs the nullish checks, even though we know these values
      // will always be defined for a Uint8Array initialized with all values
      if (keyByte === undefined || stateI === undefined) {
        throw new Error('Unexpected undefined value');
      }

      j = (j + stateI + keyByte) % 256;
      // j is always in range 0-255 due to modulo
      const stateJ = this.state[j];
      if (stateJ === undefined) {
        throw new Error('Unexpected undefined value');
      }

      this.state[i] = stateJ;
      this.state[j] = stateI;
    }
  }

  /**
   * Initialize, discard first 1024 bytes
   * This improves security by advancing the cipher state
   * @returns The current RC4 instance for method chaining
   */
  init1024(): this {
    for (let i = 0; i < 1024; i++) {
      this.getByte();
    }
    return this;
  }

  /**
   * Get next pseudo-random byte
   * Implements the PRGA (Pseudo-Random Generation Algorithm)
   * @returns A single pseudo-random byte (0-255)
   */
  getByte(): number {
    // Update x index (always in 0-255 range due to modulo)
    this.x = (this.x + 1) % 256;

    // Update y index based on state value
    const stateX = this.state[this.x];
    if (stateX === undefined) {
      throw new Error('Unexpected undefined value at index x');
    }
    this.y = (this.y + stateX) % 256;

    // Swap state[x] and state[y]
    const tempX = this.state[this.x];
    const tempY = this.state[this.y];
    if (tempX === undefined || tempY === undefined) {
      throw new Error('Unexpected undefined value during swap');
    }
    this.state[this.x] = tempY;
    this.state[this.y] = tempX;

    // Calculate output index (always in 0-255 range due to modulo)
    const idx = (tempX + tempY) % 256;
    const result = this.state[idx];
    if (result === undefined) {
      throw new Error('Unexpected undefined value in result');
    }
    return result;
  }

  /**
   * Encrypt/decrypt data
   * RC4 is symmetric, so the same operation is used for both encryption and decryption
   * @param data - String or byte array to encrypt/decrypt
   * @returns Encrypted/decrypted data as byte array
   */
  crypt(data: string | Uint8Array): Uint8Array {
    if ((typeof data !== 'string' && data.length === 0) || (typeof data === 'string' && data.length === 0)) {
      throw new Error('Data cannot be empty');
    }

    // Convert string to Uint8Array
    const input = typeof data === 'string' ? new TextEncoder().encode(data) : data;

    // Create output buffer
    const output = new Uint8Array(input.length);

    // XOR operation on each byte
    for (let i = 0; i < input.length; i++) {
      const byte = input[i];
      if (byte === undefined) {
        throw new Error('Unexpected undefined value in input');
      }
      output[i] = byte ^ this.getByte();
    }

    return output;
  }
}
