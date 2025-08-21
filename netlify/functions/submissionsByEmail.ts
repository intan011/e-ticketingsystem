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

app.get('/:email', async (c) => {
  try {
    const email = c.req.param('email').toLowerCase();
    const ids = (await kv.get(`email_${email}`)) as string[] || [];
    const submissions: Submission[] = [];

    for (const id of ids) {
      const submission = await kv.get(`submission_${id}`) as Submission | null;
      if (submission) submissions.push(submission);
    }

    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return c.json({ submissions });
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
