import React from 'react';
import { useCart } from '@/context/cartContext';
import styles from '@/styles/pages/cart.module.css';
import Button from '@/components/parts/button';

const CartPage = () => {
  const { cart, updateCartItem, removeFromCart, totalAmount } = useCart();

  return (
    <div className={styles.container}>
      <h2>カート</h2>
      {cart.length === 0 ? (
        <p>カートは空です。</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <h3>{item.name}</h3>
              <p>{item.price}円</p>
              <label htmlFor={`quantity-${item.id}`}>数量:</label>
              <input
                type="number"
                id={`quantity-${item.id}`}
                value={item.quantity}
                min="1"
                max="10"
                onChange={(e) => updateCartItem(item.id, Number(e.target.value))}
              />
              <button onClick={() => removeFromCart(item.id)}>削除</button>
            </div>
          ))}
          <div className={styles.total}>
            <h3>合計: {totalAmount}円</h3>
          </div>
          <Button label="購入する" width="100%" />
        </div>
      )}
    </div>
  );
};

export default CartPage;
