import React from 'react';
import OrderList from '@/components/templates/management/orderList';
import { NextPage } from 'next';
import Layout from '@/components/layout/Layout';

const OrderListPage: NextPage = () => {
  return (
    <div>
      <Layout>
        <OrderList />
      </Layout>
    </div>
  );
}

export default OrderListPage;
