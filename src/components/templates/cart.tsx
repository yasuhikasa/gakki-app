import React from 'react';
import { useCart } from '@/context/cartContext';
import styles from '@/styles/pages/cart.module.css';

const CartPage = () => {
  const { cartItems, totalAmount, removeFromCart, clearCart } = useCart();

  return (
    <div className={styles.container}>
      <h2>カート</h2>
      {cartItems.length === 0 ? (
        <p>カートは空です。</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - {item.quantity}個 - {item.price * item.quantity}円
                <button onClick={() => removeFromCart(item.id)}>削除</button>
              </li>
            ))}
          </ul>
          <div>
            <p>合計: {totalAmount}円</p>
            <button onClick={clearCart}>カートをクリア</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
