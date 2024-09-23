import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import ProductCard from '@/components/parts/productCard';
import Sidebar from '@/components/parts/sidebar';
import styles from '@/styles/pages/products.module.css';

// Productの型を定義
interface Product {
  id: string;
  name: string;
  price: number;
  manufacturer: string;
  imageUrl: string;
  category: string;
  subCategory: string;
}

const ProductsPage = () => {
  // Product型の配列としてproductsを定義
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);  // カテゴリ（例: ギター）用
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);  // メーカー（例: Fender）用

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = await getDocs(collection(db, 'products'));
      const productList: Product[] = productsCollection.docs.map((doc) => {
        const data = doc.data() as Omit<Product, 'id'>;
        return { id: doc.id, ...data };
      });
      setProducts(productList);
    };
    fetchProducts();
  }, []);

  // カテゴリとメーカーでフィルタリング
  const filteredProducts = products.filter((product) => {
    if (selectedCategory && selectedManufacturer) {
      return product.category === selectedCategory && product.subCategory === selectedManufacturer;
    } else if (selectedCategory) {
      return product.category === selectedCategory;
    } else if (selectedManufacturer) {
      return product.subCategory === selectedManufacturer;
    }
    return true; // カテゴリやメーカーが選択されていない場合、すべて表示
  });

  return (
    <div className={styles.container}>
      <Sidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedManufacturer={selectedManufacturer}
        setSelectedManufacturer={setSelectedManufacturer}
      />
      <div className={styles.productGrid}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            manufacturer={product.subCategory}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
