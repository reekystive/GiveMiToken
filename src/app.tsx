import { FluentProvider, Tab, TabList, teamsDarkTheme, teamsLightTheme, Title1 } from '@fluentui/react-components';
import { FC, useState } from 'react';
import { TabContent, TabValue } from './components/tab-content.tsx';
import { useMediaQuery } from './hooks/use-media-query';

export const App: FC = () => {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [selectedTab, setSelectedTab] = useState<TabValue>('tauri');

  return (
    <FluentProvider theme={isDarkMode ? teamsDarkTheme : teamsLightTheme}>
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-start overflow-x-clip overscroll-x-none p-8">
        <Title1>Welcome to Tauri + React + Fluent UI</Title1>

        <TabList
          className="my-5"
          selectedValue={selectedTab}
          onTabSelect={(_, data) => setSelectedTab(data.value as TabValue)}
        >
          <Tab value="tauri">Tauri</Tab>
          <Tab value="react">React</Tab>
          <Tab value="fluent">Fluent UI</Tab>
          <Tab value="greeting">Greeting</Tab>
          <Tab value="login">Login</Tab>
        </TabList>

        <TabContent selectedTab={selectedTab} />
      </div>
    </FluentProvider>
  );
};
