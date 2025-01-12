import { atom, map } from 'nanostores';
import { workbenchStore } from './workbench';
import { PROVIDER_LIST } from '~/utils/constants';
import type { IProviderConfig } from '~/types/model';

export interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  ctrlOrMetaKey?: boolean;
  action: () => void;
}

export interface Shortcuts {
  toggleTerminal: Shortcut;
}

export const URL_CONFIGURABLE_PROVIDERS = ['Ollama', 'LMStudio', 'OpenAILike', 'onDemand'];
export const LOCAL_PROVIDERS = ['OpenAILike', 'LMStudio', 'Ollama'];

export type ProviderSetting = Record<string, IProviderConfig>;

export const shortcutsStore = map<Shortcuts>({
  toggleTerminal: {
    key: 'j',
    ctrlOrMetaKey: true,
    action: () => workbenchStore.toggleTerminal(),
  },
});

const initialProviderSettings: ProviderSetting = {};
PROVIDER_LIST.forEach((provider) => {
  initialProviderSettings[provider.name] = {
    ...provider,
    settings: {
      enabled: true,
    },
  };
});
initialProviderSettings['onDemand'] = {
  name: 'onDemand',
  staticModels: [
      {
        name: 'predefined-openai-gpt4o',
        label: 'GPT-4o',
        provider: 'onDemand',
        maxTokenAllowed: 2048,
      },
      {
        name: 'predefined-openai-gpt4turbo',
        label: 'GPT-4',
        provider: 'onDemand',
         maxTokenAllowed: 2048,
      },
      {
        name: 'predefined-openai-gpt3.5turbo',
        label: 'GPT-3.5',
        provider: 'onDemand',
         maxTokenAllowed: 2048,
      },
      {
        name: 'predefined-gemini-1.5-pro',
        label: 'Gemini Pro 1.5',
        provider: 'onDemand',
         maxTokenAllowed: 2048,
      },
       {
        name: 'predefined-gemini-1.5-flash',
        label: 'Gemini Flash 1.5',
        provider: 'onDemand',
         maxTokenAllowed: 2048,
      },
      {
        name: 'predefined-airev-jais-70b',
        label: 'JAIS (Arabic)',
        provider: 'onDemand',
         maxTokenAllowed: 2048,
      },
    ],
  settings: {
    enabled: false,
    baseUrl: '',
    staticModels: [
      {
        name: 'predefined-openai-gpt4o',
        label: 'GPT-4o',
        provider: 'onDemand',
        maxTokenAllowed: 2048,
      },
      {
        name: 'predefined-openai-gpt4turbo',
        label: 'GPT-4',
        provider: 'onDemand',
         maxTokenAllowed: 2048,
      },
      {
        name: 'predefined-openai-gpt3.5turbo',
        label: 'GPT-3.5',
        provider: 'onDemand',
         maxTokenAllowed: 2048,
      },
      {
        name: 'predefined-gemini-1.5-pro',
        label: 'Gemini Pro 1.5',
        provider: 'onDemand',
         maxTokenAllowed: 2048,
      },
       {
        name: 'predefined-gemini-1.5-flash',
        label: 'Gemini Flash 1.5',
        provider: 'onDemand',
         maxTokenAllowed: 2048,
      },
      {
        name: 'predefined-airev-jais-70b',
        label: 'JAIS (Arabic)',
        provider: 'onDemand',
         maxTokenAllowed: 2048,
      },
    ],
  },
};

//TODO: need to create one single map for all these flags

export const providersStore = map<ProviderSetting>(initialProviderSettings);

export const isDebugMode = atom(false);

export const isEventLogsEnabled = atom(false);

export const isLocalModelsEnabled = atom(true);

export const promptStore = atom<string>('default');

export const latestBranchStore = atom(false);

export const autoSelectStarterTemplate = atom(false);
export const enableContextOptimizationStore = atom(false);
