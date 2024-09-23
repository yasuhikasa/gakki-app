// src/components/layout/Layout.tsx

import React, { ReactNode } from 'react';
import Header from '@/components/parts/header'; // ヘッダーのインポート
import styles from '@/styles/components/layout.module.css'; // 任意のレイアウト用CSS

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Header /> {/* ヘッダーを常に表示 */}
      <main className={styles.mainContent}>
        {children} {/* ページごとのコンテンツを表示 */}
      </main>
    </div>
  );
};

export default Layout;
