import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import * as kv from '../../src/supabase/functions/server/kv_store';

const app = new Hono();
app.use('*', cors({ origin: '*' }));

// GET submission by ID
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const submission = await kv.get(`submission_${id}`);

    if (!submission) return c.json({ error: 'Submission not found' }, 404);
    return c.json({ submission });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Convert Netlify HandlerEvent → Request
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const request = new Request(
    `https://${event.headers.host}${event.path}`,
    {
      method: event.httpMethod,
      headers: event.headers as HeadersInit,
      body: event.body && !event.isBase64Encoded ? event.body : event.body ? atob(event.body) : undefined,
    }
  );
  const response = await app.fetch(request);
  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.text(),
  };
};
