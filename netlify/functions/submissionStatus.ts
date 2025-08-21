import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import * as kv from '../../src/supabase/functions/server/kv_store';

interface Submission {
  id: string;
  tarikh: string;
  bahagian: string;
  namaProjek: string;
  tujuanProjek: string;
  websiteUrl?: string;
  kutipanData: string;
  namaPengawai: string;
  email: string;
  catatan?: string;
  status: string;
  submittedAt: string;
  updatedAt: string;
}

const app = new Hono();
app.use('*', cors({ origin: '*' }));

app.put('/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();

    if (!status) return c.json({ error: 'Status is required' }, 400);

    const submissionKey = `submission_${id}`;
    const submission = (await kv.get(submissionKey)) as Submission | null;

    if (!submission) return c.json({ error: 'Submission not found' }, 404);

    const updated: Submission = { ...submission, status, updatedAt: new Date().toISOString() };
    await kv.set(submissionKey, updated);

    return c.json({ success: true, submission: updated });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Netlify handler
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
