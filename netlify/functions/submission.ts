import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import * as kv from '../../src/supabase/functions/server/kv_store';

const app = new Hono();
app.use('*', cors({ origin: '*' }));

// POST: Create submission
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { tarikh, bahagian, namaProjek, tujuanProjek, websiteUrl, kutipanData, namaPengawai, email, catatan, status = 'Pending' } = body;

    if (!tarikh || !bahagian || !namaProjek || !tujuanProjek || !kutipanData || !namaPengawai || !email) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const submission = {
      id: Date.now().toString(),
      tarikh,
      bahagian,
      namaProjek,
      tujuanProjek,
      websiteUrl: websiteUrl || '',
      kutipanData,
      namaPengawai,
      email,
      catatan: catatan || '',
      status,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`submission_${submission.id}`, submission);

    const emailKey = `email_${email.toLowerCase()}`;
    const existingIds = await kv.get(emailKey) || [];
    await kv.set(emailKey, [...existingIds, submission.id]);

    return c.json({ success: true, submission });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// GET: Fetch all submissions
app.get('/', async (c) => {
  try {
    const submissions = await kv.getByPrefix('submission_');
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return c.json({ submissions });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Convert Netlify HandlerEvent to Request
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
