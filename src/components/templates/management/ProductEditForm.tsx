import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/libs/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import InputField from '@/components/parts/inputField';
import Button from '@/components/parts/button';
import Image from 'next/image';
import Textarea from '@/components/parts/textareaField';
import styles from '@/styles/components/productEditForm.module.css';

interface ProductEditFormProps {
  productId: string;
  onSave: () => void; // 保存後のコールバック
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

const ProductEditForm: React.FC<ProductEditFormProps> = ({ productId, onSave }) => {
  const [product, setProduct] = useState<Partial<Product>>({});
  const [imageUrl, setImageUrl] = useState('');

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

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        () => { /* プログレス表示など */ },
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
    if (productId) {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { ...product, updatedAt: new Date() });
      alert('商品情報が更新されました');
      onSave(); // 保存後のコールバック
    }
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
          <input className={styles.input} type="file" onChange={handleImageUpload} />
          {product.imageUrl && <Image className={styles.image} src={product.imageUrl} alt="商品画像" width={150} height={150} />}
          <Textarea
            label="商品説明"
            value={product.description || ''}
            name="name"
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
