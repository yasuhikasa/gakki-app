import React from 'react';
import ProductAdd from '@/components/templates/management/productAdd';
import { NextPage } from 'next';
import Layout from '@/components/layout/Layout';

const ProductAddPage: NextPage = () => {
  return (
    <div>
      <Layout>
        <ProductAdd />
      </Layout>
    </div>
  );
}

export default ProductAddPage;
