import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext'; // ログイン情報を取得
import { useCart } from '@/context/cartContext'; // カート情報を取得
import { auth } from '@/libs/firebase'; // Firebase 認証用
import { doc, getDoc } from 'firebase/firestore'; // Firestoreの読み取り
import { db } from '@/libs/firebase'; // Firestore設定
import HeaderButton from '@/components/parts/headerButton';
import styles from '@/styles/components/header.module.css';

const Header = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems } = useCart();
  const [role, setRole] = useState<number | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0); // カートアイテム数を保持する状態

  // Firestoreからユーザーのロール情報を取得
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setRole(userData.role); // Firestoreのroleフィールドを使用
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  // カートのアイテム数を更新
  useEffect(() => {
    // カート内のアイテムの総数（個数）を計算
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartItemCount(totalItems); // 総数を cartItemCount に反映
  }, [cartItems]);

  const handleLogout = async () => {
    const confirmLogout = window.confirm('ログアウトしてもよろしいですか？');
    if (confirmLogout) {
      try {
        await auth.signOut();
        router.push('/products'); // ログアウト後に商品一覧ページへ遷移
      } catch (error) {
        console.error('Error during logout', error);
      }
    }
  };

  const goToAdminPage = () => {
    router.push('/admin'); // 管理者ページへ遷移
  };

  const goToCart = () => {
    router.push('/cart'); // カートページへ遷移
  };

  const goToLogin = () => {
    router.push('/login?redirect=products'); // ログインページへ遷移
  };

  const goToMyPage = () => {
    router.push('/mypage'); // マイページへ遷移
  };

  const goToHomePage = () => {
    router.push('/'); // ホームページへ遷移
  };

  const goToProducts = () => {
    router.push({
      pathname: '/products',
      query: { reset: 'true' }, // resetフラグを追加して商品一覧に遷移
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.banner}>
        <h1 className={styles.title} onClick={goToHomePage}>楽器屋オンラインショップ</h1> {/* タイトルクリックでホームページへ遷移 */}
      </div>
      <nav className={styles.nav}>
        {/* 商品一覧ボタン */}
        <HeaderButton label="商品一覧" onClick={goToProducts} />

        {/* 管理者ボタン: Firestoreから取得したロールが1の場合に表示 */}
        {user && role === 1 && (
          <HeaderButton label="管理者ページ" onClick={goToAdminPage} />
        )}
        {/* マイページボタン: ログインしているユーザーにのみ表示 */}
        {user && (
          <HeaderButton label="マイページ" onClick={goToMyPage} />
        )}
        {/* カートボタン */}
        <HeaderButton label={`カート (${cartItemCount})`} onClick={goToCart} />
        {/* ログイン/ログアウト */}
        {user ? (
          <HeaderButton label="ログアウト" onClick={handleLogout} />
        ) : (
          <HeaderButton label="ログイン" onClick={goToLogin} />
        )}
      </nav>
    </header>
  );
};

export default Header;
