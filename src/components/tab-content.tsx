import { FC } from 'react';
import { FluentTab } from './tabs/fluent-tab';
import { GreetingTab } from './tabs/greeting-tab';
import { ReactTab } from './tabs/react-tab';
import { TauriTab } from './tabs/tauri-tab';
import { XiaomiLoginForm } from './xiaomi-login-form.tsx';

export type TabValue = 'tauri' | 'react' | 'fluent' | 'greeting' | 'login';

interface TabContentProps {
  selectedTab: TabValue;
}

export const TabContent: FC<TabContentProps> = ({ selectedTab }) => {
  switch (selectedTab) {
    case 'tauri':
      return <TauriTab />;
    case 'react':
      return <ReactTab />;
    case 'fluent':
      return <FluentTab />;
    case 'greeting':
      return <GreetingTab />;
    case 'login':
      return <XiaomiLoginForm />;
    default:
      return null;
  }
};
