import React from 'react';
import Cart from '@/components/templates/cart';
import { NextPage } from 'next';
import Layout from '@/components/layout/Layout';

const CartPage: NextPage = () => {
  return (
    <Layout>
      <Cart />
    </Layout>
  );
};

export default CartPage;
