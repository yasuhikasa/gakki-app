import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/libs/firebase'; // Firestoreの設定
import Button from '@/components/parts/button';
import { useCart } from '@/context/cartContext';
import Sidebar from '@/components/parts/sidebar'; // サイドバーのインポート
import styles from '@/styles/pages/productDetail.module.css';
import Image from 'next/image';

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { cartItems, addToCart } = useCart();
  const [product, setProduct] = useState(null); // 商品データ
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true); // ロード中フラグ
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // カテゴリ選択用
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null); // メーカー選択用

  // 商品の詳細情報を取得
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const productRef = doc(db, 'products', id as string);
          const productSnapshot = await getDoc(productRef);
          if (productSnapshot.exists()) {
            setProduct(productSnapshot.data());
          } else {
            console.error('Product not found');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }
  };

  const handleGoToCart = () => {
    router.push('/cart');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className={styles.container}>
      {/* サイドバー */}
      <div className={styles.sidebar}>
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedManufacturer={selectedManufacturer}
          setSelectedManufacturer={setSelectedManufacturer}
        />
      </div>

      {/* 中央カラム（商品詳細） */}
      <div className={styles.centerColumn}>
        <div className={styles.productDetail}>
          <h2 className={styles.title}>{product.name}</h2>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={500}
            height={300}
            className={styles.productImage}
          />
          <p className={styles.price}>{product.price}円</p>
          <p className={styles.manufacturer}>メーカー: {product.subCategory}</p>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.quantity}>
            <label htmlFor="quantity">個数:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              max="10"
            />
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              label="カートに入れる"
              onClick={handleAddToCart}
              width="100%"
              height="50px"
              backgroundColor="#007bff"
              textColor="#fff"
            />
          </div>
        </div>
      </div>

      {/* 右カラム（カート） */}
      <div className={styles.rightColumn}>
        <h3 className={styles.cartTitle}>カートの中身</h3>
        {cartItems.length === 0 ? (
          <p>カートに商品がありません</p>
        ) : (
          <ul className={styles.cartList}>
            {cartItems.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                {item.name} - {item.quantity}個 - {item.price}円
              </li>
            ))}
          </ul>
        )}
        <Button
          label="カートに移動"
          onClick={handleGoToCart}
          width="100%"
          height="50px"
          backgroundColor="#28a745"
          textColor="#fff"
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
