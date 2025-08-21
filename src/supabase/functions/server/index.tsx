import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Create a new submission
app.post('/make-server-764b8bb4/submissions', async (c) => {
  try {
    const body = await c.req.json();
    const { tarikh, bahagian, namaProjek, tujuanProjek, websiteUrl, kutipanData, namaPengawai, email, catatan, status = 'Pending' } = body;

    // Validate required fields
    if (!tarikh || !bahagian || !namaProjek || !tujuanProjek || !kutipanData || !namaPengawai || !email) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create submission object
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
      updatedAt: new Date().toISOString()
    };

    // Store in KV store
    await kv.set(`submission_${submission.id}`, submission);
    
    // Also store in an index for email lookups
    const emailKey = `email_${email.toLowerCase()}`;
    const existingIds = await kv.get(emailKey) || [];
    await kv.set(emailKey, [...existingIds, submission.id]);

    console.log('Submission created successfully:', submission.id);
    return c.json({ success: true, submission });
  } catch (error) {
    console.log('Error creating submission:', error);
    return c.json({ error: 'Failed to create submission', details: error.message }, 500);
  }
});

// Get all submissions
app.get('/make-server-764b8bb4/submissions', async (c) => {
  try {
    const submissionKeys = await kv.getByPrefix('submission_');
    const submissions = submissionKeys.map(item => item.value).sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    
    return c.json({ submissions });
  } catch (error) {
    console.log('Error fetching submissions:', error);
    return c.json({ error: 'Failed to fetch submissions', details: error.message }, 500);
  }
});

// Get submissions by email
app.get('/make-server-764b8bb4/submissions/email/:email', async (c) => {
  try {
    const email = c.req.param('email').toLowerCase();
    const submissionIds = await kv.get(`email_${email}`) || [];
    
    const submissions = [];
    for (const id of submissionIds) {
      const submission = await kv.get(`submission_${id}`);
      if (submission) {
        submissions.push(submission);
      }
    }
    
    // Sort by submission date (newest first)
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    
    return c.json({ submissions });
  } catch (error) {
    console.log('Error fetching submissions by email:', error);
    return c.json({ error: 'Failed to fetch submissions by email', details: error.message }, 500);
  }
});

// Update submission status
app.put('/make-server-764b8bb4/submissions/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    
    if (!status) {
      return c.json({ error: 'Status is required' }, 400);
    }

    const submissionKey = `submission_${id}`;
    const submission = await kv.get(submissionKey);
    
    if (!submission) {
      return c.json({ error: 'Submission not found' }, 404);
    }

    // Update the submission
    const updatedSubmission = {
      ...submission,
      status,
      updatedAt: new Date().toISOString()
    };

    await kv.set(submissionKey, updatedSubmission);
    
    console.log('Submission status updated successfully:', id, status);
    return c.json({ success: true, submission: updatedSubmission });
  } catch (error) {
    console.log('Error updating submission status:', error);
    return c.json({ error: 'Failed to update submission status', details: error.message }, 500);
  }
});

// Get submission by ID
app.get('/make-server-764b8bb4/submissions/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const submission = await kv.get(`submission_${id}`);
    
    if (!submission) {
      return c.json({ error: 'Submission not found' }, 404);
    }
    
    return c.json({ submission });
  } catch (error) {
    console.log('Error fetching submission:', error);
    return c.json({ error: 'Failed to fetch submission', details: error.message }, 500);
  }
});

// Health check endpoint
app.get('/make-server-764b8bb4/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

serve(app.fetch);