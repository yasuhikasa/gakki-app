import React from 'react';
import Products from '@/components/templates/products/products';
import { NextPage } from 'next';
import Layout from '@/components/layout/Layout';

const ProductsPage: NextPage = () => {
  return (
    <Layout>
      <Products />
    </Layout>
  );
};

export default ProductsPage;
