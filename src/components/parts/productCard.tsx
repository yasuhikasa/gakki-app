import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/components/productCard.module.css';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  manufacturer: string;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, manufacturer, imageUrl }) => {
  return (
    <Link href={`/products/${id}`} passHref>
      <div className={styles.productCard}>
        <Image src={imageUrl} alt={name} width={300} height={200} className={styles.productImage} quality={100} />
        <div className={styles.productContent}>
          <h3 className={styles.productName}>{name}</h3>
          <p className={styles.productPrice}>{price}円</p>
          <p className={styles.productManufacturer}>メーカー: {manufacturer}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
