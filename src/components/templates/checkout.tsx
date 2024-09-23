import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useCart } from '@/context/cartContext'; // カート情報を取得
import { useAuth } from '@/context/authContext'; // ユーザー認証情報を取得
import { db } from '@/libs/firebase'; // Firestoreのインポート
import { doc, getDoc } from 'firebase/firestore';
import styles from '@/styles/pages/checkout.module.css';
import ButtonComponent from '@/components/parts/button';

// Stripe公開キーを使用してインスタンスを作成
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { totalAmount } = useCart(); // カート情報と合計金額を取得
  const { user } = useAuth(); // ユーザー認証情報を取得
  const [address, setAddress] = useState({
    addressLine: '',
    city: '',
    prefecture: '',
    postalCode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  // Firestoreから住所情報を取得
  useEffect(() => {
    const fetchUserAddress = async () => {
      if (user) {
        try {
          const userDoc = doc(db, 'users', user.uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setAddress({
              addressLine: userData.addressLine,
              city: userData.city,
              prefecture: userData.prefecture,
              postalCode: userData.postalCode,
            });
          }
        } catch (error) {
          console.error('Error fetching user address:', error);
        }
      }
    };

    fetchUserAddress();
  }, [user]);

  const handleCardPayment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    if (!window.confirm("決済を確定してもよろしいですか？")) {
      return; // ユーザーがキャンセルを選択した場合、処理を中止
    }

    setIsProcessing(true);

    try {
      // 支払いIntentを作成するため、バックエンドAPIを呼び出す
      const { data } = await axios.post('/api/payment', {
        amount: totalAmount, // 支払い金額を送信
      });

      const { clientSecret } = data;

      // Stripeを使って支払いを確認する
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message || '支払いに失敗しました');
        setIsProcessing(false);
      } else if (result.paymentIntent?.status === 'succeeded') {
        setPaymentSucceeded(true);
        setIsProcessing(false);
        // 確認ページへ遷移
        window.location.href = '/confirmation';
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('支払い処理中に不明なエラーが発生しました');
      }
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleCardPayment} className={styles.form}>
      <h3>クレジットカードで支払う</h3>
      <p className={styles.totalAmount}>合計金額: {totalAmount}円</p> {/* 合計金額を表示 */}

      {/* 配送先情報 */}
      <div className={styles.address}>
        <p>配送先:〒{address.postalCode} {address.prefecture} {address.city} {address.addressLine} </p>
      </div>

      <div className={styles.cardElementWrapper}>
        <CardElement className={styles.cardElement} />
      </div>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      {paymentSucceeded && <p className={styles.successMessage}>支払いが成功しました！</p>}

      <ButtonComponent
        label={isProcessing ? '処理中...' : '支払いを確定'}
        width="100%"
        height="50px"
        disabled={isProcessing}
      />
    </form>
  );
};

const CheckoutPage = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>決済ページ</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default CheckoutPage;
