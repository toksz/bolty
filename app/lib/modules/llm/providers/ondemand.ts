import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { LanguageModelV1 } from 'ai';
import type { IProviderSetting } from '~/types/model';
import { createClient } from '@ai-sdk/core';

export default class OnDemandProvider extends BaseProvider {
  name = 'OnDemand';
  getApiKeyLink = 'https://api.on-demand.io/';
  config = {
    apiTokenKey: 'ONDEMAND_API_KEY',
    baseUrlKey: 'ONDEMAND_API_BASE_URL',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'predefined-openai-gpt4o',
      label: 'GPT-4o',
      provider: 'OnDemand',
      maxTokenAllowed: 4096,
    },
    {
      name: 'predefined-openai-gpt3.5turbo',
      label: 'GPT-3.5',
      provider: 'OnDemand',
      maxTokenAllowed: 4096,
    },
    {
      name: 'predefined-gemini-1.5-pro',
      label: 'Gemini Pro 1.5',
      provider: 'OnDemand',
      maxTokenAllowed: 4096,
    },
    {
      name: 'predefined-gemini-1.5-flash',
      label: 'Gemini Flash 1.5',
      provider: 'OnDemand',
      maxTokenAllowed: 4096,
    }
  ];

  getModelInstance(options: {
    model: string;
    serverEnv: any;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;
    const { apiKey, baseUrl } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: 'ONDEMAND_API_BASE_URL',
      defaultApiTokenKey: 'ONDEMAND_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    return createClient({
      baseURL: baseUrl || 'https://api.on-demand.io',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json',
      },
      endpoints: {
        createChatCompletion: {
          url: '/chat/v1/sessions/{sessionId}/query',
          method: 'POST',
          request: {
            query: '{prompt}',
            endpointId: model,
            responseMode: 'stream'
          },
          response: {
            content: 'data.answer',
          },
        },
        createSession: {
          url: '/chat/v1/sessions',
          method: 'POST',
          request: {
            pluginIds: [],
            externalUserId: '{userId}'
          },
          response: {
            sessionId: 'data.sessionId'
          }
        }
      }
    });
  }
}