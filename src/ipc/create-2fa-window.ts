import evalCookieCode from '@/assets/eval-cookie.mjs.txt';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { evalJs } from './commands.ts';
import { listen2FaWindowGotCookie, listen2FaWindowWaitingForLogin, TwoFactorAuthData } from './listen-events.ts';

export const create2FaWindow = ({
  url,
  onClose,
  onGotCookie,
}: {
  url: string;
  onClose?: () => void;
  onGotCookie?: (data: TwoFactorAuthData) => void;
}) => {
  let windowCreationTimeout: number | null = null;
  let unlistenWaitingForLoginPromise: Promise<() => void> = Promise.resolve(() => undefined);
  let unlistenGotCookiePromise: Promise<() => void> = Promise.resolve(() => undefined);

  return new Promise((resolve, reject) => {
    const child = new WebviewWindow('2fa', {
      url,
      title: 'Two Factor Authentication',
      width: 600,
      height: 600,
      minWidth: 600,
      minHeight: 600,
      parent: getCurrentWindow(),
    });
    let interval: number | null = null;

    void child.once('tauri://webview-created', () => {
      if (windowCreationTimeout) {
        window.clearTimeout(windowCreationTimeout);
      }

      interval = window.setInterval(() => {
        evalJs({ winLabel: '2fa', code: evalCookieCode });
      }, 200);

      unlistenWaitingForLoginPromise = listen2FaWindowWaitingForLogin((data) => {
        console.log('[%o] waiting-for-login', new Date().toISOString(), data);
      });

      if (onGotCookie) {
        unlistenGotCookiePromise = listen2FaWindowGotCookie((data) => {
          console.log('[%o] got-cookie', new Date().toISOString(), data);
          onGotCookie(data);
          void child.close();
        });
      }

      resolve(child);
    });

    void child.once('tauri://destroyed', () => {
      onClose?.();
      if (interval) {
        window.clearInterval(interval);
      }

      if (windowCreationTimeout) {
        window.clearTimeout(windowCreationTimeout);
      }

      void unlistenWaitingForLoginPromise.then((unlisten) => unlisten());
      void unlistenGotCookiePromise.then((unlisten) => unlisten());
    });

    windowCreationTimeout = window.setTimeout(() => {
      reject(new Error('Timeout'));
      if (interval) {
        window.clearInterval(interval);
      }
    }, 10000);
  });
};
