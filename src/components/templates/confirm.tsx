import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/libs/firebase'; // Firestore設定
import styles from '@/styles/pages/confirm.module.css';

interface Order {
  id: string;
  address: {
    addressLine: string;
    city: string;
    postalCode: string;
    prefecture: string;
  };
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  createdAt: any;
}

const ConfirmationPage = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null); // 注文情報の状態
  const orderId = 'dtaS5X5h9SJiv5S0wDGz'; // 注文IDをハードコード（例）で指定

  // Firestoreから注文情報を取得
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDocRef = doc(db, 'orders', orderId); // 'orders' コレクションから注文情報を取得
        const orderDocSnapshot = await getDoc(orderDocRef);

        if (orderDocSnapshot.exists()) {
          const orderData = orderDocSnapshot.data() as Order;
          setOrder(orderData);
        } else {
          console.error('注文情報が見つかりません');
        }
      } catch (error) {
        console.error('注文情報の取得に失敗しました:', error);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>決済が完了しました！</h2>
      <p className={styles.paragraph}>ご注文が確定しました。ありがとうございます。</p>

      {order ? (
        <div className={styles.confirmationDetails}>
          <h3 className={styles.subheading}>ご注文内容</h3>
          <ul className={styles.itemList}>
            {order.cartItems.map((item) => (
              <li key={item.id} className={styles.item}>
                <p className={styles.itemText}>{item.name}</p>
                <p className={styles.itemText}>個数: {item.quantity}</p>
                <p className={styles.itemText}>価格: {item.price}円</p>
              </li>
            ))}
          </ul>

          <h3 className={styles.subheading}>配送先</h3>
          <p>〒: {order.address.postalCode}</p>
          <p>{order.address.prefecture} {order.address.city} {order.address.addressLine}</p>

          <h3 className={styles.subheading}>合計金額</h3>
          <p className={styles.totalAmount}>{order.totalAmount}円</p>

          <h3 className={styles.subheading}>注文日時</h3>
          <p>{order.createdAt.toDate().toLocaleString()}</p> {/* 日付をフォーマットして表示 */}
        </div>
      ) : (
        <p>注文情報が見つかりません</p>
      )}
    </div>
  );
};

export default ConfirmationPage;
