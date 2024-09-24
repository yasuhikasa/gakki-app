import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import styles from '@/styles/pages/mypage.module.css';
import Button from '@/components/parts/button';
import { useRouter } from 'next/router';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  createdAt: Date;
  totalAmount: number;
  cartItems: CartItem[];
}

const MyPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      const ordersCollection = collection(db, 'orders');
      const ordersQuery = query(ordersCollection, where('userId', '==', user.uid));
      const ordersSnapshot = await getDocs(ordersQuery);

      const fetchedOrders: Order[] = ordersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          createdAt: data.createdAt.toDate(),
          totalAmount: data.totalAmount,
          cartItems: data.cartItems, // cartItems に商品情報が入っている
        } as Order;
      });

      setOrders(fetchedOrders);
    };

    fetchOrders();
  }, [user]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>注文履歴</h2>
      {orders.length === 0 ? (
        <p>注文履歴がありません。</p>
      ) : (
        <ul className={styles.orderList}>
          {orders.map((order) => (
            <li key={order.id} className={styles.orderItem}>
              <p>注文日: {order.createdAt.toLocaleDateString()}</p>
              <p>合計金額: {order.totalAmount}円</p>
              <p>注文ID: {order.id}</p>
              <ul>
                {order.cartItems.map((item, index) => (
                  <li key={index}>
                    <strong>{item.name}</strong> - {item.quantity}個 - {item.price}円
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      <Button label="ユーザー情報を編集" onClick={() => router.push('/editProfile')} width="100%" />
    </div>
  );
};

export default MyPage;
