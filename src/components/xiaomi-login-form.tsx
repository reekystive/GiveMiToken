import { create2FaWindow } from '@/ipc/create-2fa-window.ts';
import { TwoFactorAuthData } from '@/ipc/listen-events.ts';
import { cn } from '@/utils/cn';
import { XiaomiAuth } from '@/xiaomi/xiaomi-auth';
import { Button, Field, Input, Text, Title2 } from '@fluentui/react-components';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { FC, useMemo, useState } from 'react';

export const XiaomiLoginForm: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFaInProgress, setTwoFaInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const xiaomiAuth = useMemo(() => new XiaomiAuth(), []);

  const handleStartTwoFa = () => {
    setTwoFaInProgress(true);
  };

  const handleEndTwoFa = () => {
    setTwoFaInProgress(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleStartTwoFa();
    getCurrentWindow();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const ok = await xiaomiAuth.login({
        loginData: { username, password },
        onTwoFactorAuth: async ({ notificationUrl }, onTwoFactorAuth) => {
          handleStartTwoFa();
          getCurrentWindow();

          const cookies = await new Promise<TwoFactorAuthData>((resolve) => {
            void create2FaWindow({
              url: notificationUrl,
              onClose: () => {
                handleEndTwoFa();
                setLoading(false);
              },
              onGotCookie: (data) => {
                handleEndTwoFa();
                setLoading(false);
                resolve(data);
              },
            });
          });

          void onTwoFactorAuth(cookies);
        },
      });
      if (ok) {
        setSuccess('Login successful!');
      } else {
        setError('Login failed.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* {twoFaInProgress && <div className="fixed inset-0 z-50 bg-black/50" />} */}
      {twoFaInProgress && null}
      <div className={cn('flex w-full max-w-md flex-col items-stretch justify-center gap-2')}>
        <Title2 className="text-center">Xiaomi Account Login</Title2>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
        >
          <Field label="Username">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Xiaomi username"
              required
              disabled={loading}
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </Field>
          <Button type="submit" appearance="primary" disabled={loading}>
            Login
          </Button>
        </form>
        {error && (
          <Text weight="semibold" size={400} className="mt-4 text-red-600">
            {error}
          </Text>
        )}
        {success && (
          <Text weight="semibold" size={400} className="mt-4 text-green-600">
            {success}
          </Text>
        )}
      </div>
    </>
  );
};
