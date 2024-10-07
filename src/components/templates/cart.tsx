import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/cartContext'; // カートのコンテキスト
import Button from '@/components/parts/button';
import styles from '@/styles/pages/cart.module.css';
import { useAuth } from '@/context/authContext'; // 認証のコンテキスト
import Image from 'next/image';

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity } = useCart();
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();
  const { user } = useAuth(); // ログイン情報を取得

  // カートの合計金額を計算
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const itemPrice = Number(item.price) || 0;
      const itemQuantity = Number(item.quantity) || 0;
      return acc + itemPrice * itemQuantity;
    }, 0);
    setTotalAmount(total);
  }, [cartItems]);

  // アイテムを削除
  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  // アイテムの数量を更新
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartItemQuantity(id, quantity);
  };

  // 注文確定（ログインしていない場合、ログインページにリダイレクト）
  const handleProceedToCheckout = () => {
    if (!user) {
      router.push('/login?redirect=checkout'); // ログインページへリダイレクト
    } else {
      router.push('/checkout'); // 決済ページへ遷移
    }
  };

  return (
    <div className={styles.container}>
      <h2>カート</h2>
      {cartItems.length === 0 ? (
        <p>カートに商品がありません</p>
      ) : (
        <div>
          <ul className={styles.cartList}>
            {cartItems.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <div className={styles.itemDetails}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={80}
                      height={80}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className={styles.itemText}>
                    <p>{item.name}</p>
                    <p>{item.price}円</p>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                    />
                    <button onClick={() => handleRemoveItem(item.id)}>
                      削除
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.totalAmount}>
            <h3>合計金額: {totalAmount}円</h3>
          </div>
          <Button
            label="注文を確定"
            onClick={handleProceedToCheckout}
            width="100%"
            height="50px"
            backgroundColor="#007bff"
            textColor="#fff"
          />
        </div>
      )}
    </div>
  );
};

export default CartPage;
