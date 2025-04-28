import { generateRandomHexString, generateRandomNumberString } from './random.ts';

export const getMemorizedClientId = () => {
  const memorized = localStorage.getItem('client_id');
  if (memorized) {
    return memorized;
  }
  const clientId = generateRandomHexString(16).toUpperCase();
  localStorage.setItem('client_id', clientId);
  return clientId;
};

const generateRandomMijiaUaId = () => {
  const partA = generateRandomHexString(40).toUpperCase();
  const partB = generateRandomNumberString(10);
  const partC = getMemorizedClientId();
  return `${partA}-${partB}-${partC}`;
};

export const getMemorizedMijiaUaId = () => {
  const memorized = localStorage.getItem('mijia_ua_id');
  if (memorized) {
    return memorized;
  }
  const uaId = generateRandomMijiaUaId();
  localStorage.setItem('mijia_ua_id', uaId);
  return uaId;
};

export const getMemorizedWebviewUaId = () => {
  const memorized = localStorage.getItem('webview_ua_id');
  if (memorized) {
    return memorized;
  }
  const uaId = generateRandomHexString(6).toUpperCase();
  localStorage.setItem('webview_ua_id', uaId);
  return uaId;
};
