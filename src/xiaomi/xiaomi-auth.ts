import { TwoFactorAuthData } from '@/ipc/listen-events.ts';
import { fetch } from '@tauri-apps/plugin-http';
import { Cookie, CookieJar } from 'tough-cookie';
import { z } from 'zod';
import { hashPassword } from './utils/crypto-utils';
import { MIJIA_CLIENT_ID, MIJIA_WEBVIEW_UA } from './utils/magic-values';

export interface loginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  ssecurity?: string;
  userId?: string;
  cUserId?: string;
  passToken?: string;
  location?: string;
  notificationUrl?: string;
}

const COMMON_HEADERS = {
  'Cache-Control': 'no-cache',
};

export class XiaomiAuth {
  static readonly XIAOMI_ACCOUNT_BASE_URL = 'https://account.xiaomi.com';
  static readonly XIAOMI_IO_STS_BASE_URL = 'https://sts.api.io.mi.com';
  static readonly XIAOMI_IO_API_BASE_URL = 'https://api.io.mi.com';
  static readonly XIAOMI_IO_SID = 'xiaomiio';

  private readonly XIAOMI_WEBVIEW_UA = MIJIA_WEBVIEW_UA;
  private readonly XIAOMI_CLIENT_ID = MIJIA_CLIENT_ID;
  private cookieJar: CookieJar = new CookieJar();
  private initPromises: Promise<void>[] = [];

  public userId?: string;
  public cUserId?: string;
  public ssecurity?: string;
  public passToken?: string;
  public serviceToken?: string;

  constructor() {
    const initPromise = this.initCookieJar();
    this.initPromises.push(initPromise);
  }

  private async initCookieJar() {
    const url = new URL(`${XiaomiAuth.XIAOMI_ACCOUNT_BASE_URL}/`);
    await this.cookieJar.setCookie(new Cookie({ key: 'deviceId', value: this.XIAOMI_CLIENT_ID }), url.toString());
    await this.cookieJar.setCookie(new Cookie({ key: 'sdkVersion', value: '4.2.31' }), url.toString());
  }

  private parseResponseAsJson(text: string): unknown {
    if (/^\w*&&&START&&&/.exec(text)) {
      return JSON.parse(text.replace(/^\w*&&&START&&&/, '').trim());
    }
    return null;
  }

  /**
   * Login to Xiaomi account and get service token
   * @returns Whether login was successful
   */
  public async login(params: {
    loginData: loginData;
    onTwoFactorAuth?: (
      data: { notificationUrl: string },
      onGotTwoFactorCookies: (data: TwoFactorAuthData) => void | Promise<void>
    ) => void | Promise<void>;
  }): Promise<boolean> {
    await Promise.all(this.initPromises);

    // Step 1: Get sign and initial cookies
    const step1 = await this.loginStep1();
    if (!step1.sign) {
      throw new Error('Failed to get _sign from Xiaomi login step 1.');
    }

    // Step 2: Authenticate with username and password
    const step2 = await this.loginStep2(params.loginData, step1.sign);
    const step2Location = step2.location;
    if (!step2.ssecurity || !step2.userId || !step2.cUserId || !step2.passToken || !step2Location) {
      if (step2.notificationUrl) {
        const gotTwoFactorCookies = (data: TwoFactorAuthData) => {
          void this.cookieJar.setCookie(
            new Cookie({ key: 'serviceToken', value: data.serviceToken }),
            XiaomiAuth.XIAOMI_IO_STS_BASE_URL
          );
          void this.cookieJar.setCookie(
            new Cookie({ key: 'userId', value: data.userId }),
            XiaomiAuth.XIAOMI_IO_STS_BASE_URL
          );
          void this.cookieJar.setCookie(
            new Cookie({ key: 'cUserId', value: data.cUserId }),
            XiaomiAuth.XIAOMI_IO_STS_BASE_URL
          );
        };
        void params.onTwoFactorAuth?.({ notificationUrl: step2.notificationUrl }, gotTwoFactorCookies);
        return this.login({ loginData: params.loginData });
      }
      if (!step2Location) {
        throw new Error('Failed to login to Xiaomi: missing location.');
      }
    }

    this.ssecurity = step2.ssecurity;
    this.userId = step2.userId;
    this.cUserId = step2.cUserId;
    this.passToken = step2.passToken;

    // Step 3: Get service token
    const serviceToken = await this.loginStep3(step2Location);
    if (!serviceToken) {
      throw new Error('Failed to get serviceToken from Xiaomi.');
    }
    this.serviceToken = serviceToken;
    return true;
  }

