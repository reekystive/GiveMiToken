import { AppWinLabel } from '@/constants/win-labels.ts';
import { invoke } from '@tauri-apps/api/core';

interface EvalJsParams {
  winLabel: AppWinLabel;
  code: string;
}

export const evalJs = (params: EvalJsParams) => {
  void invoke('eval_js', {
    ...params,
  });
};

export const greet = async (params: { name: string }): Promise<string> => {
  return await invoke('greet', {
    ...params,
  });
};
