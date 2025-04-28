import reactLogo from '@/assets/react.svg';
import { Text, Title2 } from '@fluentui/react-components';
import { FC } from 'react';

export const TauriTab: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Title2>Tauri</Title2>
      <div className="my-8 flex justify-center gap-8">
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
    </div>
  );
};
