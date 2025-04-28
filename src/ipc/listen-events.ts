import { TWO_FA_WINDOW } from '@/constants/win-labels.ts';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Cookie } from 'tough-cookie';
import { z } from 'zod';

export interface TwoFactorAuthData {
  serviceToken: string;
  userId: string;
  cUserId: string;
}

export const listen2FaWindowGotCookie = async (onData: (data: TwoFactorAuthData) => void) => {
  const window = await WebviewWindow.getByLabel(TWO_FA_WINDOW);
  const unlisten = await window?.listen('got-cookie', (event) => {
    const payload = event.payload as { cookie: string };
    const cookieString = payload.cookie;
    const cookies = cookieString.split(';').map((cookie) => {
      return Cookie.parse(cookie);
    });
    const cookieData: Partial<TwoFactorAuthData> = {};
    cookies.forEach((cookie) => {
      if (!cookie?.key || !cookie.value) return;
      cookieData[cookie.key as keyof TwoFactorAuthData] = cookie.value;
    });
    const parsed = z
      .object({
        serviceToken: z.string(),
        userId: z.string(),
        cUserId: z.string(),
      })
      .parse(cookieData);
    onData(parsed);
  });
  return unlisten ?? (() => undefined);
};

export const listen2FaWindowWaitingForLogin = async (onData: (data: { currentUrl: string }) => void) => {
  const window = await WebviewWindow.getByLabel(TWO_FA_WINDOW);
  const unlisten = await window?.listen('waiting-for-login', (event) => {
    onData(event.payload as { currentUrl: string });
  });
  return unlisten ?? (() => undefined);
};
