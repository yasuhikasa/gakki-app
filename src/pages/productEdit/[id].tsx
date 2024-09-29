import React from 'react';
import { useRouter } from 'next/router';
import ProductEditForm from '@/components/templates/management/productEditForm';
import { NextPage } from 'next';

const ProductEditPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query; // URLのidパラメータを取得

  if (!id) return <p>商品IDが見つかりません。</p>;

  return (
    <div>
      {/* 商品IDがある場合にフォームを表示 */}
      {typeof id === 'string' && <ProductEditForm productId={id} />}
    </div>
  );
};

export default ProductEditPage;
