import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { payment_method } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // 1000 = 10.00 USD, 金額を動的に変更できます
        currency: 'usd',
        payment_method,
      });

      res.status(200).json({ paymentIntent });
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        // Stripeのエラー処理
        res.status(400).json({ error: error.message });
      } else {
        // その他のエラー処理
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}