import React, { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { db, storage } from '@/libs/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import InputField from '@/components/parts/inputField';
import Button from '@/components/parts/button';
import Image from 'next/image';
import Textarea from '@/components/parts/textareaField';
import styles from '@/styles/components/productEditForm.module.css';

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

interface Category {
  name: string; // ドキュメントID（メインカテゴリ）
  subCategories: string[]; // サブカテゴリ（メーカー名）
}

const ProductEditForm: FC<ProductEditFormProps> = ({ productId }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [role, setRole] = useState<number | null>(null);
  const [product, setProduct] = useState<Partial<Product>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // カテゴリデータを格納
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // 選択されたメインカテゴリ
  const [subCategories, setSubCategories] = useState<string[]>([]); // 選択されたメインカテゴリに対応するサブカテゴリ
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  ); // 選択されたサブカテゴリ

  // カテゴリデータを取得
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesList: Category[] = categoriesSnapshot.docs.map((doc) => ({
        name: doc.id, // メインカテゴリはドキュメントID
        subCategories: doc.data().メーカー || [], // サブカテゴリはメーカー配列
      }));
      setCategories(categoriesList);
    };

    fetchCategories();
  }, []);

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
      router.push('/');
    }
  }, [role, router]);

  // 商品データを取得
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        const productDoc = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productDoc);
        if (productSnapshot.exists()) {
          const productData = productSnapshot.data() as Product;
          setProduct(productData);
          setSelectedCategory(productData.category); // 商品のカテゴリを選択状態に設定
          setSelectedSubCategory(productData.subCategory); // 商品のサブカテゴリを選択状態に設定
        }
      };
      fetchProduct();
    }
  }, [productId]);

  // カテゴリが選択されたときに対応するサブカテゴリをセット
  useEffect(() => {
    if (selectedCategory) {
      const selectedCat = categories.find(
        (cat) => cat.name === selectedCategory
      );
      setSubCategories(selectedCat ? selectedCat.subCategories : []);
    }
  }, [selectedCategory, categories]);

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
    if (isSaving) return;

    setIsSaving(true); // 保存開始
    if (productId) {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        ...product,
        category: selectedCategory, // メインカテゴリを保存
        subCategory: selectedSubCategory, // サブカテゴリを保存
        updatedAt: new Date(), // 更新日時をセット
      });
      alert('商品情報が更新されました');
    }
    setIsSaving(false); // 保存完了
    router.push('/productList'); // 商品一覧ページにリダイレクト
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

          {/* カテゴリのドロップダウン */}
          <label>カテゴリ</label>
          <select
            className={styles.select}
            value={selectedCategory || ''}
            name="category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">カテゴリを選択</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          {/* サブカテゴリのドロップダウン（選択されたメインカテゴリに応じて変化） */}
          <label>メーカー</label>
          <select
            className={styles.select}
            value={selectedSubCategory || ''}
            name="subCategory"
            onChange={(e) => setSelectedSubCategory(e.target.value)}
          >
            <option value="">メーカーを選択</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            ))}
          </select>

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
