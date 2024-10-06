import React from 'react';
import ProductList from '@/components/templates/management/productList';
import { NextPage } from 'next';
import Layout from '@/components/layout/Layout';

const ProductListPage: NextPage = () => {
  return (
    <div>
      <Layout>
        <ProductList />
      </Layout>
    </div>
  );
};

export default ProductListPage;
