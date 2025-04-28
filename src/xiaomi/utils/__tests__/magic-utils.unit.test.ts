import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getMemorizedMijiaUaId, getMemorizedWebviewUaId } from '../magic-utils';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    },
  };
})();

// Mock crypto.getRandomValues
vi.stubGlobal('crypto', {
  getRandomValues: (array: Uint8Array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = i % 256;
    }
    return array;
  },
});

describe('Magic Utils', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    localStorageMock.clear();
    vi.clearAllMocks(); // Reset mock call history before each test
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getMemorizedMijiaUaId', () => {
    it('should generate and store Mijia UA ID if not in localStorage', () => {
      const uaId = getMemorizedMijiaUaId();

      // Check if localStorage.getItem was called
      expect(localStorageMock.getItem).toHaveBeenCalledWith('mijia_ua_id');

      // Check if localStorage.setItem was called to store the newly generated ID
      expect(localStorageMock.setItem).toHaveBeenCalledWith('mijia_ua_id', uaId);

      // Check the format of the UA ID
      expect(uaId).toMatch(/^[A-F0-9]+-\d+-[A-F0-9]+$/);
    });

    it('should return existing Mijia UA ID from localStorage', () => {
      const existingUaId = 'ABCDEF-1234567890-ABCDEF';
      localStorageMock.setItem('mijia_ua_id', existingUaId);
      vi.clearAllMocks(); // Clear mock history after setting up initial state

      const uaId = getMemorizedMijiaUaId();

      expect(uaId).toBe(existingUaId);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('mijia_ua_id');
      // localStorage.setItem should not be called since ID already exists
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('getMemorizedWebviewUaId', () => {
    it('should generate and store Webview UA ID if not in localStorage', () => {
      const uaId = getMemorizedWebviewUaId();

      // Check if localStorage.getItem was called
      expect(localStorageMock.getItem).toHaveBeenCalledWith('webview_ua_id');

      // Check if localStorage.setItem was called to store the newly generated ID
      expect(localStorageMock.setItem).toHaveBeenCalledWith('webview_ua_id', uaId);

      // Check the format of the UA ID (should be 6 uppercase hexadecimal characters)
      expect(uaId).toMatch(/^[A-F0-9]{6}$/);
    });

    it('should return existing Webview UA ID from localStorage', () => {
      const existingUaId = 'ABCDEF';
      localStorageMock.setItem('webview_ua_id', existingUaId);
      vi.clearAllMocks(); // Clear mock history after setting up initial state

      const uaId = getMemorizedWebviewUaId();

      expect(uaId).toBe(existingUaId);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('webview_ua_id');
      // localStorage.setItem should not be called since ID already exists
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });
});
