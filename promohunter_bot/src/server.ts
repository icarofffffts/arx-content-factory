import express, { Request, Response } from 'express';
import { PromoService } from './services/promoService';

const app = express();
app.use(express.json());

const promoService = new PromoService();

// 1. API: Create & Broadcast New Promotion
app.post('/api/v1/promos/broadcast', async (req: Request, res: Response) => {
  try {
    const { title, original_price, promo_price, store_name, original_url, image_url, telegram_bot_token, telegram_channel_id } = req.body;

    if (!title || !promo_price || !original_url) {
      return res.status(400).json({ error: 'title, promo_price e original_url são obrigatórios!' });
    }

    const offer = await promoService.createOffer({
      title,
      original_price: parseFloat(original_price || promo_price),
      promo_price: parseFloat(promo_price),
      store_name: store_name || 'Loja Parceira',
      original_url,
      image_url
    });

    const copyText = promoService.generateCopy(offer);

    // Telegram Dispatch (if token provided)
    let telegramSent = false;
    if (telegram_bot_token && telegram_channel_id) {
      telegramSent = await promoService.sendTelegram(telegram_bot_token, telegram_channel_id, copyText, offer.image_url);
    }

    res.json({
      success: true,
      offer,
      copy_generated: copyText,
      telegram_sent: telegramSent,
      short_url: offer.short_url
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. API: List all Promotions & Click Metrics
app.get('/api/v1/promos', async (req: Request, res: Response) => {
  try {
    const promos = await promoService.getPromotions();
    res.json(promos);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 9880;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PromoHunter Bot Engine running in TypeScript on port ${PORT}`);
});
