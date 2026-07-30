import express, { Request, Response } from 'express';
import { LeadService } from './services/leadService';
import { DMEventPayload } from './types/lead.types';

const app = express();
app.use(express.json());

const leadService = new LeadService();

// 1. Webhook for Instagram DM & Lead Engine Integration
app.post('/api/v1/leads/dm-webhook', async (req: Request, res: Response) => {
  try {
    const payload: DMEventPayload = req.body;
    if (!payload.sender_id) {
      return res.status(400).json({ error: 'sender_id é obrigatório' });
    }

    // Default simulation or real DM processing
    const isFollowing = payload.button_payload === 'unlock_material' || true;
    const shortUrl = payload.message_text ? await leadService.generateSecureDMUrl(payload.message_text, payload.post_id) : undefined;

    const lead = await leadService.upsertLead({
      instagram_user_id: payload.sender_id,
      instagram_handle: payload.sender_handle || `@user_${payload.sender_id.substring(0, 6)}`,
      source_post_id: payload.post_id,
      is_following: isFollowing,
      status: isFollowing ? 'delivered' : 'pending',
      delivered_url: shortUrl
    });

    res.json({ success: true, lead, secure_delivery_url: shortUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET all captured leads
app.get('/api/v1/leads', async (req: Request, res: Response) => {
  try {
    const leads = await leadService.getLeads();
    res.json(leads);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET Lead Engine Statistics
app.get('/api/v1/leads/stats', async (req: Request, res: Response) => {
  try {
    const stats = await leadService.getLeadStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 9879;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TypeScript Lead Engine running on port ${PORT}`);
});
