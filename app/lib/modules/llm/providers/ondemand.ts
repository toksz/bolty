import { BaseProvider, getOnDemandModel } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';

export default class OnDemandProvider extends BaseProvider {
  name = 'OnDemand';
  getApiKeyLink = undefined;

  config = {
    baseUrlKey: 'OPENAI_LIKE_API_BASE_URL',
    apiTokenKey: 'OPENAI_LIKE_API_KEY',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'predefined-openai-gpt4o',
      label: 'GPT-4o',
      provider: 'OnDemand',
      maxTokenAllowed: 4096,
    },
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
    };
	
  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv: Record<string, string> = {},
  ): Promise<ModelInfo[]> {
    const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: settings,
      serverEnv,
      defaultBaseUrlKey: 'OPENAI_LIKE_API_BASE_URL',
      defaultApiTokenKey: 'OPENAI_LIKE_API_KEY',
    });

    if (!baseUrl || !apiKey) {
      return [];
    }

    const response = await fetch(`${baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const res = (await response.json()) as any;

    return res.data.map((model: any) => ({
      name: model.id,
      label: model.id,
      provider: this.name,
      maxTokenAllowed: 8000,
    }));
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: 'OPENAI_LIKE_API_BASE_URL',
      defaultApiTokenKey: 'OPENAI_LIKE_API_KEY',
    });

    if (!baseUrl || !apiKey) {
      throw new Error(`Missing configuration for ${this.name} provider`);
    }

    return getOnDemandModel(baseUrl, apiKey, model);
  }
}
