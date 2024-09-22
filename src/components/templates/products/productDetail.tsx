import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '@/styles/pages/productDetail.module.css';
import Button from '@/components/parts/button';
import { useCart } from '@/context/cartContext';

// 商品データのモック
const productsData = [
  { id: 1, name: 'Fender Stratocaster', price: 150000, manufacturer: 'Fender', category: 'guitar', releaseDate: '2023-01-01', imageUrl: '/images/fender-stratocaster.jpg' },
  { id: 2, name: 'Gibson Les Paul', price: 200000, manufacturer: 'Gibson', category: 'guitar', releaseDate: '2023-02-15', imageUrl: '/images/gibson-les-paul.jpg' },
  { id: 3, name: 'Ibanez RG', price: 120000, manufacturer: 'Ibanez', category: 'guitar', releaseDate: '2023-03-10', imageUrl: '/images/ibanez-rg.jpg' },
  { id: 4, name: 'Fender Jazz Bass', price: 140000, manufacturer: 'Fender', category: 'bass', releaseDate: '2023-04-20', imageUrl: '/images/fender-jazz-bass.jpg' },
  { id: 5, name: 'Pearl Drum Set', price: 250000, manufacturer: 'Pearl', category: 'drum', releaseDate: '2023-05-30', imageUrl: '/images/pearl-drum-set.jpg' },
];

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const product = productsData.find((p) => p.id === Number(id));

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // 商品が見つからなかった場合
  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
  };


  return (
    <div className={styles.container}>
      <div className={styles.productDetail}>
        <h2 className={styles.title}>{product.name}</h2>
        <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
        <p className={styles.price}>{product.price}円</p>
        <p className={styles.manufacturer}>メーカー: {product.manufacturer}</p>
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
        {/* ButtonComponentを使ってカートに追加するボタン */}
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
  );
};

export default ProductDetailPage;
