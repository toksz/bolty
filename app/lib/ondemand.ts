import { request } from './fetch';

export async function onDemandRequest(sessionId: string, apiKey: string, endpointId: string, query: string, responseMode: 'sync' | 'stream' = 'sync') {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      apikey: apiKey,
    },
    body: JSON.stringify({
      responseMode: responseMode,
      query: query,
      endpointId: endpointId,
    }),
  };
  console.log('onDemandRequest options', options);

  console.log('onDemandRequest', { sessionId, apiKey, endpointId, query, responseMode });
  const response = await request(
    `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`,
    options
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('onDemandRequest API Error', response.status, error);
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  console.log('onDemandRequest response', response);

  if (responseMode === 'stream') {
    return response.body;
  }
  const json = await response.json();
  return {
    model: endpointId,
    provider: 'onDemand',
    modelId: endpointId,
    specificationVersion: 'v1',
    defaultObjectGenerationMode: 'chat' as any,
    doGenerate: async () => {
      return {
        text: json.data.answer,
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
  }
}
