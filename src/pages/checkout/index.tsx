import React from 'react';
import Checkout from '@/components/templates/checkoutPage';
import { NextPage } from 'next';
import Layout from '@/components/layout/Layout';

const CheckoutPage: NextPage = () => {
  return (
    <Layout>
      <Checkout />
    </Layout>
  );
};

export default CheckoutPage;
