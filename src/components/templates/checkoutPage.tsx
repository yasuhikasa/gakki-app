import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/templates/checkoutForm';
import styles from '@/styles/pages/checkout.module.css';

// Stripe 公開キーを使用してインスタンスを作成
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>決済ページ</h2>
      {/* ElementsコンポーネントでCheckoutFormをラップ */}
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default CheckoutPage;
