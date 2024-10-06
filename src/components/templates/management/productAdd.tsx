import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db, storage } from '@/libs/firebase';
import { useForm } from 'react-hook-form';
import { addDoc } from 'firebase/firestore';
import InputField from '@/components/parts/inputField';
import Button from '@/components/parts/button';
import Image from 'next/image';
import Textarea from '@/components/parts/textareaField';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import styles from '@/styles/pages/productAdd.module.css';
import { NextPage } from 'next';

interface Category {
  name: string;
  subCategories: string[];
}

const ProductAdd: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [role, setRole] = useState<number | null>(null);
  const { register, handleSubmit } = useForm();

  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stock: 0,
    category: '',
    subCategory: '',
    imageUrl: '',
    description: '',
    createdAt: new Date(),
    updatedAt: undefined,
  });

  // ログインユーザーのロールを確認
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setRole(userData.role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };
    fetchUserRole();
  }, [user]);

  // カテゴリとサブカテゴリをFirestoreから取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesList: Category[] = categoriesSnapshot.docs.map((doc) => {
          const data = doc.data();
          const subCategories = data["メーカー"]; // フィールド名 "メーカー" に対応する配列
          return { name: doc.id, subCategories: subCategories as string[] };
        });
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // 管理者以外はアクセス不可
  useEffect(() => {
    if (role !== null && role !== 1) {
      router.push('/');
    }
  }, [role, router]);

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

    const productWithTimestamp = { ...newProduct, createdAt: new Date(), updatedAt: new Date() };
    await addDoc(collection(db, 'products'), productWithTimestamp);
    setNewProduct({ name: '', price: 0, stock: 0, category: '', subCategory: '', imageUrl: '', description: '', createdAt: new Date(), updatedAt: undefined });
    alert('商品が登録されました');
  };

  // 画像アップロード処理
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        () => { /* プログレス表示など */ },
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

  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>商品登録</h2>
      <form onSubmit={handleSubmit(addProduct)} className={styles.form}>
        <InputField
          label="商品名"
          name="name"
          register={register('name', { required: true })}
          value={newProduct.name}
          onChange={handleNewProductChange}
        />
        <InputField
          label="価格"
          register={register('price', { required: true })}
          value={newProduct.price.toString()}
          type="number"
          name="price"
          onChange={handleNewProductChange}
        />
        <InputField
          label="在庫数"
          register={register('stock', { required: true })}
          value={newProduct.stock.toString()}
          type="number"
          name="stock"
          onChange={handleNewProductChange}
        />
        <label className={styles.label}>カテゴリ</label>
        <select className={styles.input} name="category" value={newProduct.category} onChange={handleNewProductChange}>
          <option value="">選択してください</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        {newProduct.category && (
          <>
            <label className={styles.label}>サブカテゴリ</label>
            <select className={styles.input} name="subCategory" value={newProduct.subCategory} onChange={handleNewProductChange}>
              <option value="">選択してください</option>
              {categories
                .find((cat) => cat.name === newProduct.category)?.subCategories.map((subCategory) => (
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
        <label className={styles.label}>商品画像</label>
        <input className={styles.input} type="file" onChange={handleImageUpload} />
        {newProduct.imageUrl && (
          <Image
            className={styles.img}
            src={newProduct.imageUrl}
            alt="商品画像"
            width={100}
            height={100}
            objectFit="contain"
          />
        )}
        <Button label="商品追加" type="submit" width="100%" />
      </form>
    </div>

  );
};

export default ProductAdd;
