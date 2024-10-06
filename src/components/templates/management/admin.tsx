import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import Button from '@/components/parts/button';
import styles from '@/styles/pages/admin.module.css';
import { NextPage } from 'next';

const AdminPage: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [role, setRole] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setRole(userData.role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    if (user && role !== null && role !== 1) {
      router.push('/');
    }
  }, [role, router]);

  const goToOrderManagement = () => {
    router.push('/orderList');
  };

  const goToProductAdd = () => {
    router.push('/productAdd');
  };

  const goToProductList = () => {
    router.push('/productList');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>管理者ページ</h2>
      <p className={styles.description}>
        管理者機能にアクセスするためのページです。
      </p>

      <div className={styles.buttonContainer}>
        <Button
          label="商品追加ページへ"
          onClick={goToProductAdd}
          width="200px"
          height="50px"
        />
        <Button
          label="商品一覧ページへ"
          onClick={goToProductList}
          width="200px"
          height="50px"
        />
        <Button
          label="注文一覧ページへ"
          onClick={goToOrderManagement}
          width="200px"
          height="50px"
        />
      </div>
    </div>
  );
};

export default AdminPage;
