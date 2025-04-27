import {
  Button,
  Field,
  FluentProvider,
  Input,
  teamsDarkTheme,
  teamsLightTheme,
  Text,
  Title1,
} from '@fluentui/react-components';
import { invoke } from '@tauri-apps/api/core';
import { FC, useState } from 'react';
import reactLogo from './assets/react.svg';
import { useMediaQuery } from './hooks/use-media-query';

export const App: FC = () => {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <FluentProvider theme={isDarkMode ? teamsDarkTheme : teamsLightTheme}>
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center p-8">
        <Title1>Welcome to Tauri + React + Fluent UI</Title1>

        <div className="my-8 flex justify-center gap-5">
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img
              src="/vite.svg"
              className="transition-filter h-24 duration-300 hover:drop-shadow-[0_0_2em_rgba(100,108,255,0.6)]"
              alt="Vite logo"
            />
          </a>
          <a href="https://tauri.app" target="_blank" rel="noreferrer">
            <img
              src="/tauri.svg"
              className="transition-filter h-24 duration-300 hover:drop-shadow-[0_0_2em_rgba(100,108,255,0.6)]"
              alt="Tauri logo"
            />
          </a>
          <a href="https://reactjs.org" target="_blank" rel="noreferrer">
            <img
              src={reactLogo}
              className="transition-filter h-24 duration-300 hover:drop-shadow-[0_0_2em_rgba(100,108,255,0.6)]"
              alt="React logo"
            />
          </a>
        </div>

        <Text>Click on the Tauri, Vite, and React logos to learn more.</Text>

        <form
          className="my-8 flex w-full max-w-md flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void greet();
          }}
        >
          <Field label="Enter a name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter a name..." />
          </Field>
          <Button type="submit" appearance="primary">
            Greet
          </Button>
        </form>

        {greetMsg && (
          <Text weight="semibold" size={400}>
            {greetMsg}
          </Text>
        )}
      </div>
    </FluentProvider>
  );
};
