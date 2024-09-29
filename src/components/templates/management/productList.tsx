import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { db } from '@/libs/firebase';
import Image from 'next/image';
import Button from '@/components/parts/button';
import styles from '@/styles/pages/productList.module.css';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt?: Date;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const productsCollection = await getDocs(productsQuery);
      const productList: Product[] = productsCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt ? doc.data().updatedAt.toDate() : undefined,
      })) as Product[];
      setProducts(productList);
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    const confirmation = window.confirm('この商品を削除してもよろしいですか？');
    if (confirmation) {
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>商品一覧</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>商品画像</th>
            <th>商品名</th>
            <th>価格</th>
            <th>在庫</th>
            <th>カテゴリ</th>
            <th>登録日時</th>
            <th>編集/削除</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
              <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={100}
                  height={100}
                  style={{ objectFit: 'contain' }}
                  className={styles.image}
                />
              </td>
              <td>{product.name}</td>
              <td>{product.price}円</td>
              <td>{product.stock}</td>
              <td>{product.category}</td>
              <td>{product.createdAt.toLocaleString()}</td>
              <td>
                <div className={styles.buttonContainer}>
                  <Button label="編集" onClick={() => router.push(`/productEdit/${product.id}`)} width="80%" />
                  <Button label="削除" onClick={() => deleteProduct(product.id)} width="80%" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
