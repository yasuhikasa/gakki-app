import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import styles from '@/styles/components/sidebar.module.css';

interface SidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedManufacturer: string | null;
  setSelectedManufacturer: (manufacturer: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedManufacturer,
  setSelectedManufacturer
}) => {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]); // カテゴリリスト
  const [subCategories, setSubCategories] = useState<Record<string, string[]>>({}); // カテゴリごとのサブカテゴリリスト
  const [openCategory, setOpenCategory] = useState<string | null>(null); // 開かれているカテゴリ

  // Firestoreからカテゴリとサブカテゴリを動的に取得
  useEffect(() => {
    const fetchCategoriesAndSubCategories = async () => {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const categorySet = new Set<string>();
      const subCategoryMap: Record<string, Set<string>> = {};

      productsSnapshot.forEach((doc) => {
        const product = doc.data();
        const category = product.category;
        const subCategory = product.subCategory;

        // カテゴリをセットに追加
        categorySet.add(category);

        // サブカテゴリをカテゴリごとのマップに追加
        if (!subCategoryMap[category]) {
          subCategoryMap[category] = new Set<string>();
        }
        subCategoryMap[category].add(subCategory);
      });

      // カテゴリを配列に変換してセット
      setCategories(Array.from(categorySet));

      // サブカテゴリのセットを配列に変換してセット
      const formattedSubCategories: Record<string, string[]> = {};
      for (const [category, subCategorySet] of Object.entries(subCategoryMap)) {
        formattedSubCategories[category] = Array.from(subCategorySet);
      }
      setSubCategories(formattedSubCategories);
    };

    fetchCategoriesAndSubCategories();
  }, []);

  // カテゴリの展開・折りたたみ
  const toggleCategory = (category: string) => {
    if (openCategory === category) {
      setOpenCategory(null);
    } else {
      setOpenCategory(category);
    }
    setSelectedCategory(category); // カテゴリ選択
    setSelectedManufacturer(null); // メーカー選択をリセット
  };

  // メーカー選択時の処理
  const handleManufacturerClick = (manufacturer: string) => {
    setSelectedManufacturer(manufacturer);
    router.push({
      pathname: '/products',
      query: { category: selectedCategory, manufacturer },
    });
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Categories</h2>
      {categories.map((category) => (
        <div key={category} className={styles.category}>
          <h3
            className={styles.categoryHeader}
            onClick={() => toggleCategory(category)}
          >
            {category} {openCategory === category ? '-' : '+'}
          </h3>
          {openCategory === category && (
            <div className={styles.subCategory}>
              {subCategories[category]?.map((manufacturer) => (
                <button
                  key={manufacturer}
                  className={selectedManufacturer === manufacturer ? styles.active : ''}
                  onClick={() => handleManufacturerClick(manufacturer)}
                >
                  {manufacturer}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
