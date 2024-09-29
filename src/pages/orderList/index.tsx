import React from 'react';
import OrderList from '@/components/templates/management/orderList';
import { NextPage } from 'next';

const OrderListPage: NextPage = () => {
  return (
    <div>
      <OrderList />
    </div>
  );
}

export default OrderListPage;
