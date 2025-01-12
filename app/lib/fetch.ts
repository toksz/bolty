type CommonRequest = Omit<RequestInit, 'body'> & { body?: URLSearchParams | string };

export async function request(url: string, init?: CommonRequest) {
  if (import.meta.env.DEV) {
    const nodeFetch = await import('node-fetch');
    const https = await import('node:https');

    const agent = url.startsWith('https') ? new https.Agent({ rejectUnauthorized: false }) : undefined;

    return nodeFetch.default(url, { ...init, agent });
  }

  const fetchInit = { ...init } as RequestInit;
  if (typeof fetchInit.body === 'string') {
    fetchInit.body = fetchInit.body;
  } else if (fetchInit.body && !(fetchInit.body instanceof URLSearchParams)) {
    fetchInit.body = JSON.stringify(fetchInit.body);
  }
  return fetch(url, fetchInit);
}
