import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useCart } from '@/context/cartContext';
import { useAuth } from '@/context/authContext';
import { db } from '@/libs/firebase'; // Firestoreのインポート
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'; // Firestoreからデータ操作
import styles from '@/styles/pages/checkout.module.css';
import ButtonComponent from '@/components/parts/button';

const CheckoutForm = () => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { totalAmount, cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState({
    addressLine: '',
    city: '',
    prefecture: '',
    postalCode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  // ユーザーの住所を取得
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

  // 支払い処理と注文情報の保存
  const handleCardPayment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    // 注文確定前に確認アラートを表示
    const confirmPayment = window.confirm("本当に注文を確定しますか？");
    if (!confirmPayment) {
      return; // ユーザーがキャンセルを選択した場合、処理を中止
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement!,
      });

      if (error) {
        setErrorMessage(error.message || '支払い方法の作成に失敗しました');
        setIsProcessing(false);
        return;
      }

      const { data } = await axios.post('/api/payment', {
        payment_method: paymentMethod.id,
        amount: totalAmount * 100,
      });

      const { clientSecret } = data;

      const result = await stripe.confirmCardPayment(clientSecret);

      if (result.error) {
        setErrorMessage(result.error.message || '支払いに失敗しました');
        setIsProcessing(false);
      } else if (result.paymentIntent?.status === 'succeeded') {
        // 注文情報をFirestoreに保存する
        await saveOrderToFirestore();
        setPaymentSucceeded(true);
        clearCart();
        setIsProcessing(false);
        router.push('/confirm');
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('支払い処理中に予期しないエラーが発生しました');
      }
      setIsProcessing(false);
    }
  };

  // Firestoreに注文情報を保存する関数
  const saveOrderToFirestore = async () => {
    if (user) {
      try {
        await addDoc(collection(db, 'orders'), {
          userId: user.uid,
          cartItems: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount,
          address,
          createdAt: new Date(),
        });
      } catch (error) {
        console.error('Error saving order to Firestore:', error);
      }
    }
  };

  return (
    <form onSubmit={handleCardPayment} className={styles.form}>
      <h3>クレジットカードで支払う</h3>
      <p className={styles.totalAmount}>合計金額: {totalAmount}円</p>
      <div className={styles.address}>
        <p>配送先:〒{address.postalCode} {address.prefecture} {address.city} {address.addressLine}</p>
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

export default CheckoutForm;
