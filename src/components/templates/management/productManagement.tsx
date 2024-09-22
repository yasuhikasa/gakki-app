import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { db } from '@/libs/firebase'; // Firebaseの設定ファイルをインポート
import InputField from '@/components/parts/inputField'; // InputFieldコンポーネントをインポート
import Button from '@/components/parts/button'; // Buttonコンポーネントをインポート
import styles from '@/styles/pages/productManagement.module.css'; // スタイルシートをインポート

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  subCategory: string;
  imageUrl: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { register } = useForm();
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stock: 0,
    category: '',
    subCategory: '',
    imageUrl: '',
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<Partial<Product>>({});

  // カテゴリとサブカテゴリ
  const categories = ['ギター', 'ベース', 'ドラム'] as const;
  const subCategories = {
    ギター: ['Fender', 'Gibson', 'Ibanez'],
    ベース: ['Fender', 'Music Man', 'Warwick'],
    ドラム: ['Yamaha', 'Tama', 'Pearl'],
  } as const;

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = await getDocs(collection(db, 'products'));
      const productList: Product[] = productsCollection.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        price: doc.data().price,
        stock: doc.data().stock,
        category: doc.data().category,
        subCategory: doc.data().subCategory,
        imageUrl: doc.data().imageUrl,
      }));
      setProducts(productList);
    };
    fetchProducts();
  }, []);

  // 商品の追加
  const addProduct = async () => {
    if (
      newProduct.name === '' ||
      newProduct.price <= 0 ||
      newProduct.stock < 0 ||
      newProduct.category === '' ||
      newProduct.subCategory === '' ||
      newProduct.imageUrl === ''
    ) {
      alert('すべての項目を正しく入力してください');
      return;
    }
    const addedProductRef = await addDoc(collection(db, 'products'), newProduct);
    const addedProduct: Product = { ...newProduct, id: addedProductRef.id };
    setProducts([...products, addedProduct]);
    setNewProduct({ name: '', price: 0, stock: 0, category: '', subCategory: '', imageUrl: '' });
  };

  // 商品の編集を開始
  const startEditingProduct = (product: Product) => {
    setEditingProductId(product.id);
    setUpdatedProduct({ ...product });
  };

  // 編集された商品を保存
  const saveEditedProduct = async () => {
    if (editingProductId && updatedProduct.name && updatedProduct.price !== undefined) {
      const productRef = doc(db, 'products', editingProductId);
      await updateDoc(productRef, updatedProduct);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProductId ? { ...product, ...updatedProduct } : product
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

  // 画像アップロード処理
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setNewProduct((prev) => ({ ...prev, imageUrl }));
    }
  };

  // 新商品のフィールド変更を処理する
  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  // 編集商品のフィールド変更を処理する
  const handleUpdatedProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      <InputField
          label="商品名"
          register={register('name')}
          value={newProduct.name}
          onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
        />
        <InputField
          label="価格"
          register={register('price')}
          value={newProduct.price.toString()}
          type="number"
          onChange={(e) => setNewProduct((prev) => ({ ...prev, price: Number(e.target.value) }))}
        />
        <InputField
          label="在庫数"
          register={register('stock')}
          value={newProduct.stock.toString()}
          type="number"
          onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: Number(e.target.value) }))}
        />
        <label>カテゴリ</label>
        <select
          className={styles.input}
          name="category"
          value={newProduct.category}
          onChange={handleNewProductChange}
        >
          <option value="">選択してください</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {newProduct.category && (
          <>
            <label>サブカテゴリ</label>
            <select
              className={styles.input}
              name="subCategory"
              value={newProduct.subCategory}
              onChange={handleNewProductChange}
            >
              <option value="">選択してください</option>
              {subCategories[newProduct.category as keyof typeof subCategories].map((subCategory) => (
                <option key={subCategory} value={subCategory}>
                  {subCategory}
                </option>
              ))}
            </select>
          </>
        )}
        <label>商品画像</label>
        <input
          className={styles.input}
          type="file"
          onChange={handleImageUpload}
        />
        {newProduct.imageUrl && <img src={newProduct.imageUrl} alt="商品画像" width="100" />}
        <Button label="商品追加" onClick={addProduct} width="100%" />
      </div>

      <ul className={styles.ul}>
        {products.map((product) => (
          <li key={product.id} className={styles.li}>
            {editingProductId === product.id ? (
              <div>
                <InputField
                  label="商品名"
                  register={register('name')} // react-hook-formのregisterを渡す
                  value={newProduct.name}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                />
                <InputField
                  label="価格"
                  register={register('price')} // react-hook-formのregisterを渡す
                  value={newProduct.price.toString()}
                  type="number"
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, price: Number(e.target.value) }))}
                />
                <InputField
                  label="在庫数"
                  register={register('stock')} // react-hook-formのregisterを渡す
                  value={newProduct.stock.toString()}
                  type="number"
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                />
                <label>カテゴリ</label>
                <select
                  className={styles.editingInput}
                  name="category"
                  value={updatedProduct.category || ''}
                  onChange={handleUpdatedProductChange}
                >
                  <option value="">選択してください</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <label>サブカテゴリ</label>
                <select
                  className={styles.editingInput}
                  name="subCategory"
                  value={updatedProduct.subCategory || ''}
                  onChange={handleUpdatedProductChange}
                >
                  <option value="">選択してください</option>
                  {subCategories[updatedProduct.category as keyof typeof subCategories]?.map((subCategory) => (
                    <option key={subCategory} value={subCategory}>
                      {subCategory}
                    </option>
                  ))}
                </select>
                <Button label="保存" onClick={saveEditedProduct} width="100%" />
                <Button label="キャンセル" onClick={() => setEditingProductId(null)} width="100%" />
              </div>
            ) : (
              <div>
                {product.name} - {product.price}円 - 在庫: {product.stock}
                <Button label="編集" onClick={() => startEditingProduct(product)} width="100%" />
                <Button label="削除" onClick={() => deleteProduct(product.id)} width="100%" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;
