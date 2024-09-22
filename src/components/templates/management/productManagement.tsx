import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/libs/firebase'; // Firebaseの設定ファイルをインポート
import Button from '@/components/parts/button'; // Buttonコンポーネントをインポート
import styles from '@/styles/pages/productManagement.module.css'; // スタイルシートをインポート


interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, stock: 0 });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<Partial<Product>>({});

  // 初期の商品データを取得
  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = await getDocs(collection(db, 'products'));
      const productList: Product[] = productsCollection.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        price: doc.data().price,
        stock: doc.data().stock,
      }));
      setProducts(productList);
    };
    fetchProducts();
  }, []);

  // 新しい商品の追加
  const addProduct = async () => {
    if (newProduct.name === '' || newProduct.price <= 0 || newProduct.stock < 0) {
      alert('商品名、価格、在庫数を正しく入力してください');
      return;
    }
    const addedProductRef = await addDoc(collection(db, 'products'), newProduct);
    const addedProduct: Product = { ...newProduct, id: addedProductRef.id };
    setProducts([...products, addedProduct]);
    setNewProduct({ name: '', price: 0, stock: 0 });
  };

  // 商品の編集を開始
  const startEditingProduct = (product: Product) => {
    setEditingProductId(product.id);
    setUpdatedProduct({ name: product.name, price: product.price, stock: product.stock });
  };

  // 編集された商品を保存
  const saveEditedProduct = async () => {
    if (editingProductId && updatedProduct.name && updatedProduct.price !== undefined) {
      const productRef = doc(db, 'products', editingProductId);
      await updateDoc(productRef, updatedProduct);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProductId
            ? { ...product, ...updatedProduct }
            : product
        )
      );
      setEditingProductId(null);
      setUpdatedProduct({});
    }
  };

  // 商品の削除
  const deleteProduct = async (id: string) => {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
    setProducts(products.filter((product) => product.id !== id));
  };

  // 新商品のフィールド変更を処理する
  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  // 編集商品のフィールド変更を処理する
  const handleUpdatedProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  return (
    <div className={styles.container}>
      <h2>商品管理</h2>
      <div className={styles.form}>
        <label>商品名</label>
        <input
          className={styles.input}
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleNewProductChange}
        />
        <label>価格</label>
        <input
          className={styles.input}
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleNewProductChange}
        />
        <label>在庫数</label>
        <input
          className={styles.input}
          type="number"
          name="stock"
          value={newProduct.stock}
          onChange={handleNewProductChange}
        />
        <Button label="商品追加" onClick={addProduct} width="100%" />
      </div>

      <ul className={styles.ul}>
        {products.map((product) => (
          <li key={product.id} className={styles.li}>
            {editingProductId === product.id ? (
              <div>
                <label>商品名</label>
                <input
                  className={styles.editingInput}
                  type="text"
                  name="name"
                  value={updatedProduct.name || ''}
                  onChange={handleUpdatedProductChange}
                />
                <label>価格</label>
                <input
                  className={styles.editingInput}
                  type="number"
                  name="price"
                  value={updatedProduct.price?.toString() || ''}
                  onChange={handleUpdatedProductChange}
                />
                <label>在庫数</label>
                <input
                  className={styles.editingInput}
                  type="number"
                  name="stock"
                  value={updatedProduct.stock?.toString() || ''}
                  onChange={handleUpdatedProductChange}
                />
                <div className={styles.buttonGroup}>
                  <Button label="保存" onClick={saveEditedProduct} width="100%" />
                  <Button label="キャンセル" onClick={() => setEditingProductId(null)} width="100%" />
                </div>
              </div>
            ) : (
              <div>
                {product.name} - {product.price}円 - 在庫: {product.stock}
                <div className={styles.buttonGroup}>
                  <Button label="編集" onClick={() => startEditingProduct(product)} width="100%" />
                  <Button label="削除" onClick={() => deleteProduct(product.id)} width="100%" />
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;