  /**
   * Step 1: Get _sign and initial cookies
   */
  private async loginStep1(): Promise<{ sign: string }> {
    const url = new URL(`${XiaomiAuth.XIAOMI_ACCOUNT_BASE_URL}/pass/serviceLogin`);
    url.searchParams.set('sid', XiaomiAuth.XIAOMI_IO_SID);
    url.searchParams.set('_json', 'true');

    const cookieString = await this.cookieJar.getCookieString(url.toString());

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...COMMON_HEADERS,
        'User-Agent': this.XIAOMI_WEBVIEW_UA,
        Cookie: cookieString,
      },
    });

    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      await this.cookieJar.setCookie(setCookieHeader, XiaomiAuth.XIAOMI_ACCOUNT_BASE_URL);
    }

    const text = await response.text();
    const json = this.parseResponseAsJson(text) as { _sign?: string } | null;

    const parsed = z.object({ _sign: z.string() }).safeParse(json);
    if (parsed.error) {
      throw new Error('Failed to get _sign in loginStep1.');
    }
    return { sign: parsed.data._sign };
  }

  /**
   * Step 2: Authenticate with username and password
   */
  private async loginStep2(options: loginData, sign: string): Promise<LoginResponse> {
    const url = new URL(`${XiaomiAuth.XIAOMI_ACCOUNT_BASE_URL}/pass/serviceLoginAuth2`);

    const cookieString = await this.cookieJar.getCookieString(url.toString());

    const hashedPassword = hashPassword(options.password);
    const callbackUrl = new URL(`${XiaomiAuth.XIAOMI_IO_STS_BASE_URL}/sts`);
    const qs = new URLSearchParams({
      sid: XiaomiAuth.XIAOMI_IO_SID,
      _json: 'true',
    });

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        ...COMMON_HEADERS,
        'User-Agent': this.XIAOMI_WEBVIEW_UA,
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieString,
      },
      body: new URLSearchParams({
        _json: 'true',
        hash: hashedPassword,
        sid: XiaomiAuth.XIAOMI_IO_SID,
        callback: callbackUrl.toString(),
        _sign: sign,
        qs: encodeURIComponent('?' + qs.toString()),
        user: options.username,
      })
        .toString()
        .replaceAll('%2F', '/'),
    });

    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      await this.cookieJar.setCookie(setCookieHeader, XiaomiAuth.XIAOMI_ACCOUNT_BASE_URL);
    }

    const text = await response.text();
    const json = this.parseResponseAsJson(text) as LoginResponse | null;
    if (!json) {
      throw new Error('Failed to parse response in loginStep2.');
    }

    return json;
  }

  /**
   * Step 3: Get service token
   */
  private async loginStep3(location: string): Promise<string | null> {
    const url = new URL(location.startsWith('/') ? `${XiaomiAuth.XIAOMI_ACCOUNT_BASE_URL}${location}` : location);

    const cookieString = await this.cookieJar.getCookieString(url.toString());

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': this.XIAOMI_WEBVIEW_UA,
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieString,
      },
    });

    const setCookieHeader = response.headers.get('set-cookie');

    if (setCookieHeader) {
      await this.cookieJar.setCookie(setCookieHeader, XiaomiAuth.XIAOMI_ACCOUNT_BASE_URL);
      const cookies = await this.cookieJar.getCookies(XiaomiAuth.XIAOMI_ACCOUNT_BASE_URL);
      const serviceTokenCookie = cookies.find((c) => c.key === 'serviceToken');
      return serviceTokenCookie?.value ?? null;
    }
    return null;
  }
}
