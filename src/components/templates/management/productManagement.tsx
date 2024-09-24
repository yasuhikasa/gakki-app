import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { db, storage } from '@/libs/firebase';
import InputField from '@/components/parts/inputField';
import Button from '@/components/parts/button';
import Textarea from '@/components/parts/textareaField';
import styles from '@/styles/pages/productManagement.module.css';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  subCategory: string;
  imageUrl: string;
  description: string;
  createdAt: Date; // 商品登録日時
  updatedAt?: Date; // 商品更新日時
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { register, handleSubmit, setValue } = useForm();
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stock: 0,
    category: '',
    subCategory: '',
    imageUrl: '',
    description: '',
    createdAt: new Date(), // 商品登録日時
    updatedAt: undefined, // 商品更新日時
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

  // 商品の追加
  const addProduct = async () => {
    if (
      newProduct.name === '' ||
      newProduct.price <= 0 ||
      newProduct.stock < 0 ||
      newProduct.category === '' ||
      newProduct.subCategory === '' ||
      newProduct.imageUrl === '' ||
      newProduct.description === ''
    ) {
      alert('すべての項目を正しく入力してください');
      return;
    }

    const productWithTimestamp = { ...newProduct, createdAt: new Date(), updatedAt: new Date() }; // 登録日時と更新日時を追加
    const addedProductRef = await addDoc(collection(db, 'products'), productWithTimestamp);
    const addedProduct: Product = { ...productWithTimestamp, id: addedProductRef.id };
    setProducts([addedProduct, ...products]); // 新しい商品を上に追加
    setNewProduct({ name: '', price: 0, stock: 0, category: '', subCategory: '', imageUrl: '', description: '', createdAt: new Date(), updatedAt: undefined });
  };

  // 商品の編集を開始
  const startEditingProduct = (product: Product) => {
    setEditingProductId(product.id);
    setUpdatedProduct({ ...product });
  };

  // 編集商品のフィールド変更を処理する
  const handleUpdatedProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  // 編集された商品を保存
  const saveEditedProduct = async () => {
    if (editingProductId && updatedProduct.name && updatedProduct.price !== undefined) {
      const productRef = doc(db, 'products', editingProductId);
      await updateDoc(productRef, { ...updatedProduct, updatedAt: new Date() }); // 更新日時を追加

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProductId ? { ...product, ...updatedProduct, updatedAt: new Date() } : product
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
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // プログレス表示など
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setNewProduct((prev) => ({ ...prev, imageUrl: downloadURL }));
        }
      );
    }
  };

  // 新商品のフィールド変更を処理する
  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  return (
    <div className={styles.container}>
      <h2>商品管理</h2>
      <form onSubmit={handleSubmit(addProduct)} className={styles.form}>
        <InputField
          label="商品名"
          register={register('name')}
          value={newProduct.name}
          onChange={handleNewProductChange}
        />
        <InputField
          label="価格"
          register={register('price')}
          value={newProduct.price.toString()}
          type="number"
          onChange={handleNewProductChange}
        />
        <InputField
          label="在庫数"
          register={register('stock')}
          value={newProduct.stock.toString()}
          type="number"
          onChange={handleNewProductChange}
        />
        <label>カテゴリ</label>
        <select className={styles.input} name="category" value={newProduct.category} onChange={handleNewProductChange}>
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
            <select className={styles.input} name="subCategory" value={newProduct.subCategory} onChange={handleNewProductChange}>
              <option value="">選択してください</option>
              {subCategories[newProduct.category as keyof typeof subCategories].map((subCategory) => (
                <option key={subCategory} value={subCategory}>
                  {subCategory}
                </option>
              ))}
            </select>
          </>
        )}
        <Textarea
          label="商品説明"
          value={newProduct.description}
          onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
          rows={4}
        />

        <label>商品画像</label>
        <input className={styles.input} type="file" onChange={handleImageUpload} />
        {newProduct.imageUrl && <img src={newProduct.imageUrl} alt="商品画像" width="100" />}
        <Button label="商品追加" type="submit" width="100%" />
      </form>

      <ul className={styles.ul}>
        {products.map((product) => (
          <li key={product.id} className={styles.li}>
            {editingProductId === product.id ? (
              <div>
                <InputField
                  label="商品名"
                  register={register('name')}
                  value={updatedProduct.name || ''}
                  onChange={handleUpdatedProductChange}
                />
                <InputField
                  label="価格"
                  register={register('price')}
                  value={updatedProduct.price?.toString() || ''}
                  type="number"
                  onChange={handleUpdatedProductChange}
                />
                <InputField
                  label="在庫数"
                  register={register('stock')}
                  value={updatedProduct.stock?.toString() || ''}
                  type="number"
                  onChange={handleUpdatedProductChange}
                />
                <label>カテゴリ</label>
                <select
                  className={styles.input}
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
                {updatedProduct.category && (
                  <>
                    <label>サブカテゴリ</label>
                    <select
                      className={styles.input}
                      name="subCategory"
                      value={updatedProduct.subCategory || ''}
                      onChange={handleUpdatedProductChange}
                    >
                      <option value="">選択してください</option>
                      {subCategories[updatedProduct.category as keyof typeof subCategories].map((subCategory) => (
                        <option key={subCategory} value={subCategory}>
                          {subCategory}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                <Button label="保存" onClick={saveEditedProduct} width="100%" />
                <Button label="キャンセル" onClick={() => setEditingProductId(null)} width="100%" />
              </div>
            ) : (
              <div>
                {product.name} - {product.price}円 - 在庫: {product.stock} - 登録日時: {product.createdAt.toLocaleString()} - {product.updatedAt ? `更新日時: ${product.updatedAt.toLocaleString()}` : ''}
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
