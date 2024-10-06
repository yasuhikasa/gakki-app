import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext'; // ログイン情報を取得
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/libs/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import InputField from '@/components/parts/inputField';
import Button from '@/components/parts/button';
import Image from 'next/image';
import Textarea from '@/components/parts/textareaField';
import styles from '@/styles/components/productEditForm.module.css';
import { NextPage } from 'next';

interface ProductEditFormProps {
  productId: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  subCategory: string;
  imageUrl: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
}

const ProductEditForm: NextPage<ProductEditFormProps> = ({ productId }) => {
  const router = useRouter();
  const { user } = useAuth(); // ログインユーザーを取得
  const [role, setRole] = useState<number | null>(null); // ユーザーのロールを管理する
  const [product, setProduct] = useState<Partial<Product>>({});
  const [isSaving, setIsSaving] = useState(false);

  // ユーザーの役割を取得して管理者か確認する
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setRole(userData.role); // ロールをセット
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };
    fetchUserRole();
  }, [user]);

  // ロールが管理者でない場合はトップページにリダイレクト
  useEffect(() => {
    if (role !== null && role !== 1) {
      router.push('/'); // 管理者でない場合はトップページにリダイレクト
    }
  }, [role, router]);

  // 商品データを取得
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        const productDoc = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productDoc);
        if (productSnapshot.exists()) {
          setProduct(productSnapshot.data() as Product);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleProductChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        () => {
          /* プログレス表示など */
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setProduct((prev) => ({ ...prev, imageUrl: downloadURL }));
        }
      );
    }
  };

  const saveProduct = async () => {
    if (isSaving) return; // 保存処理中の場合は二重実行を防ぐ

    setIsSaving(true); // 保存開始
    if (productId) {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { ...product, updatedAt: new Date() });
      alert('商品情報が更新されました');
    }
    setIsSaving(false); // 保存完了
    router.push('/productList');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>商品編集</h2>
      {product && (
        <>
          <InputField
            label="商品名"
            value={product.name || ''}
            name="name"
            onChange={handleProductChange}
          />
          <InputField
            label="価格"
            value={product.price?.toString() || ''}
            name="price"
            type="number"
            onChange={handleProductChange}
          />
          <InputField
            label="在庫数"
            value={product.stock?.toString() || ''}
            name="stock"
            type="number"
            onChange={handleProductChange}
          />
          <InputField
            label="カテゴリ"
            value={product.category || ''}
            name="category"
            onChange={handleProductChange}
          />
          <label>商品画像</label>
          <input
            className={styles.input}
            type="file"
            onChange={handleImageUpload}
          />
          {product.imageUrl && (
            <Image
              className={styles.image}
              src={product.imageUrl}
              alt="商品画像"
              width={150}
              height={150}
              style={{ objectFit: 'contain' }}
            />
          )}
          <Textarea
            label="商品説明"
            value={product.description || ''}
            name="description"
            onChange={handleProductChange}
            rows={4}
          />
          <Button label="保存" onClick={saveProduct} />
        </>
      )}
    </div>
  );
};

export default ProductEditForm;
