/** cspell:disable */

import { getMemorizedClientId, getMemorizedMijiaUaId, getMemorizedWebviewUaId } from './magic-utils.ts';

export const MIJIA_WEBVIEW_UA = `Mozilla/5.0 (iPhone; CPU iPhone OS 18_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/${getMemorizedWebviewUaId()}`;

export const MIJIA_PASSPORT_SDK_UA = 'APP/com.xiaomi.mihome APPV/10.5.201 iosPassportSDK/4.2.31 iOS/18.4.1 miHSTS';

export const MIJIA_APP_UA = `iOS-18.4.1-10.5.201-iPhone14,4--${getMemorizedMijiaUaId()}-iPhone`;

export const MIJIA_CLIENT_ID = getMemorizedClientId();
