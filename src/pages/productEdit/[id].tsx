import React from 'react';
import { useRouter } from 'next/router';
import ProductEditForm from '@/components/templates/management/productEditForm';
import { NextPage } from 'next';

const ProductEditPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query; // URLのidパラメータを取得

  if (!id) return <p>商品IDが見つかりません。</p>;

  // 保存が完了した後に呼ばれるコールバック関数
  const handleSave = () => {
    alert('商品が更新されました');
    router.push('/productList'); // 保存後に商品一覧ページへリダイレクト
  };

  return (
    <div>
      <h1>商品編集ページ</h1>
      {/* 商品IDがある場合にフォームを表示 */}
      {typeof id === 'string' && <ProductEditForm productId={id} onSave={handleSave} />}
    </div>
  );
};

export default ProductEditPage;
