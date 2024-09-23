import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import styles from '@/styles/pages/confirm.module.css';

interface Address {
  addressLine: string;
  city: string;
  prefecture: string;
  postalCode: string;
}

interface UserInfo {
  lastName: string;
  firstName: string;
}

const ConfirmationPage = () => {
  const { cartItems, totalAmount } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState<Address | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setAddress({
              addressLine: userData.addressLine,
              city: userData.city,
              prefecture: userData.prefecture,
              postalCode: userData.postalCode,
            });
            setUserInfo({
              lastName: userData.lastName,
              firstName: userData.firstName,
            });
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>決済が完了しました！</h2>
      <p className={styles.paragraph}>ご注文が確定しました。ありがとうございます。</p>

      <div className={styles.confirmationDetails}>
        <h3 className={styles.subheading}>ご注文内容</h3>
        <ul className={styles.itemList}>
          {cartItems.map((item) => (
            <li key={item.id} className={styles.item}>
              <p className={styles.itemText}>{item.name}</p>
              <p className={styles.itemText}>個数: {item.quantity}</p>
              <p className={styles.itemText}>価格: {item.price}円</p>
            </li>
          ))}
        </ul>

        <h3 className={styles.subheading}>配送先</h3>
        {address ? (
          <div>
            <p>{address.prefecture} {address.city} {address.addressLine}</p>
            <p>郵便番号: {address.postalCode}</p>
          </div>
        ) : (
          <p>配送先情報が見つかりません</p>
        )}

        <h3 className={styles.subheading}>お名前</h3>
        {userInfo ? (
          <p>{userInfo.lastName} {userInfo.firstName}</p>
        ) : (
          <p>ユーザー情報が見つかりません</p>
        )}

        <h3 className={styles.subheading}>合計金額</h3>
        <p className={styles.totalAmount}>{totalAmount}円</p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
