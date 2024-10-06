import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import Button from '@/components/parts/button';
import { useCart } from '@/context/cartContext';
import Sidebar from '@/components/parts/sidebar';
import styles from '@/styles/pages/productDetail.module.css';
import Image from 'next/image';
import Cookies from 'js-cookie';

// 商品データの型定義
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  subCategory: string;
}

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { cartItems, addToCart, updateCartItemQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null); // 商品データ
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true); // ロード中フラグ
  const [showPopup, setShowPopup] = useState(false); // ポップアップ表示状態
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<
    string | null
  >(null);

  // 商品の詳細情報を取得
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const productRef = doc(db, 'products', id as string);
          const productSnapshot = await getDoc(productRef);
          if (productSnapshot.exists()) {
            setProduct({
              id: productSnapshot.id,
              ...productSnapshot.data(),
            } as Product);
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
      const existingItem = cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        updateCartItemQuantity(product.id, existingItem.quantity + quantity);
      } else {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl,
        });
      }

      // クッキーにカートの状態を保存
      Cookies.set(
        'cartItems',
        JSON.stringify([
          ...cartItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            imageUrl: product.imageUrl,
          },
        ]),
        { expires: 7 }
      );

      // ポップアップ表示
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1500); // 1.5秒後に非表示
    }
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
          {/* 改行を反映して説明文を表示 */}
          <p className={styles.description}>
            {product.description.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
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

      {/* ポップアップ表示 */}
      {showPopup && <div className={styles.popup}>カートに追加しました！</div>}
    </div>
  );
};

export default ProductDetailPage;
