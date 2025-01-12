import { BaseProvider } from '../base-provider';
import type { ModelInfo } from '../types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from '../types';

export default class OnDemandProvider extends BaseProvider {
  name = 'onDemand';
  get config() {
    return {
      baseUrlKey: undefined,
      apiTokenKey: undefined,
    };
  }
  constructor() {
    super();
  }

  getModelInstance({ model }: { model: string }): LanguageModelV1 {
    return {
      modelId: model,
      provider: 'onDemand',
      specificationVersion: 'v1',
      defaultObjectGenerationMode: 'chat' as any,
      doGenerate: async () => {
        return {
          text: 'This is a test response from onDemand',
          finishReason: 'stop' as const,
          usage: {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
          },
          rawCall: {
            rawPrompt: undefined,
            rawSettings: {},
          },
        }
      },
      doStream: async () => {
        throw new Error('Streaming not implemented');
      },
    };
  }

  get staticModels(): ModelInfo[] {
    return [
      {
        name: 'predefined-openai-gpt4o',
        label: 'GPT-4o',
        provider: 'onDemand',
        maxTokenAllowed: 128000,
      },
      {
        name: 'predefined-openai-gpt4turbo',
        label: 'GPT-4',
        provider: 'onDemand',
         maxTokenAllowed: 128000,
      },
      {
        name: 'predefined-openai-gpt3.5turbo',
        label: 'GPT-3.5',
        provider: 'onDemand',
         maxTokenAllowed: 16385,
      },
      {
        name: 'predefined-gemini-1.5-pro',
        label: 'Gemini Pro 1.5',
        provider: 'onDemand',
         maxTokenAllowed: 1000000,
      },
      {
        name: 'predefined-gemini-1.5-flash',
        label: 'Gemini Flash 1.5',
        provider: 'onDemand',
         maxTokenAllowed: 1000000,
      },
       {
        name: 'predefined-airev-jais-70b',
        label: 'JAIS (Arabic)',
         provider: 'onDemand',
         maxTokenAllowed: 8192,
      },
    ];
  }
}
