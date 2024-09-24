import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/components/sidebar.module.css';

interface SidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedManufacturer: string | null;
  setSelectedManufacturer: (manufacturer: string | null) => void;
}

const categories = ['ギター', 'ベース', 'ドラム'];

const subCategories: Record<string, string[]> = {
  ギター: ['Fender', 'Gibson', 'Ibanez'],
  ベース: ['Fender', 'Music Man', 'Warwick'],
  ドラム: ['Yamaha', 'Tama', 'Pearl'],
};

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedManufacturer,
  setSelectedManufacturer
}) => {
  const router = useRouter();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // 楽器の種類（カテゴリ）をクリックしたときは選択のみ
  const toggleCategory = (category: string) => {
    if (openCategory === category) {
      setOpenCategory(null);
    } else {
      setOpenCategory(category);
    }
    setSelectedCategory(category); // カテゴリのみ設定（絞り込みは行わない）
    setSelectedManufacturer(null);
  };

  // メーカーをクリックしたときに商品一覧を絞り込み
  const handleManufacturerClick = (manufacturer: string) => {
    setSelectedManufacturer(manufacturer);

    // カテゴリとメーカーをクエリパラメータに渡して商品を絞り込み
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
              {subCategories[category].map((manufacturer) => (
                <button
                  key={manufacturer}
                  className={selectedManufacturer === manufacturer ? styles.active : ''}
                  onClick={() => handleManufacturerClick(manufacturer)} // メーカー選択時にページ遷移
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

