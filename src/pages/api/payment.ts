import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { payment_method, amount } = req.body;

      if (!payment_method || !amount) {
        return res
          .status(400)
          .json({ error: 'Payment method and amount are required' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount, // 金額は最小単位で指定（例: 1000 = 10.00 USD）
        currency: 'usd',
        payment_method,
        confirm: true,
        automatic_payment_methods: { enabled: true }, // これによりリダイレクトが不要になる場合がある
        // もしリダイレクトが必要なら、下の行をコメントアウト
        return_url: `${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/confirmation`,
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
