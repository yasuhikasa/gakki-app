import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, query, where, orderBy, doc } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import styles from '@/styles/pages/orderList.module.css';
import Button from '@/components/parts/button';

interface Order {
  id: string;
  userId: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: string;
  createdAt: Date;
  shippingAddress: {
    postalCode: string;
    addressLine: string;
    city: string;
    prefecture: string;
    phoneNumber: string;
  };
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const ordersSnapshot = await getDocs(ordersQuery);
      const orderList = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Order[];
      setOrders(orderList);
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    const orderDoc = doc(db, 'orders', id);
    await updateDoc(orderDoc, { status: newStatus });
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
    );
  };

  return (
    <div className={styles.container}>
      <h2>注文管理</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>注文ID</th>
            <th>商品情報</th>
            <th>合計金額</th>
            <th>注文日</th>
            <th>ステータス</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index}>
                      {item.name} - {item.quantity}個 - {item.price}円
                    </div>
                  ))
                ) : (
                  <div>商品情報がありません</div>
                )}
              </td>
              <td>{order.totalAmount}円</td>
              <td>{order.createdAt.toLocaleDateString()}</td>
              <td>{order.status}</td>
              <td>
                <div className={styles.buttonContainer}>
                  <Button
                    label="発送済み"
                    onClick={() => updateOrderStatus(order.id, '発送済み')}
                    disabled={order.status === 'shipped'}
                    width="80%"
                  />
                  <Button
                    label="キャンセル"
                    onClick={() => updateOrderStatus(order.id, 'キャンセル')}
                    disabled={order.status === 'canceled'}
                    width="80%"
                  />
                  <Button
                    label="未記入"
                    onClick={() => updateOrderStatus(order.id, '')}
                    disabled={order.status === 'canceled'}
                    width="80%"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default OrderList;
