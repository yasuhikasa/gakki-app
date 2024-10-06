import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
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
  createdAt: Date;
}

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]); // カテゴリのリスト
  const [manufacturers, setManufacturers] = useState<string[]>([]); // メーカーのリスト
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // カテゴリ選択
  const [selectedManufacturer, setSelectedManufacturer] = useState<
    string | null
  >(null); // メーカー選択

  useEffect(() => {
    const fetchProducts = async () => {
      const productsQuery = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc')
      );
      const productsCollection = await getDocs(productsQuery);
      const productList: Product[] = productsCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Product[];

      setProducts(productList);

      // カテゴリとメーカーのリストを動的に生成
      const categorySet = new Set<string>();
      const manufacturerSet = new Set<string>();

      productList.forEach((product) => {
        categorySet.add(product.category);
        manufacturerSet.add(product.subCategory);
      });

      setCategories(Array.from(categorySet));
      setManufacturers(Array.from(manufacturerSet));
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (router.query.reset) {
      setSelectedCategory(null);
      setSelectedManufacturer(null);
    }
  }, [router.query]);

  // フィルタリングロジック
  const filteredProducts = products.filter((product) => {
    if (selectedCategory && selectedManufacturer) {
      return (
        product.category === selectedCategory &&
        product.subCategory === selectedManufacturer
      );
    } else if (selectedManufacturer) {
      return product.subCategory === selectedManufacturer;
    }
    return true;
  });

  // セレクトボックスでのカテゴリ変更
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedCategory(selected === '' ? null : selected);
    setSelectedManufacturer(null); // カテゴリ変更時にメーカー選択をリセット
  };

  // セレクトボックスでのメーカー変更
  const handleManufacturerChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = e.target.value;
    setSelectedManufacturer(selected === '' ? null : selected);
  };

  return (
    <>
      <div className={styles.selectContainer}>
        {/* レスポンシブ時のみ表示 */}
        <select
          className={styles.select}
          value={selectedCategory || ''}
          onChange={handleCategoryChange}
        >
          <option value="">カテゴリを選択</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {selectedCategory && (
          <select
            className={styles.select}
            value={selectedManufacturer || ''}
            onChange={handleManufacturerChange}
          >
            <option value="">メーカーを選択</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.container}>
        {/* PC表示ではサイドバーを表示 */}
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
    </>
  );
};

export default ProductsPage;
