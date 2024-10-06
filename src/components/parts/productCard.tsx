import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import styles from '@/styles/components/productCard.module.css';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  manufacturer: string;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  manufacturer,
  imageUrl,
}) => {
  return (
    <div className={styles.card}>
      <Link href={`/products/${id}`}>
        <Image
          src={imageUrl}
          alt={name}
          width={200}
          height={200}
          className={styles.productImage}
        />
      </Link>
      <div className={styles.cardContent}>
        <h3>{name}</h3>
        <p>{manufacturer}</p>
        <p>{price}円</p>
      </div>
    </div>
  );
};

export default ProductCard;
