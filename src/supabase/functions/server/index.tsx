// index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as kv from './kv_store';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Create a new submission
app.post('/make-server-764b8bb4/submissions', async (req, res) => {
  try {
    const { tarikh, bahagian, namaProjek, tujuanProjek, websiteUrl, kutipanData, namaPengawai, email, catatan, status = 'Pending' } = req.body;

    if (!tarikh || !bahagian || !namaProjek || !tujuanProjek || !kutipanData || !namaPengawai || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
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
      updatedAt: new Date().toISOString()
    };

    await kv.set(`submission_${submission.id}`, submission);

    const emailKey = `email_${email.toLowerCase()}`;
    const existingIds = await kv.get(emailKey) || [];
    await kv.set(emailKey, [...existingIds, submission.id]);

    console.log('Submission created successfully:', submission.id);
    res.json({ success: true, submission });
  } catch (error: any) {
    console.log('Error creating submission:', error);
    res.status(500).json({ error: 'Failed to create submission', details: error.message });
  }
});

// Get all submissions
app.get('/make-server-764b8bb4/submissions', async (req, res) => {
  try {
    const submissions = await kv.getByPrefix('submission_');
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    res.json({ submissions });
  } catch (error: any) {
    console.log('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions', details: error.message });
  }
});

// Health check
app.get('/make-server-764b8bb4/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
