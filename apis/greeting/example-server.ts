import { createServer } from 'node:http';

import { createGreetingApi, greetingRequestSchema, greetingResponseSchema, handleGreeting } from '../index';

const server = createServer(async (request, response) => {
  if (request.method !== 'POST' || request.url !== createGreetingApi.path) {
    console.info('[greeting] route not found');
    response.writeHead(404).end('Not found');
    return;
  }

  try {
    let raw = '';

    for await (const chunk of request) {raw += chunk.toString();}

    console.info('[greeting] request received; parsing JSON and validating body');
    const input = greetingRequestSchema.parse(JSON.parse(raw));
    const result = handleGreeting(input);
    const validated = greetingResponseSchema.safeParse(result);

    if (!validated.success) {
      console.error('[greeting] response validation failed; response 500');
      response.writeHead(500).end('Internal server error');
      return;
    }

    console.info('[greeting] valid request; response 200');
    response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(validated.data));
  } catch (error) {
    console.info('[greeting] invalid request; response 400', error instanceof SyntaxError ? 'malformed JSON' : 'schema validation failed');
    response.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Invalid request' }));
  }
});

const port = Number(process.env.PORT ?? 3001);

server.listen(port, () => console.info(`[greeting] listening on http://localhost:${port}`));
