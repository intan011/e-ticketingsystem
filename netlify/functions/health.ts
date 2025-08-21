import { Handler, HandlerResponse, HandlerEvent } from '@netlify/functions';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Apply CORS globally
app.use('*', cors({ origin: '*' }));

// Health check route
app.get('/', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Netlify Function handler
export const handler: Handler = async (event: HandlerEvent, context): Promise<HandlerResponse> => {
  // Convert Netlify HandlerEvent to Request
  const request = new Request(`https://example.com${event.path}`, {
    method: event.httpMethod,
    headers: event.headers as HeadersInit,
    body: event.body ? (event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body) : null,
  });

  const response = await app.fetch(request, context);

  const body = await response.text(); // Convert Response body to string

  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body,
  };
};
