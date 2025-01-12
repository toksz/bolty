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
    let eventIndex = 0;
    return new ReadableStream({
      start(controller: ReadableStreamController<Uint8Array>) {
        const reader = (response.body as ReadableStream<Uint8Array>).getReader();
        function push() {
          reader.read().then(({ done, value }: ReadableStreamReadResult<Uint8Array>) => {
            if (done) {
              controller.close();
              return;
            }
            const textDecoder = new TextDecoder();
            const chunk = textDecoder.decode(value);
            const lines = chunk.split('\n').filter(Boolean);
            for (const line of lines) {
              if (line.startsWith('data:')) {
                try {
                  const data = JSON.parse(line.substring(5));
                   if (data.eventIndex !== undefined && data.eventIndex !== eventIndex) {
                    console.error('Stream event out of order', { expected: eventIndex, received: data.eventIndex });
                    controller.error('Stream event out of order');
                    reader.cancel();
                    return;
                  }
                  eventIndex++;
                  if (data.type === 'fulfillment') {
                    const textEncoder = new TextEncoder();
                    controller.enqueue(textEncoder.encode(data.data.answer));
                  } else if (data.type === 'statusLog') {
                    console.log('statusLog', data.data);
                  } else {
                    console.warn('Unknown event type', data);
                  }
                } catch (error: any) {
                  console.error('Error parsing stream data', error, line);
                  controller.error(error);
                  reader.cancel();
                  return;
                }
              } else if (line.startsWith('error:')) {
                console.error('SSE error', line);
                controller.error(line);
                reader.cancel();
                return;
              }
            }
            push();
          }).catch((error: any) => {
            console.error('Error reading stream', error);
            controller.error(error);
            reader.cancel();
          });
        }
        push();
      },
    });
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
