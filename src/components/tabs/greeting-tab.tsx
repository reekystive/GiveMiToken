import { Button, Field, Input, Text, Title2 } from '@fluentui/react-components';
import { invoke } from '@tauri-apps/api/core';
import { FC, useState } from 'react';

export const GreetingTab: FC = () => {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  async function greet() {
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <div className="flex w-full max-w-md flex-col items-stretch justify-center gap-2">
      <Title2 className="text-center">Greeting</Title2>

      <form
        className="flex flex-col gap-3"
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
        <Text weight="semibold" size={400} className="mt-4">
          {greetMsg}
        </Text>
      )}
    </div>
  );
};
